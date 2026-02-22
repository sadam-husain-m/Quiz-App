
import React from 'react';
import { Team } from '../types';
import { TEAM_TEXTS, TEAM_COLORS } from '../constants';

interface FinishedScreenProps {
  teams: Team[];
  onRestart: () => void;
}

export const FinishedScreen: React.FC<FinishedScreenProps> = ({ teams, onRestart }) => {
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);
  const winner = sortedTeams[0];

  return (
    <div className="max-w-3xl mx-auto p-6 text-center space-y-8 animate-in zoom-in duration-500">
      <div className="py-12">
        <div className="relative inline-block mb-6">
          <i className="fas fa-crown text-8xl text-amber-400 drop-shadow-[0_0_25px_rgba(251,191,36,0.6)]"></i>
          <div className="absolute -bottom-2 -right-2 bg-slate-800 p-2 rounded-full border-4 border-slate-900">
            <i className="fas fa-star text-2xl text-amber-400 animate-spin-slow"></i>
          </div>
        </div>
        <h1 className="text-6xl font-black text-white uppercase tracking-tighter">Grand Champion</h1>
        <p className={`text-5xl font-black mt-4 ${TEAM_TEXTS[teams.findIndex(t => t.id === winner.id)]}`}>
          {winner.name}
        </p>
      </div>

      <div className="bg-slate-800 rounded-3xl p-8 border border-slate-700 shadow-2xl">
        <h2 className="text-xl font-bold text-slate-400 uppercase tracking-widest mb-8">Final Leaderboard</h2>
        <div className="space-y-4">
          {sortedTeams.map((team, idx) => {
            const originalIdx = teams.findIndex(t => t.id === team.id);
            return (
              <div 
                key={team.id} 
                className="flex items-center justify-between p-4 bg-slate-900 rounded-2xl border border-slate-700 group transition-all hover:translate-x-2"
              >
                <div className="flex items-center space-x-6">
                  <span className="text-2xl font-black text-slate-500 w-8">{idx + 1}</span>
                  <div className={`w-10 h-10 rounded-lg ${TEAM_COLORS[originalIdx]} flex items-center justify-center text-white font-bold`}>
                    {team.name.charAt(0)}
                  </div>
                  <span className="text-xl font-bold text-white">{team.name}</span>
                </div>
                <div className="text-3xl font-black text-blue-400">
                  {team.score} <span className="text-sm font-normal text-slate-500 uppercase tracking-widest">Pts</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button
        onClick={onRestart}
        className="px-12 py-5 bg-white text-slate-900 font-black text-xl rounded-full hover:bg-slate-200 transition-all active:scale-95 shadow-xl"
      >
        PLAY AGAIN <i className="fas fa-redo ml-2"></i>
      </button>
    </div>
  );
};
