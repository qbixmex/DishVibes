import { isInaccessible, render, screen } from '@testing-library/react';
import { ContactCard } from '@/shared/components/contact-card';
import styles from '@/shared/components/contact-card/styles.module.css';
import { CONTACT_INFO } from '@/shared/data/contact';

describe('Test on <ContactCard /> component', () => {
  const renderComponent = () => {
    render(<ContactCard />);
  };

  test('Should render the default heading', () => {
    renderComponent();

    const heading = screen.getByRole('heading', {
      level: 2,
      name: /contact information/i,
    });

    expect(heading).toBeVisible();
  });

  test('Should render a custom heading', () => {
    render(
      <ContactCard
        heading={
          <>
            Need <span>help?</span>
          </>
        }
      />,
    );

    expect(
      screen.getByRole('heading', { level: 2, name: /need help/i }),
    ).toBeVisible();
    expect(
      screen.queryByRole('heading', { name: /contact information/i }),
    ).not.toBeInTheDocument();
  });

  test('Should not apply the compact layout by default', () => {
    const { container } = render(<ContactCard />);

    expect(container.firstElementChild).not.toHaveClass(styles.compact);
  });

  test('Should apply the compact layout when requested', () => {
    const { container } = render(<ContactCard compact />);

    expect(container.firstElementChild).toHaveClass(styles.compact);
  });

  test('Should render the phone information', () => {
    renderComponent();

    expect(
      screen.getByRole('heading', { level: 3, name: /phone:/i }),
    ).toBeVisible();
    expect(screen.getByText(CONTACT_INFO.phone)).toBeVisible();
  });

  test('Should render the email information', () => {
    renderComponent();

    expect(
      screen.getByRole('heading', { level: 3, name: /email:/i }),
    ).toBeVisible();
    expect(screen.getByText(CONTACT_INFO.email)).toBeVisible();
  });

  test('Should render the address information', () => {
    renderComponent();

    expect(
      screen.getByRole('heading', { level: 3, name: /address:/i }),
    ).toBeVisible();
    expect(screen.getByText(CONTACT_INFO.address)).toBeVisible();
  });

  test('Should render every icon as decorative', () => {
    const { container } = render(<ContactCard />);

    const icons = container.querySelectorAll('svg');

    expect(icons).toHaveLength(3);

    icons.forEach((icon) => {
      expect(icon).toBeVisible();
      expect(isInaccessible(icon)).toBe(true);
    });
  });
});
