
export const TEAM_COLORS = [
  'bg-blue-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-purple-500'
];

export const TEAM_BORDERS = [
  'border-blue-500',
  'border-emerald-500',
  'border-amber-500',
  'border-rose-500',
  'border-purple-500'
];

export const TEAM_TEXTS = [
  'text-blue-500',
  'text-emerald-500',
  'text-amber-500',
  'text-rose-500',
  'text-purple-500'
];

// Timers as requested
export const QUESTION_TIMER_SECONDS = 45; 
export const ROUND_1_TIMER = 45;
export const ROUND_2_TIMER = 30;
export const ROUND_3_TIMER = 60;
export const ROUND_4_TIMER = 30;
export const PASS_TIMER_SECONDS = 10;
export const SCIENTIST_ROUND_TIMER = 60;
export const DIRECT_ROUND_TIMER = 60;
export const TOTAL_TEAMS = 5;
export const MARKS_PER_QUESTION = 10;
export const PASSED_QUESTION_MARKS = 5;
export const DIRECT_QUESTION_MARKS = 5;
export const DIRECT_BONUS_MARKS = 25;

export const ROUND_CONFIGS = [
  { 
    round: 1, 
    questionsPerTeam: 1, 
    type: 'text' as const, 
    title: 'Round 1: Displacement',
    icon: 'fa-atom',
    description: 'Fundamental units and static electricity concepts. 45 seconds per question.',
    rules: [
      'This round consists of Multiple Choice Questions (MCQs).',
      'You will earn 10 marks for each correct answer.',
      'Passing of questions is not allowed in this round.',
      'A 50:50 helpline is available; however, using it will reduce the reward to 5 marks.'
    ]
  },
  { 
    round: 2, 
    questionsPerTeam: 1, 
    type: 'text' as const, 
    title: 'Round 2: Velocity',
    icon: 'fa-wind',
    description: 'Uniform motion, circular motion, and scalar quantities. 30 seconds per question.',
    rules: [
      'This round consists of Multiple Choice Questions (MCQs).',
      'You will earn 10 marks for each correct answer.',
      'The timer is set to 30 seconds per question.',
      'Passing of questions is not allowed in this round.',
      'A 50:50 helpline is available; however, using it will reduce the reward to 5 marks.'
    ]
  },
  { 
    round: 3, 
    questionsPerTeam: 1, 
    type: 'text' as const, 
    title: 'Round 3: Acceleration',
    icon: 'fa-wave-square',
    description: 'AC Supply, particles, and EM waves. 60 seconds per question. Use "Double Dip" for a second chance!',
    rules: [
      'This round consists of Multiple Choice Questions (MCQs).',
      'Correct answer without Double Dip: 10 marks.',
      'If Double Dip is used: Correct answer earns 20 marks, but an incorrect second attempt results in -5 marks.',
      'The timer is set to 60 seconds per question.',
      'Passing of questions is not allowed in this round.'
    ]
  },
  { 
    round: 4, 
    questionsPerTeam: 1, 
    type: 'text' as const, 
    title: 'Round 4: Force',
    icon: 'fa-cog',
    description: 'Transformers, mechanics, and escape velocity. 30 seconds per question. You can pass for half marks (10s limit)!',
    rules: [
      'Direct questions: Answer without options for full marks.',
      'Correct direct answers earn 10 marks.',
      'Passing is allowed; passed questions earn 5 marks with a 10-second timer.',
      'The initial timer is 30 seconds per question.'
    ]
  },
  { 
    round: 5, 
    questionsPerTeam: 1, 
    type: 'scientist_clues' as const, 
    title: 'Round 5: Work',
    icon: 'fa-user-secret',
    description: 'Identify the Scientist using four clues. Marks decrease with each revealed clue.',
    rules: [
      'Identify the Scientist using up to four progressive clues.',
      'Marks decrease as more clues are revealed: 20, 15, 10, or 5 marks.',
      'You have a total of 60 seconds for the entire question.',
      'Clues can be revealed at any time within this 60-second limit.'
    ]
  },
  { 
    round: 6, 
    questionsPerTeam: 5, 
    type: 'direct_block' as const, 
    title: 'Round 6: Energy',
    icon: 'fa-bolt-lightning',
    description: '5 rapid-fire questions per team. No options - answer directly!',
    rules: [
      'Final Blitz: 5 rapid-fire questions per team.',
      'Answer directly without multiple-choice options.',
      'Each correct answer earns 5 marks.',
      'A bonus of 25 marks is awarded for a perfect 5/5 score.'
    ]
  },
  { 
    round: 7, 
    questionsPerTeam: 5, 
    type: 'direct_block' as const, 
    title: 'Dead Round: Tie-Breaker',
    icon: 'fa-skull-crossbones',
    description: 'Triggered by a tie. 5 conceptual questions per team to decide the ultimate winner.',
    rules: [
      'Tie-Breaker: Conceptual questions to decide the final winner.',
      'Direct answers required for all questions.',
      'Highest score in this round wins the tournament.'
    ]
  }
];

export const CLUE_MARKS = [20, 15, 10, 5];
