export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
export type PieceColor = 'w' | 'b';

export interface ChessPieceData {
  type: PieceType;
  color: PieceColor;
  square: string; // e.g. "e4"
}

export type BoardThemeId = 'classic' | 'midnight' | 'royal' | 'marble' | 'wood' | 'cyber';
export type PieceThemeId = 'classic' | 'wood' | 'marble' | 'minimalist' | 'metal' | 'futuristic';

export type CameraPreset = 'top' | 'isometric' | 'cinematic' | 'player_w' | 'player_b';

export type GameMode = 
  | 'play' 
  | 'local_2p' 
  | 'custom' 
  | 'puzzle' 
  | 'practice'
  | 'learn'
  | 'analysis';

export interface TimeControlPreset {
  id: string;
  name: string;
  initialMinutes: number;
  incrementSeconds: number;
}

export interface PlayerStats {
  username: string;
  rating: number;
  gamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  currentStreak: number;
  bestStreak: number;
  puzzleRating: number;
  puzzlesSolved: number;
}

export interface HistoricalGame {
  id: string;
  date: string;
  opponent: string;
  mode: GameMode;
  result: 'win' | 'loss' | 'draw';
  reason: string;
  playerColor: PieceColor;
  movesCount: number;
  timeControl: string;
  opening?: string;
  pgn: string;
  fenHistory: string[];
}

export interface PuzzleData {
  id: string;
  title: string;
  rating: number;
  theme: string;
  fen: string;
  description: string;
  solution: string[];
  firstMoveSan: string;
  playerColor: PieceColor;
}

export interface MoveRecord {
  from: string;
  to: string;
  piece: PieceType;
  color: PieceColor;
  captured?: PieceType;
  promotion?: string;
  san: string;
  fen: string;
  timestamp: number;
}

export interface GameSettings {
  graphics: {
    quality: 'auto' | 'high' | 'medium' | 'low';
    shadows: boolean;
    particles: boolean;
    reflections: boolean;
    cameraEffects: boolean;
    viewMode: '3d' | '2d';
  };
  sound: {
    enabled: boolean;
    masterVolume: number; // 0 to 1
    moveSound: boolean;
    captureSound: boolean;
    checkSound: boolean;
    voiceFeedback: boolean;
  };
  gameplay: {
    autoQueen: boolean;
    confirmMoves: boolean;
    showLegalMoves: boolean;
    showCoordinates: boolean;
    pieceAnimations: boolean;
    boardTheme: BoardThemeId;
    pieceTheme: PieceThemeId;
  };
  accessibility: {
    reducedMotion: boolean;
    highContrast: boolean;
    colorFriendlyHighlights: boolean;
  };
}

export interface OnlineRoomData {
  id: string;
  whitePlayer: string;
  blackPlayer: string;
  status: 'waiting' | 'active' | 'checkmate' | 'draw' | 'resigned' | 'timeout';
  timeControl: string;
  moveCount: number;
}
