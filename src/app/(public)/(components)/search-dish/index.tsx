'use client';

import type { FC } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchPanel } from './search-panel';
import { useSearchDish } from './use-search-dish';
import styles from './styles.module.css';

export const SearchDish: FC = () => {
  const search = useSearchDish();

  return (
    <>
      <div className={styles.formContainer}>
        <button
          type="button"
          className={styles.trigger}
          onClick={search.openSearch}
          aria-label="Search the menu"
          aria-haspopup="dialog"
        >
          <Search className={styles.searchIcon} aria-hidden="true" />
          <span className={styles.triggerText}>Search the menu</span>
        </button>
      </div>

      <div className={styles.mobileTrigger}>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={search.openSearch}
          aria-label="Open search"
          aria-haspopup="dialog"
        >
          <Search aria-hidden="true" />
        </Button>
      </div>

      <SearchPanel search={search} />
    </>
  );
};
