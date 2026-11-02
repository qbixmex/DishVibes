import { render, screen, waitFor } from '@testing-library/react';
import { SearchDish } from '@/app/(public)/(components)/search-dish';
import userEvent from '@testing-library/user-event';

describe('Test on <SearchDish /> component', () => {
  let consoleLog: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleLog.mockRestore();
  });

  const renderComponent = () => {
    render(<SearchDish />);

    const input = screen.getByRole('textbox', { name: /search dishes/i });
    const button = screen.getByRole('button', { name: /search/i });
    const user = userEvent.setup();
    const alert = () => screen.queryByRole('alert');

    return {
      input,
      button,
      user,
      alert,
    };
  };

  test('Should render the search input and the submit button', () => {
    const { input, button } = renderComponent();

    expect(input).toHaveAttribute('id', 'term');
    expect(input).toBeVisible();
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toBeVisible();
  });

  test('Should show a validation error when submitting an empty term', async () => {
    const { button, user, alert } = renderComponent();

    await user.click(button);

    await waitFor(() => {
      expect(alert()).toBeVisible();
      expect(alert()).toHaveTextContent(
        'El termino de búsqueda es obligatorio',
      );
    });

    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  test('Should submit the term and clear the validation error', async () => {
    const { user, input, button, alert } = renderComponent();

    await user.type(input, 'pizza');
    await user.click(button);

    expect(consoleLog).toHaveBeenCalledWith({ term: 'pizza' });

    await waitFor(() => expect(alert()).not.toBeInTheDocument());
  });
});
