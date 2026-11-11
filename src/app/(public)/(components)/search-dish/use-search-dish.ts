'use client';

import type { KeyboardEvent } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SEARCH_RESULT_LIMIT, searchDishes } from '@/lib/dish-search';
import type { Dish } from '@/shared/interfaces/dish.interface';

/**
 * State and keyboard behavior for the menu search panel.
 *
 * The panel starts without a highlighted result. Arrow keys wrap around the
 * visible results, Enter opens the highlighted one and Escape closes it.
 */
export const useSearchDish = () => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);

  const results = useMemo(() => searchDishes(term), [term]);
  const visibleDishes = useMemo(
    () => results.dishes.slice(0, SEARCH_RESULT_LIMIT),
    [results.dishes],
  );

  const openSearch = useCallback(() => {
    setTerm('');
    setActiveIndex(-1);
    setOpen(true);
  }, []);

  const closeSearch = useCallback(() => {
    setOpen(false);
    setActiveIndex(-1);
  }, []);

  const changeTerm = useCallback((value: string) => {
    setTerm(value);
    setActiveIndex(-1);
  }, []);

  const goToDish = useCallback(
    (dish: Dish) => {
      setOpen(false);
      setActiveIndex(-1);
      router.push(`/menu/${dish.slug}`);
    },
    [router],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      const lastIndex = visibleDishes.length - 1;

      switch (event.key) {
        case 'ArrowDown': {
          event.preventDefault();

          if (lastIndex < 0) return;

          setActiveIndex((index) => (index >= lastIndex ? 0 : index + 1));
          return;
        }
        case 'ArrowUp': {
          event.preventDefault();

          if (lastIndex < 0) return;

          setActiveIndex((index) => (index <= 0 ? lastIndex : index - 1));
          return;
        }
        case 'Enter': {
          const dish = visibleDishes[activeIndex];

          if (!dish) return;

          event.preventDefault();
          goToDish(dish);
          return;
        }
        case 'Escape': {
          event.preventDefault();
          closeSearch();
        }
      }
    },
    [activeIndex, closeSearch, goToDish, visibleDishes],
  );

  useEffect(() => {
    if (activeIndex < 0) return;

    document
      .getElementById(`search-dish-option-${activeIndex}`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  return {
    open,
    term,
    activeIndex,
    inputRef,
    results,
    visibleDishes,
    openSearch,
    closeSearch,
    changeTerm,
    goToDish,
    setActiveIndex,
    handleKeyDown,
  };
};
