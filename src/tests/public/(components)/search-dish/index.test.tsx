import { SearchDish } from '@/app/(public)/(components)/search-dish';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Test on <SearchDish /> component', () => {
  let consoleTable: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleTable = vi.spyOn(console, 'table').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleTable.mockRestore();
  });

  const renderComponent = () => render(<SearchDish />);

  test('Should render the search input and the submit button', () => {
    renderComponent();

    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  test('Should show a validation error when submitting an empty term', async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'El termino de búsqueda es obligatorio',
    );
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  test('Should submit the term and clear the validation error', async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.type(screen.getByRole('textbox'), 'pizza');
    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(consoleTable).toHaveBeenCalledWith({ term: 'pizza' });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
