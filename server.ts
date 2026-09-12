import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const PUZZLES = [
  {
    id: "puz_1",
    title: "The Opera House Decoy",
    rating: 1450,
    theme: "Back-Rank Checkmate",
    fen: "rn3rk1/ppp2ppp/5q2/8/8/2B5/PPP2PPP/R2QR1K1 w - - 0 1",
    description: "White has a crushing tactical blow against the Black queen and king.",
    solution: ["Qd8", "Qxd8", "Re8"],
    firstMoveSan: "Qd8!",
    playerColor: "w"
  },
  {
    id: "puz_2",
    title: "Smothered Royalty",
    rating: 1680,
    theme: "Smothered Mate",
    fen: "6k1/5ppp/8/8/8/8/1Q4PP/4q1K1 w - - 0 1",
    description: "Defend against mate or find the winning counterpunch.",
    solution: ["Qb8", "Qe8", "Qxe8"],
    firstMoveSan: "Qb8+",
    playerColor: "w"
  },
  {
    id: "puz_3",
    title: "Knight's Fork in the Center",
    rating: 1320,
    theme: "Tactical Fork",
    fen: "r1bqk2r/pppp1ppp/2n5/4p3/1b2n3/2NP1N2/PPP1BPPP/R1BQK2R w KQkq - 0 6",
    description: "Unleash a double attack to recover material with initiative.",
    solution: ["dxe4", "Bxc3+", "bxc3"],
    firstMoveSan: "dxe4",
    playerColor: "w"
  },
  {
    id: "puz_4",
    title: "Rook Sacrifice on the Seventh",
    rating: 1850,
    theme: "King Hunt",
    fen: "2r3k1/5ppp/8/8/8/1R6/1P3PPP/6K1 w - - 0 1",
    description: "Convert a back-rank threat into an unstoppable victory.",
    solution: ["g3", "h6", "Rb8"],
    firstMoveSan: "h3",
    playerColor: "w"
  },
  {
    id: "puz_5",
    title: "Endgame Queen Deflection",
    rating: 1950,
    theme: "Deflection & Promotion",
    fen: "8/5p2/4p1p1/3pP1Pp/k2P1P1P/2K5/8/8 w - - 0 1",
    description: "Find the subtle zugzwang breakthrough to force pawn promotion.",
    solution: ["f5", "gxf5", "h5"],
    firstMoveSan: "f5",
    playerColor: "w"
  }
];

const OPENINGS = [
  {
    eco: "C50",
    name: "Italian Game (Giuoco Piano)",
    moves: ["e4", "e5", "Nf3", "Nc6", "Bc4", "Bc5"],
    description: "One of the oldest recorded openings, emphasizing rapid piece development, control of the center d4 square, and rapid castling.",
    strengths: ["Harmonious bishop development", "Direct pressure on vulnerable f7", "Solid king safety"]
  },
  {
    eco: "B90",
    name: "Sicilian Defense (Najdorf Variation)",
    moves: ["e4", "c5", "Nf3", "d6", "d4", "cxd4", "Nxd4", "Nf6", "Nc3", "a6"],
    description: "The weapon of champions like Fischer and Kasparov. Dynamic, asymmetrical counter-attacking struggle with rich tactical themes.",
    strengths: ["Aggressive queenside counterplay", "Unbalanced pawn structure", "High win rate for Black"]
  },
  {
    eco: "D37",
    name: "Queen's Gambit Declined",
    moves: ["d4", "d5", "c4", "e6", "Nc3", "Nf6", "Nf3", "Be7"],
    description: "The classical cornerstone of chess strategy. White fights for central dominance while Black builds an unshakeable fortress.",
    strengths: ["Ironclad central defense", "Deep strategic maneuvering", "Tested at World Championship level"]
  },
  {
    eco: "E60",
    name: "King's Indian Defense",
    moves: ["d4", "Nf6", "c4", "g6", "Nc3", "Bg7", "e4", "d6"],
    description: "A hypermodern masterpiece where Black allows White to build an imposing pawn center before launching a fierce kingside storm.",
    strengths: ["Violent kingside attacks", "Dynamic counter-strikes with ...e5 or ...c5", "High psychological pressure"]
  },
  {
    eco: "C65",
    name: "Ruy Lopez (Spanish Opening)",
    moves: ["e4", "e5", "Nf3", "Nc6", "Bb5"],
    description: "The quintessential classical opening. Puts immediate indirect pressure on the defender of the e5 pawn and dictates long-term strategy.",
    strengths: ["Enduring positional pressure", "Flexible pawn structures", "Rich middlegame plans"]
  }
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(express.static(path.join(process.cwd(), "public")));

  // API Endpoints
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: Date.now() });
  });

  app.get("/api/puzzles", (_req, res) => {
    res.json({ puzzles: PUZZLES });
  });

  app.get("/api/openings", (_req, res) => {
    res.json({ openings: OPENINGS });
  });

  // Vite middleware in dev, static files in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Chess Verse Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
