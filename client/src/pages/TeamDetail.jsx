import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import {
  getTeamById,
  getPlayers,
  getTeamSeasonHistory,
  assignTeamToLeague,
  removeTeamSeasonEntry,
} from "../services/api.js";
import Spinner from "../components/Spinner.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import { useApp } from "../context/AppContext.jsx";

const TeamDetail = () => {
  const { id } = useParams();
  const { leagues, seasons } = useApp();
  const [team, setTeam] = useState(null);
  const [players, setPlayers] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [leagueId, setLeagueId] = useState("");
  const [seasonId, setSeasonId] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [assignErr, setAssignErr] = useState(null);

  const loadHistory = async () => {
    const h = await getTeamSeasonHistory(id);
    setHistory(h);
  };

  useEffect(() => {
    const load = async () => {
      try {
        const [t, p, h] = await Promise.all([
          getTeamById(id),
          getPlayers(id),
          getTeamSeasonHistory(id),
        ]);
        setTeam(t);
        setPlayers(p);
        setHistory(h);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!leagueId || !seasonId) return;
    setAssigning(true);
    setAssignErr(null);

    try {
      await assignTeamToLeague({
        team: id,
        league: leagueId,
        season: seasonId,
      });
      setLeagueId("");
      setSeasonId("");
      await loadHistory();
    } catch (err) {
      setAssignErr(err.message);
    } finally {
      setAssigning(false);
    }
  };

  const handleRemove = async (entryId) => {
    if (!confirm("Remove this team from the league for this season?")) return;
    try {
      await removeTeamSeasonEntry(entryId);
      await loadHistory();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <main className="page">
      <Link to="/teams">Back to Teams</Link>
      <h1>{team.name}</h1>
      {team.city && <p>{team.city}</p>}

      <form className="form-card" onSubmit={handleAssign}>
        <h2>Register for a league</h2>
        {assignErr && <ErrorMessage message={assignErr} />}
        <select
          value={leagueId}
          onChange={(e) => setLeagueId(e.target.value)}
          required
        >
          <option value="">League *</option>
          {leagues.map((l) => (
            <option key={l._id} value={l._id}>
              {l.name} ({l.country} - {l.gender} - Tier {l.tier}
              {l.group ? ` - ${l.group}` : ""})
            </option>
          ))}
        </select>

        <select
          value={seasonId}
          onChange={(e) => setSeasonId(e.target.value)}
          required
        >
          <option value="">Season *</option>
          {seasons.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>

        <button type="submit" disabled={assigning}>
          {assigning ? "Saving..." : "Register"}
        </button>
      </form>

      <h2>League history</h2>
      {history.length === 0 ? (
        <p className="empty-message">Not registered in any league yet.</p>
      ) : (
        <ul className="item-list">
          {history.map((h) => (
            <li key={h._id} className="item-row">
              <Link to={`/leagues/${h.league._id}`}>
                <strong>{h.league.name}</strong>
                <span> - {h.season.name}</span>
              </Link>
              <button
                className="btn-danger"
                onClick={() => handleRemove(h._id)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      <h2>Roster</h2>
      {players.length === 0 ? (
        <p>
          No players yet. <Link to="/players">Add players</Link>.
        </p>
      ) : (
        <ul className="item-list">
          {players.map((p) => (
            <li key={p._id} className="item-row">
              <Link to={`/players/${p._id}`}>
                #{p.number} - <strong>{p.name}</strong> ({p.position})
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
};

export default TeamDetail;
