
import React from 'react';
import { Team } from '../types';
import { TEAM_TEXTS, TEAM_COLORS } from '../constants';

interface FinishedScreenProps {
  teams: Team[];
  onRestart: () => void;
}

export const FinishedScreen: React.FC<FinishedScreenProps> = ({ teams, onRestart }) => {
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);
  const maxScore = sortedTeams[0].score;
  const winners = sortedTeams.filter(t => t.score === maxScore);
  const isTie = winners.length > 1;

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8 text-center space-y-6 animate-in zoom-in duration-500">
      <div className="py-6">
        <div className="relative inline-block mb-4">
          <i className="fas fa-crown text-6xl text-amber-400 drop-shadow-[0_0_20px_rgba(251,191,36,0.5)]"></i>
        </div>
        <h1 className="text-4xl font-black text-white uppercase tracking-tighter">
          {isTie ? 'Co-Champions' : 'Grand Champion'}
        </h1>
        <div className="mt-2 space-y-2">
          {winners.map(winner => (
            <p key={winner.id} className={`text-4xl font-black ${TEAM_TEXTS[teams.findIndex(t => t.id === winner.id)]}`}>
              {winner.name}
            </p>
          ))}
        </div>
      </div>

      <div className="bg-slate-800/80 rounded-3xl p-6 border border-slate-700 shadow-2xl">
        <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Final Leaderboard</h2>
        <div className="space-y-2">
          {sortedTeams.map((team, idx) => {
            const originalIdx = teams.findIndex(t => t.id === team.id);
            return (
              <div 
                key={team.id} 
                className="flex items-center justify-between p-3 bg-slate-900/60 rounded-xl border border-slate-700/50 group transition-all"
              >
                <div className="flex items-center space-x-4">
                  <span className="text-xl font-black text-slate-600 w-6">{idx + 1}</span>
                  <div className={`w-8 h-8 rounded-lg ${TEAM_COLORS[originalIdx]} flex items-center justify-center text-white font-bold text-xs`}>
                    {team.name.charAt(0)}
                  </div>
                  <span className="text-base font-bold text-white">{team.name}</span>
                </div>
                <div className="text-2xl font-black text-blue-400">
                  {team.score} <span className="text-[10px] font-normal text-slate-600 uppercase">Marks</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button
        onClick={onRestart}
        className="px-10 py-4 bg-white text-slate-900 font-black text-lg rounded-full hover:bg-slate-200 transition-all active:scale-95 shadow-xl"
      >
        PLAY AGAIN <i className="fas fa-redo ml-2 text-sm"></i>
      </button>
    </div>
  );
};
