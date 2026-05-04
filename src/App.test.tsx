import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

describe('App smoke test', () => {
  it('should run tests with vitest and jsdom', () => {
    expect(document).toBeDefined();
    expect(typeof window).toBe('object');
  });

  it('should support React Testing Library', () => {
    render(<div data-testid="test">Hello</div>);
    expect(screen.getByTestId('test')).toHaveTextContent('Hello');
  });
});
