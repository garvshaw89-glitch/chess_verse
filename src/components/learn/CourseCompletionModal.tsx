import React from 'react';
import { useLearnStore } from '../../store/learnStore';
import { Button3D } from '../ui/Button3D';
import { Award, Crown, CheckCircle2, Sparkles } from 'lucide-react';

export const CourseCompletionModal: React.FC = () => {
  const {
    completionModalOpen,
    closeCompletionModal,
    completedLessonIds,
    exercisesSolvedCount
  } = useLearnStore();

  if (!completionModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-gradient-to-b from-neutral-900 to-neutral-950 border border-amber-500/50 rounded-2xl p-8 flex flex-col items-center text-center shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="w-20 h-20 rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-400 mb-4 shadow-xl shadow-amber-500/20 animate-bounce">
          <Crown className="w-10 h-10" />
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/40 mb-2 font-mono">
          MASTER REPERTOIRE COMPLETED
        </span>

        <h2 className="text-3xl font-extrabold text-white">
          CHESS SCHOLAR
        </h2>
        <p className="text-sm text-neutral-300 mt-2 leading-relaxed max-w-sm">
          You have conquered all 4 levels of the ChessVerse Academy! From piece mechanics to grandmaster prophylaxis, you hold the complete tactical arsenal.
        </p>

        <div className="grid grid-cols-2 gap-3 w-full my-6">
          <div className="bg-neutral-950/80 border border-neutral-800 rounded-xl p-3">
            <span className="text-[11px] text-neutral-400 font-mono">Completed</span>
            <span className="text-xl font-bold text-amber-400 block">{completedLessonIds.length} Lessons</span>
          </div>
          <div className="bg-neutral-950/80 border border-neutral-800 rounded-xl p-3">
            <span className="text-[11px] text-neutral-400 font-mono">Exercises</span>
            <span className="text-xl font-bold text-emerald-400 block">{exercisesSolvedCount} Solved</span>
          </div>
        </div>

        <Button3D
          variant="primary"
          size="lg"
          onClick={closeCompletionModal}
          icon={<Sparkles className="w-4 h-4 fill-amber-950" />}
        >
          <span>Claim Scholar Certificate</span>
        </Button3D>
      </div>
    </div>
  );
};
