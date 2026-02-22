
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, Team, Question, GameStatus } from './types';
import { SetupScreen } from './components/SetupScreen';
import { QuizScreen } from './components/QuizScreen';
import { FinishedScreen } from './components/FinishedScreen';
import { RoundTransitionScreen } from './components/RoundTransitionScreen';
import { 
  QUESTION_TIMER_SECONDS, 
  ROUND_1_TIMER, 
  ROUND_2_TIMER, 
  ROUND_3_TIMER, 
  ROUND_4_TIMER, 
  PASS_TIMER_SECONDS,
  SCIENTIST_ROUND_TIMER, 
  DIRECT_ROUND_TIMER, 
  ROUND_CONFIGS, 
  MARKS_PER_QUESTION, 
  PASSED_QUESTION_MARKS, 
  DIRECT_QUESTION_MARKS, 
  DIRECT_BONUS_MARKS, 
  CLUE_MARKS 
} from './constants';

const SOUND_URLS = {
  bgm: 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3',
  correct: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3',
  wrong: 'https://assets.mixkit.co/active_storage/sfx/951/951-preview.mp3',
  select: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  tick: 'https://assets.mixkit.co/active_storage/sfx/599/599-preview.mp3',
  round: 'https://assets.mixkit.co/music/preview/mixkit-mysterious-suspense-667.mp3'
};

