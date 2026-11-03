import { isInaccessible, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FAQSection } from '@/app/(public)/(home)/faq-section';
import { questions } from '@/app/(public)/(home)/faq-section/question/data';

describe('Test on <FAQSection /> component', () => {
  const renderComponent = () => {
    render(<FAQSection />);

    return { user: userEvent.setup() };
  };

  test('Should render the heading and the description', () => {
    renderComponent();

    const heading = screen.getByRole('heading', { level: 2 });

    expect(heading).toBeVisible();
    expect(heading).toHaveTextContent(/frequent asked questions/i);
    expect(
      screen.getByText(/all you need to know before submit an order/i),
    ).toBeVisible();
  });

  test('Should render the customer service card', () => {
    renderComponent();

    const heading = screen.getByRole('heading', { level: 3 });

    expect(heading).toBeVisible();
    expect(heading).toHaveTextContent(/do you have a specific question/i);
    expect(
      screen.getByText(/our customer service will attend your inquiries/i),
    ).toBeVisible();
  });

  test('Should render the contact link', () => {
    renderComponent();

    const contactLink = screen.getByRole('link', { name: /contact us/i });

    expect(contactLink).toBeVisible();
    expect(contactLink).toHaveAttribute('href', '#');
  });

  test('Should render one question per inquiry', () => {
    renderComponent();

    const articles = screen.getAllByRole('article');

    expect(articles).toHaveLength(questions.length);

    questions.forEach((question, index) => {
      expect(within(articles[index]).getByText(question.query)).toBeVisible();
    });
  });

  test('Should open the first question by default', () => {
    renderComponent();

    const [first, ...rest] = screen.getAllByRole('article');

    expect(
      within(first).getByRole('button', { name: /hide answer/i }),
    ).toHaveAttribute('aria-expanded', 'true');
    expect(isInaccessible(within(first).getByText(questions[0].answer))).toBe(
      false,
    );

    rest.forEach((article, index) => {
      const question = questions[index + 1];

      expect(
        within(article).getByRole('button', { name: /show answer/i }),
      ).toHaveAttribute('aria-expanded', 'false');
      expect(isInaccessible(within(article).getByText(question.answer))).toBe(
        true,
      );
    });
  });

  test('Should close the open question when another one is opened', async () => {
    const { user } = renderComponent();

    const [first, second] = screen.getAllByRole('article');

    await user.click(
      within(second).getByRole('button', { name: /show answer/i }),
    );

    expect(
      within(first).getByRole('button', { name: /show answer/i }),
    ).toHaveAttribute('aria-expanded', 'false');
    expect(isInaccessible(within(first).getByText(questions[0].answer))).toBe(
      true,
    );

    expect(
      within(second).getByRole('button', { name: /hide answer/i }),
    ).toHaveAttribute('aria-expanded', 'true');
    expect(isInaccessible(within(second).getByText(questions[1].answer))).toBe(
      false,
    );
  });

  test('Should close the open question when its toggle is clicked again', async () => {
    const { user } = renderComponent();

    const first = screen.getAllByRole('article')[0];

    await user.click(
      within(first).getByRole('button', { name: /hide answer/i }),
    );

    expect(
      within(first).getByRole('button', { name: /show answer/i }),
    ).toHaveAttribute('aria-expanded', 'false');
    expect(isInaccessible(within(first).getByText(questions[0].answer))).toBe(
      true,
    );
  });

  test('Should render the customer service and question icons as decorative', () => {
    const { container } = render(<FAQSection />);

    const icons = container.querySelectorAll('svg');

    expect(icons).toHaveLength(questions.length * 2 + 1);

    icons.forEach((icon) => {
      expect(icon).toBeVisible();
      expect(isInaccessible(icon)).toBe(true);
    });
  });
});
