import { PieceColor, PieceType } from './chess';

export type LearnLevelId = 'foundations' | 'beginner' | 'intermediate' | 'advanced';

export type LearnStepType = 'concept' | 'demonstration' | 'try' | 'solve' | 'quiz' | 'complete';

export type LearnCameraMode = 'overview' | 'focus' | 'piece' | 'tactical' | 'top' | 'cinematic';

export interface TacticalArrow {
  from: string;
  to: string;
  color?: string; // Hex or CSS color
}

export interface LessonQuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface LessonQuiz {
  question: string;
  options: LessonQuizOption[];
  boardQuestion?: boolean;
  targetSquare?: string;
}

export interface LessonDef {
  id: string;
  levelId: LearnLevelId;
  order: number;
  title: string;
  subtitle: string;
  durationMinutes: number;
  teacherPiece: PieceType;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  
  // Concept explanation
  concept: {
    summary: string;
    bullets: string[];
    keyTakeaway: string;
  };

  // 3D Demonstration setup
  demonstration: {
    fen: string;
    cameraMode: LearnCameraMode;
    focusSquare?: string;
    highlightSquares?: string[];
    arrow?: TacticalArrow;
    demoMove?: { from: string; to: string; san: string };
    narration: string;
  };

  // Interactive Practice / Solve exercise
  exercise: {
    prompt: string;
    fen: string;
    playerColor: PieceColor;
    solutionMoves: string[]; // e.g. ["e2e4"] or ["d5e7", "g8f8", "e7c8"]
    hint: string;
    successMessage: string;
    explanationAfterSolve: string;
  };

  // Quiz
  quiz: LessonQuiz;
}

export interface LevelDef {
  id: LearnLevelId;
  numberPrefix: string; // e.g. "01", "02"
  title: string;
  tagline: string;
  description: string;
  pieceIcon: PieceType;
  accentColor: string;
  estimatedHours: string;
  lessons: LessonDef[];
}

export interface LearnProgress {
  completedLessonIds: string[];
  currentLevelId: LearnLevelId;
  activeLessonId: string | null;
  quizCorrectCount: number;
  exercisesSolvedCount: number;
  learningStreakDays: number;
  lastActiveTimestamp: number;
  achievements: string[];
}

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  iconName: string;
  badge: string;
}
