import React from 'react';
import { useLearnStore } from '../../store/learnStore';
import { ACHIEVEMENTS } from '../../data/learnCurriculum';
import { Button3D } from '../ui/Button3D';
import { X, Award, CheckCircle2, Lock, Sparkles, Shield, Zap } from 'lucide-react';

export const AchievementsModal: React.FC = () => {
  const {
    achievementsModalOpen,
    closeAchievements,
    achievements
  } = useLearnStore();

  if (!achievementsModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                Course Achievements
              </h3>
              <p className="text-xs text-neutral-400">
                {achievements.length} of {ACHIEVEMENTS.length} Badges Unlocked
              </p>
            </div>
          </div>

          <button
            onClick={closeAchievements}
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Badges List */}
        <div className="p-6 flex flex-col gap-3 max-h-[60vh] overflow-y-auto">
          {ACHIEVEMENTS.map((ach) => {
            const isUnlocked = achievements.includes(ach.id);

            return (
              <div
                key={ach.id}
                className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-all ${
                  isUnlocked
                    ? 'bg-neutral-950/90 border-amber-500/40 shadow-md shadow-amber-500/5'
                    : 'bg-neutral-950/40 border-neutral-800/40 opacity-50'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl border ${
                      isUnlocked
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                        : 'bg-neutral-800 border-neutral-700 text-neutral-500'
                    }`}
                  >
                    {isUnlocked ? <Sparkles className="w-6 h-6" /> : <Lock className="w-5 h-5" />}
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">
                        {ach.title}
                      </h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                        {ach.badge}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      {ach.description}
                    </p>
                  </div>
                </div>

                <div>
                  {isUnlocked ? (
                    <span className="p-1 rounded-full bg-emerald-500/20 text-emerald-400 inline-block">
                      <CheckCircle2 className="w-5 h-5" />
                    </span>
                  ) : (
                    <span className="text-xs text-neutral-500 font-mono">
                      Locked
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950/70 flex justify-end">
          <Button3D variant="secondary" size="sm" onClick={closeAchievements}>
            <span>Close</span>
          </Button3D>
        </div>
      </div>
    </div>
  );
};
