import { create } from 'zustand';
import { Chess, Square } from 'chess.js';
import { 
  GameMode, 
  CameraPreset, 
  MoveRecord, 
  PieceColor, 
  PieceType,
  TimeControlPreset 
} from '../types/chess';
import { soundService } from '../services/sound';
import { StorageService } from '../services/storage';

export const TIME_CONTROL_PRESETS: TimeControlPreset[] = [
  { id: '1+0', name: '1 min (Bullet)', initialMinutes: 1, incrementSeconds: 0 },
  { id: '2+1', name: '2 | 1 (Bullet)', initialMinutes: 2, incrementSeconds: 1 },
  { id: '3+0', name: '3 min (Blitz)', initialMinutes: 3, incrementSeconds: 0 },
  { id: '3+2', name: '3 | 2 (Blitz)', initialMinutes: 3, incrementSeconds: 2 },
  { id: '5+0', name: '5 min (Blitz)', initialMinutes: 5, incrementSeconds: 0 },
  { id: '5+3', name: '5 | 3 (Rapid)', initialMinutes: 5, incrementSeconds: 3 },
  { id: '10+0', name: '10 min (Rapid)', initialMinutes: 10, incrementSeconds: 0 },
  { id: '15+10', name: '15 | 10 (Rapid)', initialMinutes: 15, incrementSeconds: 10 },
  { id: '30+0', name: '30 min (Classical)', initialMinutes: 30, incrementSeconds: 0 }
];

interface GameState {
  chess: Chess;
  fen: string;
  history: MoveRecord[];
  turn: PieceColor;
  isCheck: boolean;
  isCheckmate: boolean;
  isDraw: boolean;
  drawReason: string;
  isGameOver: boolean;
  winner: PieceColor | 'draw' | null;
  winReason: string;

  // Configuration
  gameMode: GameMode;
  players: {
    white: string;
    black: string;
  };
  isTwoPlayerSetupOpen: boolean;
  autoFlipBoard: boolean;
  playerColor: PieceColor;
  boardOrientation: PieceColor;
  timeControl: TimeControlPreset;
  stats: {
    wins: number;
    losses: number;
    draws: number;
    winStreak: number;
  };

  // Interaction
  selectedSquare: string | null;
  legalMoves: string[];
  lastMove: { from: string; to: string } | null;
  capturedWhite: PieceType[]; // captured by black
  capturedBlack: PieceType[]; // captured by white
  whiteTime: number; // seconds
  blackTime: number; // seconds
  clockActive: boolean;

  cameraPreset: CameraPreset;
  promotionPending: { from: string; to: string } | null;
  viewingMoveIndex: number; // -1 for current live board
  toast: { message: string; type: 'info' | 'success' | 'warning' | 'danger'; id: number } | null;

  // Actions
  selectSquare: (sq: string | null) => void;
  makeMove: (from: string, to: string, promotion?: string) => boolean;
  completePromotion: (promo: 'q' | 'r' | 'b' | 'n') => void;
  cancelPromotion: () => void;
  undoMove: () => void;
  resetGame: (customTimeControl?: TimeControlPreset) => void;
  setGameMode: (mode: GameMode) => void;
  setTwoPlayerSetupOpen: (open: boolean) => void;
  setAutoFlipBoard: (autoFlip: boolean) => void;
  setPlayers: (names: { white: string; black: string }) => void;
  startTwoPlayerGame: (config: {
    whiteName: string;
    blackName: string;
    timeControl?: TimeControlPreset;
    autoFlipBoard?: boolean;
  }) => void;
  setBoardOrientation: (color: PieceColor) => void;
  toggleOrientation: () => void;
  setCameraPreset: (preset: CameraPreset) => void;
  setTimeControl: (tc: TimeControlPreset) => void;
  setPlayerColor: (color: PieceColor) => void;
  resign: (color?: PieceColor) => void;
  offerDraw: () => void;
  jumpToMove: (index: number) => void;
  loadCustomFen: (fen: string) => void;
  showToast: (message: string, type?: 'info' | 'success' | 'warning' | 'danger') => void;
  tickClock: () => void;
}

