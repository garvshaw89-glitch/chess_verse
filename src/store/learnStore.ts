import { create } from 'zustand';
import { Chess, Square } from 'chess.js';
import { 
  LearnLevelId, 
  LearnStepType, 
  LearnCameraMode, 
  TacticalArrow,
  LessonDef 
} from '../types/learn';
import { COURSE_LEVELS, ALL_LESSONS, getLessonById, ACHIEVEMENTS } from '../data/learnCurriculum';
import { soundService } from '../services/sound';

const LEARN_STORAGE_KEY = 'chessverse_learn_progress_v2';

interface LearnStorageData {
  completedLessonIds: string[];
  currentLevelId: LearnLevelId;
  quizCorrectCount: number;
  exercisesSolvedCount: number;
  learningStreakDays: number;
  lastActiveTimestamp: number;
  achievements: string[];
}

function loadInitialStorage(): LearnStorageData {
  if (typeof window === 'undefined') {
    return {
      completedLessonIds: [],
      currentLevelId: 'foundations',
      quizCorrectCount: 0,
      exercisesSolvedCount: 0,
      learningStreakDays: 1,
      lastActiveTimestamp: Date.now(),
      achievements: []
    };
  }

  try {
    const raw = localStorage.getItem(LEARN_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        completedLessonIds: Array.isArray(parsed.completedLessonIds) ? parsed.completedLessonIds : [],
        currentLevelId: parsed.currentLevelId || 'foundations',
        quizCorrectCount: typeof parsed.quizCorrectCount === 'number' ? parsed.quizCorrectCount : 0,
        exercisesSolvedCount: typeof parsed.exercisesSolvedCount === 'number' ? parsed.exercisesSolvedCount : 0,
        learningStreakDays: typeof parsed.learningStreakDays === 'number' ? parsed.learningStreakDays : 1,
        lastActiveTimestamp: parsed.lastActiveTimestamp || Date.now(),
        achievements: Array.isArray(parsed.achievements) ? parsed.achievements : []
      };
    }
  } catch (err) {
    console.warn('Failed to load learn progress:', err);
  }

  return {
    completedLessonIds: [],
    currentLevelId: 'foundations',
    quizCorrectCount: 0,
    exercisesSolvedCount: 0,
    learningStreakDays: 1,
    lastActiveTimestamp: Date.now(),
    achievements: []
  };
}

function saveStorage(data: LearnStorageData) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LEARN_STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn('Failed to save learn progress:', err);
  }
}

interface LearnState {
  // Navigation & Active Lesson
  activeLevelId: LearnLevelId;
  activeLessonId: string | null;
  currentStep: LearnStepType;
  
  // Progress
  completedLessonIds: string[];
  quizCorrectCount: number;
  exercisesSolvedCount: number;
  learningStreakDays: number;
  achievements: string[];
  
  // Interactive Lesson Engine State
  boardChess: Chess;
  boardFen: string;
  selectedSquare: string | null;
  legalMoves: string[];
  lastMove: { from: string; to: string } | null;
  cameraMode: LearnCameraMode;
  showHints: boolean;
  activeArrow: TacticalArrow | null;
  highlightSquares: string[];
  
  // Exercise & Quiz status for current lesson
  isExerciseSolved: boolean;
  exerciseAttempts: number;
  exerciseFeedback: string | null;
  quizAnswered: { selectedId: string; isCorrect: boolean } | null;
  
  // Modals & Views
  courseMapOpen: boolean;
  achievementsModalOpen: boolean;
  completionModalOpen: boolean;

  // Actions
  setActiveLevel: (levelId: LearnLevelId) => void;
  startLesson: (lessonId: string) => void;
  exitLesson: () => void;
  setStep: (step: LearnStepType) => void;
  nextStep: () => void;
  prevStep: () => void;
  
  setCameraMode: (mode: LearnCameraMode) => void;
  toggleShowHints: () => void;
  
