'use client';

import type { FC } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Kbd } from '@/components/ui/kbd';
import { SearchResultItem } from './search-result-item';
import type { useSearchDish } from './use-search-dish';
import styles from './styles.module.css';

type Props = Readonly<{
  search: ReturnType<typeof useSearchDish>;
}>;

export const SearchPanel: FC<Props> = ({ search }) => {
  const {
    open,
    term,
    activeIndex,
    inputRef,
    results,
    visibleDishes,
    closeSearch,
    changeTerm,
    setActiveIndex,
    handleKeyDown,
  } = search;

  const sectionLabel = results.isPopular
    ? 'Popular right now'
    : `Results for “${results.term}”`;

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) closeSearch();
      }}
    >
      <DialogContent
        className={styles.panel}
        overlayClassName={styles.overlay}
        showCloseButton={false}
        initialFocus={inputRef}
        aria-label="Search the menu"
      >
        <DialogTitle className="sr-only">Search the menu</DialogTitle>

        <div className={styles.panelHeader}>
          <Search className={styles.headerIcon} aria-hidden="true" />

          <input
            ref={inputRef}
            id="search-dish-input"
            type="text"
            role="combobox"
            aria-label="Search dishes"
            aria-expanded
            aria-controls="search-dish-results"
            aria-autocomplete="list"
            aria-activedescendant={
              activeIndex >= 0
                ? `search-dish-option-${activeIndex}`
                : undefined
            }
            placeholder="Search the menu"
            autoComplete="off"
            value={term}
            onChange={(event) => changeTerm(event.target.value)}
            onKeyDown={handleKeyDown}
            className={styles.input}
          />

          <Button
            type="button"
            variant="outline"
            className={styles.closeButton}
            onClick={closeSearch}
          >
            Close
          </Button>
        </div>

        <div className={styles.divider} />

        <section className={styles.resultsSection}>
          <h2 id="search-dish-section-label" className={styles.sectionLabel}>
            {sectionLabel}
          </h2>

          {visibleDishes.length > 0 ? (
            <ul
              id="search-dish-results"
              role="listbox"
              aria-labelledby="search-dish-section-label"
              className={styles.results}
            >
              {visibleDishes.map((dish, index) => (
                <SearchResultItem
                  key={dish.id}
                  dish={dish}
                  index={index}
                  isActive={index === activeIndex}
                  onActivate={() => setActiveIndex(index)}
                  onSelect={closeSearch}
                />
              ))}
            </ul>
          ) : (
            <p role="status" className={styles.empty}>
              No dishes found for “{results.term}”.
            </p>
          )}
        </section>

        <footer className={styles.footer}>
          <div className={styles.hints}>
            <span className={styles.hint}>
              <Kbd>↑↓</Kbd> to move
            </span>
            <span className={styles.hint}>
              <Kbd>↵</Kbd> to open
            </span>
            <span className={styles.hint}>
              <Kbd>esc</Kbd> to close
            </span>
          </div>

          <div className={styles.meta}>
            {visibleDishes.length > 0 && (
              <span
                role="status"
                aria-live="polite"
                className={styles.count}
              >
                {visibleDishes.length} shown
              </span>
            )}

            {results.seeAllHref && (
              <Link
                href={results.seeAllHref}
                className={styles.seeAll}
                onClick={closeSearch}
              >
                See all
              </Link>
            )}
          </div>
        </footer>
      </DialogContent>
    </Dialog>
  );
};
