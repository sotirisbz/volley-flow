import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { getPlayerById, getStatsByPlayer } from "../services/api.js";
import Spinner from "../components/Spinner.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";

const PlayerDetail = () => {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [p, s] = await Promise.all([
          getPlayerById(id),
          getStatsByPlayer(id),
        ]);
        setPlayer(p);
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
      <Link to="/players">Back to Players</Link>
      <h1>
        #{player.number} {player.name}
      </h1>
      <p>
        <strong>Position:</strong> {player.position}
      </p>
      {player.team && (
        <p>
          <strong>Team:</strong>{" "}
          <Link to={`/players/${player.team._id}`}>{player.team.name}</Link>
        </p>
      )}

      <h2>Game Stats</h2>
      {stats.length === 0 ? (
        <p>No stats record yet.</p>
      ) : (
        <table className="stats-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>K</th>
              <th>Att</th>
              <th>Err</th>
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
                  <Link to={`/games/${s.game._id}`}>
                    {new Date(s.game.date).toLocaleDateString()}
                  </Link>
                </td>
                <td>{s.kills}</td>
                <td>{s.attackAttempts}</td>
                <td>{s.attackErrors}</td>
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

export default PlayerDetail;
