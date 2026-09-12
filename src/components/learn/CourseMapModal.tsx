import React from 'react';
import { useLearnStore } from '../../store/learnStore';
import { COURSE_LEVELS } from '../../data/learnCurriculum';
import { Button3D } from '../ui/Button3D';
import { X, CheckCircle2, Lock, Play, Compass, MapPin } from 'lucide-react';

export const CourseMapModal: React.FC = () => {
  const {
    courseMapOpen,
    closeCourseMap,
    startLesson,
    completedLessonIds,
    isLessonUnlocked,
    isLevelUnlocked
  } = useLearnStore();

  if (!courseMapOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-5xl max-h-[85vh] bg-neutral-900 border border-neutral-800 rounded-2xl flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/30">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                Curriculum Progression Map
              </h3>
              <p className="text-xs text-neutral-400">
                Explore the complete 4-level journey from novice to master
              </p>
            </div>
          </div>

          <button
            onClick={closeCourseMap}
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Course Road Map */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">
          {COURSE_LEVELS.map((level, lvlIdx) => {
            const levelUnlocked = isLevelUnlocked(level.id);

            return (
              <div key={level.id} className="flex flex-col gap-3">
                {/* Level Title Node */}
                <div className="flex items-center gap-3">
                  <div 
                    className="px-3 py-1 rounded-lg text-xs font-bold font-mono uppercase tracking-wider border flex items-center gap-1.5"
                    style={{
                      backgroundColor: `${level.accentColor}15`,
                      borderColor: `${level.accentColor}40`,
                      color: level.accentColor
                    }}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    Level {level.numberPrefix}: {level.title}
                  </div>
                  <div className="flex-1 h-px bg-neutral-800" />
                </div>

                {/* Lesson Grid Nodes */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
                  {level.lessons.map((lesson) => {
                    const isDone = completedLessonIds.includes(lesson.id);
                    const unlocked = isLessonUnlocked(lesson.id);

                    return (
                      <button
                        key={lesson.id}
                        disabled={!unlocked}
                        onClick={() => {
                          startLesson(lesson.id);
                          closeCourseMap();
                        }}
                        className={`p-3 rounded-xl border text-left flex flex-col justify-between h-24 transition-all relative select-none group ${
                          isDone
                            ? 'bg-neutral-950/80 border-emerald-500/40 hover:border-emerald-400 hover:bg-neutral-900'
                            : unlocked
                            ? 'bg-neutral-950/90 border-amber-500/40 hover:border-amber-400 hover:bg-neutral-900 shadow-sm'
                            : 'bg-neutral-950/40 border-neutral-800/40 opacity-40 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-[10px] font-mono font-bold text-neutral-400">
                            #{lesson.order}
                          </span>
                          {isDone ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          ) : unlocked ? (
                            <Play className="w-3.5 h-3.5 text-amber-400 fill-amber-400 opacity-60 group-hover:opacity-100" />
                          ) : (
                            <Lock className="w-3 h-3 text-neutral-500" />
                          )}
                        </div>

                        <span className="text-xs font-bold text-neutral-200 line-clamp-2 group-hover:text-white transition-colors">
                          {lesson.title}
                        </span>

                        <span className="text-[10px] text-neutral-500 font-mono">
                          {lesson.durationMinutes}m • {lesson.difficulty}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950/70 flex justify-end">
          <Button3D variant="secondary" size="sm" onClick={closeCourseMap}>
            <span>Close Map</span>
          </Button3D>
        </div>
      </div>
    </div>
  );
};
