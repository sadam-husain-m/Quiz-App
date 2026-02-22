import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SetupScreen } from '../../components/SetupScreen';

describe('SetupScreen', () => {
  it('should render the setup screen with title', () => {
    const onStart = vi.fn();
    render(<SetupScreen onStart={onStart} />);
    
    expect(screen.getByText('Physics Quiz Pro')).toBeInTheDocument();
    expect(screen.getByText('Tournament Edition')).toBeInTheDocument();
  });

  it('should render 5 default team input fields', () => {
    const onStart = vi.fn();
    render(<SetupScreen onStart={onStart} />);
    
    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(5);
  });

  it('should have default science-themed team names', () => {
    const onStart = vi.fn();
    render(<SetupScreen onStart={onStart} />);
    
    expect(screen.getByDisplayValue('Quantum Quarks')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Cosmic Crusaders')).toBeInTheDocument();
    expect(screen.getByDisplayValue('The Entropy Squad')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Atomic Avengers')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Absolute Zeroes')).toBeInTheDocument();
  });

  it('should allow editing team names', () => {
    const onStart = vi.fn();
    render(<SetupScreen onStart={onStart} />);
    
    const firstInput = screen.getByDisplayValue('Quantum Quarks');
    fireEvent.change(firstInput, { target: { value: 'New Team Name' } });
    
    expect(screen.getByDisplayValue('New Team Name')).toBeInTheDocument();
  });

  it('should render Begin Tournament button', () => {
    const onStart = vi.fn();
    render(<SetupScreen onStart={onStart} />);
    
    expect(screen.getByRole('button', { name: /begin tournament/i })).toBeInTheDocument();
  });

  it('should call onStart with team names when form is submitted', () => {
    const onStart = vi.fn();
    render(<SetupScreen onStart={onStart} />);
    
    const submitButton = screen.getByRole('button', { name: /begin tournament/i });
    fireEvent.click(submitButton);
    
    expect(onStart).toHaveBeenCalledTimes(1);
    expect(onStart).toHaveBeenCalledWith(
      ['Quantum Quarks', 'Cosmic Crusaders', 'The Entropy Squad', 'Atomic Avengers', 'Absolute Zeroes'],
      'Physics Pro Quiz'
    );
  });

  it('should call onStart with modified team names', () => {
    const onStart = vi.fn();
    render(<SetupScreen onStart={onStart} />);
    
    const firstInput = screen.getByDisplayValue('Quantum Quarks');
    fireEvent.change(firstInput, { target: { value: 'Team Alpha' } });
    
    const submitButton = screen.getByRole('button', { name: /begin tournament/i });
    fireEvent.click(submitButton);
    
    expect(onStart).toHaveBeenCalledWith(
      ['Team Alpha', 'Cosmic Crusaders', 'The Entropy Squad', 'Atomic Avengers', 'Absolute Zeroes'],
      'Physics Pro Quiz'
    );
  });

  it('should render Team Lineup label', () => {
    const onStart = vi.fn();
    render(<SetupScreen onStart={onStart} />);
    
    expect(screen.getByText('Team Lineup')).toBeInTheDocument();
  });
});

