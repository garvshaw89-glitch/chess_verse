import React, { useState, useEffect } from 'react';
import { useGameStore, TIME_CONTROL_PRESETS } from '../../store/gameStore';
import { 
  Users, 
  ArrowLeftRight, 
  Shuffle, 
  Play, 
  Clock, 
  RotateCw, 
  X, 
  Crown, 
  Swords, 
  Check 
} from 'lucide-react';
import { PieceColor, TimeControlPreset } from '../../types/chess';
import { Modal3D } from '../transitions/Modal3D';
import { Button3D } from './Button3D';

interface TwoPlayerSetupModalProps {
  onStartPlaying?: () => void;
}

export const TwoPlayerSetupModal: React.FC<TwoPlayerSetupModalProps> = ({ onStartPlaying }) => {
  const { 
    isTwoPlayerSetupOpen, 
    setTwoPlayerSetupOpen, 
    startTwoPlayerGame, 
    players, 
    timeControl: initialTimeControl,
    autoFlipBoard: initialAutoFlip
  } = useGameStore();

  const [player1Name, setPlayer1Name] = useState('Player 1');
  const [player2Name, setPlayer2Name] = useState('Player 2');
  // Which color player 1 selected: 'w' or 'b'
  const [player1Color, setPlayer1Color] = useState<PieceColor>('w');
  const [selectedTimeControl, setSelectedTimeControl] = useState<TimeControlPreset>(
    TIME_CONTROL_PRESETS.find(tc => tc.id === '10+0') || TIME_CONTROL_PRESETS[6]
  );
  const [autoFlip, setAutoFlip] = useState(false);

  // Sync state when modal opens
  useEffect(() => {
    if (isTwoPlayerSetupOpen) {
      if (players.white && players.white !== 'Player' && players.white !== 'You') {
        setPlayer1Name(players.white);
      }
      if (players.black && players.black !== 'DeepAI') {
        setPlayer2Name(players.black);
      }
      setPlayer1Color('w');
      setSelectedTimeControl(initialTimeControl || TIME_CONTROL_PRESETS[6]);
      setAutoFlip(initialAutoFlip);
    }
  }, [isTwoPlayerSetupOpen]);

  if (!isTwoPlayerSetupOpen) return null;

  const player2Color: PieceColor = player1Color === 'w' ? 'b' : 'w';
  const whitePlayerName = player1Color === 'w' ? player1Name : player2Name;
  const blackPlayerName = player1Color === 'w' ? player2Name : player1Name;

  const handleSwapColors = () => {
    setPlayer1Color(prev => (prev === 'w' ? 'b' : 'w'));
  };

  const handleRandomizeColors = () => {
    const randomColor: PieceColor = Math.random() < 0.5 ? 'w' : 'b';
    setPlayer1Color(randomColor);
  };

  const handleStart = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanP1 = player1Name.trim() || 'Player 1';
    const cleanP2 = player2Name.trim() || 'Player 2';
    
    const finalWhite = player1Color === 'w' ? cleanP1 : cleanP2;
    const finalBlack = player1Color === 'w' ? cleanP2 : cleanP1;

    startTwoPlayerGame({
      whiteName: finalWhite,
      blackName: finalBlack,
      timeControl: selectedTimeControl,
      autoFlipBoard: autoFlip
    });

    if (onStartPlaying) {
      onStartPlaying();
    }
  };

  return (
    <Modal3D 
      isOpen={isTwoPlayerSetupOpen} 
      onClose={() => setTwoPlayerSetupOpen(false)} 
      maxWidth="max-w-xl"
    >
      <div 
        className="relative w-full p-5 sm:p-7 text-neutral-100"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Gold Subtle Ambient Line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent rounded-full" />

        {/* Close button */}
        <button
          onClick={() => setTwoPlayerSetupOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors cursor-pointer"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-neutral-100 font-display flex items-center gap-2">
              Two-Player Match Setup
            </h2>
            <p className="text-xs text-neutral-400">
              Enter player names and select who controls the White and Black pieces.
            </p>
          </div>
        </div>

        <form onSubmit={handleStart} className="space-y-4">
          {/* Player Cards & Color Pickers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative">
            {/* Player 1 Card */}
            <div className={`p-3.5 rounded-xl border transition-all ${
              player1Color === 'w' 
                ? 'bg-neutral-800/80 border-amber-500/40 shadow-sm' 
                : 'bg-neutral-900/90 border-neutral-800'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Player 1
                </span>
                <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  player1Color === 'w'
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                    : 'bg-neutral-800 text-neutral-300 border border-neutral-700'
                }`}>
                  {player1Color === 'w' ? '⚪ WHITE' : '⚫ BLACK'}
                </span>
              </div>

              <input
                type="text"
                value={player1Name}
                onChange={(e) => setPlayer1Name(e.target.value)}
                placeholder="Enter Player 1 Name"
                maxLength={24}
                className="w-full px-3 py-2 rounded-lg bg-neutral-950/70 border border-neutral-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-neutral-100 text-sm font-medium outline-none transition-all placeholder:text-neutral-500"
              />

              {/* Color Chooser for Player 1 */}
              <div className="flex items-center gap-1.5 mt-2.5">
                <button
                  type="button"
                  onClick={() => setPlayer1Color('w')}
                  className={`flex-1 py-1.5 px-2 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    player1Color === 'w'
                      ? 'bg-neutral-100 text-neutral-950 font-bold shadow-md'
                      : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <span>⚪ White</span>
                  {player1Color === 'w' && <Check className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => setPlayer1Color('b')}
                  className={`flex-1 py-1.5 px-2 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    player1Color === 'b'
                      ? 'bg-neutral-950 text-neutral-100 font-bold border border-neutral-700 shadow-md'
                      : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <span>⚫ Black</span>
                  {player1Color === 'b' && <Check className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Swap & Randomize Quick Controls for Large Screens */}
            <div className="hidden sm:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex-col gap-1">
              <button
                type="button"
                onClick={handleSwapColors}
                title="Swap Colors"
                className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-amber-400 flex items-center justify-center shadow-lg transition-transform hover:rotate-180 cursor-pointer"
              >
                <ArrowLeftRight className="w-4 h-4" />
              </button>
            </div>

            {/* Player 2 Card */}
            <div className={`p-3.5 rounded-xl border transition-all ${
              player2Color === 'w' 
                ? 'bg-neutral-800/80 border-amber-500/40 shadow-sm' 
                : 'bg-neutral-900/90 border-neutral-800'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Player 2
                </span>
                <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  player2Color === 'w'
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                    : 'bg-neutral-800 text-neutral-300 border border-neutral-700'
                }`}>
                  {player2Color === 'w' ? '⚪ WHITE' : '⚫ BLACK'}
                </span>
              </div>

              <input
                type="text"
                value={player2Name}
                onChange={(e) => setPlayer2Name(e.target.value)}
                placeholder="Enter Player 2 Name"
                maxLength={24}
                className="w-full px-3 py-2 rounded-lg bg-neutral-950/70 border border-neutral-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-neutral-100 text-sm font-medium outline-none transition-all placeholder:text-neutral-500"
              />

              {/* Color Chooser for Player 2 */}
              <div className="flex items-center gap-1.5 mt-2.5">
                <button
                  type="button"
                  onClick={() => setPlayer1Color('b')}
                  className={`flex-1 py-1.5 px-2 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    player2Color === 'w'
                      ? 'bg-neutral-100 text-neutral-950 font-bold shadow-md'
                      : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <span>⚪ White</span>
                  {player2Color === 'w' && <Check className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => setPlayer1Color('w')}
                  className={`flex-1 py-1.5 px-2 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    player2Color === 'b'
                      ? 'bg-neutral-950 text-neutral-100 font-bold border border-neutral-700 shadow-md'
                      : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <span>⚫ Black</span>
                  {player2Color === 'b' && <Check className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Swap & Randomize Bar on Mobile */}
          <div className="flex items-center justify-center gap-2 sm:hidden pt-1">
            <button
              type="button"
              onClick={handleSwapColors}
              className="flex items-center gap-1 px-3 py-1 rounded-lg bg-neutral-800 text-xs text-neutral-300 hover:text-neutral-100"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-amber-400" />
              <span>Swap Colors</span>
            </button>
            <button
              type="button"
              onClick={handleRandomizeColors}
              className="flex items-center gap-1 px-3 py-1 rounded-lg bg-neutral-800 text-xs text-neutral-300 hover:text-neutral-100"
            >
              <Shuffle className="w-3.5 h-3.5 text-amber-400" />
              <span>Randomize</span>
            </button>
          </div>

          {/* Match Assignment Summary Banner */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-white ring-2 ring-neutral-700" />
              <span className="text-neutral-400">White:</span>
              <span className="font-bold text-neutral-100">
                {whitePlayerName || 'Player 1'}
              </span>
              <span className="text-[10px] text-amber-400 font-sans font-semibold ml-1">
                (Moves 1st)
              </span>
            </div>

            <div className="text-neutral-500 font-sans font-bold">vs</div>

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-800 ring-2 ring-neutral-600" />
              <span className="text-neutral-400">Black:</span>
              <span className="font-bold text-neutral-100">
                {blackPlayerName || 'Player 2'}
              </span>
            </div>
          </div>

          {/* Time Control Options */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-neutral-300 mb-2">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Match Clock</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: '10+0', label: '10 min Rapid', tc: TIME_CONTROL_PRESETS[6] },
                { id: '5+3', label: '5 | 3 Rapid', tc: TIME_CONTROL_PRESETS[5] },
                { id: '3+2', label: '3 | 2 Blitz', tc: TIME_CONTROL_PRESETS[3] },
                { id: '30+0', label: '30 min Casual', tc: TIME_CONTROL_PRESETS[8] },
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedTimeControl(item.tc)}
                  className={`py-2 px-2.5 rounded-lg border text-xs font-medium transition-all text-center cursor-pointer ${
                    selectedTimeControl.id === item.tc.id
                      ? 'bg-amber-500/15 border-amber-500 text-amber-300 font-bold'
                      : 'bg-neutral-800/60 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Auto-flip board toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-950/60 border border-neutral-800 text-xs">
            <div className="flex items-center gap-2.5">
              <RotateCw className="w-4 h-4 text-cyan-400" />
              <div>
                <div className="font-semibold text-neutral-200">Auto-rotate board on each move</div>
                <div className="text-[11px] text-neutral-400">
                  Flips the 3D board to match the active player's perspective
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setAutoFlip(!autoFlip)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                autoFlip ? 'bg-amber-500' : 'bg-neutral-800'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-neutral-950 transition-transform absolute top-1 ${
                  autoFlip ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Actions: Start Playing & Cancel */}
          <div className="flex items-center gap-3 pt-3">
            <Button3D
              type="button"
              variant="secondary"
              size="md"
              onClick={() => setTwoPlayerSetupOpen(false)}
              className="!px-4"
            >
              Cancel
            </Button3D>

            <Button3D
              type="submit"
              variant="primary"
              size="md"
              icon={<Swords className="w-4 h-4" />}
              className="flex-1"
            >
              START PLAYING
            </Button3D>
          </div>
        </form>
      </div>
    </Modal3D>
  );
};
