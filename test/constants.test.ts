import { describe, it, expect } from 'vitest';
import {
  TEAM_COLORS,
  TEAM_BORDERS,
  TEAM_TEXTS,
  QUESTION_TIMER_SECONDS,
  ROUND_1_TIMER,
  ROUND_2_TIMER,
  ROUND_3_TIMER,
  ROUND_4_TIMER,
  PASS_TIMER_SECONDS,
  SCIENTIST_ROUND_TIMER,
  DIRECT_ROUND_TIMER,
  TOTAL_TEAMS,
  MARKS_PER_QUESTION,
  PASSED_QUESTION_MARKS,
  DIRECT_QUESTION_MARKS,
  DIRECT_BONUS_MARKS,
  ROUND_CONFIGS,
  CLUE_MARKS,
} from '../constants';

describe('Team Color Constants', () => {
  it('should have 5 team colors', () => {
    expect(TEAM_COLORS).toHaveLength(5);
  });

  it('should have 5 team borders', () => {
    expect(TEAM_BORDERS).toHaveLength(5);
  });

  it('should have 5 team text colors', () => {
    expect(TEAM_TEXTS).toHaveLength(5);
  });

  it('should have consistent team styling arrays', () => {
    expect(TEAM_COLORS.length).toBe(TEAM_BORDERS.length);
    expect(TEAM_BORDERS.length).toBe(TEAM_TEXTS.length);
  });
});

describe('Timer Constants', () => {
  it('should have correct default timer', () => {
    expect(QUESTION_TIMER_SECONDS).toBe(45);
  });

  it('should have correct round-specific timers', () => {
    expect(ROUND_1_TIMER).toBe(45);
    expect(ROUND_2_TIMER).toBe(30);
    expect(ROUND_3_TIMER).toBe(60);
    expect(ROUND_4_TIMER).toBe(30);
  });

  it('should have correct pass timer', () => {
    expect(PASS_TIMER_SECONDS).toBe(10);
  });

  it('should have correct special round timers', () => {
    expect(SCIENTIST_ROUND_TIMER).toBe(60);
    expect(DIRECT_ROUND_TIMER).toBe(60);
  });
});

describe('Scoring Constants', () => {
  it('should have correct total teams', () => {
    expect(TOTAL_TEAMS).toBe(5);
  });

  it('should have correct marks per question', () => {
    expect(MARKS_PER_QUESTION).toBe(10);
  });

  it('should have correct passed question marks (half of regular)', () => {
    expect(PASSED_QUESTION_MARKS).toBe(5);
    expect(PASSED_QUESTION_MARKS).toBe(MARKS_PER_QUESTION / 2);
  });

  it('should have correct direct question marks', () => {
    expect(DIRECT_QUESTION_MARKS).toBe(5);
  });

  it('should have correct bonus marks for perfect blitz', () => {
    expect(DIRECT_BONUS_MARKS).toBe(25);
  });

  it('should have descending clue marks', () => {
    expect(CLUE_MARKS).toEqual([20, 15, 10, 5]);
    for (let i = 1; i < CLUE_MARKS.length; i++) {
      expect(CLUE_MARKS[i]).toBeLessThan(CLUE_MARKS[i - 1]);
    }
  });
});

describe('Round Configurations', () => {
  it('should have 7 rounds configured', () => {
    expect(ROUND_CONFIGS).toHaveLength(7);
  });

  it('should have sequential round numbers', () => {
    ROUND_CONFIGS.forEach((config, index) => {
      expect(config.round).toBe(index + 1);
    });
  });

  it('should have required properties for each round', () => {
    ROUND_CONFIGS.forEach((config) => {
      expect(config).toHaveProperty('round');
      expect(config).toHaveProperty('questionsPerTeam');
      expect(config).toHaveProperty('type');
      expect(config).toHaveProperty('title');
      expect(config).toHaveProperty('icon');
    });
  });

  it('should have valid types for each round', () => {
    const validTypes = ['text', 'visual', 'scientist_clues', 'direct_block'];
    ROUND_CONFIGS.forEach((config) => {
      expect(validTypes).toContain(config.type);
    });
  });

  it('should have rules array for each round', () => {
    ROUND_CONFIGS.forEach((config) => {
      expect(config.rules).toBeDefined();
      expect(Array.isArray(config.rules)).toBe(true);
      expect(config.rules!.length).toBeGreaterThan(0);
    });
  });

  it('Round 6 should be blitz with 5 questions per team', () => {
    const round6 = ROUND_CONFIGS.find(r => r.round === 6);
    expect(round6?.questionsPerTeam).toBe(5);
    expect(round6?.type).toBe('direct_block');
  });

  it('Round 7 should be tie-breaker', () => {
    const round7 = ROUND_CONFIGS.find(r => r.round === 7);
    expect(round7?.title).toContain('Tie-Breaker');
    expect(round7?.type).toBe('direct_block');
  });
});

