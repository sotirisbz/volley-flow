import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import { createGame, deleteGame, getGames } from "../services/api.js";
import Spinner from "../components/Spinner.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import { Link } from "react-router";

const Games = () => {
  const { teams } = useApp();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formErr, setFormErr] = useState(null);
  const [form, setForm] = useState({
    homeTeam: "",
    awayTeam: "",
    date: "",
    location: "",
  });

  const fetchGames = async () => {
    try {
      setLoading(true);
      const data = await getGames();
      setGames(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadGames = async () => {
      try {
        const data = await getGames();
        setGames(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadGames();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormErr(null);
    try {
      await createGame(form);
      setForm({ homeTeam: "", awayTeam: "", date: "", location: "" });
      await fetchGames();
    } catch (err) {
      setFormErr(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this game?")) return;
    try {
      await deleteGame(id);
      await fetchGames();
    } catch (err) {
      alert(err.message);
    }
  };

  const statusBadge = (status) => (
    <span className={`badge badge-${status}`}>{status}</span>
  );

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <main className="page">
      <h1>Games</h1>

      <form className="form-card" onSubmit={handleSubmit}>
        <h2>Schedule Game</h2>
        {formErr && <ErrorMessage message={formErr} />}
        <select
          value={form.homeTeam}
          onChange={(e) => setForm({ ...form, homeTeam: e.target.value })}
          required
        >
          <option value="">Home Team</option>
          {teams.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name}
            </option>
          ))}
        </select>
        <select
          value={form.awayTeam}
          onChange={(e) => setForm({ ...form, awayTeam: e.target.value })}
          required
        >
          <option value="">Away Team</option>
          {teams.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name}
            </option>
          ))}
        </select>
        <input
          type="datetime-local"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          required
        />
        <input
          placeholder="Location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />
        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Schedule a game"}
        </button>
      </form>

      <ul className="item-list">
        {games.map((g) => (
          <li key={g._id} className="item-row">
            <Link to={`/games/${g._id}`}>
              <strong>{g.homeTeam?.name}</strong> vs{" "}
              <strong>{g.awayTeam?.name}</strong>
              <span> - {new Date(g.date).toLocaleDateString()}</span>
              {g.score && (
                <span>
                  {" "}
                  - {g.score.home}-{g.score.away}
                </span>
              )}
            </Link>
            <div className="row-actions">
              {statusBadge(g.status)}
              <button
                className="btn-danger"
                onClick={() => handleDelete(g._id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default Games;
