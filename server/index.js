import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import errorHandler from "./middleware/errorHandler.js";
import teamRoutes from "./routes/teamRoutes.js";
import playerRoutes from "./routes/playerRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import seasonRoutes from "./routes/seasonRoutes.js";
import leagueRoutes from "./routes/leagueRoutes.js";
import teamSeasonRoutes from "./routes/teamSeasonRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/teams", teamRoutes);
app.use("/api/players", playerRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/seasons", seasonRoutes);
app.use("/api/team-seasons", teamSeasonRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`VolleyFlow server running on port ${PORT}`),
);
