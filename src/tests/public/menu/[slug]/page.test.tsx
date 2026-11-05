import { act } from 'react';
import DishPage, {
  generateStaticParams,
} from '@/app/(public)/menu/[slug]/page';
import { render, screen } from '@testing-library/react';

const shouldSuspend = vi.hoisted(() => ({ value: false }));
const mocks = vi.hoisted(() => ({ getDishSlugs: vi.fn() }));

vi.mock('@/app/(public)/menu/[slug]/dish-view', async () => {
  const { use } = await import('react');

  return {
    DishView: () => {
      if (shouldSuspend.value) {
        use(new Promise(() => {}));
      }

      return <div data-testid="dish-view" />;
    },
  };
});

vi.mock('@/app/(public)/menu/[slug]/(actions)/get-dish-by-slug', () => ({
  getDishSlugs: mocks.getDishSlugs,
}));

const params = Promise.resolve({ slug: 'pepperoni-pizza' });

describe('Tests on <DishPage /> component', () => {
  beforeEach(() => {
    shouldSuspend.value = false;
    mocks.getDishSlugs.mockResolvedValue([
      'pepperoni-pizza',
      'hawaiian-pizza',
    ]);
  });

  test('Should render the dish view once the params are resolved', async () => {
    await act(async () => {
      render(<DishPage params={params} />);
    });

    expect(screen.getByTestId('dish-view')).toBeVisible();
    expect(screen.queryByTestId('dish-view-skeleton')).not.toBeInTheDocument();
  });

  test('Should render the skeleton while the dish view is loading', async () => {
    shouldSuspend.value = true;

    await act(async () => {
      render(<DishPage params={params} />);
    });

    expect(screen.getByTestId('dish-view-skeleton')).toBeVisible();
    expect(screen.queryByTestId('dish-view')).not.toBeInTheDocument();
  });
});

describe('Tests on <DishPage /> generateStaticParams', () => {
  beforeEach(() => {
    mocks.getDishSlugs.mockResolvedValue([
      'pepperoni-pizza',
      'hawaiian-pizza',
    ]);
  });

  test('Should prerender one param object per dish slug', async () => {
    const staticParams = await generateStaticParams();

    expect(mocks.getDishSlugs).toHaveBeenCalledTimes(1);
    expect(staticParams).toEqual([
      { slug: 'pepperoni-pizza' },
      { slug: 'hawaiian-pizza' },
    ]);
  });

  test('Should return an empty list when there are no dishes', async () => {
    mocks.getDishSlugs.mockResolvedValue([]);

    await expect(generateStaticParams()).resolves.toEqual([]);
  });
});
