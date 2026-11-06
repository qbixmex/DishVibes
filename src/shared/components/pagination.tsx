'use client';

import type { FC } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import generatePagination from '@/shared/actions/generate-pagination.action';
import { cn } from 'cn';

const scrollToTop = () => {
  window.scrollTo({ top: 0 });
};

type PaginationProps = Readonly<{
  totalPages: number;
  propName?: string;
}>;

export const Pagination: FC<PaginationProps> = (props) => {
  const { totalPages, propName = 'page' } = props;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get(propName)) || 1;
  const allPages = generatePagination(currentPage, totalPages);

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set(propName, pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <>
      <div className="inline-flex">
        <PaginationArrow
          direction="left"
          url={createPageURL(currentPage - 1)}
          isDisabled={currentPage <= 1}
        />

        <div className="flex -space-x-px">
          {allPages.map((page, index) => {
            let position: 'first' | 'last' | 'single' | 'middle' | undefined;

            if (index === 0) position = 'first';
            if (index === allPages.length - 1) position = 'last';
            if (allPages.length === 1) position = 'single';
            if (page === '...') position = 'middle';

            return (
              <PaginationNumber
                key={`${page}-${index}`}
                url={createPageURL(page)}
                page={page}
                position={position}
                isActive={currentPage === page}
              />
            );
          })}
        </div>

        <PaginationArrow
          direction="right"
          url={createPageURL(currentPage + 1)}
          isDisabled={currentPage >= totalPages}
        />
      </div>
    </>
  );
};

type PaginationNumberProps = Readonly<{
  page: number | string;
  url: string;
  position?: 'first' | 'last' | 'middle' | 'single';
  isActive: boolean;
}>;

const PaginationNumber: FC<PaginationNumberProps> = ({ page, url, isActive, position }) => {
  const router = useRouter();

  const handleNavigate = () => {
    scrollToTop();
    router.replace(url, { scroll: false });
  };

  const className = cn(
    'flex h-10 w-10 items-center justify-center text-sm border',
    {
      'rounded-l-md': position === 'first' || position === 'single',
      'rounded-r-md': position === 'last' || position === 'single',
      'z-10 bg-primary border-orange-500 text-white font-bold': isActive,
      'bg-orange-100 text-orange-900 hover:bg-orange-400 hover:text-orange-50 dark:bg-zinc-800 dark:hover:bg-orange-600 dark:text-white dark:hover:text-orange-50': !isActive && position !== 'middle',
      'bg-orange-50 text-orange-900 dark:bg-zinc-900 dark:text-gray-300': position === 'middle',
    },
  );

  return isActive || position === 'middle' ? (
    <div className={className}>{page}</div>
  ) : (
    <button className={className} onClick={handleNavigate}>
      {page}
    </button>
  );
};

type PaginationArrowProps = Readonly<{
  url: string;
  direction: 'left' | 'right';
  isDisabled?: boolean;
}>;

const PaginationArrow: FC<PaginationArrowProps> = ({ url, direction, isDisabled }) => {
  const router = useRouter();

  const handleNavigate = () => {
    scrollToTop();
    router.replace(url, { scroll: false });
  };

  const className = cn(
    'flex h-10 w-10 items-center justify-center rounded-md border',
    {
      'pointer-events-none bg-zinc-200 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500': isDisabled,
      'bg-primary hover:bg-orange-600 dark:hover:bg-orange-700 text-white hover:text-zinc-50': !isDisabled,
      'mr-2 md:mr-4': direction === 'left',
      'ml-2 md:ml-4': direction === 'right',
    },
  );

  const icon =
    direction === 'left' ? (
      <ArrowLeft className="w-4" />
    ) : (
      <ArrowRight className="w-4" />
    );

  return isDisabled ? (
    <div className={className}>{icon}</div>
  ) : (
    <button className={className} onClick={handleNavigate}>
      {icon}
    </button>
  );
};

export default Pagination;
