/** Minimum quantity allowed for a single order line. */
export const MIN_QUANTITY = 1;

/** Maximum quantity allowed for a single order line. */
export const MAX_QUANTITY = 20;

/** Sales tax applied to the order subtotal after discounts. */
export const TAX_RATE = 0.0825;

/** Mocked promo codes: code -> discount rate applied to the subtotal. */
export const PROMO_CODES: Record<string, number> = {
  DISH10: 0.1,
  WELCOME5: 0.05,
};

/** Local storage key used by the persisted order store. */
export const ORDER_STORAGE_KEY = 'dish-vibes:order';

/** Persisted order schema version, bump it when the stored shape changes. */
export const ORDER_STORAGE_VERSION = 1;
