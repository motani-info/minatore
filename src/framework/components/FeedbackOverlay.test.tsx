import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { FeedbackOverlay } from './FeedbackOverlay';

function renderWithChakra(ui: React.ReactElement) {
  return render(<ChakraProvider value={defaultSystem}>{ui}</ChakraProvider>);
}

describe('FeedbackOverlay', () => {
  it('正解時に ○ を表示する', () => {
    renderWithChakra(
      <FeedbackOverlay isCorrect={true} visible={true} onNext={() => {}} />,
    );
    expect(screen.getByText('○')).toBeInTheDocument();
  });

  it('不正解時に ✕ を表示する', () => {
    renderWithChakra(
      <FeedbackOverlay isCorrect={false} visible={true} onNext={() => {}} />,
    );
    expect(screen.getByText('✕')).toBeInTheDocument();
    expect(screen.getByText('ざんねん…')).toBeInTheDocument();
  });

  it('正解時にメッセージを表示する', () => {
    renderWithChakra(
      <FeedbackOverlay isCorrect={true} visible={true} onNext={() => {}} />,
    );
    expect(screen.getByText('よくできました')).toBeInTheDocument();
  });

  it('不正解時に onRetry が提供されている場合「もう一回やる」ボタンを表示する', () => {
    const onRetry = vi.fn();
    renderWithChakra(
      <FeedbackOverlay
        isCorrect={false}
        visible={true}
        onNext={() => {}}
        onRetry={onRetry}
      />,
    );
    expect(screen.getByText('もう一回やる')).toBeInTheDocument();
  });

  it('visible=false の場合は何も描画しない', () => {
    const { container } = renderWithChakra(
      <FeedbackOverlay isCorrect={true} visible={false} onNext={() => {}} />,
    );
    expect(container.innerHTML).toBe('');
  });
});