  selectSquare: (sq: string | null) => void;
  handlePlayerMove: (from: string, to: string, promotion?: string) => boolean;
  resetExerciseBoard: () => void;
  
  handleQuizAnswer: (optionId: string) => void;
  completeCurrentLesson: () => void;
  nextLesson: () => void;
  
  openCourseMap: () => void;
  closeCourseMap: () => void;
  openAchievements: () => void;
  closeAchievements: () => void;
  closeCompletionModal: () => void;
  
  // Helpers
  isLevelUnlocked: (levelId: LearnLevelId) => boolean;
  isLessonUnlocked: (lessonId: string) => boolean;
  getLevelProgress: (levelId: LearnLevelId) => number;
  getTotalProgress: () => number;
}

const initialSaved = loadInitialStorage();
const initialChess = new Chess();

export const useLearnStore = create<LearnState>((set, get) => ({
  activeLevelId: initialSaved.currentLevelId,
  activeLessonId: null,
  currentStep: 'concept',

  completedLessonIds: initialSaved.completedLessonIds,
  quizCorrectCount: initialSaved.quizCorrectCount,
  exercisesSolvedCount: initialSaved.exercisesSolvedCount,
  learningStreakDays: initialSaved.learningStreakDays,
  achievements: initialSaved.achievements,

  boardChess: initialChess,
  boardFen: initialChess.fen(),
  selectedSquare: null,
  legalMoves: [],
  lastMove: null,
  cameraMode: 'overview',
  showHints: true,
  activeArrow: null,
  highlightSquares: [],

  isExerciseSolved: false,
  exerciseAttempts: 0,
  exerciseFeedback: null,
  quizAnswered: null,

  courseMapOpen: false,
  achievementsModalOpen: false,
  completionModalOpen: false,

  setActiveLevel: (levelId) => {
    soundService.playButton3DPress('secondary');
    set({ activeLevelId: levelId });
  },

  startLesson: (lessonId: string) => {
    const lesson = getLessonById(lessonId);
    if (!lesson) return;

    soundService.playButton3DPress('primary');

    const demoChess = new Chess();
    try {
      demoChess.load(lesson.demonstration.fen);
    } catch {
      demoChess.reset();
    }

    set({
      activeLessonId: lessonId,
      activeLevelId: lesson.levelId,
      currentStep: 'concept',
      boardChess: demoChess,
      boardFen: demoChess.fen(),
      selectedSquare: null,
      legalMoves: [],
      lastMove: null,
      cameraMode: lesson.demonstration.cameraMode || 'tactical',
      activeArrow: lesson.demonstration.arrow || null,
      highlightSquares: lesson.demonstration.highlightSquares || [],
      isExerciseSolved: false,
      exerciseAttempts: 0,
      exerciseFeedback: null,
      quizAnswered: null
    });
  },

  exitLesson: () => {
    soundService.playClick();
    set({
      activeLessonId: null,
      currentStep: 'concept',
      selectedSquare: null,
      legalMoves: [],
      activeArrow: null,
      highlightSquares: []
    });
  },

  setStep: (step: LearnStepType) => {
    const { activeLessonId } = get();
    if (!activeLessonId) return;
    const lesson = getLessonById(activeLessonId);
    if (!lesson) return;

    soundService.playButton3DPress('secondary');

    const newChess = new Chess();
    if (step === 'concept' || step === 'demonstration') {
      try {
        newChess.load(lesson.demonstration.fen);
      } catch {
        newChess.reset();
      }
      set({
        currentStep: step,
        boardChess: newChess,
        boardFen: newChess.fen(),
        cameraMode: lesson.demonstration.cameraMode || 'tactical',
        activeArrow: lesson.demonstration.arrow || null,
        highlightSquares: lesson.demonstration.highlightSquares || [],
        selectedSquare: null,
        legalMoves: []
      });
    } else if (step === 'try' || step === 'solve') {
      try {
        newChess.load(lesson.exercise.fen);
      } catch {
        newChess.reset();
      }
      set({
        currentStep: step,
        boardChess: newChess,
        boardFen: newChess.fen(),
        cameraMode: 'tactical',
        activeArrow: null,
        highlightSquares: [],
        selectedSquare: null,
        legalMoves: []
      });
    } else {
      set({ currentStep: step });
    }
  },

  nextStep: () => {
    const steps: LearnStepType[] = ['concept', 'demonstration', 'try', 'solve', 'quiz', 'complete'];
    const { currentStep } = get();
    const idx = steps.indexOf(currentStep);
    if (idx < steps.length - 1) {
      get().setStep(steps[idx + 1]);
    }
  },

  prevStep: () => {
    const steps: LearnStepType[] = ['concept', 'demonstration', 'try', 'solve', 'quiz', 'complete'];
    const { currentStep } = get();
    const idx = steps.indexOf(currentStep);
    if (idx > 0) {
      get().setStep(steps[idx - 1]);
    }
  },

  setCameraMode: (mode: LearnCameraMode) => {
    soundService.playClick();
    set({ cameraMode: mode });
  },

  toggleShowHints: () => {
    soundService.playClick();
    set((state) => ({ showHints: !state.showHints }));
  },

  selectSquare: (sq: string | null) => {
    const { boardChess, currentStep, isExerciseSolved } = get();

    // Only allow selection in try or solve steps
    if (currentStep !== 'try' && currentStep !== 'solve') return;
    if (isExerciseSolved && currentStep === 'solve') return;

    if (!sq) {
      set({ selectedSquare: null, legalMoves: [] });
      return;
    }

    const { selectedSquare } = get();

    if (selectedSquare) {
      if (selectedSquare === sq) {
        set({ selectedSquare: null, legalMoves: [] });
        return;
      }

      // Check if clicking a legal move target
      const moves = boardChess.moves({ square: selectedSquare as Square, verbose: true });
      const targetMove = moves.find((m) => m.to === sq);
      if (targetMove) {
        get().handlePlayerMove(selectedSquare, sq);
        return;
      }
    }

    // Select piece
    const piece = boardChess.get(sq as Square);
    if (piece && piece.color === boardChess.turn()) {
      const moves = boardChess.moves({ square: sq as Square, verbose: true });
      soundService.playClick();
      set({
        selectedSquare: sq,
        legalMoves: moves.map((m) => m.to)
      });
    } else {
      set({ selectedSquare: null, legalMoves: [] });
    }
  },

  handlePlayerMove: (from: string, to: string, promotion = 'q') => {
    const { boardChess, activeLessonId, currentStep, completedLessonIds, achievements } = get();
    if (!activeLessonId) return false;
    const lesson = getLessonById(activeLessonId);
    if (!lesson) return false;

    try {
      const moveResult = boardChess.move({
        from: from as Square,
        to: to as Square,
        promotion
      });

      if (!moveResult) return false;

      if (moveResult.captured) {
        soundService.playCapture();
      } else {
        soundService.playMove();
      }

      set({
        boardFen: boardChess.fen(),
        lastMove: { from, to },
        selectedSquare: null,
        legalMoves: []
      });

      // If in "solve" step, check if the move matches the lesson solution
      if (currentStep === 'solve') {
        const playedUci = `${from}${to}`.toLowerCase();
        const expectedUci = lesson.exercise.solutionMoves[0]?.toLowerCase();

        if (playedUci === expectedUci || (expectedUci && playedUci.startsWith(expectedUci))) {
          // Correct Move!
          soundService.playWin();

          // Unlock "first_move" achievement if first lesson
          const newAchievements = [...achievements];
          if (!newAchievements.includes('first_move')) {
            newAchievements.push('first_move');
          }

          const newSolvedCount = get().exercisesSolvedCount + 1;
          if (newSolvedCount >= 10 && !newAchievements.includes('tactician')) {
            newAchievements.push('tactician');
          }

          set((state) => ({
            isExerciseSolved: true,
            exerciseFeedback: lesson.exercise.successMessage,
            exercisesSolvedCount: newSolvedCount,
            achievements: newAchievements
          }));

          saveStorage({
            completedLessonIds,
            currentLevelId: get().activeLevelId,
            quizCorrectCount: get().quizCorrectCount,
            exercisesSolvedCount: newSolvedCount,
            learningStreakDays: get().learningStreakDays,
            lastActiveTimestamp: Date.now(),
            achievements: newAchievements
          });

          return true;
        } else {
          // Incorrect move - give hint and allow retry
          soundService.playError();
          set((state) => ({
            exerciseAttempts: state.exerciseAttempts + 1,
            exerciseFeedback: 'Try again! ' + (state.showHints ? lesson.exercise.hint : 'Consider piece safety and the tactical objective.')
          }));

          // Reset board position after brief moment
          setTimeout(() => {
            get().resetExerciseBoard();
          }, 1200);

          return false;
        }
      }

      return true;
    } catch {
      return false;
    }
  },

  resetExerciseBoard: () => {
    const { activeLessonId, currentStep } = get();
    if (!activeLessonId) return;
    const lesson = getLessonById(activeLessonId);
    if (!lesson) return;

    const newChess = new Chess();
    try {
      newChess.load(lesson.exercise.fen);
    } catch {
      newChess.reset();
    }

    set({
      boardChess: newChess,
      boardFen: newChess.fen(),
      selectedSquare: null,
      legalMoves: [],
      lastMove: null,
      exerciseFeedback: null
    });
  },

  handleQuizAnswer: (optionId: string) => {
    const { activeLessonId, quizAnswered, quizCorrectCount, completedLessonIds, achievements } = get();
    if (!activeLessonId || quizAnswered) return;
    const lesson = getLessonById(activeLessonId);
    if (!lesson) return;

    const option = lesson.quiz.options.find((o) => o.id === optionId);
    if (!option) return;

    const isCorrect = option.isCorrect;

    if (isCorrect) {
      soundService.playWin();
    } else {
      soundService.playError();
    }

    const newQuizCount = isCorrect ? quizCorrectCount + 1 : quizCorrectCount;

    set({
      quizAnswered: { selectedId: optionId, isCorrect },
      quizCorrectCount: newQuizCount
    });

    saveStorage({
      completedLessonIds,
      currentLevelId: get().activeLevelId,
      quizCorrectCount: newQuizCount,
      exercisesSolvedCount: get().exercisesSolvedCount,
      learningStreakDays: get().learningStreakDays,
      lastActiveTimestamp: Date.now(),
      achievements
    });
  },

  completeCurrentLesson: () => {
    const { activeLessonId, completedLessonIds, achievements } = get();
    if (!activeLessonId) return;

    soundService.playCelebration();

    const newCompleted = completedLessonIds.includes(activeLessonId)
      ? completedLessonIds
      : [...completedLessonIds, activeLessonId];

    const newAchievements = [...achievements];

    // Check for "piece_master"
    const foundationsIds = COURSE_LEVELS[0].lessons.map((l) => l.id);
    if (foundationsIds.every((id) => newCompleted.includes(id)) && !newAchievements.includes('piece_master')) {
      newAchievements.push('piece_master');
    }

    // Check for "checkmate_expert"
    if (newCompleted.includes('b_3') && !newAchievements.includes('checkmate_expert')) {
      newAchievements.push('checkmate_expert');
    }

    // Check for "endgame_expert"
    if (newCompleted.includes('b_20') && !newAchievements.includes('endgame_expert')) {
      newAchievements.push('endgame_expert');
    }

    // Check for "chess_scholar" (all lessons completed)
    const isAllComplete = ALL_LESSONS.every((l) => newCompleted.includes(l.id));
    if (isAllComplete && !newAchievements.includes('chess_scholar')) {
      newAchievements.push('chess_scholar');
    }

    set({
      completedLessonIds: newCompleted,
      achievements: newAchievements,
      currentStep: 'complete',
      completionModalOpen: isAllComplete
    });

    saveStorage({
      completedLessonIds: newCompleted,
      currentLevelId: get().activeLevelId,
      quizCorrectCount: get().quizCorrectCount,
      exercisesSolvedCount: get().exercisesSolvedCount,
      learningStreakDays: get().learningStreakDays,
      lastActiveTimestamp: Date.now(),
      achievements: newAchievements
    });
  },

  nextLesson: () => {
    const { activeLessonId } = get();
    if (!activeLessonId) return;

    const currentIdx = ALL_LESSONS.findIndex((l) => l.id === activeLessonId);
    if (currentIdx >= 0 && currentIdx < ALL_LESSONS.length - 1) {
      const nextOne = ALL_LESSONS[currentIdx + 1];
      get().startLesson(nextOne.id);
    } else {
      get().exitLesson();
    }
  },

  openCourseMap: () => {
    soundService.playButton3DPress('secondary');
    set({ courseMapOpen: true });
  },

  closeCourseMap: () => {
    soundService.playClick();
    set({ courseMapOpen: false });
  },

  openAchievements: () => {
    soundService.playButton3DPress('secondary');
    set({ achievementsModalOpen: true });
  },

  closeAchievements: () => {
    soundService.playClick();
    set({ achievementsModalOpen: false });
  },

  closeCompletionModal: () => {
    soundService.playClick();
    set({ completionModalOpen: false });
  },

  isLevelUnlocked: (levelId: LearnLevelId) => {
    if (levelId === 'foundations') return true;
    const { completedLessonIds } = get();

    if (levelId === 'beginner') {
      // Need at least 3 foundation lessons
      const foundationsLessons = COURSE_LEVELS[0].lessons;
      const finished = foundationsLessons.filter((l) => completedLessonIds.includes(l.id)).length;
      return finished >= 3;
    }

    if (levelId === 'intermediate') {
      // Need at least 10 beginner lessons
      const beginnerLessons = COURSE_LEVELS[1].lessons;
      const finished = beginnerLessons.filter((l) => completedLessonIds.includes(l.id)).length;
      return finished >= 10;
    }

    if (levelId === 'advanced') {
      // Need at least 15 intermediate lessons
      const intermediateLessons = COURSE_LEVELS[2].lessons;
      const finished = intermediateLessons.filter((l) => completedLessonIds.includes(l.id)).length;
      return finished >= 15;
    }

    return true;
  },

  isLessonUnlocked: (lessonId: string) => {
    const lesson = getLessonById(lessonId);
    if (!lesson) return false;
    if (!get().isLevelUnlocked(lesson.levelId)) return false;

    // First lesson of any unlocked level is unlocked
    if (lesson.order === 1) return true;

    // Otherwise requires previous lesson to be completed
    const level = COURSE_LEVELS.find((l) => l.id === lesson.levelId);
    if (!level) return true;

    const prevLesson = level.lessons.find((l) => l.order === lesson.order - 1);
    if (!prevLesson) return true;

    return get().completedLessonIds.includes(prevLesson.id);
  },

  getLevelProgress: (levelId: LearnLevelId) => {
    const level = COURSE_LEVELS.find((l) => l.id === levelId);
    if (!level || level.lessons.length === 0) return 0;
    const { completedLessonIds } = get();
    const count = level.lessons.filter((l) => completedLessonIds.includes(l.id)).length;
    return Math.round((count / level.lessons.length) * 100);
  },

  getTotalProgress: () => {
    const { completedLessonIds } = get();
    if (ALL_LESSONS.length === 0) return 0;
    return Math.round((completedLessonIds.length / ALL_LESSONS.length) * 100);
  }
}));
