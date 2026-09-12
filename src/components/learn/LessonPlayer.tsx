import React from 'react';
import { useLearnStore } from '../../store/learnStore';
import { getLessonById, getLevelById } from '../../data/learnCurriculum';
import { LearnChessCanvas3D } from '../../3d/LearnChessCanvas3D';
import { LearnStepType, LearnCameraMode } from '../../types/learn';
import { Button3D } from '../ui/Button3D';
import { 
  ArrowLeft, 
  Camera, 
  Lightbulb, 
  CheckCircle2, 
  HelpCircle, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft,
  Sparkles,
  Award,
  BookOpen,
  Eye,
  Crosshair,
  Compass,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

const STEP_LABELS: { type: LearnStepType; label: string; number: number }[] = [
  { type: 'concept', label: 'Concept', number: 1 },
  { type: 'demonstration', label: '3D Demo', number: 2 },
  { type: 'try', label: 'Try It', number: 3 },
  { type: 'solve', label: 'Solve', number: 4 },
  { type: 'quiz', label: 'Quiz', number: 5 },
  { type: 'complete', label: 'Complete', number: 6 }
];

export const LessonPlayer: React.FC = () => {
  const {
    activeLessonId,
    currentStep,
    cameraMode,
    showHints,
    isExerciseSolved,
    exerciseFeedback,
    quizAnswered,
    exitLesson,
    setStep,
    nextStep,
    prevStep,
    setCameraMode,
    toggleShowHints,
    resetExerciseBoard,
    handleQuizAnswer,
    completeCurrentLesson,
    nextLesson
  } = useLearnStore();

  if (!activeLessonId) return null;
  const lesson = getLessonById(activeLessonId);
  if (!lesson) return null;
  const level = getLevelById(lesson.levelId);

  const getTeacherPieceName = (p: string) => {
    switch (p) {
      case 'k': return 'Grandmaster King';
      case 'q': return 'Tactic Queen';
      case 'r': return 'Rook Strategist';
      case 'b': return 'Bishop Sniper';
      case 'n': return 'Knight Cavalry';
      default: return 'Pawn Scout';
    }
  };

  const getTeacherSymbol = (p: string) => {
    switch (p) {
      case 'k': return '♔';
      case 'q': return '♕';
      case 'r': return '♖';
      case 'b': return '♗';
      case 'n': return '♘';
      default: return '♙';
    }
  };

  const handleFinishLesson = () => {
    confetti({
      particleCount: 75,
      spread: 60,
      origin: { y: 0.7 }
    });
    completeCurrentLesson();
  };

  return (
    <div className="relative w-full h-[calc(100dvh-56px)] md:h-[calc(100dvh-60px)] flex flex-col bg-neutral-950 overflow-hidden select-none">
      {/* Top Interactive Lesson Navigation Bar */}
      <div className="w-full h-13 sm:h-14 bg-neutral-900/95 border-b border-neutral-800 px-2.5 sm:px-6 flex items-center justify-between gap-2 z-20 shrink-0 backdrop-blur-md">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Button3D
            variant="secondary"
            size="sm"
            icon={<ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            onClick={exitLesson}
            title="Return to Curriculum Dashboard"
            className="!py-1 !px-2 text-xs"
          >
            <span className="hidden sm:inline">Dashboard</span>
          </Button3D>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span 
                className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 shrink-0"
              >
                {level?.title}
              </span>
              <span className="text-xs font-bold text-white truncate max-w-[130px] sm:max-w-xs">
                {lesson.order}. {lesson.title}
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Step Badge */}
        <div className="flex md:hidden items-center gap-1 text-[11px] font-mono text-amber-400 font-bold bg-neutral-950/80 border border-neutral-800 rounded-full px-2 py-0.5">
          <span>{STEP_LABELS.find((s) => s.type === currentStep)?.number}/6</span>
          <span className="text-[10px] text-neutral-400 uppercase font-sans">
            {STEP_LABELS.find((s) => s.type === currentStep)?.label}
          </span>
        </div>

        {/* Step Indicator Pills (Desktop & Tablet) */}
        <div className="hidden md:flex items-center gap-1.5 bg-neutral-950/80 border border-neutral-800/80 rounded-full px-2.5 py-1">
          {STEP_LABELS.map((step) => {
            const isActive = currentStep === step.type;
            return (
              <button
                key={step.type}
                onClick={() => setStep(step.type)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-amber-500 text-neutral-950 shadow-sm font-bold'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                }`}
              >
                <span>{step.number}.</span>
                <span>{step.label}</span>
              </button>
            );
          })}
        </div>

        {/* Camera Preset & Utility Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Camera Selector Dropdown */}
          <div className="flex items-center bg-neutral-950 border border-neutral-800 rounded-lg p-0.5 sm:p-1">
            <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-neutral-400 ml-1 mr-0.5" />
            <select
              value={cameraMode}
              onChange={(e) => setCameraMode(e.target.value as LearnCameraMode)}
              className="bg-transparent text-[11px] sm:text-xs font-medium text-neutral-200 outline-none cursor-pointer pr-1"
            >
              <option value="tactical" className="bg-neutral-900 text-white">Tactical 3D</option>
              <option value="overview" className="bg-neutral-900 text-white">Overview</option>
              <option value="focus" className="bg-neutral-900 text-white">Focus Zoom</option>
              <option value="top" className="bg-neutral-900 text-white">Top 2D View</option>
              <option value="piece" className="bg-neutral-900 text-white">Piece Cam</option>
              <option value="cinematic" className="bg-neutral-900 text-white">Cinematic</option>
            </select>
          </div>

          <Button3D
            variant={showHints ? 'primary' : 'secondary'}
            size="sm"
            icon={<Lightbulb className="w-3.5 h-3.5" />}
            onClick={toggleShowHints}
            title={showHints ? 'Hints enabled' : 'Hints disabled'}
            className="!py-1 !px-2"
          >
            <span className="hidden sm:inline">Hints</span>
          </Button3D>
        </div>
      </div>

      {/* Main Split Screen Stage with Max-Width container for Desktop and Ultrawide */}
      <div className="relative flex-1 w-full max-w-7xl mx-auto flex flex-col lg:flex-row overflow-hidden min-h-0">
        {/* 3D Chess Board Main Canvas */}
        <div className="relative flex-1 h-[46vh] sm:h-[50vh] lg:h-full flex items-center justify-center overflow-hidden bg-neutral-950 min-h-0 touch-none">
          <LearnChessCanvas3D />

          {/* Teacher Floating Badge */}
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 z-10 flex items-center gap-2 bg-neutral-900/90 border border-neutral-800/90 rounded-xl px-2.5 py-1.5 sm:px-3 sm:py-2 backdrop-blur-md shadow-lg">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-base sm:text-lg text-amber-400 font-serif">
              {getTeacherSymbol(lesson.teacherPiece)}
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] sm:text-[10px] text-neutral-400 uppercase font-mono tracking-wider">Teacher</span>
              <span className="text-[11px] sm:text-xs font-bold text-white">{getTeacherName(lesson.teacherPiece)}</span>
            </div>
          </div>

          {/* Interactive Turn Prompt Banner on 3D stage during Try / Solve */}
          {(currentStep === 'try' || currentStep === 'solve') && (
            <div className="absolute bottom-3 sm:bottom-4 z-10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-neutral-900/90 border border-amber-500/40 text-[11px] sm:text-xs font-bold text-amber-300 backdrop-blur-md shadow-xl flex items-center gap-2 animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{currentStep === 'try' ? 'Free Practice: Move pieces on the 3D board' : 'Challenge: Make your move on the board!'}</span>
            </div>
          )}
        </div>

        {/* Right Pedagogical / Instructional Panel */}
        <div className="w-full lg:w-[420px] xl:w-[460px] h-[54vh] sm:h-[50vh] lg:h-full bg-neutral-950/95 border-t lg:border-t-0 lg:border-l border-neutral-800/80 flex flex-col justify-between p-3.5 sm:p-5 xl:p-6 z-10 overflow-y-auto min-h-0">
          {/* Top Section: Step Content */}
          <div className="flex flex-col gap-4">
            {/* Step Header */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
                  STEP {STEP_LABELS.find((s) => s.type === currentStep)?.number} OF 6: {currentStep.toUpperCase()}
                </span>
              </div>
              <span className="text-xs text-neutral-400 font-mono">
                {lesson.difficulty}
              </span>
            </div>

            {/* STEP 1: CONCEPT */}
            {currentStep === 'concept' && (
              <div className="flex flex-col gap-4">
                <h3 className="text-xl font-extrabold text-white">
                  {lesson.title}
                </h3>
                <p className="text-sm text-neutral-300 leading-relaxed">
                  {lesson.concept.summary}
                </p>

                <div className="flex flex-col gap-2 bg-neutral-900/70 border border-neutral-800/80 rounded-xl p-3.5">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
                    Key Principles
                  </span>
                  <ul className="flex flex-col gap-2">
                    {lesson.concept.bullets.map((bullet, idx) => (
                      <li key={idx} className="text-xs text-neutral-300 flex items-start gap-2 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-sky-500/10 border border-sky-500/30 rounded-xl p-3 flex items-start gap-2.5">
                  <Lightbulb className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
                  <p className="text-xs text-sky-200 leading-relaxed">
                    <strong className="text-sky-300">Takeaway: </strong>
                    {lesson.concept.keyTakeaway}
                  </p>
                </div>
              </div>
            )}

            {/* STEP 2: 3D DEMONSTRATION */}
            {currentStep === 'demonstration' && (
              <div className="flex flex-col gap-4">
                <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                  <Eye className="w-5 h-5 text-amber-400" />
                  3D Spatial Demonstration
                </h3>
                <p className="text-sm text-neutral-300 leading-relaxed">
                  {lesson.demonstration.narration}
                </p>

                <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-4 flex flex-col gap-2">
                  <span className="text-xs font-bold text-neutral-400 font-mono uppercase">
                    3D Board Visualization
                  </span>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Observe the active highlighted squares and tactical indicators on the board. You can freely rotate and orbit the 3D board using click-and-drag.
                  </p>
                </div>
              </div>
            )}

            {/* STEP 3: TRY IT YOURSELF */}
            {currentStep === 'try' && (
              <div className="flex flex-col gap-4">
                <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                  <Compass className="w-5 h-5 text-amber-400" />
                  Interactive Board Playground
                </h3>
                <p className="text-sm text-neutral-300 leading-relaxed">
                  {lesson.exercise.prompt}
                </p>

                <div className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-3.5 flex flex-col gap-2">
                  <span className="text-xs font-bold text-amber-400 font-mono uppercase">
                    Hands-On Practice
                  </span>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Click any friendly piece on the 3D board to reveal its available destination squares. Move pieces around to feel their reach!
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <Button3D
                    variant="secondary"
                    size="sm"
                    icon={<RotateCcw className="w-3.5 h-3.5" />}
                    onClick={resetExerciseBoard}
                  >
                    <span>Reset Position</span>
                  </Button3D>
                </div>
              </div>
            )}

            {/* STEP 4: SOLVE CHALLENGE */}
            {currentStep === 'solve' && (
              <div className="flex flex-col gap-4">
                <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                  <Crosshair className="w-5 h-5 text-amber-400" />
                  Tactical Challenge
                </h3>
                <p className="text-sm text-neutral-300 leading-relaxed">
                  {lesson.exercise.prompt}
                </p>

                {/* Feedback Banner */}
                {isExerciseSolved ? (
                  <div className="bg-emerald-500/15 border border-emerald-500/40 rounded-xl p-4 flex flex-col gap-2 animate-fadeIn">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>{exerciseFeedback || 'Brilliant move! Challenge solved.'}</span>
                    </div>
                    <p className="text-xs text-emerald-200 leading-relaxed mt-1">
                      {lesson.exercise.explanationAfterSolve}
                    </p>
                  </div>
                ) : exerciseFeedback ? (
                  <div className="bg-amber-500/15 border border-amber-500/40 rounded-xl p-3 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                    <span className="text-xs text-amber-200 leading-relaxed">{exerciseFeedback}</span>
                  </div>
                ) : showHints && (
                  <div className="bg-sky-500/10 border border-sky-500/30 rounded-xl p-3 flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
                    <span className="text-xs text-sky-200 leading-relaxed">
                      <strong>Hint: </strong>{lesson.exercise.hint}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <Button3D
                    variant="secondary"
                    size="sm"
                    icon={<RotateCcw className="w-3.5 h-3.5" />}
                    onClick={resetExerciseBoard}
                  >
                    <span>Reset Challenge</span>
                  </Button3D>
                </div>
              </div>
            )}

            {/* STEP 5: QUIZ */}
            {currentStep === 'quiz' && (
              <div className="flex flex-col gap-4">
                <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-amber-400" />
                  Check Your Knowledge
                </h3>
                <p className="text-sm text-neutral-200 font-medium">
                  {lesson.quiz.question}
                </p>

                <div className="flex flex-col gap-2.5">
                  {lesson.quiz.options.map((option) => {
                    const isSelected = quizAnswered?.selectedId === option.id;
                    const showCorrect = quizAnswered && option.isCorrect;
                    const showWrong = isSelected && !option.isCorrect;

                    return (
                      <button
                        key={option.id}
                        disabled={!!quizAnswered}
                        onClick={() => handleQuizAnswer(option.id)}
                        className={`w-full text-left p-3.5 rounded-xl border text-xs font-medium transition-all ${
                          showCorrect
                            ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200 font-bold'
                            : showWrong
                            ? 'bg-red-500/20 border-red-500/50 text-red-200 font-bold'
                            : 'bg-neutral-900/70 border-neutral-800 hover:bg-neutral-800 hover:border-neutral-700 text-neutral-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span>{option.text}</span>
                          {showCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
                        </div>
                        {quizAnswered && isSelected && (
                          <p className="text-[11px] text-neutral-400 mt-2 pt-2 border-t border-neutral-700/50 font-normal">
                            {option.explanation}
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 6: COMPLETE */}
            {currentStep === 'complete' && (
              <div className="flex flex-col gap-4 items-center text-center py-4 animate-fadeIn">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-xl shadow-amber-500/10">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-extrabold text-white">
                  Lesson Complete!
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 max-w-sm">
                  You have successfully mastered <strong>{lesson.title}</strong> and added its tactical concepts to your repertoire!
                </p>

                <div className="w-full bg-neutral-900/80 border border-neutral-800 rounded-xl p-4 flex items-center justify-around mt-2">
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-neutral-400 font-mono">XP Earned</span>
                    <span className="text-lg font-bold text-amber-400">+50 XP</span>
                  </div>
                  <div className="w-px h-8 bg-neutral-800" />
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-neutral-400 font-mono">Mastery</span>
                    <span className="text-lg font-bold text-emerald-400">100%</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Action Footer with 3D Navigation Controls */}
          <div className="pt-4 border-t border-neutral-800 flex items-center justify-between gap-3 mt-4">
            <Button3D
              variant="secondary"
              size="sm"
              icon={<ChevronLeft className="w-4 h-4" />}
              onClick={prevStep}
              disabled={currentStep === 'concept'}
            >
              <span>Back</span>
            </Button3D>

            {currentStep === 'quiz' ? (
              <Button3D
                variant="primary"
                size="md"
                onClick={handleFinishLesson}
                disabled={!quizAnswered}
                icon={<Award className="w-4 h-4 fill-amber-950" />}
              >
                <span>Complete Lesson</span>
              </Button3D>
            ) : currentStep === 'complete' ? (
              <Button3D
                variant="primary"
                size="md"
                onClick={nextLesson}
                icon={<Sparkles className="w-4 h-4 fill-amber-950" />}
              >
                <span>Next Lesson</span>
              </Button3D>
            ) : currentStep === 'solve' && !isExerciseSolved ? (
              <Button3D
                variant="secondary"
                size="sm"
                onClick={() => setStep('quiz')}
              >
                <span>Skip to Quiz</span>
              </Button3D>
            ) : (
              <Button3D
                variant="primary"
                size="md"
                onClick={nextStep}
                icon={<ChevronRight className="w-4 h-4" />}
              >
                <span>Continue</span>
              </Button3D>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function getTeacherName(piece: string) {
  switch (piece) {
    case 'k': return 'Grandmaster King';
    case 'q': return 'Tactic Queen';
    case 'r': return 'Rook Strategist';
    case 'b': return 'Bishop Sniper';
    case 'n': return 'Knight Cavalry';
    default: return 'Pawn Scout';
  }
}
