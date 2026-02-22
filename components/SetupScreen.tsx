
import React, { useState } from 'react';
import { TEAM_COLORS } from '../constants';

const DEFAULT_SCIENCE_NAMES = [
  'Quantum Quarks',
  'Cosmic Crusaders',
  'The Entropy Squad',
  'Atomic Avengers',
  'Absolute Zeroes'
];

interface SetupScreenProps {
  onStart: (teamNames: string[], topic: string, file?: File) => void;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({ onStart }) => {
  const [teamNames, setTeamNames] = useState<string[]>(DEFAULT_SCIENCE_NAMES);

  const handleTeamNameChange = (index: number, name: string) => {
    const newNames = [...teamNames];
    newNames[index] = name;
    setTeamNames(newNames);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart(teamNames, "Physics Pro Quiz");
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-slate-800/80 rounded-[2.5rem] shadow-2xl border border-slate-700 animate-in fade-in zoom-in duration-500">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-500/10 rounded-2xl mb-3 border border-blue-500/20 shadow-inner">
          <i className="fas fa-atom text-2xl text-blue-400"></i>
        </div>
        <h1 className="text-3xl font-black bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent tracking-tighter uppercase">
          Physics Quiz Pro
        </h1>
        <p className="text-blue-400 mt-1 font-black uppercase tracking-[0.2em] text-[9px]">Tournament Edition</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 text-center">Team Lineup</label>
          <div className="space-y-2.5">
            {teamNames.map((name, i) => (
              <div key={i} className="group relative">
                <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-lg transition-all ${TEAM_COLORS[i]}`}></div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleTeamNameChange(i, e.target.value)}
                  className="w-full bg-slate-900/60 border border-slate-700 border-l-0 rounded-r-xl px-4 py-2.5 text-white focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm font-bold"
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-700 pointer-events-none">T{i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="group w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-3.5 rounded-2xl shadow-xl transform active:scale-95 transition-all text-base uppercase tracking-widest flex items-center justify-center space-x-3 border-b-4 border-blue-800"
        >
          <span>Begin Tournament</span>
          <i className="fas fa-bolt group-hover:rotate-12 transition-transform"></i>
        </button>
      </form>
    </div>
  );
};
