
import React from 'react';
import { GameState } from '../types';
import { 
  TEAM_COLORS, 
  TEAM_BORDERS, 
  TEAM_TEXTS, 
  ROUND_1_TIMER, 
  ROUND_2_TIMER, 
  ROUND_3_TIMER, 
  ROUND_4_TIMER, 
  PASS_TIMER_SECONDS,
  QUESTION_TIMER_SECONDS, 
  ROUND_CONFIGS, 
  DIRECT_ROUND_TIMER, 
  SCIENTIST_ROUND_TIMER, 
  CLUE_MARKS,
  MARKS_PER_QUESTION,
  PASSED_QUESTION_MARKS,
  DIRECT_QUESTION_MARKS,
  DIRECT_BONUS_MARKS
} from '../constants';

interface QuizScreenProps {
  gameState: GameState;
  onSelectOption: (index: number) => void;
  onRevealAnswer: () => void;
  onNextQuestion: () => void;
  onUseHelpline: () => void;
  onUseDoubleDip: () => void;
  onPass: () => void;
  onManualScore: (isCorrect: boolean) => void;
  onTimeUp: () => void;
  onClueWrong: () => void;
  onClueCorrect: () => void;
  onToggleDirectScore: (idx: number) => void;
  onSubmitDirectBlock: () => void;
  onRevealOptions: () => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({ 
  gameState, 
  onSelectOption, 
  onRevealAnswer,
  onNextQuestion,
  onUseHelpline,
  onUseDoubleDip,
  onPass,
  onManualScore,
  onClueCorrect,
  onClueWrong,
  onToggleDirectScore,
  onSubmitDirectBlock,
  onRevealOptions,
}) => {
  const { 
    teams, 
    questions, 
    currentQuestionIndex, 
    activeTeamIndex, 
    status, 
    timeLeft, 
    selectedOption,
    currentRound,
    showOptions,
    helplineUsed,
    hiddenOptions,
    doubleDipActive,
    doubleDipAttemptCount,
    wrongDoubleDipIndices,
    isPassed,
    directRoundScores,
    currentClueIndex,
    isAnswerRevealed
  } = gameState;

  const currentQuestion = questions[currentQuestionIndex];
  const roundConfig = ROUND_CONFIGS.find(r => r.round === currentRound);
  const roundTitle = roundConfig?.title || `Round ${currentRound}`;

  const getMaxTimer = () => {
    if (isPassed) return PASS_TIMER_SECONDS;
    if (currentRound === 1) return ROUND_1_TIMER;
    if (currentRound === 2) return ROUND_2_TIMER;
    if (currentRound === 3) return ROUND_3_TIMER;
    if (currentRound === 4) return ROUND_4_TIMER;
    if (currentRound === 5) return SCIENTIST_ROUND_TIMER;
    if (currentRound >= 6) return DIRECT_ROUND_TIMER;
    return QUESTION_TIMER_SECONDS;
  };

  const maxTimer = getMaxTimer();
  const isLowTime = timeLeft <= 10 && status === 'playing' && showOptions;
  const progressWidth = showOptions ? (timeLeft / maxTimer) * 100 : 100;

  const isRound4 = currentRound === 4;
  const isRound5 = currentRound === 5;
  const isRound6 = currentRound === 6;
  const isRound7 = currentRound === 7;

  const blitzQuestions = (isRound6 || isRound7) ? questions.slice(currentQuestionIndex, currentQuestionIndex + 5) : [];

  const getSubmitButtonLabel = () => {
    if (doubleDipActive) {
      return doubleDipAttemptCount === 0 ? "SUBMIT FIRST DIP" : "SUBMIT SECOND DIP";
    }
    return "SUBMIT SELECTION";
  };

  const getResultStamp = () => {
    if (status !== 'question_result') return null;
    
    // Blitz rounds don't show central stamps
    if (currentRound >= 6) return null;

    const isCorrect = selectedOption !== null && selectedOption === currentQuestion?.correctIndex;
    const isTimeUpUnanswered = selectedOption === null && timeLeft === 0;

    // 1. Correct Answer Highlight
    if (isCorrect) {
      let points = MARKS_PER_QUESTION;
      if (isPassed) points = PASSED_QUESTION_MARKS;
      else if (helplineUsed) points = 5;
      else if (currentRound === 5) points = CLUE_MARKS[currentClueIndex];
      else if (currentRound === 3 && doubleDipActive) points = 20;

      return (
        <div className="flex flex-col items-center space-y-2">
          <div className="px-8 py-4 rounded-2xl font-black text-3xl md:text-5xl border-4 shadow-[0_20px_40px_-10px_rgba(16,185,129,0.4)] uppercase tracking-widest bg-emerald-600 text-white border-emerald-400">
            CORRECT
          </div>
          {!currentQuestion?.isSample && (
            <div className="px-4 py-1 bg-emerald-500/20 border border-emerald-500/40 rounded-full text-emerald-400 font-black text-xs uppercase tracking-widest animate-bounce">
              +{points} POINTS
            </div>
          )}
        </div>
      );
    }

    // 2. Wrong Answer with Penalty (Double Dip)
    if (status === 'question_result' && doubleDipActive && !isCorrect && doubleDipAttemptCount === 1) {
      return (
        <div className="flex flex-col items-center space-y-2">
          <div className="px-8 py-4 rounded-2xl font-black text-3xl md:text-5xl border-4 shadow-[0_20px_40px_-10px_rgba(239,68,68,0.4)] uppercase tracking-widest bg-red-600 text-white border-red-400">
            WRONG
          </div>
          <div className="px-4 py-1 bg-red-500/20 border border-red-500/40 rounded-full text-red-400 font-black text-xs uppercase tracking-widest animate-bounce">
            -5 POINTS
          </div>
        </div>
      );
    }

    // 2. Rounds 1 & 2: Audience/Reveal logic
    if (isTimeUpUnanswered && currentRound <= 2) {
      if (!isAnswerRevealed) {
        return (
          <div className="px-8 py-4 rounded-2xl font-black text-3xl md:text-5xl border-4 shadow-[0_20px_40px_-10px_rgba(245,158,11,0.4)] uppercase tracking-widest bg-amber-500 text-white border-amber-300">
            AUDIENCE
          </div>
        );
      }
      return null;
    }

    // 3. Round 3: Manual reveal after time up
    if (isTimeUpUnanswered && currentRound === 3) {
      if (!isAnswerRevealed) return null;
      return (
        <div className="px-8 py-4 rounded-2xl font-black text-3xl md:text-5xl border-4 shadow-[0_20px_40px_-10px_rgba(239,68,68,0.4)] uppercase tracking-widest bg-red-600 text-white border-red-400">
          TIME UP
        </div>
      );
    }

    // 4. Fallback for other scenarios (Wrong answers or other rounds)
    if (isAnswerRevealed || !isTimeUpUnanswered) {
        // Special request: Remove WRONG stamp from Round 4 specifically
        if (currentRound === 4) return null;

        return (
          <div className="px-8 py-4 rounded-2xl font-black text-3xl md:text-5xl border-4 shadow-[0_20px_40px_-10px_rgba(239,68,68,0.4)] uppercase tracking-widest bg-red-600 text-white border-red-400">
            {isTimeUpUnanswered ? 'TIME UP' : 'WRONG'}
          </div>
        );
    }

    return null;
  };

  return (
    <div className="flex h-full w-full bg-slate-900/50 overflow-hidden select-none">
      {/* LEFT SIDEBAR: Scores */}
      <aside className="w-56 border-r border-slate-800 bg-slate-900/80 p-3 flex flex-col space-y-3 shrink-0 shadow-2xl z-20 overflow-hidden">
        <div className="mb-2">
          <h2 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Leaderboard</h2>
          <div className="space-y-3">
              {teams.map((team, idx) => {
                const isTied = gameState.tiedTeamIndices ? gameState.tiedTeamIndices.includes(idx) : true;
                if (gameState.currentRound === 7 && !isTied) return null;

                return (
                  <div 
                    key={team.id} 
                    className={`p-3 rounded-2xl border transition-all duration-300 flex items-center space-x-3 ${
                      (idx === activeTeamIndex && !currentQuestion?.isSample)
                        ? `bg-slate-800 ${isRound7 ? 'border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.2)]' : `${TEAM_BORDERS[idx]} shadow-[0_0_15px_rgba(59,130,246,0.15)]`} scale-[1.02]` 
                        : 'bg-slate-900/50 border-slate-800 opacity-60'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black shrink-0 shadow-md ${isRound7 && idx === activeTeamIndex && !currentQuestion?.isSample ? 'bg-rose-500 text-white' : (TEAM_COLORS[idx] + ' text-white')}`}>
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[8px] font-black text-slate-500 uppercase tracking-wider truncate">{team.name}</p>
                      <p className={`text-lg font-black ${isRound7 && idx === activeTeamIndex && !currentQuestion?.isSample ? 'text-rose-400' : (idx === activeTeamIndex && !currentQuestion?.isSample ? TEAM_TEXTS[idx] : 'text-slate-400')}`}>
                        {team.score}
                        <span className="text-[8px] ml-1 font-bold text-slate-600 uppercase">pts</span>
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 relative flex flex-col p-4 md:p-6 overflow-hidden">
        
        {/* TIMER (Top Right) */}
        <div className="absolute top-6 right-6 z-30">
          <div className={`flex flex-col items-end`}>
            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Timer</p>
            <div className={`text-5xl font-mono font-black tabular-nums transition-all ${isLowTime ? 'text-red-500 animate-pulse drop-shadow-[0_0_10px_rgba(239,68,68,0.4)]' : 'text-white'}`}>
              {!showOptions && status === 'playing' ? <span className="text-blue-500 italic text-2xl">READY</span> : `${timeLeft}s`}
            </div>
            <div className="w-32 h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden border border-slate-700">
               <div 
                 className={`h-full transition-all duration-1000 ease-linear ${isLowTime ? 'bg-red-500' : 'bg-blue-500'}`}
                 style={{ width: `${progressWidth}%` }}
               ></div>
            </div>
          </div>
        </div>

        {/* Top bar Left: Round Info */}
        <div className="flex items-start mb-6 justify-between w-full">
           <div className="flex flex-col space-y-2">
             <div className={`inline-flex items-center space-x-3 bg-slate-800/60 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-700`}>
               <i className={`fas ${roundConfig?.icon} ${isRound7 ? 'text-rose-500' : 'text-blue-400'} text-sm`}></i>
               <div>
                  <p className={`text-[8px] font-black uppercase tracking-[0.2em] ${isRound7 ? 'text-rose-500' : 'text-blue-500'}`}>Round {currentRound}</p>
                  <h1 className="text-lg font-black text-white uppercase tracking-tight">{roundTitle.includes(': ') ? roundTitle.split(': ')[1] : roundTitle}</h1>
               </div>
             </div>
           </div>

           {currentQuestion?.isSample && (
             <div className="animate-bounce">
               <div className="bg-amber-500 text-slate-900 px-4 py-2 rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(245,158,11,0.3)] border-2 border-amber-400">
                 Sample Question
               </div>
             </div>
           )}
        </div>

        {/* MIDDLE CONTENT */}
        <div className="flex-1 flex flex-col justify-center items-center max-w-5xl mx-auto w-full min-h-0">
          
          {status === 'question_result' && (
             <div className="mb-6 animate-in slide-in-from-top-2 duration-300">
               {getResultStamp()}
             </div>
          )}

          <div className={`bg-slate-800/50 backdrop-blur-xl p-6 md:p-8 rounded-[3rem] border-2 ${currentQuestion?.isSample ? 'border-amber-500/40' : (isRound7 ? 'border-rose-500/50' : `${TEAM_BORDERS[activeTeamIndex]}/40`)} shadow-2xl relative overflow-hidden w-full flex flex-col transition-all duration-500`}>
            
            {!showOptions && status === 'playing' ? (
              <div className="flex-1 flex flex-col items-center justify-center space-y-6 py-6 animate-in fade-in zoom-in">
                 {!(isRound6 || isRound7) && (
                   <h3 className="text-2xl md:text-3xl font-black leading-tight text-white tracking-tight text-center max-w-3xl">
                      {currentQuestion?.text}
                   </h3>
                 )}
                 <button
                   onClick={onRevealOptions}
                   className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black text-lg md:text-xl rounded-2xl shadow-xl transition-all transform hover:scale-105 active:scale-95 border-b-4 border-blue-800 uppercase tracking-widest"
                 >
                   {(isRound6 || isRound7) ? 'REVEAL QUESTIONS & START TIMER' : isRound4 ? 'START TIMER' : 'REVEAL OPTIONS & START TIMER'}
                 </button>
              </div>
            ) : (
              <div className="flex-1">
                {(isRound6 || isRound7) ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-700/50 pb-4 mb-2">
                      <h2 className={`text-xl font-black uppercase tracking-widest ${isRound7 ? 'text-rose-500' : 'text-white'}`}>
                        {isRound7 ? 'TIE-BREAKER' : 'FINAL BLITZ'}
                      </h2>
                      {status === 'question_result' && !isRound7 && !currentQuestion?.isSample && (
                        <div className="px-4 py-1 bg-blue-500/20 border border-blue-500/40 rounded-full text-blue-400 font-black text-xs uppercase tracking-widest">
                          +{directRoundScores.filter(s => s).length * DIRECT_QUESTION_MARKS + (directRoundScores.filter(s => s).length === 5 ? DIRECT_BONUS_MARKS : 0)} POINTS
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      {blitzQuestions.map((q, idx) => (
                        <div key={q.id} className="flex items-center gap-4 p-4 bg-slate-900/60 rounded-2xl border border-slate-700/50 transition-all hover:border-slate-500">
                          <div className={`w-10 h-10 rounded-xl border flex items-center justify-center font-black text-lg shrink-0 ${isRound7 ? 'bg-rose-600/10 border-rose-500/30 text-rose-400' : 'bg-blue-600/10 border-blue-500/30 text-blue-400'}`}>
                            {idx + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-lg font-bold text-slate-100 truncate">{q.text}</p>
                            {(status === 'question_result' && isAnswerRevealed) && <p className="text-sm text-emerald-400 mt-1 font-black uppercase">Ans: {q.explanation}</p>}
                          </div>
                          {status === 'playing' && (
                            <button 
                              onClick={() => onToggleDirectScore(idx)}
                              className={`px-4 py-2 rounded-xl font-black text-[10px] uppercase transition-all flex items-center min-w-[100px] justify-center ${directRoundScores[idx] ? 'bg-emerald-600 text-white border-2 border-emerald-400 shadow-sm' : 'bg-slate-800 text-slate-600 border border-slate-700'}`}
                            >
                              {directRoundScores[idx] ? 'OK' : 'MARK'}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    {status === 'playing' && (
                      <div className="pt-4">
                        <button onClick={onSubmitDirectBlock} className={`w-full py-4 text-white font-black text-xl rounded-2xl transition-all active:scale-95 border-b-4 uppercase tracking-[0.2em] ${isRound7 ? 'bg-rose-600 border-rose-800' : 'bg-blue-600 border-blue-800'}`}>SUBMIT BLOCK</button>
                      </div>
                    )}
                  </div>
                ) : isRound5 ? (
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-8 uppercase italic">Identify the Scientist</h3>
                      <div className="grid grid-cols-4 gap-4 max-w-3xl mx-auto">
                        {[0, 1, 2, 3].map((idx) => (
                            <div key={idx} className={`h-32 rounded-3xl border-2 flex flex-col items-center justify-center p-4 transition-all duration-500 transform ${idx <= currentClueIndex ? 'bg-blue-600/10 border-blue-500 shadow-lg scale-105 z-10' : 'bg-slate-900/50 border-slate-800 opacity-20 scale-95'}`}>
                              <i className={`fas ${idx <= currentClueIndex ? 'fa-microscope' : 'fa-lock'} text-xl mb-2 ${idx <= currentClueIndex ? 'text-blue-400' : 'text-slate-700'}`}></i>
                              <p className={`text-[10px] font-black uppercase tracking-widest ${idx <= currentClueIndex ? 'text-white' : 'text-slate-800'}`}>CLUE {idx + 1}</p>
                            </div>
                        ))}
                      </div>
                    </div>
                    {status === 'playing' ? (
                      <div className="grid grid-cols-2 gap-6 max-w-xl mx-auto pt-4">
                        <button onClick={() => onClueCorrect()} className="p-8 rounded-3xl bg-emerald-600 border-b-8 border-emerald-800 text-white font-black text-2xl transition-all active:scale-95 flex flex-col items-center space-y-4">CORRECT</button>
                        <button onClick={() => onClueWrong()} className="p-8 rounded-3xl bg-rose-600 border-b-8 border-rose-800 text-white font-black text-2xl transition-all active:scale-95 flex flex-col items-center space-y-4">WRONG/NEXT</button>
                      </div>
                    ) : (status === 'question_result' && isAnswerRevealed) && (
                      <div className="max-w-2xl mx-auto w-full animate-in zoom-in">
                        <div className="bg-slate-900/80 border-2 border-emerald-500/40 rounded-3xl p-8 text-center"><h4 className="text-4xl font-black text-white">{currentQuestion.explanation}</h4></div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col space-y-8">
                    <div className="text-center">
                      {doubleDipActive && status === 'playing' && <div className="px-4 py-1.5 bg-rose-600/20 border border-rose-500 rounded-lg text-rose-400 font-black text-[9px] uppercase tracking-widest animate-pulse inline-block mb-4">Double Dip Active</div>}
                      <h3 className="text-2xl md:text-4xl font-black leading-tight text-white tracking-tight drop-shadow-sm text-center">{currentQuestion?.text}</h3>
                    </div>
                    <div className="flex-1 min-h-0">
                      {isRound4 ? (
                        status === 'playing' ? (
                          <div className="grid grid-cols-2 gap-8 max-w-xl mx-auto pt-2">
                            <button onClick={() => onManualScore(true)} className="p-10 rounded-3xl bg-emerald-600 border-b-8 border-emerald-800 text-white font-black text-2xl transition-all active:scale-95 flex flex-col items-center space-y-4">CORRECT</button>
                            <button onClick={() => onPass()} className="p-10 rounded-3xl bg-rose-600 border-b-8 border-rose-800 text-white font-black text-2xl transition-all active:scale-95 flex flex-col items-center space-y-4">PASS</button>
                          </div>
                        ) : isAnswerRevealed && <div className="max-w-xl mx-auto text-center py-10"><h4 className="text-4xl font-black text-white">{currentQuestion.options[currentQuestion.correctIndex]}</h4></div>
                      ) : (
                        <div className="grid grid-cols-2 gap-4 max-w-4xl mx-auto">
                          {currentQuestion?.options.map((option, idx) => {
                            const isHidden = hiddenOptions.includes(idx) && status === 'playing';
                            const isWrongDip = wrongDoubleDipIndices.includes(idx) && status === 'playing';
                            let stateClass = "bg-slate-700/20 border-slate-700/50 hover:border-blue-500/40 hover:bg-slate-700/40 cursor-pointer";
                            if (status === 'question_result') {
                              if (isAnswerRevealed && idx === currentQuestion.correctIndex) stateClass = "bg-emerald-600 border-emerald-400 text-white z-10 scale-[1.03] shadow-lg";
                              else if (idx === selectedOption) stateClass = (isAnswerRevealed && idx !== currentQuestion.correctIndex) ? "bg-red-600 border-red-400 text-white" : `border-2 ${currentQuestion?.isSample ? 'border-amber-500' : TEAM_BORDERS[activeTeamIndex]} bg-slate-700`;
                              else stateClass = "bg-slate-900 border-slate-800 opacity-20 grayscale";
                            } else if (selectedOption === idx) stateClass = `border-2 ${currentQuestion?.isSample ? 'border-amber-500' : TEAM_BORDERS[activeTeamIndex]} bg-slate-700 shadow-lg scale-[1.01]`;
                            else if (isHidden || isWrongDip) stateClass = "bg-slate-900 opacity-10 pointer-events-none border-dashed line-through";
                            
                            return (
                              <button key={idx} disabled={status !== 'playing' || isHidden || isWrongDip} onClick={() => onSelectOption(idx)} className={`p-4 rounded-2xl border-2 text-left font-black text-lg transition-all flex items-center space-x-4 ${stateClass}`}>
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black shrink-0 border border-white/10 ${selectedOption === idx ? 'bg-white text-slate-900' : 'bg-slate-800'}`}>{String.fromCharCode(65 + idx)}</div>
                                <span className="flex-1 leading-tight text-sm md:text-base">{option}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ACTION BUTTONS (Bottom) */}
          <div className="mt-8 space-y-4 w-full max-w-3xl shrink-0">
            {status === 'question_result' ? (
              <div className="flex flex-col gap-4">
                {!isAnswerRevealed && <button onClick={onRevealAnswer} className="w-full py-4 bg-blue-600 border-b-4 border-blue-800 rounded-2xl font-black text-xl text-white uppercase tracking-widest">REVEAL ANSWER</button>}
                {isAnswerRevealed && (
                  <button 
                    onClick={onNextQuestion} 
                    className={`w-full py-4 rounded-2xl font-black text-xl text-white shadow-lg border-b-4 border-black/20 uppercase tracking-widest ${currentQuestion?.isSample ? 'bg-amber-600 border-amber-800' : (isRound7 ? 'bg-rose-600 border-rose-800' : TEAM_COLORS[activeTeamIndex])}`}
                  >
                    {currentQuestion?.isSample ? 'Start' : (isRound6 || isRound7 ? 'Next Team' : 'Next Question')}
                  </button>
                )}
              </div>
            ) : status === 'playing' && showOptions && !isRound6 && !isRound7 && !isRound4 && !isRound5 && (
              <div className="flex flex-col space-y-4">
                <div className="flex gap-4 justify-center">
                  {[1, 2].includes(currentRound) && !helplineUsed && (
                    <button onClick={onUseHelpline} className="px-8 py-3 bg-emerald-600/20 border border-emerald-500 text-emerald-500 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all">50:50 HELPLINE</button>
                  )}
                  {currentRound === 3 && !doubleDipActive && (
                    <button onClick={onUseDoubleDip} className="px-8 py-3 bg-rose-600/20 border border-rose-500 text-rose-500 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all">DOUBLE DIP</button>
                  )}
                </div>
                {selectedOption !== null && (
                  <button onClick={onRevealAnswer} className={`w-full py-4 text-white font-black text-xl rounded-2xl shadow-lg border-b-4 uppercase tracking-widest ${doubleDipActive ? 'bg-rose-600 border-rose-800' : 'bg-blue-600 border-blue-800'}`}>
                    {getSubmitButtonLabel()}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
