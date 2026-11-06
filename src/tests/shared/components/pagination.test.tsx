import Pagination from '@/shared/components/pagination';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mocks = vi.hoisted(() => ({
  replace: vi.fn(),
  page: '1',
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mocks.replace }),
  usePathname: () => '/menu',
  useSearchParams: () => new URLSearchParams(`page=${mocks.page}`),
}));

describe('Test on <Pagination /> component', () => {
  beforeEach(() => {
    mocks.replace.mockClear();
    mocks.page = '1';
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should render the available page numbers', () => {
    render(<Pagination totalPages={3} />);

    expect(screen.getByRole('button', { name: '2' })).toBeVisible();
    expect(screen.getByRole('button', { name: '3' })).toBeVisible();
  });

  test('Should scroll to the top and navigate when a page is selected', async () => {
    const user = userEvent.setup();

    render(<Pagination totalPages={3} />);

    await user.click(screen.getByRole('button', { name: '2' }));

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0 });
    expect(mocks.replace).toHaveBeenCalledWith('/menu?page=2', {
      scroll: false,
    });
  });

  test('Should scroll to the top when using the next arrow', async () => {
    const user = userEvent.setup();

    render(<Pagination totalPages={3} />);

    const buttons = screen.getAllByRole('button');

    await user.click(buttons[buttons.length - 1]);

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0 });
    expect(mocks.replace).toHaveBeenCalledWith('/menu?page=2', {
      scroll: false,
    });
  });

  test('Should scroll to the top when using the previous arrow', async () => {
    const user = userEvent.setup();

    mocks.page = '2';

    render(<Pagination totalPages={3} />);

    const buttons = screen.getAllByRole('button');

    await user.click(buttons[0]);

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0 });
    expect(mocks.replace).toHaveBeenCalledWith('/menu?page=1', {
      scroll: false,
    });
  });
});
