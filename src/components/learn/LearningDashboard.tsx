import React from 'react';
import { useLearnStore } from '../../store/learnStore';
import { COURSE_LEVELS, ALL_LESSONS } from '../../data/learnCurriculum';
import { LearnLevelId, LevelDef, LessonDef } from '../../types/learn';
import { Button3D } from '../ui/Button3D';
import { 
  GraduationCap, 
  Map, 
  Award, 
  Flame, 
  CheckCircle2, 
  Lock, 
  Play, 
  Clock, 
  BookOpen, 
  Sparkles,
  ChevronRight,
  Zap,
  Target
} from 'lucide-react';

export const LearningDashboard: React.FC = () => {
  const {
    activeLevelId,
    setActiveLevel,
    startLesson,
    completedLessonIds,
    exercisesSolvedCount,
    learningStreakDays,
    isLevelUnlocked,
    isLessonUnlocked,
    getLevelProgress,
    getTotalProgress,
    openCourseMap,
    openAchievements
  } = useLearnStore();

  const totalProgress = getTotalProgress();
  const activeLevel = COURSE_LEVELS.find((l) => l.id === activeLevelId) || COURSE_LEVELS[0];

  // Find next unfinished lesson
  const nextUnfinishedLesson = ALL_LESSONS.find(
    (l) => isLessonUnlocked(l.id) && !completedLessonIds.includes(l.id)
  ) || ALL_LESSONS[0];

  const getPieceSymbol = (piece: string) => {
    switch (piece) {
      case 'k': return '♔';
      case 'q': return '♕';
      case 'r': return '♖';
      case 'b': return '♗';
      case 'n': return '♘';
      default: return '♙';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-8">
      {/* Hero Header & Quick Stats Bar */}
      <div className="relative rounded-2xl bg-gradient-to-b from-neutral-900 via-neutral-900/90 to-neutral-950 border border-neutral-800 p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex flex-col gap-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5" />
                Chess Academy 3D
              </span>
              <span className="text-xs text-neutral-400 font-mono">
                {completedLessonIds.length} / {ALL_LESSONS.length} Lessons Finished
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              LEARN CHESS
            </h1>
            <p className="text-base sm:text-lg text-neutral-300">
              "From your first move to advanced strategy."
            </p>
          </div>

          {/* Quick Action Launchers */}
          <div className="flex flex-wrap items-center gap-3">
            <Button3D
              variant="primary"
              size="md"
              icon={<Play className="w-4 h-4 fill-amber-950" />}
              onClick={() => startLesson(nextUnfinishedLesson.id)}
            >
              <span>Continue: {nextUnfinishedLesson.title}</span>
            </Button3D>

            <Button3D
              variant="secondary"
              size="md"
              icon={<Map className="w-4 h-4 text-sky-400" />}
              onClick={openCourseMap}
            >
              <span>Course Map</span>
            </Button3D>

            <Button3D
              variant="secondary"
              size="md"
              icon={<Award className="w-4 h-4 text-amber-400" />}
              onClick={openAchievements}
            >
              <span>Badges</span>
            </Button3D>
          </div>
        </div>

        {/* Dynamic Metric Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-neutral-800/80">
          <div className="bg-neutral-950/60 border border-neutral-800/70 rounded-xl p-3 sm:p-4">
            <span className="text-xs text-neutral-400 font-medium block">Course Progress</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-bold font-mono text-amber-400">
                {totalProgress}%
              </span>
              <span className="text-xs text-neutral-500">Overall</span>
            </div>
            <div className="w-full bg-neutral-800 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-amber-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${totalProgress}%` }}
              />
            </div>
          </div>

          <div className="bg-neutral-950/60 border border-neutral-800/70 rounded-xl p-3 sm:p-4">
            <span className="text-xs text-neutral-400 font-medium block">Current Level</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xl sm:text-2xl font-bold text-white capitalize">
                {activeLevel.id}
              </span>
            </div>
            <span className="text-xs text-neutral-400 mt-2 block font-mono">
              Level {activeLevel.numberPrefix} of 04
            </span>
          </div>

          <div className="bg-neutral-950/60 border border-neutral-800/70 rounded-xl p-3 sm:p-4">
            <span className="text-xs text-neutral-400 font-medium block">Tactical Solves</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-bold font-mono text-sky-400">
                {exercisesSolvedCount}
              </span>
              <span className="text-xs text-neutral-500">Solved</span>
            </div>
            <span className="text-xs text-neutral-400 mt-2 block flex items-center gap-1">
              <Target className="w-3 h-3 text-sky-400" />
              Interactive drills
            </span>
          </div>

          <div className="bg-neutral-950/60 border border-neutral-800/70 rounded-xl p-3 sm:p-4">
            <span className="text-xs text-neutral-400 font-medium block">Learning Streak</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400 flex items-center gap-1">
                <Flame className="w-5 h-5 text-orange-500 fill-orange-500 animate-pulse" />
                {learningStreakDays}
              </span>
              <span className="text-xs text-neutral-500">Days</span>
            </div>
            <span className="text-xs text-neutral-400 mt-2 block font-mono">
              Keep it blazing!
            </span>
          </div>
        </div>
      </div>

      {/* 4 Major Level Cards */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            Curriculum Paths
          </h2>
          <span className="text-xs text-neutral-400">
            Click any level to view its detailed lessons
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {COURSE_LEVELS.map((level) => {
            const unlocked = isLevelUnlocked(level.id);
            const progress = getLevelProgress(level.id);
            const isSelected = activeLevelId === level.id;
            const completedCount = level.lessons.filter((l) => completedLessonIds.includes(l.id)).length;

            return (
              <div
                key={level.id}
                onClick={() => {
                  if (unlocked) setActiveLevel(level.id);
                }}
                className={`relative rounded-xl border p-5 flex flex-col justify-between transition-all duration-200 cursor-pointer select-none group ${
                  isSelected
                    ? 'bg-neutral-900 border-amber-500/70 shadow-lg shadow-amber-500/5 ring-1 ring-amber-500/30'
                    : unlocked
                    ? 'bg-neutral-900/70 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900'
                    : 'bg-neutral-950/60 border-neutral-800/40 opacity-60 cursor-not-allowed'
                }`}
              >
                {/* Level Top Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-2xl border font-serif"
                      style={{
                        backgroundColor: `${level.accentColor}15`,
                        borderColor: `${level.accentColor}40`,
                        color: level.accentColor
                      }}
                    >
                      {getPieceSymbol(level.pieceIcon)}
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                        LEVEL {level.numberPrefix}
                      </span>
                      <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                        {level.title}
                      </h3>
                    </div>
                  </div>

                  {unlocked ? (
                    progress === 100 ? (
                      <span className="p-1 rounded-full bg-emerald-500/20 text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                      </span>
                    ) : (
                      <span className="text-xs font-mono font-bold text-neutral-400">
                        {progress}%
                      </span>
                    )
                  ) : (
                    <span className="p-1.5 rounded-full bg-neutral-800 text-neutral-500">
                      <Lock className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs text-neutral-300 mt-3 line-clamp-2 leading-relaxed">
                  {level.description}
                </p>

                {/* Bottom Meta & Progress */}
                <div className="mt-4 pt-3 border-t border-neutral-800/60 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-[11px] text-neutral-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-neutral-500" />
                      {level.estimatedHours}
                    </span>
                    <span className="font-mono">
                      {completedCount} / {level.lessons.length} Lessons
                    </span>
                  </div>

                  <div className="w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${progress}%`,
                        backgroundColor: level.accentColor
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Level Lessons List */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-3">
            <span 
              className="text-lg font-bold uppercase tracking-wider font-mono"
              style={{ color: activeLevel.accentColor }}
            >
              {activeLevel.numberPrefix} — {activeLevel.title}
            </span>
            <span className="text-xs text-neutral-400 hidden sm:inline">
              ({activeLevel.lessons.length} interactive lessons)
            </span>
          </div>

          <span className="text-xs text-neutral-400 font-mono">
            {activeLevel.tagline}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {activeLevel.lessons.map((lesson) => {
            const isCompleted = completedLessonIds.includes(lesson.id);
            const isUnlocked = isLessonUnlocked(lesson.id);

            return (
              <div
                key={lesson.id}
                onClick={() => {
                  if (isUnlocked) startLesson(lesson.id);
                }}
                className={`group relative rounded-xl border p-4 flex items-start justify-between gap-3 transition-all select-none ${
                  isCompleted
                    ? 'bg-neutral-900/60 border-neutral-800 hover:border-emerald-500/50 hover:bg-neutral-900 cursor-pointer'
                    : isUnlocked
                    ? 'bg-neutral-900/80 border-neutral-800 hover:border-amber-500/50 hover:bg-neutral-900 cursor-pointer shadow-sm'
                    : 'bg-neutral-950/40 border-neutral-800/30 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold font-mono border mt-0.5 ${
                      isCompleted
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : isUnlocked
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                        : 'bg-neutral-800/50 border-neutral-700/50 text-neutral-500'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : isUnlocked ? (
                      lesson.order
                    ) : (
                      <Lock className="w-3.5 h-3.5" />
                    )}
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                      {lesson.title}
                    </h4>
                    <p className="text-xs text-neutral-400 line-clamp-1">
                      {lesson.subtitle}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5 text-[11px] text-neutral-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {lesson.durationMinutes} min
                      </span>
                      <span>•</span>
                      <span>{lesson.difficulty}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center self-center">
                  {isUnlocked && (
                    <Button3D
                      variant={isCompleted ? 'secondary' : 'primary'}
                      size="sm"
                      onClick={(e) => {
                        e?.stopPropagation();
                        startLesson(lesson.id);
                      }}
                    >
                      <span>{isCompleted ? 'Review' : 'Start'}</span>
                    </Button3D>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
