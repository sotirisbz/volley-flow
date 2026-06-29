import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import { createPlayer, deletePlayer, getPlayers } from "../services/api.js";
import Spinner from "../components/Spinner.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import { Link } from "react-router";

const POSITIONS = [
  "Setter",
  "Outside Hitter",
  "Opposite",
  "Middle Blocker",
  "Libero",
  "Defensive Specialist",
];

const Players = () => {
  const { teams } = useApp();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formErr, setFormErr] = useState(null);
  const [search, setSearch] = useState("");
  const [filterTeam, setFilterTeam] = useState("");
  const [form, setForm] = useState({
    name: "",
    number: "",
    position: "",
    team: "",
  });

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const data = await getPlayers();
      setPlayers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadPlayers = async () => {
      try {
        const data = await getPlayers();
        setPlayers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadPlayers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormErr(null);
    try {
      await createPlayer(form);
      setForm({ name: "", number: "", position: "", team: "" });
      await fetchPlayers();
    } catch (err) {
      setFormErr(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this player?")) return;
    try {
      await deletePlayer(id);
      await fetchPlayers();
    } catch (err) {
      alert(err.message);
    }
  };

  const filtered = players.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      String(p.number).includes(q) ||
      p.position.toLowerCase().includes(q) ||
      p.team?.name?.toLowerCase().includes(q);
    const matchTeam = !filterTeam || p.team?._id === filterTeam;
    return matchSearch && matchTeam;
  });

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <main className="page">
      <h1>Players</h1>

      <form className="form-card" onSubmit={handleSubmit}>
        <h2>Add Player</h2>
        {formErr && <ErrorMessage message={formErr} />}
        <input
          placeholder="Full name *"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Jersey number *"
          value={form.number}
          onChange={(e) => setForm({ ...form, number: e.target.value })}
          required
        />
        <select
          value={form.position}
          onChange={(e) => setForm({ ...form, position: e.target.value })}
          required
        >
          <option value="">Select position *</option>
          {POSITIONS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <select
          value={form.team}
          onChange={(e) => setForm({ ...form, team: e.target.value })}
          required
        >
          <option value="">Select team *</option>
          {teams.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name}
            </option>
          ))}
        </select>
        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Add Player"}
        </button>
      </form>

      <div className="filter-bar">
        <input
          className="search-input"
          placeholder="Search by name, number, position..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={filterTeam}
          onChange={(e) => setFilterTeam(e.target.value)}
        >
          <option value="">All teams</option>
          {teams.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name}
            </option>
          ))}
        </select>
        {(search || filterTeam) && (
          <button
            className="btn-secondary"
            onClick={() => {
              setSearch("");
              setFilterTeam("");
            }}
          >
            Clear
          </button>
        )}
        <span>
          {filtered.length} player{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {filtered.length === 0 ? (
        <p className="empty-message">No players match the current search.</p>
      ) : (
        <ul className="item-list">
          {filtered.map((p) => (
            <li key={p._id} className="item-row">
              <Link to={`/players/${p._id}`}>
                #{p.number} - <strong>{p.name}</strong> ({p.position})
                {p.team && <span> - {p.team.name}</span>}
              </Link>
              <button
                className="btn-danger"
                onClick={() => handleDelete(p._id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
};

export default Players;
