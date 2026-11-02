import {
  isInaccessible,
  render,
  screen,
  within,
} from '@testing-library/react';
import { Testimonial } from '@/app/(public)/(home)/feedback-section/testimonial';
import type { Testimonial as ITestimonial } from '@/shared/interfaces/testimonial.interface';

const testimonial: Omit<ITestimonial, 'id'> = {
  review: 'I loved the pepperoni pizza and the fettucini pasta.',
  customerName: 'Alice Johnson',
  rating: 3,
};

describe('Test on <Testimonial /> component', () => {
  test('Should render the review as a quote', () => {
    render(<Testimonial testimonial={testimonial} />);

    const quote = screen.getByRole('blockquote');

    expect(quote).toBeVisible();
    expect(quote).toHaveTextContent(testimonial.review);
  });

  test('Should render the customer name as the figure caption', () => {
    render(<Testimonial testimonial={testimonial} />);

    const figure = screen.getByRole('figure');
    const caption = figure.querySelector('figcaption');
    const customerName = within(figure).getByText(testimonial.customerName);

    expect(caption).toBeVisible();
    expect(caption).toContainElement(customerName);
  });

  test('Should announce the rating as a single accessible image', () => {
    render(<Testimonial testimonial={testimonial} />);

    const rating = screen.getByRole('img', { name: 'Rating: 3 out of 5' });

    expect(rating).toBeVisible();
    expect(rating).toHaveAccessibleName('Rating: 3 out of 5');
  });

  test('Should render one decorative star per rating point', () => {
    const { container } = render(<Testimonial testimonial={testimonial} />);

    const stars = container.querySelectorAll('svg');

    expect(stars).toHaveLength(testimonial.rating);

    stars.forEach((star) => {
      expect(star).toBeVisible();
      expect(isInaccessible(star)).toBe(true);
    });
  });

  test.each([1, 3, 5])(
    'Should render %i stars when the rating is %i',
    (rating) => {
      const { container } = render(
        <Testimonial testimonial={{ ...testimonial, rating }} />,
      );

      expect(
        screen.getByRole('img', { name: `Rating: ${rating} out of 5` }),
      ).toBeVisible();
      expect(container.querySelectorAll('svg')).toHaveLength(rating);
    },
  );
});
