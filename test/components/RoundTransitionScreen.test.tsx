import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RoundTransitionScreen } from '../../components/RoundTransitionScreen';

describe('RoundTransitionScreen', () => {
  it('should render Round 1 information correctly', () => {
    const onStart = vi.fn();
    render(<RoundTransitionScreen round={1} onStart={onStart} />);
    
    expect(screen.getByText('Round 1')).toBeInTheDocument();
    expect(screen.getByText('Displacement')).toBeInTheDocument();
  });

  it('should render Round 2 information correctly', () => {
    const onStart = vi.fn();
    render(<RoundTransitionScreen round={2} onStart={onStart} />);
    
    expect(screen.getByText('Round 2')).toBeInTheDocument();
    expect(screen.getByText('Velocity')).toBeInTheDocument();
  });

  it('should render Round 3 information correctly', () => {
    const onStart = vi.fn();
    render(<RoundTransitionScreen round={3} onStart={onStart} />);
    
    expect(screen.getByText('Round 3')).toBeInTheDocument();
    expect(screen.getByText('Acceleration')).toBeInTheDocument();
  });

  it('should render Round 4 information correctly', () => {
    const onStart = vi.fn();
    render(<RoundTransitionScreen round={4} onStart={onStart} />);
    
    expect(screen.getByText('Round 4')).toBeInTheDocument();
    expect(screen.getByText('Force')).toBeInTheDocument();
  });

  it('should render Round 5 information correctly', () => {
    const onStart = vi.fn();
    render(<RoundTransitionScreen round={5} onStart={onStart} />);
    
    expect(screen.getByText('Round 5')).toBeInTheDocument();
    expect(screen.getByText('Work')).toBeInTheDocument();
  });

  it('should render Round 6 information correctly', () => {
    const onStart = vi.fn();
    render(<RoundTransitionScreen round={6} onStart={onStart} />);
    
    expect(screen.getByText('Round 6')).toBeInTheDocument();
    expect(screen.getByText('Energy')).toBeInTheDocument();
  });

  it('should render Round 7 (tie-breaker) information correctly', () => {
    const onStart = vi.fn();
    render(<RoundTransitionScreen round={7} onStart={onStart} />);
    
    expect(screen.getByText('Round 7')).toBeInTheDocument();
    expect(screen.getByText('Tie-Breaker')).toBeInTheDocument();
  });

  it('should render START ROUND button', () => {
    const onStart = vi.fn();
    render(<RoundTransitionScreen round={1} onStart={onStart} />);
    
    expect(screen.getByRole('button', { name: /start round/i })).toBeInTheDocument();
  });

  it('should call onStart when START ROUND is clicked', () => {
    const onStart = vi.fn();
    render(<RoundTransitionScreen round={1} onStart={onStart} />);
    
    const startButton = screen.getByRole('button', { name: /start round/i });
    fireEvent.click(startButton);
    
    expect(onStart).toHaveBeenCalledTimes(1);
  });

  it('should render Round Rules section', () => {
    const onStart = vi.fn();
    render(<RoundTransitionScreen round={1} onStart={onStart} />);
    
    expect(screen.getByText('Round Rules')).toBeInTheDocument();
  });

  it('should display rules for Round 1', () => {
    const onStart = vi.fn();
    render(<RoundTransitionScreen round={1} onStart={onStart} />);
    
    expect(screen.getByText(/Multiple Choice Questions/i)).toBeInTheDocument();
    expect(screen.getByText(/10 marks for each correct answer/i)).toBeInTheDocument();
  });

  it('should render Prepare your teams text', () => {
    const onStart = vi.fn();
    render(<RoundTransitionScreen round={1} onStart={onStart} />);
    
    expect(screen.getByText('Prepare your teams')).toBeInTheDocument();
  });

  it('should return null for invalid round number', () => {
    const onStart = vi.fn();
    const { container } = render(<RoundTransitionScreen round={99} onStart={onStart} />);
    
    expect(container.firstChild).toBeNull();
  });
});

