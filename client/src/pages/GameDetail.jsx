import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { getGameById, getStatsByGame } from "../services/api.js";
import Spinner from "../components/Spinner.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";

const GameDetail = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [g, s] = await Promise.all([getGameById(id), getStatsByGame(id)]);
        setGame(g);
        setStats(s);
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

  return (
    <main className="page">
      <Link to="/games">Back to Games</Link>

      <h1>
        {game.homeTeam?.name} vs {game.awayTeam?.name}
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
        <span className={`badge badge-${game.status}`}>{game.status}</span>
      </p>

      <h2>Score</h2>
      <p className="score-display">
        {game.homeTeam?.name} <strong>{game.score?.home}</strong>
        {" - "}
        <strong>{game.score?.away}</strong> {game.awayTeam?.name}
      </p>

      {game.sets?.length > 0 && (
        <>
          <h3>Sets</h3>
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

      <h2>Player Stats</h2>
      {stats.length === 0 ? (
        <p>No stats recorded yeat.</p>
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
