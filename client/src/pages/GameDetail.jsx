import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { getGameById, getPlayers, getStatsByGame } from "../services/api.js";
import Spinner from "../components/Spinner.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import { useCallback } from "react";
import GameStatusControl from "../components/GameStatusControl.jsx";
import SetScoreEditor from "../components/SetScoreEditor.jsx";
import StatsForm from "../components/StatsForm.jsx";

const GameDetail = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [stats, setStats] = useState([]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadStats = useCallback(async () => {
    const s = await getStatsByGame(id);
    setStats(s);
  }, [id]);

  useEffect(() => {
    const load = async () => {
      try {
        const [g, s] = await Promise.all([getGameById(id), getStatsByGame(id)]);

        const [homePlayers, awayPlayers] = await Promise.all([
          getPlayers(g.homeTeam._id),
          getPlayers(g.awayTeam._id),
        ]);
        setGame(g);
        setStats(s);

        const allPlayers = [
          ...homePlayers,
          ...awayPlayers.filter(
            (ap) => !homePlayers.some((hp) => hp._id === ap._id),
          ),
        ];
        setPlayers(allPlayers);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage message={error} />;

  const isLive = game.status === "in_progress";
  const isCompleted = game.status === "completed";
  const canEdit = !isCompleted;

  return (
    <main className="page">
      <Link to="/games">Back to Games</Link>

      <h1>
        {game.homeTeam?.name} <span className="vs">vs</span>{" "}
        {game.awayTeam?.name}
      </h1>
      <p>
        <strong>Date:</strong> {new Date(game.date).toLocaleDateString()}
      </p>
      {game.location && (
        <p>
          <strong>Location:</strong> {game.location}
        </p>
      )}
      <p>
        <strong>Status: </strong>{" "}
        <span className={`badge badge-${game.status}`}>
          {game.status.replace("_", " ")}
        </span>
      </p>

      <div className="score-banner">
        <div className="score-team">
          <span className="score-name">{game.homeTeam?.name}</span>
          <span className="score-num">{game.score?.home ?? 0}</span>
        </div>
        <span className="score-sep">-</span>
        <div score-team away>
          <span className="score-num">{game.score?.away ?? 0}</span>
          <span className="score-name">{game.awayTeam?.name}</span>
        </div>
      </div>

      {canEdit && (
        <GameStatusControl
          game={game}
          onUpdate={(updated) => setGame(updated)}
        />
      )}

      {canEdit && (
        <>
          <h2>Set Scores</h2>
          <SetScoreEditor
            game={game}
            onUpdate={(updated) => setGame(updated)}
          />
        </>
      )}

      {isCompleted && game.sets?.length > 0 && (
        <>
          <h2>Set Scores</h2>
          <table className="stats-table">
            <thead>
              <tr>
                <th>Set</th>
                <th>{game.homeTeam?.name}</th>
                <th>{game.awayTeam?.name}</th>
              </tr>
            </thead>
            <tbody>
              {game.sets.map((s) => (
                <tr key={s.setNumber}>
                  <td>{s.setNumber}</td>
                  <td>{s.homePoints}</td>
                  <td>{s.awayPoints}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {(isLive || canEdit) && players.length > 0 && (
        <>
          <h2>Enter Player Stats</h2>
          <StatsForm
            game={game}
            players={players}
            existingStats={stats}
            onSaved={loadStats}
          />
        </>
      )}

      <h2>Player Stats</h2>
      {stats.length === 0 ? (
        <p>No stats recorded for this game yet.</p>
      ) : (
        <table className="stats-table">
          <thead>
            <tr>
              <th>Player</th>
              <th>Team</th>
              <th>K</th>
              <th>Att</th>
              <th>Pct</th>
              <th>A</th>
              <th>Aces</th>
              <th>Digs</th>
              <th>Blk</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((s) => (
              <tr key={s._id}>
                <td>
                  <Link to={`/players/${s.player._id}`}>{s.player.name}</Link>
                </td>
                <td>{s.team?.name}</td>
                <td>{s.kills}</td>
                <td>{s.attackAttempts}</td>
                <td>{s.attackPct}</td>
                <td>{s.assists}</td>
                <td>{s.aces}</td>
                <td>{s.digs}</td>
                <td>{s.blocks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
};

export default GameDetail;
