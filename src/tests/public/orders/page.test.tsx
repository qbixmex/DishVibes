import OrdersPage from '@/app/(public)/orders/page';
import { render, screen } from '@testing-library/react';

describe('Test on <OrdersPage /> component', () => {
  test('Should render its content', () => {
    render(<OrdersPage />);

    expect(screen.getByText('Orders Page')).toBeVisible();
  });
});
