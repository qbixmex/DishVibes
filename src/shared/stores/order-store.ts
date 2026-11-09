import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';
import type { OrderDishSnapshot, OrderLine } from '@/shared/interfaces/order.interface';
import {
  MAX_QUANTITY,
  MIN_QUANTITY,
  ORDER_STORAGE_KEY,
  ORDER_STORAGE_VERSION,
  PROMO_CODES,
} from '@/shared/constants/order';
export type AddOrderLineInput = Omit<OrderLine, 'lineId'>;

/** Keeps only the dish fields needed to render an order line. */
export const toOrderDishSnapshot = (dish: OrderDishSnapshot): OrderDishSnapshot => ({
  id: dish.id,
  name: dish.name,
  slug: dish.slug,
  imageUrl: dish.imageUrl,
  description: dish.description,
  price: dish.price,
});

export interface OrderState {
  lines: OrderLine[];
  promoCode: string | null;
  hydrated: boolean;
  addLine: (input: AddOrderLineInput) => void;
  setLineQuantity: (lineId: string, quantity: number) => void;
  incrementLine: (lineId: string) => void;
  decrementLine: (lineId: string) => void;
  removeLine: (lineId: string) => void;
  applyPromo: (code: string) => boolean;
  removePromo: () => void;
  clearOrder: () => void;
  setHydrated: (hydrated: boolean) => void;
}

const clampQuantity = (quantity: number): number => {
  if (!Number.isFinite(quantity)) return MIN_QUANTITY;

  return Math.min(MAX_QUANTITY, Math.max(MIN_QUANTITY, Math.trunc(quantity)));
};

const createLineId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const normalizeInstructions = (instructions: string): string => {
  return instructions.trim();
};

/**
 * Used during server rendering so the store never touches `localStorage`.
 * The client bundle evaluates the store again with the real storage.
 */
const serverStorage: StateStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
};

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      lines: [],
      promoCode: null,
      hydrated: false,

      addLine: (input) => {
        const specialInstructions = normalizeInstructions(input.specialInstructions);
        const quantity = clampQuantity(input.quantity);

        set((state) => {
          const existingLine = state.lines.find(
            (line) =>
              line.dishId === input.dishId &&
              line.specialInstructions === specialInstructions,
          );

          if (existingLine) {
            return {
              lines: state.lines.map((line) =>
                line.lineId === existingLine.lineId
                  ? { ...line, quantity: clampQuantity(line.quantity + quantity) }
                  : line,
              ),
            };
          }

          const newLine: OrderLine = {
            ...input,
            lineId: createLineId(),
            quantity,
            specialInstructions,
          };

          return { lines: [...state.lines, newLine] };
        });
      },

      setLineQuantity: (lineId, quantity) => {
        set((state) => ({
          lines: state.lines.map((line) =>
            line.lineId === lineId
              ? { ...line, quantity: clampQuantity(quantity) }
              : line,
          ),
        }));
      },

      incrementLine: (lineId) => {
        const line = get().lines.find((item) => item.lineId === lineId);

        if (!line) return;

        get().setLineQuantity(lineId, line.quantity + 1);
      },

      decrementLine: (lineId) => {
        const line = get().lines.find((item) => item.lineId === lineId);

        if (!line) return;

        get().setLineQuantity(lineId, line.quantity - 1);
      },

      removeLine: (lineId) => {
        set((state) => ({
          lines: state.lines.filter((line) => line.lineId !== lineId),
        }));
      },

      applyPromo: (code) => {
        const normalizedCode = code.trim().toUpperCase();

        if (!PROMO_CODES[normalizedCode]) return false;

        set({ promoCode: normalizedCode });

        return true;
      },

      removePromo: () => {
        set({ promoCode: null });
      },

      clearOrder: () => {
        set({ lines: [], promoCode: null });
      },

      setHydrated: (hydrated) => {
        set({ hydrated });
      },
    }),
    {
      name: ORDER_STORAGE_KEY,
      version: ORDER_STORAGE_VERSION,
      storage: createJSONStorage(() =>
        typeof window === 'undefined' ? serverStorage : window.localStorage,
      ),
      partialize: (state) => ({
        lines: state.lines,
        promoCode: state.promoCode,
      }),
      skipHydration: true,
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