const STATIC_QUESTIONS: Question[] = [
  // ROUND 1 SAMPLES
  { id: 's1', text: 'SAMPLE: What is the SI unit of length?', options: ['Kilogram', 'Meter', 'Second', 'Ampere'], correctIndex: 1, explanation: 'The meter is the SI unit of length.', type: 'text', round: 1, isSample: true },
  // ROUND 1
  { id: '1', text: 'The SI unit of electric charge is', options: ['Ampere', 'Coulomb', 'Volt', 'Ohm'], correctIndex: 1, explanation: 'The Coulomb is the SI unit of electric charge.', type: 'text', round: 1 },
  { id: '2', text: 'Which law explains the attraction or repulsion between electric charges?', options: ['Faraday’s law', 'Coulomb’s law', 'Ohm’s law', 'Ampere’s law'], correctIndex: 1, explanation: 'Coulomb\'s law describes the force between charges.', type: 'text', round: 1 },
  { id: '3', text: 'The dimensional formula of force is', options: ['MLT⁻¹', 'ML²T⁻²', 'MLT⁻²', 'ML⁻¹T⁻²'], correctIndex: 2, explanation: 'Force is Mass x Acceleration (M x LT^-2).', type: 'text', round: 1 },
  { id: '4', text: 'A body is said to be in equilibrium when', options: ['Its velocity is zero', 'Net force acting on it is zero', 'It is at rest only', 'It moves with uniform acceleration'], correctIndex: 1, explanation: 'Equilibrium requires the vector sum of forces to be zero.', type: 'text', round: 1 },
  { id: '5', text: 'The slope of a displacement–time graph represents', options: ['Acceleration', 'Speed', 'Velocity', 'Force'], correctIndex: 2, explanation: 'Velocity is the rate of change of displacement.', type: 'text', round: 1 },
  
  // ROUND 2 SAMPLES
  { id: 's2', text: 'SAMPLE: Is speed a vector or scalar quantity?', options: ['Vector', 'Scalar', 'Both', 'None'], correctIndex: 1, explanation: 'Speed is a scalar quantity as it only has magnitude.', type: 'text', round: 2, isSample: true },
  // ROUND 2
  { id: '6', text: 'Which quantity remains constant in uniform circular motion?', options: ['Velocity', 'Acceleration', 'Speed', 'Force'], correctIndex: 2, explanation: 'Speed is constant, but direction (and thus velocity) changes.', type: 'text', round: 2 },
  { id: '7', text: 'The work done by a centripetal force is', options: ['Maximum', 'Minimum', 'Zero', 'Infinite'], correctIndex: 2, explanation: 'Work is force dot displacement; here they are perpendicular.', type: 'text', round: 2 },
  { id: '8', text: 'The unit of magnetic flux is', options: ['Tesla', 'Weber', 'Henry', 'Gauss'], correctIndex: 1, explanation: 'Weber is the SI unit of magnetic flux.', type: 'text', round: 2 },
  { id: '9', text: 'Which of the following is a scalar quantity?', options: ['Velocity', 'Force', 'Momentum', 'Energy'], correctIndex: 3, explanation: 'Energy has no direction, only magnitude.', type: 'text', round: 2 },
  { id: '10', text: 'The phenomenon responsible for mirage is', options: ['Reflection', 'Diffraction', 'Dispersion', 'Total internal reflection'], correctIndex: 3, explanation: 'Mirages occur due to TIR in air layers of different temperatures.', type: 'text', round: 2 },

  // ROUND 3 SAMPLES
  { id: 's3', text: 'SAMPLE: What is the approximate acceleration due to gravity on Earth?', options: ['5.0 m/s²', '9.8 m/s²', '12.0 m/s²', '1.6 m/s²'], correctIndex: 1, explanation: 'Acceleration due to gravity is approx 9.8 m/s².', type: 'text', round: 3, isSample: true },
  // ROUND 3
  { id: '11', text: 'The frequency of AC supply in India is', options: ['60 Hz', '100 Hz', '25 Hz', '50 Hz'], correctIndex: 3, explanation: 'Standard AC frequency in India is 50 Hertz.', type: 'text', round: 3 },
  { id: '12', text: 'Which particle has the least mass?', options: ['Proton', 'Neutron', 'Electron', 'Alpha particle'], correctIndex: 2, explanation: 'An electron is significantly lighter than protons or neutrons.', type: 'text', round: 3 },
  { id: '13', text: 'The SI unit of electric field is', options: ['N/C', 'C/N', 'V·s', 'Wb'], correctIndex: 0, explanation: 'Electric field is Force per unit Charge (Newton per Coulomb).', type: 'text', round: 3 },
  { id: '14', text: 'A convex lens can form', options: ['Only real images', 'Only virtual images', 'Both real and virtual images', 'Only inverted images'], correctIndex: 2, explanation: 'Depending on object position, it can form real or virtual images.', type: 'text', round: 3 },
  { id: '15', text: 'Which wave does not require a medium for propagation?', options: ['Sound wave', 'Water wave', 'Seismic wave', 'Electromagnetic wave'], correctIndex: 3, explanation: 'EM waves can travel through a vacuum.', type: 'text', round: 3 },

  // ROUND 4 SAMPLES
  { id: 's4', text: 'SAMPLE: State Newton\'s First Law of Motion.', options: ['Action-Reaction', 'Inertia', 'F=ma', 'Gravity'], correctIndex: 1, explanation: 'Newton\'s First Law is the Law of Inertia.', type: 'text', round: 4, isSample: true },
  // ROUND 4
  { id: '16', text: 'The principle of operation of a transformer is based on', options: ['Self-induction', 'Mutual induction', 'Electromagnetic force', 'Electric induction'], correctIndex: 1, explanation: 'Mutual induction between coils.', type: 'text', round: 4 },
  { id: '17', text: 'The unit of Young’s modulus is', options: ['N m⁻¹', 'N m²', 'N m⁻²', 'N'], correctIndex: 2, explanation: 'N m⁻² (Pascal).', type: 'text', round: 4 },
  { id: '18', text: 'The time period of a simple pendulum depends on', options: ['Mass of the bob', 'Amplitude of oscillation', 'Length of the pendulum', 'Material of the string'], correctIndex: 2, explanation: 'Length of the pendulum.', type: 'text', round: 4 },
  { id: '19', text: 'Which device converts mechanical energy into electrical energy?', options: ['Motor', 'Transformer', 'Generator', 'Rectifier'], correctIndex: 2, explanation: 'Generator.', type: 'text', round: 4 },
  { id: '20', text: 'The escape velocity of a body depends on', options: ['Shape of the body', 'Mass of the body', 'Radius and mass of the planet', 'Height of the body'], correctIndex: 2, explanation: 'Radius and mass of the planet.', type: 'text', round: 4 },

  // ROUND 5 SAMPLES
  { id: 's5', text: 'SAMPLE: Identify this Scientist: He developed the laws of motion and universal gravitation.', options: [], correctIndex: 0, explanation: 'Isaac Newton', type: 'scientist_clues', round: 5, isSample: true },
  // ROUND 5
  { id: '21', text: 'Identify this Scientist', options: [], correctIndex: 0, explanation: 'Albert Einstein', type: 'scientist_clues', round: 5 },
  { id: '22', text: 'Identify this Scientist', options: [], correctIndex: 0, explanation: 'Isaac Newton', type: 'scientist_clues', round: 5 },
  { id: '23', text: 'Identify this Scientist', options: [], correctIndex: 0, explanation: 'Marie Curie', type: 'scientist_clues', round: 5 },
  { id: '24', text: 'Identify this Scientist', options: [], correctIndex: 0, explanation: 'Nikola Tesla', type: 'scientist_clues', round: 5 },
  { id: '25', text: 'Identify this Scientist', options: [], correctIndex: 0, explanation: 'Michael Faraday', type: 'scientist_clues', round: 5 },

  // ROUND 6 SAMPLES (Block of 5)
  { id: 's6-1', text: 'SAMPLE: Unit of resistance?', options: [], correctIndex: -1, explanation: 'Ohm', type: 'direct_block', round: 6, isSample: true },
  { id: 's6-2', text: 'SAMPLE: Unit of resistance?', options: [], correctIndex: -1, explanation: 'Ohm', type: 'direct_block', round: 6, isSample: true },
  { id: 's6-3', text: 'SAMPLE: Unit of resistance?', options: [], correctIndex: -1, explanation: 'Ohm', type: 'direct_block', round: 6, isSample: true },
  { id: 's6-4', text: 'SAMPLE: Unit of resistance?', options: [], correctIndex: -1, explanation: 'Ohm', type: 'direct_block', round: 6, isSample: true },
  { id: 's6-5', text: 'SAMPLE: Unit of resistance?', options: [], correctIndex: -1, explanation: 'Ohm', type: 'direct_block', round: 6, isSample: true },
  // ROUND 6
  { id: '26', text: 'What is the SI unit of power?', options: [], correctIndex: -1, explanation: 'Watt', type: 'direct_block', round: 6 },
  { id: '27', text: 'What particle carries a negative charge?', options: [], correctIndex: -1, explanation: 'Electron', type: 'direct_block', round: 6 },
  { id: '28', text: 'Bending of light as it passes through a lens?', options: [], correctIndex: -1, explanation: 'Refraction', type: 'direct_block', round: 6 },
  { id: '29', text: 'Energy stored due to position?', options: [], correctIndex: -1, explanation: 'Potential Energy', type: 'direct_block', round: 6 },
  { id: '30', text: 'Dimensional formula for velocity?', options: [], correctIndex: -1, explanation: 'LT⁻¹', type: 'direct_block', round: 6 },
  { id: '31', text: 'Tool to measure electric current?', options: [], correctIndex: -1, explanation: 'Ammeter', type: 'direct_block', round: 6 },
  { id: '32', text: 'Newton\'s Third Law describes...?', options: [], correctIndex: -1, explanation: 'Action and Reaction', type: 'direct_block', round: 6 },
  { id: '33', text: 'SI unit of frequency?', options: [], correctIndex: -1, explanation: 'Hertz', type: 'direct_block', round: 6 },
  { id: '34', text: 'Resistance to change in motion?', options: [], correctIndex: -1, explanation: 'Inertia', type: 'direct_block', round: 6 },
  { id: '35', text: 'Speed of sound is fastest in which state of matter?', options: [], correctIndex: -1, explanation: 'Solid', type: 'direct_block', round: 6 },
  { id: '36', text: 'Unit of potential difference?', options: [], correctIndex: -1, explanation: 'Volt', type: 'direct_block', round: 6 },
  { id: '37', text: 'Particle in atom with no charge?', options: [], correctIndex: -1, explanation: 'Neutron', type: 'direct_block', round: 6 },
  { id: '38', text: 'Unit of luminous intensity?', options: [], correctIndex: -1, explanation: 'Candela', type: 'direct_block', round: 6 },
  { id: '39', text: 'Property of liquids that opposes flow?', options: [], correctIndex: -1, explanation: 'Viscosity', type: 'direct_block', round: 6 },
  { id: '40', text: 'Visible light color with longest wavelength?', options: [], correctIndex: -1, explanation: 'Red', type: 'direct_block', round: 6 },
  { id: '41', text: 'Rate of change of displacement?', options: [], correctIndex: -1, explanation: 'Velocity', type: 'direct_block', round: 6 },
  { id: '42', text: 'Unit of capacitance?', options: [], correctIndex: -1, explanation: 'Farad', type: 'direct_block', round: 6 },
  { id: '43', text: 'Force that pulls objects towards Earth?', options: [], correctIndex: -1, explanation: 'Gravity', type: 'direct_block', round: 6 },
  { id: '44', text: 'Mirror that always forms diminished images?', options: [], correctIndex: -1, explanation: 'Convex Mirror', type: 'direct_block', round: 6 },
  { id: '45', text: 'Splitting of white light into colors?', options: [], correctIndex: -1, explanation: 'Dispersion', type: 'direct_block', round: 6 },
  { id: '46', text: 'Unit of force?', options: [], correctIndex: -1, explanation: 'Newton', type: 'direct_block', round: 6 },
  { id: '47', text: 'Dimensional formula for acceleration?', options: [], correctIndex: -1, explanation: 'LT⁻²', type: 'direct_block', round: 6 },
  { id: '48', text: 'Center part of an atom?', options: [], correctIndex: -1, explanation: 'Nucleus', type: 'direct_block', round: 6 },
  { id: '49', text: 'SI unit of thermodynamic temperature?', options: [], correctIndex: -1, explanation: 'Kelvin', type: 'direct_block', round: 6 },
  { id: '50', text: 'Work done is Force multiplied by...?', options: [], correctIndex: -1, explanation: 'Displacement', type: 'direct_block', round: 6 },

  // ROUND 7 SAMPLES (Block of 5)
  { id: 's7-1', text: 'SAMPLE: Why does ice float?', options: [], correctIndex: -1, explanation: 'Less dense than water', type: 'direct_block', round: 7, isSample: true },
  { id: 's7-2', text: 'SAMPLE: Why does ice float?', options: [], correctIndex: -1, explanation: 'Less dense than water', type: 'direct_block', round: 7, isSample: true },
  { id: 's7-3', text: 'SAMPLE: Why does ice float?', options: [], correctIndex: -1, explanation: 'Less dense than water', type: 'direct_block', round: 7, isSample: true },
  { id: 's7-4', text: 'SAMPLE: Why does ice float?', options: [], correctIndex: -1, explanation: 'Less dense than water', type: 'direct_block', round: 7, isSample: true },
  { id: 's7-5', text: 'SAMPLE: Why does ice float?', options: [], correctIndex: -1, explanation: 'Less dense than water', type: 'direct_block', round: 7, isSample: true },
  // ROUND 7 (DEAD ROUND - Tie Breaker Conceptual Questions)
  { id: '51', text: 'Why does a cyclist lean inward while taking a turn?', options: [], correctIndex: -1, explanation: 'To provide the necessary centripetal force.', type: 'direct_block', round: 7 },
  { id: '52', text: 'If gravity disappeared, what would happen to satellites orbiting the Earth?', options: [], correctIndex: -1, explanation: 'They would fly off in a straight line (tangent to their orbit).', type: 'direct_block', round: 7 },
  { id: '53', text: 'Why does ice float on water even though it is a solid?', options: [], correctIndex: -1, explanation: 'Ice is less dense than liquid water due to its lattice structure.', type: 'direct_block', round: 7 },
  { id: '54', text: 'Why does a rainbow form only at a specific angle?', options: [], correctIndex: -1, explanation: 'Due to the specific dispersion and internal reflection angle in water droplets (approx. 42°).', type: 'direct_block', round: 7 },
  { id: '55', text: 'Why do astronauts feel weightless inside a spacecraft even though gravity is present?', options: [], correctIndex: -1, explanation: 'They are in a state of continuous free-fall along with the spacecraft.', type: 'direct_block', round: 7 },
  { id: '56', text: 'Why does sound travel faster in solids than in gases?', options: [], correctIndex: -1, explanation: 'Molecules in solids are closer and have stronger elastic properties.', type: 'direct_block', round: 7 },
  { id: '57', text: 'Why does a black object absorb more heat than a white object?', options: [], correctIndex: -1, explanation: 'Black absorbs all wavelengths of visible light energy.', type: 'direct_block', round: 7 },
  { id: '58', text: 'Why can birds sit safely on high-voltage power lines?', options: [], correctIndex: -1, explanation: 'There is no potential difference between their feet (no complete circuit).', type: 'direct_block', round: 7 },
  { id: '59', text: 'Why does a moving fan appear slower or stationary under certain lighting conditions?', options: [], correctIndex: -1, explanation: 'The Stroboscopic effect caused by periodic light pulses.', type: 'direct_block', round: 7 },
  { id: '60', text: 'Why is it more difficult to stop a moving bus than a bicycle?', options: [], correctIndex: -1, explanation: 'The bus has much greater inertia due to its larger mass.', type: 'direct_block', round: 7 },
  { id: '61', text: 'Why does a spoon appear bent when placed in a glass of water?', options: [], correctIndex: -1, explanation: 'Refraction of light as it moves from water to air.', type: 'direct_block', round: 7 },
  { id: '62', text: 'Why do we see lightning before hearing thunder?', options: [], correctIndex: -1, explanation: 'Light travels much faster (3x10^8 m/s) than sound (343 m/s).', type: 'direct_block', round: 7 },
  { id: '63', text: 'Why does pressure increase as we go deeper into water?', options: [], correctIndex: -1, explanation: 'The weight of the water column above increases with depth.', type: 'direct_block', round: 7 },
  { id: '64', text: 'Why does a metal spoon feel colder than a wooden spoon at the same temperature?', options: [], correctIndex: -1, explanation: 'Metal is a better thermal conductor and draws heat away from the skin faster.', type: 'direct_block', round: 7 },
  { id: '65', text: 'Why does the sky appear blue during the day but reddish during sunrise and sunset?', options: [], correctIndex: -1, explanation: 'Rayleigh scattering; blue scatters more at noon, red survives the longer path at dusk.', type: 'direct_block', round: 7 },
  { id: '66', text: 'Why do clouds float when they contain millions of tons of water?', options: [], correctIndex: -1, explanation: 'The water is distributed in tiny droplets supported by rising warm air.', type: 'direct_block', round: 7 },
  { id: '67', text: 'Why does your hair stand on end after removing a woolly hat?', options: [], correctIndex: -1, explanation: 'Static electricity; like charges on the hair strands repel each other.', type: 'direct_block', round: 7 },
  { id: '68', text: 'Why does a compass needle point North?', options: [], correctIndex: -1, explanation: 'It aligns with the Earth\'s magnetic field.', type: 'direct_block', round: 7 },
  { id: '69', text: 'Why does a pressure cooker cook food faster?', options: [], correctIndex: -1, explanation: 'Increased pressure raises the boiling point of water.', type: 'direct_block', round: 7 },
  { id: '70', text: 'Why does an iron ship float while a small nail sinks?', options: [], correctIndex: -1, explanation: 'The ship displaces a volume of water equal to its weight (Archimedes\' Principle).', type: 'direct_block', round: 7 },
  { id: '71', text: 'Why does a magnifying glass burn paper when held in sunlight?', options: [], correctIndex: -1, explanation: 'It converges parallel sun rays into a single high-temperature focal point.', type: 'direct_block', round: 7 },
  { id: '72', text: 'Why do we lean forward while climbing a hill?', options: [], correctIndex: -1, explanation: 'To shift our center of gravity forward for stability.', type: 'direct_block', round: 7 },
  { id: '73', text: 'Why is it easier to pull a lawn roller than to push it?', options: [], correctIndex: -1, explanation: 'Pulling reduces the effective normal force and friction.', type: 'direct_block', round: 7 },
  { id: '74', text: 'Why does a ball bounce higher on a hard floor than on a carpet?', options: [], correctIndex: -1, explanation: 'A hard floor absorbs less energy during the collision.', type: 'direct_block', round: 7 },
  { id: '75', text: 'Why do we sweat more on a humid day than on a dry day?', options: [], correctIndex: -1, explanation: 'High humidity prevents efficient evaporation of sweat.', type: 'direct_block', round: 7 },
];

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    teams: [],
    questions: [],
    currentQuestionIndex: 0,
    activeTeamIndex: 0,
    status: 'setup',
    timeLeft: ROUND_1_TIMER,
    selectedOption: null,
    currentRound: 1,
    showOptions: false,
    helplineUsed: false,
    hiddenOptions: [],
    doubleDipActive: false,
    doubleDipAttemptCount: 0,
    wrongDoubleDipIndices: [],
    isPassed: false,
    currentClueIndex: 0,
    directRoundScores: [false, false, false, false, false],
    isAnswerRevealed: false
  });

  const [isMuted, setIsMuted] = useState(false);
  const timerRef = useRef<number | null>(null);

  const bgmPlayer = useRef<HTMLAudioElement | null>(null);
  const tickPlayer = useRef<HTMLAudioElement | null>(null);
  const roundPlayer = useRef<HTMLAudioElement | null>(null);

  const playSFX = useCallback((key: keyof typeof SOUND_URLS) => {
    if (isMuted) return;
    const audio = new Audio(SOUND_URLS[key]);
    if (key === 'wrong') audio.volume = 1.0; 
    else if (key === 'correct') audio.volume = 0.8;
    else audio.volume = 0.7;
    audio.play().catch(() => {});
  }, [isMuted]);

  useEffect(() => {
    if (!bgmPlayer.current) {
      bgmPlayer.current = new Audio(SOUND_URLS.bgm);
      bgmPlayer.current.loop = true;
    } else if (bgmPlayer.current.src !== SOUND_URLS.bgm) {
      bgmPlayer.current.pause();
      bgmPlayer.current.src = SOUND_URLS.bgm;
      bgmPlayer.current.load();
    }

    const isBGMActive = (gameState.status === 'playing' || gameState.status === 'question_result');
    if (!isMuted && isBGMActive) {
      bgmPlayer.current.volume = gameState.status === 'question_result' ? 0.04 : 0.08;
      const playPromise = bgmPlayer.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    } else {
      bgmPlayer.current.pause();
    }
    return () => bgmPlayer.current?.pause();
  }, [gameState.status, isMuted]);

  useEffect(() => {
    if (!tickPlayer.current) {
      tickPlayer.current = new Audio(SOUND_URLS.tick);
      tickPlayer.current.loop = true;
    } else if (tickPlayer.current.src !== SOUND_URLS.tick) {
      tickPlayer.current.pause();
      tickPlayer.current.src = SOUND_URLS.tick;
      tickPlayer.current.load();
    }

    const isLowTime = gameState.status === 'playing' && gameState.timeLeft <= 10 && gameState.timeLeft > 0;
    const shouldPlayTick = !isMuted && isLowTime && gameState.showOptions;
    if (shouldPlayTick) {
      tickPlayer.current.volume = 0.95;
      if (tickPlayer.current.paused) {
        const playPromise = tickPlayer.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {});
        }
      }
    } else {
      tickPlayer.current.pause();
      tickPlayer.current.currentTime = 0;
    }
  }, [gameState.status, gameState.timeLeft, gameState.showOptions, isMuted]);

  useEffect(() => {
    if (!roundPlayer.current) {
      roundPlayer.current = new Audio(SOUND_URLS.round);
      roundPlayer.current.loop = true;
    } else if (roundPlayer.current.src !== SOUND_URLS.round) {
      roundPlayer.current.pause();
      roundPlayer.current.src = SOUND_URLS.round;
      roundPlayer.current.load();
    }

    if (!isMuted && gameState.status === 'round_transition') {
      roundPlayer.current.volume = 1.0;
      const playPromise = roundPlayer.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Round audio play failed, retrying on next update:", err);
        });
      }
    } else {
      if (roundPlayer.current) {
        roundPlayer.current.pause();
        roundPlayer.current.currentTime = 0;
      }
    }
    return () => roundPlayer.current?.pause();
  }, [gameState.status, isMuted]);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setGameState(prev => {
        if (prev.timeLeft <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          playSFX('wrong');
          // No auto-reveal for Rounds 1, 2, or 3. Moderator manually reveals after time ends.
          return { ...prev, timeLeft: 0, status: 'question_result' as GameStatus, isAnswerRevealed: false };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);
  }, [playSFX]);

  const triggerOptionDelay = useCallback((skipResetTimer?: boolean) => {
    setGameState(prev => {
      let timer = QUESTION_TIMER_SECONDS;
      if (prev.isPassed) {
        timer = PASS_TIMER_SECONDS;
      } else {
        switch (prev.currentRound) {
          case 1: timer = ROUND_1_TIMER; break;
          case 2: timer = ROUND_2_TIMER; break;
          case 3: timer = ROUND_3_TIMER; break;
          case 4: timer = ROUND_4_TIMER; break;
          case 5: timer = SCIENTIST_ROUND_TIMER; break;
          default: timer = DIRECT_ROUND_TIMER; break;
        }
      }

      return { 
        ...prev, 
        showOptions: false, 
        timeLeft: skipResetTimer ? prev.timeLeft : timer, 
        selectedOption: null, 
        helplineUsed: false, 
        hiddenOptions: [],
        doubleDipActive: false,
        doubleDipAttemptCount: 0,
        wrongDoubleDipIndices: [],
        currentClueIndex: 0,
        directRoundScores: [false, false, false, false, false],
        isAnswerRevealed: false
      };
    });
  }, [startTimer]);

  const handleRevealOptions = () => {
    playSFX('select');
    setGameState(prev => ({ ...prev, showOptions: true }));
    startTimer();
  };

  const handleStartGame = async (teamNames: string[]) => {
    playSFX('select');
    setGameState(prev => ({ ...prev, status: 'loading' }));
    await new Promise(r => setTimeout(r, 1500));
    const initialTeams: Team[] = teamNames.map((name, i) => ({
      id: i, name, score: 0, color: '' 
    }));
    setGameState({
      teams: initialTeams,
      questions: STATIC_QUESTIONS,
      currentQuestionIndex: 0,
      activeTeamIndex: 0,
      directTeamIndex: 0,
      status: 'round_transition',
      timeLeft: ROUND_1_TIMER,
      selectedOption: null,
      currentRound: 1,
      showOptions: false,
      helplineUsed: false,
      hiddenOptions: [],
      doubleDipActive: false,
      doubleDipAttemptCount: 0,
      wrongDoubleDipIndices: [],
      isPassed: false,
      currentClueIndex: 0,
      directRoundScores: [false, false, false, false, false],
      isAnswerRevealed: false
    });
  };

  const handleStartRound = () => {
    playSFX('select');
    setGameState(prev => ({ ...prev, status: 'playing', isAnswerRevealed: false }));
    triggerOptionDelay();
  };

  const handleToggleDirectScore = (idx: number) => {
    playSFX('select');
    setGameState(prev => {
      const newScores = [...prev.directRoundScores];
      newScores[idx] = !newScores[idx];
      return { ...prev, directRoundScores: newScores };
    });
  };

  const handleSubmitDirectBlock = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const q = gameState.questions[gameState.currentQuestionIndex];
    if (q.isSample) {
      playSFX('correct');
      setGameState(prev => ({ ...prev, status: 'question_result', isAnswerRevealed: true }));
      return;
    }
    playSFX('correct');
    setGameState(prev => {
      const correctCount = prev.directRoundScores.filter(s => s).length;
      let roundTotal = correctCount * DIRECT_QUESTION_MARKS;
      if (correctCount === 5) roundTotal += DIRECT_BONUS_MARKS;
      
      const updatedTeams = prev.teams.map((team, idx) => 
        idx === prev.activeTeamIndex ? { ...team, score: team.score + roundTotal } : team
      );
      
      return { ...prev, teams: updatedTeams, status: 'question_result', isAnswerRevealed: true };
    });
  };

  const handleManualScore = (isCorrect: boolean) => {
    if (gameState.status !== 'playing') return;
    const q = gameState.questions[gameState.currentQuestionIndex];
    
    if (gameState.currentRound === 5) {
      if (isCorrect) {
        if (timerRef.current) clearInterval(timerRef.current);
        playSFX('correct');
        const points = q.isSample ? 0 : CLUE_MARKS[gameState.currentClueIndex];
        setGameState(prev => {
          const updatedTeams = prev.teams.map((team, idx) => 
            (idx === prev.activeTeamIndex && !q.isSample) ? { ...team, score: team.score + points } : team
          );
          return { ...prev, status: 'question_result', teams: updatedTeams, selectedOption: 0, isAnswerRevealed: true };
        });
      } else {
        if (gameState.currentClueIndex < 3) {
          playSFX('select');
          setGameState(prev => ({ ...prev, currentClueIndex: prev.currentClueIndex + 1 }));
        } else {
          if (timerRef.current) clearInterval(timerRef.current);
          playSFX('wrong');
          setGameState(prev => ({ ...prev, status: 'question_result', selectedOption: -1, isAnswerRevealed: true }));
        }
      }
      return;
    }

    if (timerRef.current) clearInterval(timerRef.current);
    playSFX(isCorrect ? 'correct' : 'wrong');
    const marks = (isCorrect && !q.isSample) ? (gameState.isPassed ? PASSED_QUESTION_MARKS : MARKS_PER_QUESTION) : 0;
    setGameState(prev => {
      const updatedTeams = prev.teams.map((team, idx) => 
        (isCorrect && idx === prev.activeTeamIndex && !q.isSample) ? { ...team, score: team.score + marks } : team
      );
      
      return { 
        ...prev, 
        status: 'question_result', 
        teams: updatedTeams, 
        selectedOption: isCorrect ? q.correctIndex : -1, 
        isAnswerRevealed: true 
      };
    });
  };

  const handleSelectOption = (index: number) => {
    if (gameState.status !== 'playing' || !gameState.showOptions || [4, 5, 6, 7].includes(gameState.currentRound)) return;
    playSFX('select');
    setGameState(prev => ({ ...prev, selectedOption: index }));
  };

  const handleUseHelpline = () => {
    if (gameState.status !== 'playing' || ![1, 2].includes(gameState.currentRound) || gameState.helplineUsed) return;
    playSFX('select');
    const currentQuestion = gameState.questions[gameState.currentQuestionIndex];
    const correctIdx = currentQuestion.correctIndex;
    const incorrectIndices = [0, 1, 2, 3].filter(i => i !== correctIdx);
    const toHide = incorrectIndices.sort(() => Math.random() - 0.5).slice(0, 2);
    setGameState(prev => ({
      ...prev,
      helplineUsed: true,
      hiddenOptions: toHide,
      selectedOption: toHide.includes(prev.selectedOption || -1) ? null : prev.selectedOption
    }));
  };

  const handleUseDoubleDip = () => {
    if (gameState.status !== 'playing' || gameState.currentRound !== 3 || gameState.doubleDipActive) return;
    playSFX('select');
    setGameState(prev => ({ ...prev, doubleDipActive: true, doubleDipAttemptCount: 0 }));
  };

  const handlePass = () => {
    if (gameState.status !== 'playing' || gameState.currentRound !== 4) return;
    playSFX('wrong');
    const directTeamIndex = gameState.directTeamIndex ?? 0;
    const lastTeamToPassTo = (directTeamIndex + gameState.teams.length - 1) % gameState.teams.length;
    
    if (gameState.activeTeamIndex === lastTeamToPassTo) {
      if (timerRef.current) clearInterval(timerRef.current);
      setGameState(prev => ({ ...prev, status: 'question_result', selectedOption: -1, isAnswerRevealed: true })); 
      return;
    }
    
    if (timerRef.current) clearInterval(timerRef.current);
    
    setGameState(prev => ({
        ...prev,
        activeTeamIndex: (prev.activeTeamIndex + 1) % prev.teams.length,
        isPassed: true,
        timeLeft: PASS_TIMER_SECONDS,
        showOptions: false,
        selectedOption: null,
        isAnswerRevealed: false
    }));
    
    setTimeout(() => {
      handleRevealOptions();
    }, 1000);
  };

  const handleRevealAnswer = () => {
    if (gameState.status === 'question_result') {
      playSFX('select');
      setGameState(prev => ({ ...prev, isAnswerRevealed: true }));
      return;
    }

    if (gameState.status !== 'playing' || [4, 5, 6, 7].includes(gameState.currentRound)) return;
    if (gameState.selectedOption === null) return;
    const currentQuestion = gameState.questions[gameState.currentQuestionIndex];
    const isCorrect = gameState.selectedOption === currentQuestion.correctIndex;
    if (timerRef.current) clearInterval(timerRef.current);
    
    if (gameState.doubleDipActive) {
      if (isCorrect) {
        playSFX('correct');
        const marks = currentQuestion.isSample ? 0 : 20;
        setGameState(prev => {
          const updatedTeams = prev.teams.map((team, idx) => 
            (idx === prev.activeTeamIndex && !currentQuestion.isSample) ? { ...team, score: team.score + marks } : team
          );
          return { ...prev, status: 'question_result', teams: updatedTeams, isAnswerRevealed: true };
        });
      } else {
        playSFX('wrong');
        if (gameState.doubleDipAttemptCount === 0) {
          startTimer();
          setGameState(prev => ({ ...prev, doubleDipAttemptCount: 1, wrongDoubleDipIndices: [...prev.wrongDoubleDipIndices, prev.selectedOption!], selectedOption: null }));
        } else {
          setGameState(prev => {
            const updatedTeams = prev.teams.map((team, idx) => 
              (idx === prev.activeTeamIndex && !currentQuestion.isSample) ? { ...team, score: team.score - 5 } : team
            );
            return { ...prev, status: 'question_result', teams: updatedTeams, isAnswerRevealed: true };
          });
        }
      }
    } else {
      playSFX(isCorrect ? 'correct' : 'wrong');
      const marks = (isCorrect && !currentQuestion.isSample) ? (gameState.isPassed ? PASSED_QUESTION_MARKS : (gameState.helplineUsed ? 5 : MARKS_PER_QUESTION)) : 0;
      setGameState(prev => {
        const updatedTeams = prev.teams.map((team, idx) => 
          (isCorrect && idx === prev.activeTeamIndex && !currentQuestion.isSample) ? { ...team, score: team.score + marks } : team
        );
        return { ...prev, status: 'question_result', teams: updatedTeams, isAnswerRevealed: true };
      });
    }
  };

  const handleNextQuestion = async () => {
    playSFX('select');
    const increment = gameState.currentRound >= 6 ? 5 : 1;
    const nextIdx = gameState.currentQuestionIndex + increment;
    
    if (gameState.currentRound === 6 && nextIdx >= 60) {
      const maxScore = Math.max(...gameState.teams.map(t => t.score));
      const tiedTeams = gameState.teams.filter(t => t.score === maxScore);
      const tiedIndices = gameState.teams
        .map((t, i) => t.score === maxScore ? i : -1)
        .filter(i => i !== -1);
      
      if (tiedTeams.length > 1) {
        setGameState(prev => ({ 
          ...prev, 
          currentQuestionIndex: 65, 
          activeTeamIndex: tiedIndices[0], 
          tiedTeamIndices: tiedIndices,
          status: 'round_transition', 
          currentRound: 7, 
          showOptions: false, 
          selectedOption: null,
          isAnswerRevealed: false
        }));
        return;
      } else {
        setGameState(prev => ({ ...prev, status: 'finished' }));
        return;
      }
    }

    if (gameState.currentRound === 7 && gameState.tiedTeamIndices) {
      const currentTiedIdx = gameState.tiedTeamIndices.indexOf(gameState.activeTeamIndex);
      const isLastTiedTeam = currentTiedIdx === gameState.tiedTeamIndices.length - 1;
      
      if (isLastTiedTeam) {
        // Check if tie is broken
        const tiedScores = gameState.tiedTeamIndices.map(idx => gameState.teams[idx].score);
        const maxTiedScore = Math.max(...tiedScores);
        const winnersCount = tiedScores.filter(s => s === maxTiedScore).length;
        
        if (winnersCount === 1 || nextIdx >= gameState.questions.length) {
          setGameState(prev => ({ ...prev, status: 'finished' }));
          return;
        }
        // If still tied and more questions, continue cycling
      }
    }

    if (nextIdx >= gameState.questions.length) {
      setGameState(prev => ({ ...prev, status: 'finished' }));
      return;
    }

    const nextQuestion = gameState.questions[nextIdx];
    const isNewRound = nextQuestion.round > gameState.currentRound;
    
    let nextTeam = gameState.activeTeamIndex;
    if (isNewRound || gameState.questions[gameState.currentQuestionIndex].isSample) {
      if (nextQuestion.round === 7 && gameState.tiedTeamIndices) {
        nextTeam = gameState.tiedTeamIndices[0];
      } else {
        nextTeam = 0; // Always start new round or real questions after sample with Team 1
      }
    } else if (gameState.currentRound === 4) {
      const round4StartIdx = gameState.questions.findIndex(q => q.round === 4 && !q.isSample);
      const questionNumInRound = nextIdx - round4StartIdx;
      nextTeam = questionNumInRound % gameState.teams.length;
    } else {
      if (gameState.currentRound === 7 && gameState.tiedTeamIndices) {
        const currentTiedIdx = gameState.tiedTeamIndices.indexOf(gameState.activeTeamIndex);
        nextTeam = gameState.tiedTeamIndices[(currentTiedIdx + 1) % gameState.tiedTeamIndices.length];
      } else {
        nextTeam = (gameState.activeTeamIndex + 1) % gameState.teams.length;
      }
    }
      
    if (isNewRound) {
      setGameState(prev => ({ ...prev, currentQuestionIndex: nextIdx, activeTeamIndex: nextTeam, directTeamIndex: nextTeam, status: 'round_transition', currentRound: nextQuestion.round, showOptions: false, selectedOption: null, isPassed: false, currentClueIndex: 0, directRoundScores: [false, false, false, false, false], isAnswerRevealed: false }));
    } else {
      setGameState(prev => ({ ...prev, currentQuestionIndex: nextIdx, activeTeamIndex: nextTeam, directTeamIndex: nextTeam, status: 'playing', selectedOption: null, showOptions: false, helplineUsed: false, hiddenOptions: [], doubleDipActive: false, doubleDipAttemptCount: 0, wrongDoubleDipIndices: [], isPassed: false, currentClueIndex: 0, directRoundScores: [false, false, false, false, false], isAnswerRevealed: false }));
      triggerOptionDelay();
    }
  };

  const resetGame = () => { 
    if (bgmPlayer.current) bgmPlayer.current.pause();
    setGameState({ teams: [], questions: [], currentQuestionIndex: 0, activeTeamIndex: 0, directTeamIndex: 0, status: 'setup', timeLeft: ROUND_1_TIMER, selectedOption: null, currentRound: 1, showOptions: false, helplineUsed: false, hiddenOptions: [], doubleDipActive: false, doubleDipAttemptCount: 0, wrongDoubleDipIndices: [], isPassed: false, currentClueIndex: 0, directRoundScores: [false, false, false, false, false], isAnswerRevealed: false, tiedTeamIndices: undefined }); 
  };

  const jumpToRound = (roundNumber: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    playSFX('select');
    const idx = gameState.questions.findIndex(q => q.round === roundNumber);
    if (idx === -1) return;
    setGameState(prev => ({ ...prev, currentRound: roundNumber, currentQuestionIndex: idx, activeTeamIndex: 0, directTeamIndex: 0, status: 'round_transition', showOptions: false, selectedOption: null, isPassed: false, helplineUsed: false, hiddenOptions: [], doubleDipActive: false, doubleDipAttemptCount: 0, wrongDoubleDipIndices: [], currentClueIndex: 0, directRoundScores: [false, false, false, false, false], isAnswerRevealed: false, tiedTeamIndices: undefined }));
  };

  useEffect(() => { return () => { if (timerRef.current) clearInterval(timerRef.current); }; }, []);

  return (
    <div className="fixed inset-0 bg-slate-900 text-slate-100 flex flex-col overflow-hidden">
      <div className="flex-1 relative overflow-hidden flex flex-col items-center justify-center">
        {gameState.status === 'setup' && <div className="w-full max-h-full overflow-y-auto"><SetupScreen onStart={handleStartGame} /></div>}
        {gameState.status === 'loading' && (
          <div className="flex flex-col items-center justify-center h-full space-y-8">
            <div className="relative w-24 h-24">
               <div className="absolute inset-0 border-[8px] border-slate-800 rounded-full"></div>
               <div className="absolute inset-0 border-[8px] border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="text-2xl font-black text-white animate-pulse uppercase tracking-widest">Initializing...</h2>
         </div>
        )}
        {gameState.status === 'round_transition' && <RoundTransitionScreen round={gameState.currentRound} onStart={handleStartRound} />}
        {(gameState.status === 'playing' || gameState.status === 'question_result') && (
          <QuizScreen 
            gameState={gameState} 
            onSelectOption={handleSelectOption}
            onRevealAnswer={handleRevealAnswer}
            onNextQuestion={handleNextQuestion}
            onUseHelpline={handleUseHelpline}
            onUseDoubleDip={handleUseDoubleDip}
            onPass={handlePass}
            onManualScore={handleManualScore}
            onClueWrong={() => handleManualScore(false)}
            onClueCorrect={() => handleManualScore(true)}
            onToggleDirectScore={handleToggleDirectScore}
            onSubmitDirectBlock={handleSubmitDirectBlock}
            onRevealOptions={handleRevealOptions}
            onTimeUp={() => {}} 
          />
        )}
        {gameState.status === 'finished' && <div className="w-full h-full overflow-y-auto"><FinishedScreen teams={gameState.teams} onRestart={resetGame} /></div>}
      </div>
      {(gameState.status !== 'setup' && gameState.status !== 'loading') && (
        <div className="bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 p-2 shrink-0 z-50">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar flex-1">
              {ROUND_CONFIGS.map((config) => (
                <button key={config.round} onClick={() => jumpToRound(config.round)} className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all shrink-0 border ${gameState.currentRound === config.round ? 'bg-blue-600 border-blue-500 text-white shadow-lg' : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'}`}>R{config.round}</button>
              ))}
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setIsMuted(!isMuted)} 
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all border border-slate-700 ${isMuted ? 'bg-slate-800 text-slate-500' : 'bg-blue-600/20 text-blue-400'}`}
              >
                <i className={`fas ${isMuted ? 'fa-volume-mute' : 'fa-volume-up'} text-xs`}></i>
              </button>
              <button onClick={resetGame} className="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all border border-red-900/50 text-red-500 hover:bg-red-500 hover:text-white">QUIT</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
