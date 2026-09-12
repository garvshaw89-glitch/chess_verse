import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { useLearnStore } from '../store/learnStore';
import { NavPage } from '../components/ui/Navbar';
import { 
  User, 
  Trophy, 
  Award, 
  ShieldCheck, 
  RotateCcw, 
  Calendar, 
  Zap, 
  Swords, 
  CheckCircle2, 
  Flame,
  ChevronRight,
  GraduationCap,
  Puzzle,
  Edit2,
  Check
} from 'lucide-react';
import { storage } from '../services/storage';
import { Button3D } from '../components/ui/Button3D';
import { StaggerContainer } from '../components/transitions/StaggerContainer';

interface ProfileViewProps {
  onNavigate: (page: NavPage) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onNavigate }) => {
  const { stats, showToast } = useGameStore();
  const { 
    completedLessonIds, 
    learningStreakDays, 
    getTotalProgress 
  } = useLearnStore();

  const [playerStats, setPlayerStats] = useState(() => storage.getStats());
  const [username, setUsername] = useState(() => storage.getStats().username || 'Grandmaster');
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(username);

  useEffect(() => {
    setPlayerStats(storage.getStats());
  }, []);

  const totalMatches = stats.wins + stats.losses + stats.draws;
  const winRate = totalMatches > 0 ? Math.round((stats.wins / totalMatches) * 100) : 0;
  const lessonsCompletedCount = completedLessonIds.length;
  const puzzlesSolvedCount = playerStats.puzzlesSolved || 0;
  const courseProgressPercent = getTotalProgress();

  const handleSaveName = () => {
    if (tempName.trim()) {
      const updated = { ...playerStats, username: tempName.trim() };
      storage.saveStats(updated);
      setUsername(tempName.trim());
      setIsEditingName(false);
      showToast('Profile name updated', 'success');
    }
  };

  const achievements = [
    { 
      id: 'first_win', 
      name: 'First Victory', 
      desc: 'Win your first chess game', 
      unlocked: stats.wins >= 1 
    },
    { 
      id: 'scholar', 
      name: 'Tactical Mind', 
      desc: 'Complete at least 5 lessons', 
      unlocked: lessonsCompletedCount >= 5 
    },
    { 
      id: 'puzzle_master', 
      name: 'Puzzle Solver', 
      desc: 'Solve tactical chess puzzles', 
      unlocked: puzzlesSolvedCount >= 1 
    },
    { 
      id: 'streak', 
      name: 'Hot Streak', 
      desc: 'Achieve a winning streak of 3', 
      unlocked: stats.winStreak >= 3 
    }
  ];

  return (
    <div className="w-full min-h-[calc(100vh-60px)] p-4 sm:p-8 bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 overflow-y-auto">
      <StaggerContainer staggerMs={60} baseDelayMs={40} className="max-w-5xl mx-auto space-y-6">
        
        {/* Profile Card Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800 shadow-xl backdrop-blur-md">
          {/* Avatar */}
          <div className="relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-4xl shadow-xl shadow-amber-500/20 text-neutral-950 font-serif font-black">
              ♔
            </div>
            <div className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-neutral-950 border border-amber-500 text-[10px] font-mono font-bold text-amber-400">
              LOCAL
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              {isEditingName ? (
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    maxLength={24}
                    className="px-3 py-1 bg-neutral-950 border border-amber-500/60 rounded-lg text-neutral-100 font-display text-lg focus:outline-none"
                    autoFocus
                  />
                  <Button3D
                    variant="primary"
                    size="sm"
                    onClick={handleSaveName}
                    icon={<Check className="w-3.5 h-3.5" />}
                  >
                    Save
                  </Button3D>
                </div>
              ) : (
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <h2 className="text-2xl font-bold text-neutral-100 font-display">
                    {username}
                  </h2>
                  <button
                    onClick={() => {
                      setTempName(username);
                      setIsEditingName(true);
                    }}
                    className="p-1 rounded-md text-neutral-400 hover:text-amber-400 transition-colors"
                    title="Edit username"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            <p className="text-xs text-neutral-400 mt-1">
              ChessVerse 3D Practitioner • Local Session Record
            </p>

            {/* Badges */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-4 font-mono text-xs">
              <div className="px-3 py-1 rounded-lg bg-neutral-950/80 border border-neutral-800 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-red-400" />
                <span className="text-neutral-400">Current Streak:</span>
                <span className="font-bold text-neutral-200">{stats.winStreak}</span>
              </div>
              <div className="px-3 py-1 rounded-lg bg-neutral-950/80 border border-neutral-800 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-neutral-400">Study Streak:</span>
                <span className="font-bold text-neutral-200">{learningStreakDays} {learningStreakDays === 1 ? 'day' : 'days'}</span>
              </div>
              <div className="px-3 py-1 rounded-lg bg-neutral-950/80 border border-neutral-800 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-neutral-400">Curriculum:</span>
                <span className="font-bold text-purple-300">{courseProgressPercent}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Complete Verified Statistics (Requirement 23) */}
        <div>
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 mb-3 px-1">
            Career Statistics (Locally Stored)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
            {/* 1. Games Played */}
            <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 text-center">
              <span className="text-[11px] uppercase tracking-wider text-neutral-400">Games Played</span>
              <div className="text-2xl sm:text-3xl font-bold text-neutral-100 mt-1">
                {totalMatches}
              </div>
            </div>

            {/* 2. Wins */}
            <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 text-center">
              <span className="text-[11px] uppercase tracking-wider text-neutral-400">Wins</span>
              <div className="text-2xl sm:text-3xl font-bold text-emerald-400 mt-1">
                {stats.wins}
              </div>
            </div>

            {/* 3. Losses */}
            <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 text-center">
              <span className="text-[11px] uppercase tracking-wider text-neutral-400">Losses</span>
              <div className="text-2xl sm:text-3xl font-bold text-red-400 mt-1">
                {stats.losses}
              </div>
            </div>

            {/* 4. Draws */}
            <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 text-center">
              <span className="text-[11px] uppercase tracking-wider text-neutral-400">Draws</span>
              <div className="text-2xl sm:text-3xl font-bold text-neutral-300 mt-1">
                {stats.draws}
              </div>
            </div>

            {/* 5. Lessons Completed */}
            <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 text-center">
              <span className="text-[11px] uppercase tracking-wider text-neutral-400">Lessons Completed</span>
              <div className="text-2xl sm:text-3xl font-bold text-purple-400 mt-1">
                {lessonsCompletedCount}
              </div>
            </div>

            {/* 6. Puzzles Solved */}
            <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 text-center">
              <span className="text-[11px] uppercase tracking-wider text-neutral-400">Puzzles Solved</span>
              <div className="text-2xl sm:text-3xl font-bold text-cyan-400 mt-1">
                {puzzlesSolvedCount}
              </div>
            </div>

            {/* 7. Learning Streak */}
            <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 text-center">
              <span className="text-[11px] uppercase tracking-wider text-neutral-400">Learning Streak</span>
              <div className="text-2xl sm:text-3xl font-bold text-amber-400 mt-1">
                {learningStreakDays}d
              </div>
            </div>

            {/* 8. Course Progress */}
            <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 text-center">
              <span className="text-[11px] uppercase tracking-wider text-neutral-400">Course Progress</span>
              <div className="text-2xl sm:text-3xl font-bold text-emerald-400 mt-1">
                {courseProgressPercent}%
              </div>
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-neutral-800">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-200 font-mono">
              Badges & Milestones
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className={`p-3.5 rounded-xl border flex items-start gap-3 transition-all ${
                  ach.unlocked
                    ? 'bg-amber-500/10 border-amber-500/40 text-neutral-200'
                    : 'bg-neutral-950/40 border-neutral-800/60 text-neutral-500 opacity-60'
                }`}
              >
                <div
                  className={`p-2 rounded-lg ${
                    ach.unlocked ? 'bg-amber-500/20 text-amber-400' : 'bg-neutral-800 text-neutral-600'
                  }`}
                >
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold">{ach.name}</h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5">{ach.desc}</p>
                  <span className="text-[10px] font-mono mt-1.5 block font-semibold">
                    {ach.unlocked ? '✓ UNLOCKED' : 'LOCKED'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="flex flex-col justify-between p-4 rounded-xl bg-neutral-900/80 border border-neutral-800">
            <div>
              <h4 className="text-sm font-bold text-neutral-100">Play a Match</h4>
              <p className="text-xs text-neutral-400 mt-1">Jump directly into a 3D match or local pass & play.</p>
            </div>
            <div className="mt-4">
              <Button3D
                variant="primary"
                size="sm"
                onClick={() => onNavigate('play')}
                icon={<ChevronRight className="w-3.5 h-3.5" />}
                className="w-full"
              >
                PLAY NOW
              </Button3D>
            </div>
          </div>

          <div className="flex flex-col justify-between p-4 rounded-xl bg-neutral-900/80 border border-neutral-800">
            <div>
              <h4 className="text-sm font-bold text-neutral-100">Study Curriculum</h4>
              <p className="text-xs text-neutral-400 mt-1">Learn openings, endgames, tactics, and master games.</p>
            </div>
            <div className="mt-4">
              <Button3D
                variant="purple"
                size="sm"
                onClick={() => onNavigate('learn')}
                icon={<GraduationCap className="w-3.5 h-3.5" />}
                className="w-full"
              >
                OPEN ACADEMY
              </Button3D>
            </div>
          </div>

          <div className="flex flex-col justify-between p-4 rounded-xl bg-neutral-900/80 border border-neutral-800">
            <div>
              <h4 className="text-sm font-bold text-neutral-100">Tactical Puzzles</h4>
              <p className="text-xs text-neutral-400 mt-1">Sharp tactical puzzles with hint and solve feedback.</p>
            </div>
            <div className="mt-4">
              <Button3D
                variant="emerald"
                size="sm"
                onClick={() => onNavigate('puzzles')}
                icon={<Puzzle className="w-3.5 h-3.5" />}
                className="w-full"
              >
                SOLVE PUZZLES
              </Button3D>
            </div>
          </div>
        </div>
      </StaggerContainer>
    </div>
  );
};
