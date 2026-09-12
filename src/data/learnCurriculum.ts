import { LevelDef, LessonDef, AchievementDef } from '../types/learn';

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: 'first_move',
    title: 'FIRST MOVE',
    description: 'Complete your first interactive chess lesson.',
    iconName: 'Footprints',
    badge: 'Initiate'
  },
  {
    id: 'piece_master',
    title: 'PIECE MASTER',
    description: 'Master how every piece moves and captures.',
    iconName: 'Crown',
    badge: 'Foundations'
  },
  {
    id: 'tactician',
    title: 'TACTICIAN',
    description: 'Solve 10 tactical chess puzzles and exercises.',
    iconName: 'Zap',
    badge: 'Combat'
  },
  {
    id: 'checkmate_expert',
    title: 'CHECKMATE',
    description: 'Complete the checkmate and royal king hunt lessons.',
    iconName: 'Sword',
    badge: 'Victory'
  },
  {
    id: 'endgame_expert',
    title: 'ENDGAME EXPERT',
    description: 'Master core endgames, king opposition, and pawn conversion.',
    iconName: 'ShieldCheck',
    badge: 'Technique'
  },
  {
    id: 'chess_scholar',
    title: 'CHESS SCHOLAR',
    description: 'Complete the complete four-level ChessVerse Master Course.',
    iconName: 'Award',
    badge: 'Grandmaster'
  }
];

// Helper to construct structured lessons cleanly
function makeLesson(
  id: string,
  levelId: any,
  order: number,
  title: string,
  subtitle: string,
  durationMinutes: number,
  teacherPiece: any,
  difficulty: any,
  concept: { summary: string; bullets: string[]; keyTakeaway: string },
  demo: {
    fen: string;
    cameraMode?: any;
    focusSquare?: string;
    highlightSquares?: string[];
    arrow?: { from: string; to: string; color?: string };
    demoMove?: { from: string; to: string; san: string };
    narration: string;
  },
  exercise: {
    prompt: string;
    fen: string;
    playerColor?: any;
    solutionMoves: string[];
    hint: string;
    successMessage: string;
    explanationAfterSolve: string;
  },
  quiz: {
    question: string;
    options: { id: string; text: string; isCorrect: boolean; explanation: string }[];
  }
): LessonDef {
  return {
    id,
    levelId,
    order,
    title,
    subtitle,
    durationMinutes,
    teacherPiece,
    difficulty,
    concept,
    demonstration: {
      fen: demo.fen,
      cameraMode: demo.cameraMode || 'tactical',
      focusSquare: demo.focusSquare,
      highlightSquares: demo.highlightSquares || [],
      arrow: demo.arrow,
      demoMove: demo.demoMove,
      narration: demo.narration
    },
    exercise: {
      prompt: exercise.prompt,
      fen: exercise.fen,
      playerColor: exercise.playerColor || 'w',
      solutionMoves: exercise.solutionMoves,
      hint: exercise.hint,
      successMessage: exercise.successMessage,
      explanationAfterSolve: exercise.explanationAfterSolve
    },
    quiz
  };
}

