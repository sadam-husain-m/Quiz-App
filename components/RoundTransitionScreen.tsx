
import React from 'react';
import { ROUND_CONFIGS } from '../constants';

interface RoundTransitionScreenProps {
  round: number;
  onStart: () => void;
}

export const RoundTransitionScreen: React.FC<RoundTransitionScreenProps> = ({ round, onStart }) => {
  const config = ROUND_CONFIGS.find(r => r.round === round);
  if (!config) return null;

  return (
    <div className="h-full flex flex-col items-center justify-center p-4 text-center animate-in fade-in zoom-in duration-700">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full scale-150 animate-pulse"></div>
        <div className="relative w-20 h-20 bg-slate-800 rounded-[2rem] border-2 border-blue-500/30 flex items-center justify-center text-4xl text-blue-400 shadow-xl">
          <i className={`fas ${config.icon}`}></i>
        </div>
      </div>

      <div className="space-y-2 max-w-xl">
        <h2 className="text-xs font-black text-blue-500 uppercase tracking-[0.3em]">Round {round}</h2>
        <h1 className="text-3xl md:text-4xl font-black text-white leading-tight uppercase tracking-tight">
          {config.title.split(': ')[1]}
        </h1>

        {config.rules && (
          <div className="mt-6 bg-slate-800/40 border border-slate-700/50 rounded-3xl p-4 text-left max-w-2xl mx-auto space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
            <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2 flex items-center">
              <i className="fas fa-scroll mr-2"></i> Round Rules
            </h3>
            <ul className="space-y-1.5">
              {config.rules.map((rule, i) => (
                <li key={i} className="flex items-start space-x-2 text-xs text-slate-300 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-8 w-full max-w-xs">
        <button
          onClick={onStart}
          className="w-full py-4 bg-white text-slate-900 font-black text-lg rounded-2xl shadow-xl hover:bg-blue-50 transition-all hover:scale-105 active:scale-95 flex items-center justify-center group"
        >
          START ROUND <i className="fas fa-play ml-3 group-hover:translate-x-1 transition-transform text-sm"></i>
        </button>
      </div>

      <div className="mt-4 flex items-center space-x-2 text-slate-500 font-bold text-[10px] uppercase tracking-widest">
        <span className="w-8 h-[1px] bg-slate-800"></span>
        <span>Prepare your teams</span>
        <span className="w-8 h-[1px] bg-slate-800"></span>
      </div>
    </div>
  );
};