const initialChess = new Chess();

export const useGameStore = create<GameState>((set, get) => {
  let clockTimer: any = null;

  const startClockLoop = () => {
    if (clockTimer) clearInterval(clockTimer);
    clockTimer = setInterval(() => {
      get().tickClock();
    }, 1000);
  };

  return {
    chess: initialChess,
    fen: initialChess.fen(),
    history: [],
    turn: 'w',
    isCheck: false,
    isCheckmate: false,
    isDraw: false,
    drawReason: '',
    isGameOver: false,
    winner: null,
    winReason: '',

    gameMode: 'local_2p',
    players: {
      white: 'White',
      black: 'Black'
    },
    isTwoPlayerSetupOpen: false,
    autoFlipBoard: false,
    playerColor: 'w',
    boardOrientation: 'w',
    timeControl: TIME_CONTROL_PRESETS[5], // 5+3 Rapid
    stats: {
      wins: 9,
      losses: 4,
      draws: 1,
      winStreak: 3
    },

    selectedSquare: null,
    legalMoves: [],
    lastMove: null,
    capturedWhite: [],
    capturedBlack: [],
    whiteTime: 300,
    blackTime: 300,
    clockActive: false,

    cameraPreset: 'player_w',
    promotionPending: null,
    viewingMoveIndex: -1,
    toast: null,

    showToast: (message, type = 'info') => {
      set({ toast: { message, type, id: Date.now() } });
      setTimeout(() => {
        if (get().toast?.message === message) {
          set({ toast: null });
        }
      }, 3500);
    },

    selectSquare: (sq) => {
      const state = get();
      if (state.isGameOver || state.viewingMoveIndex !== -1) return;

      if (!sq) {
        set({ selectedSquare: null, legalMoves: [] });
        return;
      }

      const piece = state.chess.get(sq as Square);

      // If a square is already selected
      if (state.selectedSquare) {
        if (state.selectedSquare === sq) {
          // Deselect
          set({ selectedSquare: null, legalMoves: [] });
          return;
        }

        // If target is in legal moves, attempt move
        if (state.legalMoves.includes(sq)) {
          const success = state.makeMove(state.selectedSquare, sq);
          if (success) return;
        }

        // Otherwise if clicked another own piece, switch selection
        if (piece && piece.color === state.chess.turn()) {
          const moves = state.chess.moves({ square: sq as Square, verbose: true });
          set({
            selectedSquare: sq,
            legalMoves: moves.map((m) => m.to)
          });
          soundService.playClick();
          return;
        }

        set({ selectedSquare: null, legalMoves: [] });
        return;
      }

      // No square selected yet
      if (piece && piece.color === state.chess.turn()) {
        const moves = state.chess.moves({ square: sq as Square, verbose: true });
        set({
          selectedSquare: sq,
          legalMoves: moves.map((m) => m.to)
        });
        soundService.playClick();
      }
    },

    makeMove: (from, to, promotionPiece) => {
      const state = get();
      if (state.isGameOver || state.viewingMoveIndex !== -1) return false;
      if (!from || !to) return false;

      const fromLower = from.toLowerCase() as Square;
      const toLower = to.toLowerCase() as Square;

      const piece = state.chess.get(fromLower);
      if (!piece || piece.color !== state.chess.turn()) {
        return false;
      }

      // Validate that this move is in legal moves
      const legalMoves = state.chess.moves({ square: fromLower, verbose: true });
      const matchedMove = legalMoves.find((m) => m.to === toLower);
      if (!matchedMove) {
        return false;
      }

      // Check for pawn promotion requirement
      const isPawnPromotion = Boolean(
        piece.type === 'p' &&
        ((piece.color === 'w' && to[1] === '8') || (piece.color === 'b' && to[1] === '1'))
      );

      if (isPawnPromotion && !promotionPiece) {
        set({ promotionPending: { from, to } });
        return true;
      }

      try {
        const moveConfig: { from: string; to: string; promotion?: string } = {
          from: fromLower,
          to: toLower
        };
        if (isPawnPromotion) {
          moveConfig.promotion = promotionPiece || 'q';
        }

        const move = state.chess.move(moveConfig);

        if (!move) {
          get().showToast('Illegal move', 'warning');
          return false;
        }

        // Sound effect
        if (state.chess.isCheckmate()) {
          soundService.playCheckmate();
        } else if (state.chess.inCheck()) {
          soundService.playCheck();
        } else if (move.captured) {
          soundService.playCapture();
        } else {
          soundService.playMove();
        }

        // Captures update
        const capturedWhite = [...state.capturedWhite];
        const capturedBlack = [...state.capturedBlack];
        if (move.captured) {
          if (move.color === 'w') {
            capturedBlack.push(move.captured as PieceType);
          } else {
            capturedWhite.push(move.captured as PieceType);
          }
        }

        // Update clock with increment
        let newWhiteTime = state.whiteTime;
        let newBlackTime = state.blackTime;
        if (state.clockActive) {
          if (move.color === 'w') {
            newWhiteTime += state.timeControl.incrementSeconds;
          } else {
            newBlackTime += state.timeControl.incrementSeconds;
          }
        } else {
          // Start clock on first move
          startClockLoop();
        }

        const moveRecord: MoveRecord = {
          from: move.from,
          to: move.to,
          piece: move.piece as PieceType,
          color: move.color as PieceColor,
          captured: move.captured as PieceType | undefined,
          promotion: move.promotion,
          san: move.san,
          fen: state.chess.fen(),
          timestamp: Date.now()
        };

        const newHistory = [...state.history, moveRecord];
        const isCheck = state.chess.inCheck();
        const isCheckmate = state.chess.isCheckmate();
        const isDraw = state.chess.isDraw();

        let winner: PieceColor | 'draw' | null = null;
        let winReason = '';
        let drawReason = '';

        if (isCheckmate) {
          winner = move.color;
          winReason = 'by Checkmate';
          StorageService.updateStatsAfterGame(winner === state.playerColor ? 'win' : 'loss');
          get().showToast(`Checkmate! ${winner === 'w' ? 'White' : 'Black'} wins!`, 'success');
        } else if (isDraw) {
          winner = 'draw';
          if (state.chess.isStalemate()) drawReason = 'Stalemate';
          else if (state.chess.isThreefoldRepetition()) drawReason = 'Threefold Repetition';
          else if (state.chess.isInsufficientMaterial()) drawReason = 'Insufficient Material';
          else drawReason = '50-Move Rule';
          winReason = drawReason;
          StorageService.updateStatsAfterGame('draw');
          get().showToast(`Game drawn by ${drawReason}`, 'info');
        } else if (isCheck) {
          get().showToast('Check!', 'danger');
        }

        set({
          fen: state.chess.fen(),
          history: newHistory,
          turn: state.chess.turn() as PieceColor,
          isCheck,
          isCheckmate,
          isDraw,
          drawReason,
          isGameOver: isCheckmate || isDraw,
          winner,
          winReason,
          selectedSquare: null,
          legalMoves: [],
          lastMove: { from, to },
          capturedWhite,
          capturedBlack,
          whiteTime: newWhiteTime,
          blackTime: newBlackTime,
          clockActive: !(isCheckmate || isDraw),
          promotionPending: null
        });

        // In 2-player pass & play, rotate board if auto-flip is enabled
        if (state.gameMode === 'local_2p' && state.autoFlipBoard && !isCheckmate && !isDraw) {
          const nextTurn = state.chess.turn() as PieceColor;
          get().setBoardOrientation(nextTurn);
        }

        return true;
      } catch (err) {
        return false;
      }
    },

    completePromotion: (promo) => {
      const pending = get().promotionPending;
      if (!pending) return;
      get().makeMove(pending.from, pending.to, promo);
    },

    cancelPromotion: () => {
      set({ promotionPending: null, selectedSquare: null, legalMoves: [] });
    },

    undoMove: () => {
      const state = get();
      if (state.history.length === 0) return;

      state.chess.undo();

      const updatedHistory = state.history.slice(0, state.history.length - 1);
      const last = updatedHistory[updatedHistory.length - 1];

      set({
        fen: state.chess.fen(),
        history: updatedHistory,
        turn: state.chess.turn() as PieceColor,
        isCheck: state.chess.inCheck(),
        isCheckmate: false,
        isDraw: false,
        isGameOver: false,
        winner: null,
        winReason: '',
        selectedSquare: null,
        legalMoves: [],
        lastMove: last ? { from: last.from, to: last.to } : null,
        viewingMoveIndex: -1
      });

      soundService.playClick();
      get().showToast('Move undone', 'info');
    },

    resetGame: (customTimeControl) => {
      if (clockTimer) clearInterval(clockTimer);
      const newChess = new Chess();
      const tc = customTimeControl || get().timeControl;
      const initialSeconds = tc.initialMinutes * 60;

      set({
        chess: newChess,
        fen: newChess.fen(),
        history: [],
        turn: 'w',
        isCheck: false,
        isCheckmate: false,
        isDraw: false,
        drawReason: '',
        isGameOver: false,
        winner: null,
        winReason: '',
        selectedSquare: null,
        legalMoves: [],
        lastMove: null,
        capturedWhite: [],
        capturedBlack: [],
        whiteTime: initialSeconds,
        blackTime: initialSeconds,
        clockActive: false,
        promotionPending: null,
        viewingMoveIndex: -1
      });

      soundService.playGameStart();
      get().showToast('New game started', 'info');
    },

    setTwoPlayerSetupOpen: (isTwoPlayerSetupOpen) => {
      set({ isTwoPlayerSetupOpen });
    },

    setAutoFlipBoard: (autoFlipBoard) => {
      set({ autoFlipBoard });
    },

    setPlayers: (players) => {
      set({ players });
    },

    startTwoPlayerGame: ({ whiteName, blackName, timeControl, autoFlipBoard = false }) => {
      const tc = timeControl || get().timeControl;
      const cleanWhite = whiteName?.trim() || 'Player 1';
      const cleanBlack = blackName?.trim() || 'Player 2';

      set({
        gameMode: 'local_2p',
        players: {
          white: cleanWhite,
          black: cleanBlack
        },
        playerColor: 'w',
        boardOrientation: 'w',
        cameraPreset: 'player_w',
        autoFlipBoard,
        timeControl: tc,
        isTwoPlayerSetupOpen: false
      });

      get().resetGame(tc);
      get().showToast(`Match started: ${cleanWhite} (White) vs ${cleanBlack} (Black)`, 'success');
    },

    setGameMode: (gameMode) => {
      if (gameMode === 'local_2p') {
        const currentPlayers = get().players;
        set({
          gameMode,
          players: {
            white: currentPlayers.white === 'Player' || currentPlayers.white === 'You' ? 'Player 1' : currentPlayers.white,
            black: currentPlayers.black === 'DeepAI' ? 'Player 2' : currentPlayers.black
          }
        });
      } else {
        set({ gameMode });
      }
      get().resetGame();
    },

    setBoardOrientation: (boardOrientation) => {
      set({
        boardOrientation,
        cameraPreset: boardOrientation === 'w' ? 'player_w' : 'player_b'
      });
    },

    toggleOrientation: () => {
      const current = get().boardOrientation;
      const next = current === 'w' ? 'b' : 'w';
      get().setBoardOrientation(next);
      soundService.playClick();
    },

    setCameraPreset: (cameraPreset) => {
      set({ cameraPreset });
      soundService.playClick();
    },

    setTimeControl: (tc) => {
      set({ timeControl: tc });
      get().resetGame(tc);
    },

    setPlayerColor: (playerColor) => {
      set({ playerColor });
      get().setBoardOrientation(playerColor);
      get().resetGame();
    },

    resign: (color) => {
      const state = get();
      const resigningColor = color || (state.gameMode === 'local_2p' ? state.turn : state.playerColor);
      const winnerColor = resigningColor === 'w' ? 'b' : 'w';
      const resigningName = resigningColor === 'w' ? state.players.white : state.players.black;
      const winnerName = winnerColor === 'w' ? state.players.white : state.players.black;

      set({
        isGameOver: true,
        winner: winnerColor,
        winReason: `${resigningName} (${resigningColor === 'w' ? 'White' : 'Black'}) resigned. ${winnerName} wins!`,
        clockActive: false
      });

      StorageService.updateStatsAfterGame(winnerColor === get().playerColor ? 'win' : 'loss');
      soundService.playCheckmate();
      get().showToast(`${resigningName} resigned`, 'warning');
    },

    offerDraw: () => {
      const state = get();
      if (state.isGameOver) return;

      set({
        isGameOver: true,
        isDraw: true,
        winner: 'draw',
        drawReason: 'Draw by mutual agreement',
        winReason: `Draw agreed between ${state.players.white} and ${state.players.black}`,
        clockActive: false
      });
      StorageService.updateStatsAfterGame('draw');
      soundService.playMove();
      get().showToast('Game drawn by mutual agreement', 'info');
    },

    jumpToMove: (index) => {
      const state = get();
      if (index === -1 || index >= state.history.length) {
        set({ viewingMoveIndex: -1 });
        return;
      }
      set({ viewingMoveIndex: index });
      soundService.playClick();
    },

    loadCustomFen: (fen) => {
      try {
        const customChess = new Chess(fen);
        set({
          chess: customChess,
          fen: customChess.fen(),
          history: [],
          turn: customChess.turn() as PieceColor,
          isCheck: customChess.inCheck(),
          isCheckmate: customChess.isCheckmate(),
          isDraw: customChess.isDraw(),
          isGameOver: customChess.isGameOver(),
          winner: customChess.isCheckmate() ? (customChess.turn() === 'w' ? 'b' : 'w') : null,
          lastMove: null,
          selectedSquare: null,
          legalMoves: [],
          viewingMoveIndex: -1
        });
      } catch (e) {
        console.error('Invalid FEN loaded:', e);
      }
    },

    tickClock: () => {
      const state = get();
      if (!state.clockActive || state.isGameOver) return;

      if (state.turn === 'w') {
        const remaining = state.whiteTime - 1;
        if (remaining <= 0) {
          set({
            whiteTime: 0,
            isGameOver: true,
            winner: 'b',
            winReason: `${state.players.white} (White) ran out of time`,
            clockActive: false
          });
          soundService.playCheckmate();
          StorageService.updateStatsAfterGame(state.playerColor === 'b' ? 'win' : 'loss');
        } else {
          set({ whiteTime: remaining });
          if (remaining === 10) soundService.playClockWarning();
        }
      } else {
        const remaining = state.blackTime - 1;
        if (remaining <= 0) {
          set({
            blackTime: 0,
            isGameOver: true,
            winner: 'w',
            winReason: `${state.players.black} (Black) ran out of time`,
            clockActive: false
          });
          soundService.playCheckmate();
          StorageService.updateStatsAfterGame(state.playerColor === 'w' ? 'win' : 'loss');
        } else {
          set({ blackTime: remaining });
          if (remaining === 10) soundService.playClockWarning();
        }
      }
    }
  };
});