// -------------------------------------------------------------
// LEVEL 1: CHESS FOUNDATIONS (5 LESSONS)
// -------------------------------------------------------------
const FOUNDATIONS_LESSONS: LessonDef[] = [
  makeLesson(
    'f_1',
    'foundations',
    1,
    'What is Chess?',
    'Board layout, ranks, files, squares, and the battlefield',
    8,
    'k',
    'Beginner',
    {
      summary: 'Chess is a 1,500-year-old game of pure strategy played between two opponents on an 8x8 grid of 64 alternating light and dark squares.',
      bullets: [
        'The board consists of 64 squares: 32 light and 32 dark.',
        'Columns running vertically (A to H) are called FILES.',
        'Rows running horizontally (1 to 8) are called RANKS.',
        'White always sets up on ranks 1 & 2; Black sets up on ranks 7 & 8.',
        'The ultimate goal is CHECKMATE: trapping the enemy King so it cannot escape capture.'
      ],
      keyTakeaway: 'Remember the cardinal setup rule: "White on right" — the bottom-right corner square (h1 for White, a8 for Black) must always be a light square!'
    },
    {
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      cameraMode: 'overview',
      focusSquare: 'e4',
      highlightSquares: ['e4', 'd4', 'e5', 'd5'],
      arrow: { from: 'e2', to: 'e4', color: '#10b981' },
      narration: 'The 64 squares of the chessboard. Notice the central squares e4, d4, e5, and d5—they represent the vital high ground of the board.'
    },
    {
      prompt: 'Occupy the central square e4 with White’s King’s pawn to stake your first claim in the center.',
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      solutionMoves: ['e2e4'],
      hint: 'Move the pawn in front of your King (on e2) forward two squares to e4.',
      successMessage: 'Splendid! You have claimed the center square e4!',
      explanationAfterSolve: '1. e4 is the most popular opening move in history, claiming the center and liberating both your Queen and Light-squared Bishop.'
    },
    {
      question: 'Which of the following describes the bottom-right corner square of the board during setup?',
      options: [
        { id: 'q1_a', text: 'It must always be a light square ("White on the right")', isCorrect: true, explanation: 'Correct! A light square must always reside on the right-hand corner of each player.' },
        { id: 'q1_b', text: 'It must always be a dark square', isCorrect: false, explanation: 'Incorrect. If your bottom right square is dark, your board is rotated 90 degrees incorrectly.' },
        { id: 'q1_c', text: 'It does not matter which orientation is used', isCorrect: false, explanation: 'Incorrect. Proper board orientation is mandatory under official chess rules.' }
      ]
    }
  ),

  makeLesson(
    'f_2',
    'foundations',
    2,
    'The Chess Pieces',
    'King, Queen, Rook, Bishop, Knight, and Pawn',
    10,
    'q',
    'Beginner',
    {
      summary: 'Each army begins with 16 pieces: 1 King, 1 Queen, 2 Rooks, 2 Bishops, 2 Knights, and 8 Pawns.',
      bullets: [
        'King (♔): The leader. Invaluable; if checkmated, the game ends immediately.',
        'Queen (♕): The most powerful piece, commanding ranks, files, and diagonals.',
        'Rook (♖): The heavy artillery, moving in straight lines across ranks and files.',
        'Bishop (♗): The sniper, gliding along diagonals of its assigned color.',
        'Knight (♘): The jumper, leaping over obstacles in an unmistakable "L" shape.',
        'Pawn (♙): The foot soldier, marching forward and capturing diagonally.'
      ],
      keyTakeaway: 'The Queen always starts on her own color: White Queen on d1 (light square), Black Queen on d8 (dark square)!'
    },
    {
      fen: '8/8/8/4Q3/8/8/8/8 w - - 0 1',
      cameraMode: 'piece',
      focusSquare: 'e5',
      highlightSquares: ['e1', 'e2', 'e3', 'e4', 'e6', 'e7', 'e8', 'a5', 'b5', 'c5', 'd5', 'f5', 'g5', 'h5', 'b2', 'c3', 'd4', 'f6', 'g7', 'h8', 'a1', 'h2', 'g3', 'f4', 'd6', 'c7', 'b8'],
      arrow: { from: 'e5', to: 'e8', color: '#38bdf8' },
      narration: 'Look at the immense reach of the Queen from e5. She controls 27 squares simultaneously in all eight directions!'
    },
    {
      prompt: 'Activate the White Queen by moving her to the central outpost e5.',
      fen: '4k3/8/8/8/8/8/8/4Q2K w - - 0 1',
      solutionMoves: ['e1e5'],
      hint: 'Move the Queen on e1 straight forward along the e-file to e5.',
      successMessage: 'Exceptional! The Queen dominates the board from e5.',
      explanationAfterSolve: 'By placing the Queen in the center, you maximize her offensive and defensive coverage across diagonals, ranks, and files.'
    },
    {
      question: 'Which square does the White Queen begin on at the start of the game?',
      options: [
        { id: 'q2_a', text: 'd1 (her own color)', isCorrect: true, explanation: 'Correct! "Queen on her color": White Queen on the light d1 square.' },
        { id: 'q2_b', text: 'e1', isCorrect: false, explanation: 'Incorrect! The King begins on e1.' },
        { id: 'q2_c', text: 'c1', isCorrect: false, explanation: 'Incorrect! c1 is home to the Queenside Bishop.' }
      ]
    }
  ),

  makeLesson(
    'f_3',
    'foundations',
    3,
    'How Each Piece Moves',
    'Interactive mechanics: lines, diagonals, L-shapes, and pawn marches',
    12,
    'n',
    'Beginner',
    {
      summary: 'Every chess piece has an unmistakable movement signature. Understanding these geometries is the bedrock of all tactical vision.',
      bullets: [
        'Rook: Unlimited straight steps along ranks and files.',
        'Bishop: Unlimited diagonal steps, locked forever to light or dark squares.',
        'Queen: Combines the full powers of both the Rook and the Bishop.',
        'Knight: Moves 2 squares in one cardinal direction, then 1 square perpendicular (an L-shape). Only piece that leaps over other pieces!',
        'King: Moves exactly 1 square in any direction.',
        'Pawn: Marches 1 square forward (or 2 on its first move), captures 1 square diagonally forward.'
      ],
      keyTakeaway: 'Knights are the only pieces on the board capable of hopping over friendly or enemy pieces without obstruction!'
    },
    {
      fen: '8/8/8/4N3/8/8/8/8 w - - 0 1',
      cameraMode: 'focus',
      focusSquare: 'e5',
      highlightSquares: ['d7', 'f7', 'c6', 'g6', 'c4', 'g4', 'd3', 'f3'],
      arrow: { from: 'e5', to: 'f7', color: '#f59e0b' },
      narration: 'From e5, the Knight controls 8 separate squares in a perimeter circle. Notice how the destination square is always the opposite color of its current square!'
    },
    {
      prompt: 'Execute an L-shaped leap with the Knight from b1 to the natural developing square c3.',
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      solutionMoves: ['b1c3'],
      hint: 'Pick up the Knight on b1 and jump it over your pawns to c3.',
      successMessage: 'Brilliant jump! The Knight safely lands on c3.',
      explanationAfterSolve: 'Notice how the Knight leaped right over the pawn on b2. No other piece possesses this capability.'
    },
    {
      question: 'Which piece is strictly confined to squares of a single color throughout the entire game?',
      options: [
        { id: 'q3_a', text: 'Bishop', isCorrect: true, explanation: 'Correct! A Bishop starting on a light square can only ever visit light squares.' },
        { id: 'q3_b', text: 'Knight', isCorrect: false, explanation: 'Incorrect! The Knight alternates colors on every single move.' },
        { id: 'q3_c', text: 'Rook', isCorrect: false, explanation: 'Incorrect! Rooks can reach every square on the board.' }
      ]
    }
  ),

  makeLesson(
    'f_4',
    'foundations',
    4,
    'How to Set Up the Board',
    'Rooks in corners, Knights next door, Bishops flank the Royals',
    10,
    'r',
    'Beginner',
    {
      summary: 'Setting up the board accurately ensures all opening principles apply correctly. Every piece has a designated historical square.',
      bullets: [
        'Rooks occupy the outer corners (a1/h1 for White; a8/h8 for Black).',
        'Knights sit immediately next to the Rooks (b1/g1 and b8/g8).',
        'Bishops flank the Royals (c1/f1 and c8/f8).',
        'Queen stands on her own color (d1 for White; d8 for Black).',
        'King stands next to his Queen (e1 for White; e8 for Black).',
        'All 8 pawns form an unbroken protective frontline across the 2nd and 7th ranks.'
      ],
      keyTakeaway: 'Rooks in corners, Knights like horses, Bishops by royalty, Queen on her color, King by her side!'
    },
    {
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      cameraMode: 'overview',
      focusSquare: 'e1',
      highlightSquares: ['a1', 'h1', 'b1', 'g1', 'c1', 'f1', 'd1', 'e1'],
      narration: 'Observe the symmetric battlefield. Both players mirror one another across the 8 ranks.'
    },
    {
      prompt: 'Develop White’s kingside Bishop from its home square f1 to the active post c4.',
      fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
      solutionMoves: ['f1c4'],
      hint: 'Move the light-squared Bishop along its open diagonal from f1 to c4.',
      successMessage: 'Superb! The Bishop lasers into the Black position.',
      explanationAfterSolve: 'By moving to c4, your Bishop directly eyes Black’s vulnerable f7 square, the only square defended solely by Black’s King.'
    },
    {
      question: 'Where do the two Kings stand in the starting setup?',
      options: [
        { id: 'q4_a', text: 'White King on e1, Black King on e8', isCorrect: true, explanation: 'Correct! The kings face each other across the central e-file.' },
        { id: 'q4_b', text: 'White King on d1, Black King on d8', isCorrect: false, explanation: 'Incorrect! The d-file belongs to the Queens.' },
        { id: 'q4_c', text: 'White King on f1, Black King on f8', isCorrect: false, explanation: 'Incorrect! The f-file belongs to the Kingside Bishops.' }
      ]
    }
  ),

  makeLesson(
    'f_5',
    'foundations',
    5,
    'Your First Chess Move',
    'Taking the initiative: center strikes and opening gambits',
    8,
    'p',
    'Beginner',
    {
      summary: 'Every grandmaster game begins with a single move. In chess, White always moves first, holding the initiative.',
      bullets: [
        'White always plays first, followed by Black.',
        'The best first moves place a pawn directly into the center (1. e4 or 1. d4).',
        'Moving central pawns immediately opens expressways for your Bishop and Queen.',
        'Avoid moving flank pawns (like a3 or h3) on your very first turn.'
      ],
      keyTakeaway: 'Strike the center, free your minor pieces, and never waste opening moves on edge pawns!'
    },
    {
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      cameraMode: 'tactical',
      focusSquare: 'd4',
      highlightSquares: ['d4'],
      arrow: { from: 'd2', to: 'd4', color: '#10b981' },
      narration: '1. d4 is known as the Queen’s Pawn opening. It firmly plants a pawn on d4, safeguarded by the Queen on d1.'
    },
    {
      prompt: 'Play 1. d4 to command the center and open the diagonal for White’s dark-squared bishop.',
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      solutionMoves: ['d2d4'],
      hint: 'Push the pawn directly in front of the White Queen (d2) two squares forward to d4.',
      successMessage: 'Magnificent! You have officially initiated your chess journey with 1. d4!',
      explanationAfterSolve: 'With 1. d4, your pawn establishes a fortified base in the center, supported by the Queen, and clears the c1-h6 diagonal.'
    },
    {
      question: 'Who always makes the opening move in a standard game of chess?',
      options: [
        { id: 'q5_a', text: 'White', isCorrect: true, explanation: 'Correct! White always moves first in chess, holding the initial initiative.' },
        { id: 'q5_b', text: 'Black', isCorrect: false, explanation: 'Incorrect! Black always responds to White’s first move.' },
        { id: 'q5_c', text: 'Decided by a coin flip on each turn', isCorrect: false, explanation: 'Incorrect! By convention and official rules, White always plays first.' }
      ]
    }
  )
];

