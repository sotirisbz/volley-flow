import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import {
  getPlayerById,
  getPlayerSeasonStats,
  getStatsByPlayer,
} from "../services/api.js";
import { useApp } from "../context/AppContext.jsx";
import Spinner from "../components/Spinner.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";

const StatCard = ({ label, value }) => (
  <div className="stat-card">
    <span className="stat-card-value">{value ?? "-"}</span>
    <span className="stat-card-label">{label}</span>
  </div>
);

const PlayerDetail = () => {
  const { id } = useParams();
  const { seasons } = useApp();
  const [player, setPlayer] = useState(null);
  const [stats, setStats] = useState([]);
  const [season, setSeason] = useState(null);
  const [seasonId, setSeasonId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const effectiveSeasonId = seasonId || seasons[0]?._id || "";

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

  useEffect(() => {
    const loadSeasonStats = async () => {
      if (!effectiveSeasonId) {
        setSeason(null);
        return;
      }
      try {
        const agg = getPlayerSeasonStats(id, effectiveSeasonId);
        setSeason(agg);
      } catch (err) {
        setError(err.message);
      }
    };
    loadSeasonStats();
  }, [id, effectiveSeasonId]);

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
          <Link to={`/teams/${player.team._id}`}>{player.team.name}</Link>
        </p>
      )}

      <h2>Season Totals</h2>
      <div className="filter-bar">
        <select
          value={effectiveSeasonId}
          onChange={(e) => setSeasonId(e.target.value)}
        >
          <option value="">Select a season</option>
          {seasons.map((s) => {
            <option key={s._id} value={s._id}>
              {s.name}
            </option>;
          })}
        </select>
      </div>

      {!effectiveSeasonId ? (
        <p className="empty-message">Select a season to see totals.</p>
      ) : !season ? (
        <p className="empty-message">No stats recorded for this season yet.</p>
      ) : (
        <>
          <h2>Season Totals</h2>
          <p className="games-played">
            {season.gamesPlayed} game{season.gamesPlayed !== 1 ? "s" : ""}
          </p>
          <div className="stat-cards">
            <StatCard label="Kills" value={season.totalKills} />
            <StatCard label="Aces" value={season.totalAces} />
            <StatCard label="Digs" value={season.totalDigs} />
            <StatCard label="Blocks" value={season.totalBlocks} />
            <StatCard label="Assists" value={season.totalAssists} />
            <StatCard label="Atk Pct" value={season.attackPct} />
          </div>

          <h2>
            Season Average <span className="per-game">per game</span>
          </h2>
          <div className="stat-cards">
            <StatCard label="Kills" value={season.avgKills} />
            <StatCard label="Aces" value={season.avgAces} />
            <StatCard label="Digs" value={season.avgDigs} />
            <StatCard label="Blocks" value={season.avgBlocks} />
            <StatCard label="Assists" value={season.avgAssists} />
          </div>
        </>
      )}

      {/* Per game breakdown */}
      <h2>Game Log</h2>
      {stats.length === 0 ? (
        <p>No stats recorded yet.</p>
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
