import { isInaccessible, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentProps } from 'react';
import { Question } from '@/app/(public)/(home)/faq-section/question';
import { questions } from '@/app/(public)/(home)/faq-section/question/data';

const question = questions[0];

const renderComponent = (props: Partial<ComponentProps<typeof Question>> = {}) => {
  const onToggle = vi.fn();

  render(
    <Question question={question} open={false} onToggle={onToggle} {...props} />,
  );

  return { onToggle };
};

const getAnswer = () => screen.getByText(question.answer);

describe('Test on <Question /> component', () => {
  test('Should render the query and its answer', () => {
    renderComponent();

    expect(screen.getByText(question.query)).toBeVisible();
    expect(getAnswer()).toBeInTheDocument();
  });

  test('Should announce a closed question with a show action', () => {
    renderComponent();

    const toggle = screen.getByRole('button', { name: /show answer/i });
    const answer = getAnswer();

    expect(toggle).toBeVisible();
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(answer.parentElement).toHaveAttribute('aria-hidden', 'true');
    expect(isInaccessible(answer)).toBe(true);
  });

  test('Should announce an open question with a hide action', () => {
    renderComponent({ open: true });

    const toggle = screen.getByRole('button', { name: /hide answer/i });
    const answer = getAnswer();

    expect(toggle).toBeVisible();
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(answer.parentElement).toHaveAttribute('aria-hidden', 'false');
    expect(isInaccessible(answer)).toBe(false);
  });

  test('Should connect the toggle with the answer it controls', () => {
    renderComponent();

    const toggle = screen.getByRole('button', { name: /show answer/i });
    const answerId = toggle.getAttribute('aria-controls');
    const answer = document.getElementById(answerId!);

    expect(answerId).toBeTruthy();
    expect(answer).toBeVisible();
    expect(answer).toContainElement(getAnswer());
  });

  test('Should call onToggle once when the toggle is clicked', async () => {
    const { onToggle } = renderComponent();
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /show answer/i }));

    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  test('Should render the query icon and the chevron as decorative', () => {
    const { container } = render(
      <Question question={question} open={false} onToggle={vi.fn()} />,
    );

    const icons = container.querySelectorAll('svg');

    expect(icons).toHaveLength(2);

    icons.forEach((icon) => {
      expect(icon).toBeVisible();
      expect(isInaccessible(icon)).toBe(true);
    });
  });
});