// -------------------------------------------------------------
// LEVEL 2: BEGINNER CHESS (20 LESSONS)
// -------------------------------------------------------------
const BEGINNER_LESSON_TITLES = [
  { title: 'Capturing Pieces', sub: 'Removing enemy forces and claiming material', piece: 'p', fen: '4k3/8/8/3p4/4P3/8/8/4K3 w - - 0 1', move: 'e4d5', prompt: 'Capture the black pawn on d5 using your pawn on e4.', hint: 'Pawns capture diagonally forward one square.', desc: 'When capturing in chess, your piece physically replaces the captured piece on its square.' },
  { title: 'Check', sub: 'The royal warning: escaping immediate assault', piece: 'k', fen: '4k3/8/8/8/8/8/4R3/4K3 b - - 0 1', move: 'e8f7', prompt: 'Your king on e8 is in check from White’s rook. Step into safety on f7.', hint: 'Move the King one square away from the rook’s attack line.', desc: 'When your King is under attack, you are in CHECK. You must escape check immediately by moving, blocking, or capturing!' },
  { title: 'Checkmate', sub: 'The ultimate victory: inescapable royal capture', piece: 'q', fen: '6k1/5ppp/8/8/8/8/8/4Q1K1 w - - 0 1', move: 'e1e8', prompt: 'Deliver back-rank checkmate by moving your Queen to e8.', hint: 'Slide the Queen straight up the open e-file to the 8th rank.', desc: 'Checkmate occurs when the King is in check and has no legal moves, no blocking piece, and cannot capture the attacker.' },
  { title: 'Stalemate', sub: 'The tragic draw: no legal moves and not in check', piece: 'k', fen: 'k7/8/1K6/8/8/8/8/8 w - - 0 1', move: 'b6c7', prompt: 'White has a lone King. Move your King to a position with legal moves available.', hint: 'Avoid trapping the Black king on a8 without checking it.', desc: 'Stalemate happens when the player whose turn it is has no legal moves and is NOT in check. The result is an immediate draw (tie)!' },
  { title: 'Castling', sub: 'King safety and rook activation in a single turn', piece: 'r', fen: 'rnbqk2r/pppp1ppp/5n2/2b1p3/4P3/5N2/PPPPBPPP/RNBQK2R w KQkq - 4 4', move: 'e1g1', prompt: 'Perform Kingside castling (O-O) by moving the King two squares to g1.', hint: 'Click the King on e1, then click g1. The rook will automatically leap over to f1.', desc: 'Castling is the only move where two pieces move in the same turn, tucking the King into safety behind pawns while activating the Rook.' },
  { title: 'En Passant', sub: 'The special French pawn capture in passing', piece: 'p', fen: '4k3/8/8/3Pp3/8/8/8/4K3 w - e6 0 1', move: 'd5e6', prompt: 'Execute the en passant capture! Capture Black’s e5 pawn by landing on e6.', hint: 'Move your d5 pawn diagonally to e6 as if Black only moved one square.', desc: 'En Passant ("in passing") allows a pawn on the 5th rank to capture an enemy pawn that jumped 2 squares on its immediate previous move.' },
  { title: 'Pawn Promotion', sub: 'A foot soldier crowns into an all-powerful Queen', piece: 'q', fen: '4k3/4P3/8/8/8/8/8/4K3 w - - 0 1', move: 'e7e8q', prompt: 'Push the pawn to e8 and promote it to a Queen!', hint: 'Advance the pawn to the final rank (e8) and select Queen.', desc: 'When a humble pawn reaches the 8th rank, it transforms immediately into any chosen piece (usually a Queen).' },
  { title: 'Basic Chess Notation', sub: 'Reading and writing moves like a grandmaster', piece: 'n', fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', move: 'g1f3', prompt: 'Play the standard opening move Nf3 (Knight to f3).', hint: 'Move your kingside knight from g1 to f3.', desc: 'Chess notation uses capital letters for pieces (N=Knight, B=Bishop, R=Rook, Q=Queen, K=King) followed by the destination square.' },
  { title: 'Material Value', sub: 'Pawn=1, Knight=3, Bishop=3, Rook=5, Queen=9', piece: 'r', fen: '4k3/8/8/3r4/8/8/8/3R2K1 w - - 0 1', move: 'd1d5', prompt: 'Capture the undefended Black Rook on d5 with White’s Rook.', hint: 'Take the rook on d5 to gain 5 points of material advantage.', desc: 'Trading pieces wisely is crucial: Pawns are 1 pt, Minor pieces (B/N) 3 pts, Rooks 5 pts, and Queens 9 pts.' },
  { title: 'Developing Pieces', sub: 'Bring minor pieces into the battle swiftly', piece: 'b', fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPPBPPP/RNBQK1NR w KQkq - 0 2', move: 'g1f3', prompt: 'Develop the kingside Knight to f3 to attack e5 and prepare castling.', hint: 'Move the knight from g1 to f3.', desc: 'Development means bringing your Knights and Bishops out from the back rank into active squares early in the game.' },
  { title: 'Controlling the Center', sub: 'Why central dominance dictates victory', piece: 'p', fen: 'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2', move: 'e4d5', prompt: 'Strike at Black’s central pawn by capturing exd5.', hint: 'Take the pawn on d5 with your e4 pawn.', desc: 'Pieces placed near the 4 center squares (e4, d4, e5, d5) exert far more tactical radiation than pieces on the sidelines.' },
  { title: 'King Safety', sub: 'Sheltering the monarch behind a fortified shield', piece: 'k', fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 1 5', move: 'e1g1', prompt: 'Tuck the White King away into safe harbor by castling kingside.', hint: 'Click the King on e1 and move it to g1.', desc: 'An uncastled King stuck in the open center is a prime target for crushing sacrifices and pin tactics.' },
  { title: 'Opening Principles', sub: 'The golden triad: Center, Development, Safety', piece: 'b', fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3', move: 'f1c4', prompt: 'Follow the opening principles: develop the bishop to c4 targeting f7.', hint: 'Move the light-squared bishop from f1 to c4.', desc: 'Never move the same piece twice early, avoid early Queen raids, and prioritize king safety before launching attacks.' },
  { title: 'Basic Tactics', sub: 'Short, sharp calculating combinations', piece: 'n', fen: 'r1bqkb1r/pppp1ppp/2n5/4p3/2B1n3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 4', move: 'd2d3', prompt: 'Dislodge Black’s advanced knight by playing d2-d3.', hint: 'Push your d-pawn forward one square to d3.', desc: 'Tactics are calculated sequences of forcing moves that win material, create checkmate, or secure a decisive advantage.' },
  { title: 'Forks', sub: 'One piece attacking two enemy targets simultaneously', piece: 'n', fen: '4k3/4r3/8/3N4/8/8/8/4K3 w - - 0 1', move: 'd5e7', prompt: 'Execute a lethal knight fork! Capture the Rook on e7.', hint: 'Capture the rook on e7 with your knight.', desc: 'A fork attacks two or more enemy pieces at once. Knights and Pawns make the most devastating forkers!' },
  { title: 'Pins', sub: 'Paralyzing a piece against a higher-value target', piece: 'b', fen: '4k3/8/4r3/8/8/8/8/3B1K2 w - - 0 1', move: 'd1b3', prompt: 'Pin Black’s rook to its King along the diagonal with Bb3!', hint: 'Move the Bishop from d1 to b3.', desc: 'An absolute pin freezes a piece because moving it would expose the King to illegal check.' },
  { title: 'Skewers', sub: 'Attacking a valuable piece to win the target behind it', piece: 'b', fen: '8/8/8/8/4k3/8/2B5/4K2r w - - 0 1', move: 'c2e4', prompt: 'Your bishop is attacked by the rook on h1. Deliver check on e4, skewering the king and rook.', hint: 'Step onto e4 with the bishop.', desc: 'A skewer is the inverse of a pin: the more valuable piece is in front and forced to move, exposing the piece behind it.' },
  { title: 'Discovered Attacks', sub: 'Unleashing an ambush by moving an intervening piece', piece: 'b', fen: '4k3/8/8/8/4B3/8/8/3R2K1 w - - 0 1', move: 'e4h7', prompt: 'Move your bishop to h7 to uncover a devastating discovered check from the d1 Rook!', hint: 'Step the bishop off the d-file to h7.', desc: 'A discovered attack occurs when moving one piece unmasks a line of attack for another piece behind it.' },
  { title: 'Double Attacks', sub: 'Creating two inescapable threats in one move', piece: 'q', fen: '4k3/8/8/8/8/8/1Q6/4K2r w - - 0 1', move: 'b2e5', prompt: 'Deliver a double attack! Play Qe5+ checking the King while eyeing the rook on h1.', hint: 'Move Queen to e5.', desc: 'Double attacks overload the defender because they can typically only respond to one threat at a time.' },
  { title: 'Basic Endgames', sub: 'King and Queen vs lone King checkmate technique', piece: 'q', fen: '8/8/8/8/8/3k4/1Q6/4K3 w - - 0 1', move: 'b2d2', prompt: 'Trap the black king into a smaller box by playing Qd2+.', hint: 'Move the Queen to d2 to cut off the king’s ranks and files.', desc: 'In endgames with heavy pieces, your King must become an active fighting piece to escort checks and secure checkmate.' }
];

const BEGINNER_LESSONS: LessonDef[] = BEGINNER_LESSON_TITLES.map((item, idx) =>
  makeLesson(
    `b_${idx + 1}`,
    'beginner',
    idx + 1,
    item.title,
    item.sub,
    10,
    item.piece,
    'Beginner',
    {
      summary: item.desc,
      bullets: [
        'Fundamental chess technique essential for club-level play.',
        'Always verify piece safety before making your move.',
        'Calculated forcing moves limit your opponent’s options.'
      ],
      keyTakeaway: 'Mastering these 20 foundational skills separates deliberate chess thinkers from random piece-pushers!'
    },
    {
      fen: item.fen,
      cameraMode: 'tactical',
      narration: item.desc
    },
    {
      prompt: item.prompt,
      fen: item.fen,
      solutionMoves: [item.move],
      hint: item.hint,
      successMessage: 'Well done! Exact tactical execution.',
      explanationAfterSolve: item.desc
    },
    {
      question: `What is the key tactical concept behind ${item.title}?`,
      options: [
        { id: 'q_b_1', text: item.desc.slice(0, 75) + '...', isCorrect: true, explanation: 'Exactly right! Keep this pattern etched into your memory.' },
        { id: 'q_b_2', text: 'Moving pawns backwards to safety', isCorrect: false, explanation: 'Incorrect! Pawns can never move backwards in chess.' },
        { id: 'q_b_3', text: 'Sacrificing the King for positional gain', isCorrect: false, explanation: 'Incorrect! The King can never be sacrificed.' }
      ]
    }
  )
);

// -------------------------------------------------------------
// LEVEL 3: INTERMEDIATE CHESS (27 LESSONS)
// -------------------------------------------------------------
const INTERMEDIATE_LESSON_TITLES = [
  'Tactical Patterns', 'Advanced Forks', 'Advanced Pins', 'Skewers',
  'Removing the Defender', 'Deflection', 'Decoy', 'Zwischenzug',
  'Discovered Attack', 'Double Check', 'Clearance', 'Interference',
  'King Attacks', 'Pawn Structures', 'Open Files', 'Weak Squares',
  'Outposts', 'Piece Activity', 'Bishop Pair', 'Rook Endgames',
  'King and Pawn Endgames', 'Opposition', 'Zugzwang', 'Basic Opening Repertoire',
  'Middlegame Planning', 'Candidate Moves', 'Calculation Techniques'
];

const INTERMEDIATE_LESSONS: LessonDef[] = INTERMEDIATE_LESSON_TITLES.map((title, idx) =>
  makeLesson(
    `i_${idx + 1}`,
    'intermediate',
    idx + 1,
    title,
    `Mastering positional mastery and tactical sharpness in ${title.toLowerCase()}`,
    14,
    idx % 2 === 0 ? 'r' : 'b',
    'Intermediate',
    {
      summary: `${title} is a pivotal concept for advancing from intermediate to tournament-grade master play.`,
      bullets: [
        `Recognize ${title.toLowerCase()} configurations 2–3 moves ahead.`,
        'Identify vulnerable coordinating squares in your opponent’s camp.',
        'Calculate forcing candidate moves: Checks, Captures, and Threats.'
      ],
      keyTakeaway: `When you spot a potential ${title.toLowerCase()}, always look for candidate moves that force your opponent into compliance.`
    },
    {
      fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 1 5',
      cameraMode: 'tactical',
      narration: `Notice the strategic dynamics at play here. Precision in ${title.toLowerCase()} turns equal games into crushing victories.`
    },
    {
      prompt: `Execute the strategic master move in this ${title.toLowerCase()} position.`,
      fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
      solutionMoves: ['f3g5'],
      hint: 'Launch the Knight to g5, aiming laser sights directly at the weak f7 square.',
      successMessage: `Outstanding vision! You executed the ${title} key maneuver.`,
      explanationAfterSolve: `By playing Ng5, White pressurizes the f7 weakness with both Bishop and Knight, forcing defensive concessions.`
    },
    {
      question: `In tournament play, what is the primary goal of ${title}?`,
      options: [
        { id: 'q_i_1', text: `To convert strategic positional pressure into material or mating advantages`, isCorrect: true, explanation: `Correct! ${title} serves as a tactical weapon to break opponent resistance.` },
        { id: 'q_i_2', text: 'To avoid developing pieces until move 20', isCorrect: false, explanation: 'Incorrect! Development is always prioritized.' },
        { id: 'q_i_3', text: 'To deliver checkmate on move 1', isCorrect: false, explanation: 'Incorrect! Checkmate on move 1 is mathematically impossible in chess.' }
      ]
    }
  )
);

// -------------------------------------------------------------
// LEVEL 4: ADVANCED CHESS (30 LESSONS)
// -------------------------------------------------------------
const ADVANCED_LESSON_TITLES = [
  'Advanced Opening Principles', 'Opening Preparation', 'Opening Repertoire',
  'Strategic Planning', 'Prophylaxis', 'Positional Sacrifices',
  'Exchange Sacrifices', 'Pawn Breaks', 'Space Advantage',
  'Dynamic vs Static Advantages', 'Weaknesses', 'Strong Squares',
  'Good vs Bad Pieces', 'Restriction', 'Transformation of Advantages',
  'Advanced Calculation', 'Forcing Moves', 'Candidate Move Trees',
  'Tactical Vision', 'Complex Middlegames', 'Advanced Rook Endgames',
  'Queen Endgames', 'Minor Piece Endgames', 'Fortress',
  'Practical Endgames', 'Advanced Checkmate Patterns', 'Strategic Exchanges',
  'Positional Evaluation', 'Game Analysis', 'Master-Level Training'
];

const ADVANCED_LESSONS: LessonDef[] = ADVANCED_LESSON_TITLES.map((title, idx) =>
  makeLesson(
    `a_${idx + 1}`,
    'advanced',
    idx + 1,
    title,
    `Master-level comprehension: ${title.toLowerCase()}`,
    18,
    'q',
    'Advanced',
    {
      summary: `At the master level, ${title.toLowerCase()} separates Grandmasters from ordinary players through rigorous calculation and prophylaxis.`,
      bullets: [
        'Anticipate opponent counter-threats before launching your offensive.',
        'Evaluate imbalances: pawn majorities, piece activity, and king safety.',
        'Synthesize long-term strategic plans with razor-sharp tactical validation.'
      ],
      keyTakeaway: `Prophylactic thinking: ask yourself on every move what your opponent intends to do before executing your own agenda.`
    },
    {
      fen: 'r2q1rk1/ppp2ppp/2np1n2/4p3/2B1P1b1/3P1N2/PPP2PPP/RNBQR1K1 w - - 2 8',
      cameraMode: 'cinematic',
      narration: `Grandmaster study in ${title}. Notice the profound balance of tension across the central files.`
    },
    {
      prompt: `Find the deeply calculated master move to gain an enduring advantage in this ${title.toLowerCase()} scenario.`,
      fen: 'r2q1rk1/ppp2ppp/2np1n2/4p3/2B1P1b1/2NP1N2/PPP2PPP/R1BQR1K1 w - - 3 9',
      solutionMoves: ['c1g5'],
      hint: 'Pin Black’s f6 knight to the queen with Bg5 to weaken Black’s kingside pawn shield.',
      successMessage: `Exquisite master execution! The pin severely cripples Black’s defensive coordination.`,
      explanationAfterSolve: `Bg5 applies immense pressure. If Black plays h6, White can preserve the pin or induce structural weaknesses.`
    },
    {
      question: `What defines grandmaster mastery of ${title}?`,
      options: [
        { id: 'q_a_1', text: 'Harmonizing concrete calculation with intuitive long-term strategic evaluation', isCorrect: true, explanation: 'Masterfully stated! Top grandmasters combine computer-like calculation with positional intuition.' },
        { id: 'q_a_2', text: 'Moving random pawns as quickly as possible', isCorrect: false, explanation: 'Incorrect! Every move must carry deliberate purpose.' },
        { id: 'q_a_3', text: 'Ignoring opponent threats to chase single-move checkmates', isCorrect: false, explanation: 'Incorrect! Ignoring opponent resources leads directly to defeat.' }
      ]
    }
  )
);

// -------------------------------------------------------------
// COURSE LEVELS COLLECTION
// -------------------------------------------------------------
export const COURSE_LEVELS: LevelDef[] = [
  {
    id: 'foundations',
    numberPrefix: '01',
    title: 'CHESS FOUNDATIONS',
    tagline: 'From your very first move',
    description: 'Learn the board layout, the rules of every piece, how to set up the battlefield, and how to deliver your first checkmate.',
    pieceIcon: 'k',
    accentColor: '#38bdf8', // Cyan
    estimatedHours: '1.5 Hours',
    lessons: FOUNDATIONS_LESSONS
  },
  {
    id: 'beginner',
    numberPrefix: '02',
    title: 'BEGINNER CHESS',
    tagline: 'Captures, tactics & checkmates',
    description: 'Master castling, en passant, pawn promotion, tactical forks, pins, skewers, and essential basic endgame checkmates.',
    pieceIcon: 'n',
    accentColor: '#fbbf24', // Amber
    estimatedHours: '4.0 Hours',
    lessons: BEGINNER_LESSONS
  },
  {
    id: 'intermediate',
    numberPrefix: '03',
    title: 'INTERMEDIATE CHESS',
    tagline: 'Strategy, pawn structures & combinations',
    description: 'Deep dive into discovered attacks, deflection, decoys, outpost knights, open files, king opposition, and rook endgames.',
    pieceIcon: 'r',
    accentColor: '#a855f7', // Purple
    estimatedHours: '6.5 Hours',
    lessons: INTERMEDIATE_LESSONS
  },
  {
    id: 'advanced',
    numberPrefix: '04',
    title: 'ADVANCED CHESS',
    tagline: 'Grandmaster strategy & deep calculation',
    description: 'Prophylaxis, positional sacrifices, candidate move trees, complex middlegame plans, and master-level endgame fortresses.',
    pieceIcon: 'q',
    accentColor: '#f43f5e', // Rose
    estimatedHours: '8.0 Hours',
    lessons: ADVANCED_LESSONS
  }
];

export const ALL_LESSONS: LessonDef[] = [
  ...FOUNDATIONS_LESSONS,
  ...BEGINNER_LESSONS,
  ...INTERMEDIATE_LESSONS,
  ...ADVANCED_LESSONS
];

export function getLessonById(id: string): LessonDef | undefined {
  return ALL_LESSONS.find((l) => l.id === id);
}

export function getLevelById(id: string): LevelDef | undefined {
  return COURSE_LEVELS.find((lvl) => lvl.id === id);
}
