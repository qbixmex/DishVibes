import { render, screen, within } from '@testing-library/react';
import { FeedbackSection } from '@/app/(public)/(home)/feedback-section';
import { testimonials } from '@/app/(public)/(home)/feedback-section/data';

describe('Test on <FeedbackSection /> component', () => {
  test('Should render an accessible region with its heading and description', () => {
    render(<FeedbackSection />);

    const region = screen.getByRole('region', { name: /customers feedback/i });
    const heading = screen.getByRole('heading', { level: 2 });

    expect(region).toBeVisible();
    expect(region).toHaveAccessibleName(/customers feedback/i);
    expect(region).toHaveAccessibleDescription(/testimonials and reviews/i);
    expect(heading).toBeVisible();
    expect(heading).toHaveTextContent(/customers feedback/i);
  });

  test('Should render the testimonials as a list', () => {
    render(<FeedbackSection />);

    const list = screen.getByRole('list');
    const items = within(list).getAllByRole('listitem');

    expect(list).toBeVisible();
    expect(items).toHaveLength(testimonials.length);

    items.forEach((item) => {
      expect(within(item).getByRole('figure')).toBeVisible();
    });
  });

  test('Should render each review with its author', () => {
    render(<FeedbackSection />);

    const items = screen.getAllByRole('listitem');

    testimonials.forEach((testimonial, index) => {
      const item = within(items[index]);

      expect(item.getByText(testimonial.review)).toBeVisible();
      expect(item.getByText(testimonial.customerName)).toBeVisible();
    });
  });

  test('Should not render stray text outside the testimonials', () => {
    render(<FeedbackSection />);

    const strayText = Array.from(screen.getByRole('list').childNodes)
      .filter((node) => node.nodeType === Node.TEXT_NODE)
      .map((node) => node.textContent?.trim())
      .filter(Boolean);

    expect(strayText).toEqual([]);
  });
});
