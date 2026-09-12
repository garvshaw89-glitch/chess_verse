import { PlayerStats, HistoricalGame, GameSettings } from '../types/chess';

const STATS_KEY = 'chessverse_player_stats';
const HISTORY_KEY = 'chessverse_game_history';
const SETTINGS_KEY = 'chessverse_game_settings';

export const DEFAULT_STATS: PlayerStats = {
  username: 'Grandmaster',
  rating: 1250,
  gamesPlayed: 14,
  wins: 9,
  losses: 4,
  draws: 1,
  currentStreak: 3,
  bestStreak: 6,
  puzzleRating: 1420,
  puzzlesSolved: 28
};

export const DEFAULT_SETTINGS: GameSettings = {
  graphics: {
    quality: 'high',
    shadows: true,
    particles: true,
    reflections: true,
    cameraEffects: true,
    viewMode: '3d'
  },
  sound: {
    enabled: true,
    masterVolume: 0.75,
    moveSound: true,
    captureSound: true,
    checkSound: true,
    voiceFeedback: false
  },
  gameplay: {
    autoQueen: false,
    confirmMoves: false,
    showLegalMoves: true,
    showCoordinates: true,
    pieceAnimations: true,
    boardTheme: 'classic',
    pieceTheme: 'classic'
  },
  accessibility: {
    reducedMotion: false,
    highContrast: false,
    colorFriendlyHighlights: true
  }
};

export const INITIAL_GAMES: HistoricalGame[] = [
  {
    id: 'g_init_1',
    date: '2026-03-08',
    opponent: 'Grandmaster Magnus (Sim)',
    mode: 'local_2p',
    result: 'win',
    reason: 'checkmate',
    playerColor: 'w',
    movesCount: 34,
    timeControl: '5 + 3',
    opening: 'Italian Game: Giuoco Piano',
    pgn: '1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. c3 Nf6 5. d4 exd4 6. cxd4 Bb4+ 7. Bd2 Bxd2+ 8. Nbxd2 d5',
    fenHistory: []
  },
  {
    id: 'g_init_2',
    date: '2026-03-05',
    opponent: 'Challenger Alex',
    mode: 'local_2p',
    result: 'win',
    reason: 'resignation',
    playerColor: 'b',
    movesCount: 27,
    timeControl: '3 + 2',
    opening: 'Sicilian Defense: Najdorf',
    pgn: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Be3 e5 7. Nb3 Be6',
    fenHistory: []
  },
  {
    id: 'g_init_3',
    date: '2026-02-28',
    opponent: 'Tactician Sarah',
    mode: 'local_2p',
    result: 'loss',
    reason: 'timeout',
    playerColor: 'w',
    movesCount: 42,
    timeControl: '1 + 0',
    opening: "Queen's Gambit Declined",
    pgn: '1. d4 d5 2. c4 e6 3. Nc3 Nf6 4. Bg5 Be7 5. e3 O-O 6. Nf3 Nbd7',
    fenHistory: []
  }
];

export class StorageService {
  public static getStats(): PlayerStats {
    try {
      const data = localStorage.getItem(STATS_KEY);
      return data ? JSON.parse(data) : DEFAULT_STATS;
    } catch {
      return DEFAULT_STATS;
    }
  }

  public static saveStats(stats: PlayerStats) {
    try {
      localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    } catch {}
  }

  public static updateStatsAfterGame(result: 'win' | 'loss' | 'draw', ratingDelta: number = 0) {
    const stats = this.getStats();
    stats.gamesPlayed++;
    if (result === 'win') {
      stats.wins++;
      stats.currentStreak++;
      if (stats.currentStreak > stats.bestStreak) stats.bestStreak = stats.currentStreak;
      stats.rating += ratingDelta || 15;
    } else if (result === 'loss') {
      stats.losses++;
      stats.currentStreak = 0;
      stats.rating = Math.max(800, stats.rating - (ratingDelta || 12));
    } else {
      stats.draws++;
      stats.rating += 2;
    }
    this.saveStats(stats);
    return stats;
  }

  public static getHistory(): HistoricalGame[] {
    try {
      const data = localStorage.getItem(HISTORY_KEY);
      return data ? JSON.parse(data) : INITIAL_GAMES;
    } catch {
      return INITIAL_GAMES;
    }
  }

  public static saveGame(game: HistoricalGame) {
    try {
      const history = this.getHistory();
      history.unshift(game);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 50)));
    } catch {}
  }

  public static getSettings(): GameSettings {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      return data ? JSON.parse(data) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  public static saveSettings(settings: GameSettings) {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {}
  }
}

export const storage = StorageService;
