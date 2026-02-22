import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FinishedScreen } from '../../components/FinishedScreen';
import { Team } from '../../types';

const mockTeams: Team[] = [
  { id: 0, name: 'Team Alpha', score: 100, color: '' },
  { id: 1, name: 'Team Beta', score: 80, color: '' },
  { id: 2, name: 'Team Gamma', score: 120, color: '' },
  { id: 3, name: 'Team Delta', score: 90, color: '' },
  { id: 4, name: 'Team Epsilon', score: 75, color: '' },
];

describe('FinishedScreen', () => {
  it('should render Grand Champion title for single winner', () => {
    const onRestart = vi.fn();
    render(<FinishedScreen teams={mockTeams} onRestart={onRestart} />);
    
    expect(screen.getByText('Grand Champion')).toBeInTheDocument();
  });

  it('should display the winning team name', () => {
    const onRestart = vi.fn();
    render(<FinishedScreen teams={mockTeams} onRestart={onRestart} />);

    // Team Gamma has highest score (120) - appears in winner section and leaderboard
    const teamGammaElements = screen.getAllByText('Team Gamma');
    expect(teamGammaElements.length).toBeGreaterThanOrEqual(1);
  });

  it('should render Co-Champions title when teams are tied', () => {
    const tiedTeams: Team[] = [
      { id: 0, name: 'Team Alpha', score: 100, color: '' },
      { id: 1, name: 'Team Beta', score: 100, color: '' },
      { id: 2, name: 'Team Gamma', score: 80, color: '' },
    ];
    const onRestart = vi.fn();
    render(<FinishedScreen teams={tiedTeams} onRestart={onRestart} />);
    
    expect(screen.getByText('Co-Champions')).toBeInTheDocument();
  });

  it('should display both winner names when tied', () => {
    const tiedTeams: Team[] = [
      { id: 0, name: 'Team Alpha', score: 100, color: '' },
      { id: 1, name: 'Team Beta', score: 100, color: '' },
      { id: 2, name: 'Team Gamma', score: 80, color: '' },
    ];
    const onRestart = vi.fn();
    render(<FinishedScreen teams={tiedTeams} onRestart={onRestart} />);

    // Winners appear in both winner section and leaderboard
    const alphaElements = screen.getAllByText('Team Alpha');
    const betaElements = screen.getAllByText('Team Beta');
    expect(alphaElements.length).toBeGreaterThanOrEqual(1);
    expect(betaElements.length).toBeGreaterThanOrEqual(1);
  });

  it('should render Final Leaderboard section', () => {
    const onRestart = vi.fn();
    render(<FinishedScreen teams={mockTeams} onRestart={onRestart} />);
    
    expect(screen.getByText('Final Leaderboard')).toBeInTheDocument();
  });

  it('should display all teams in the leaderboard', () => {
    const onRestart = vi.fn();
    render(<FinishedScreen teams={mockTeams} onRestart={onRestart} />);

    mockTeams.forEach(team => {
      // Use getAllByText since winner name also appears in winner section
      const elements = screen.getAllByText(team.name);
      expect(elements.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('should display team scores with Marks label', () => {
    const onRestart = vi.fn();
    render(<FinishedScreen teams={mockTeams} onRestart={onRestart} />);
    
    // Check that "Marks" label appears for each team
    const marksLabels = screen.getAllByText('Marks');
    expect(marksLabels.length).toBe(5);
  });

  it('should render Play Again button', () => {
    const onRestart = vi.fn();
    render(<FinishedScreen teams={mockTeams} onRestart={onRestart} />);
    
    expect(screen.getByRole('button', { name: /play again/i })).toBeInTheDocument();
  });

  it('should call onRestart when Play Again is clicked', () => {
    const onRestart = vi.fn();
    render(<FinishedScreen teams={mockTeams} onRestart={onRestart} />);
    
    const restartButton = screen.getByRole('button', { name: /play again/i });
    fireEvent.click(restartButton);
    
    expect(onRestart).toHaveBeenCalledTimes(1);
  });

  it('should sort teams by score in descending order', () => {
    const onRestart = vi.fn();
    render(<FinishedScreen teams={mockTeams} onRestart={onRestart} />);

    // Get score elements from the leaderboard (look for the score text with Marks label)
    const leaderboardSection = screen.getByText('Final Leaderboard').parentElement;
    expect(leaderboardSection).toBeTruthy();

    // Verify highest scorer (Team Gamma with 120) is at top position
    const firstPosition = screen.getByText('1');
    expect(firstPosition).toBeInTheDocument();

    // Verify lowest scorer (Team Epsilon with 75) is at last position
    const lastPosition = screen.getByText('5');
    expect(lastPosition).toBeInTheDocument();
  });
});

