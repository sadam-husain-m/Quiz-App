
export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
  type: 'text' | 'visual' | 'scientist_clues' | 'direct_block';
  round: number;
  isSample?: boolean;
  imagePrompt?: string;
  imageUrl?: string;
  cluePrompts?: string[];
  clueUrls?: string[];
}

export interface Team {
  id: number;
  name: string;
  score: number;
  color: string;
}

export type GameStatus = 'setup' | 'loading' | 'playing' | 'question_result' | 'finished' | 'round_transition';

export interface GameState {
  teams: Team[];
  questions: Question[];
  currentQuestionIndex: number;
  activeTeamIndex: number;
  status: GameStatus;
  timeLeft: number;
  selectedOption: number | null;
  currentRound: number;
  showOptions: boolean;
  helplineUsed: boolean;
  hiddenOptions: number[];
  doubleDipActive: boolean;
  doubleDipAttemptCount: number;
  wrongDoubleDipIndices: number[];
  isPassed?: boolean;
  currentClueIndex: number;
  directRoundScores: boolean[]; // Tracks correct/wrong for the 5-question block
  isAnswerRevealed: boolean;
  tiedTeamIndices?: number[];
  directTeamIndex?: number;
}
