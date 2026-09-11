import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import {
  createGame,
  deleteGame,
  getGames,
  getLeagueTeams,
} from "../services/api.js";
import Spinner from "../components/Spinner.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import { Link } from "react-router";

const STATUSES = ["scheduled", "in_progress", "completed"];

const Games = () => {
  const { teams, leagues, seasons } = useApp();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formErr, setFormErr] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterTeam, setFilterTeam] = useState("");
  const [filterLeague, setFilterLeague] = useState("");
  const [filterSeason, setFilterSeason] = useState("");
  const [form, setForm] = useState({
    league: "",
    season: "",
    homeTeam: "",
    awayTeam: "",
    date: "",
    time: "",
    location: "",
  });
  const [formTeams, setFormTeams] = useState([]);
  const [formTeamsLoading, setFormTeamsLoading] = useState(false);

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

  useEffect(() => {
    const loadFormTeams = async () => {
      if (!form.league || !form.season) {
        setFormTeams([]);
        return;
      }
      setFormTeamsLoading(true);
      try {
        const data = await getLeagueTeams(form.league, form.season);
        setFormTeams(data);
      } catch (err) {
        setFormErr(err.message);
      } finally {
        setFormTeamsLoading(false);
      }
    };
    loadFormTeams();
  }, [form.league, form.season]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormErr(null);
    try {
      const date = form.time ? `${form.date}T${form.time}` : form.date;
      await createGame({
        league: form.league,
        season: form.season,
        homeTeam: form.homeTeam,
        awayTeam: form.awayTeam,
        date,
        location: form.location,
      });
      setForm({
        league: "",
        season: "",
        homeTeam: "",
        awayTeam: "",
        date: "",
        time: "",
        location: "",
      });
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

  const filtered = games.filter((g) => {
    const matchStatus = !filterStatus || g.status === filterStatus;
    const matchTeam =
      !filterTeam ||
      g.homeTeam?._id === filterTeam ||
      g.awayTeam?._id === filterTeam;
    const matchLeague = !filterLeague || g.league?._id === filterLeague;
    const matchSeason = !filterSeason || g.season?._id === filterSeason;
    return matchStatus && matchTeam && matchLeague && matchSeason;
  });

  const statusBadge = (status) => (
    <span className={`badge badge-${status}`}>{status}</span>
  );

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage message={error} />;

  const canPickTeams = form.league && form.season;

  return (
    <main className="page">
      <h1>Games</h1>

      <form className="form-card" onSubmit={handleSubmit}>
        <h2>Schedule Game</h2>
        {formErr && <ErrorMessage message={formErr} />}
        <select
          value={form.league}
          onChange={(e) =>
            setForm({
              ...form,
              league: e.target.value,
              homeTeam: "",
              awayTeam: "",
            })
          }
          required
        >
          <option value="">League *</option>
          {leagues.map((l) => (
            <option key={l._id} value={l._id}>
              {l.name} ({l.gender} - Tier {l.tier})
            </option>
          ))}
        </select>
        <select
          value={form.season}
          onChange={(e) =>
            setForm({
              ...form,
              season: e.target.value,
              homeTeam: "",
              awayTeam: "",
            })
          }
          required
        >
          <option value="">Season *</option>
          {seasons.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>

        <select
          value={form.homeTeam}
          onChange={(e) => setForm({ ...form, homeTeam: e.target.value })}
          disabled={!canPickTeams || formTeamsLoading}
          required
        >
          <option value="">Home Team *</option>
          {formTeams.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name}
            </option>
          ))}
        </select>
        <select
          value={form.awayTeam}
          onChange={(e) => setForm({ ...form, awayTeam: e.target.value })}
          disabled={!canPickTeams || formTeamsLoading}
          required
        >
          <option value="">Away Team *</option>
          {formTeams.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name}
            </option>
          ))}
        </select>
        {canPickTeams && formTeams.length === 0 && !formTeamsLoading && (
          <p className="empty-message">
            No teams registered for this league/season yet, add some from the
            league page first.
          </p>
        )}
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          required
        />
        <input
          type="time"
          value={form.time}
          onChange={(e) => setForm({ ...form, time: e.target.value })}
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

      {/* Filters */}
      <div className="filter-bar">
        <select
          value={filterLeague}
          onChange={(e) => setFilterLeague(e.target.value)}
        >
          <option value="">All leagues</option>
          {leagues.map((l) => (
            <option key={l._id} value={l._id}>
              {l.name}
            </option>
          ))}
        </select>

        <select
          value={filterSeason}
          onChange={(e) => setFilterSeason(e.target.value)}
        >
          <option value="">All seasons</option>
          {seasons.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace("_", " ")}
            </option>
          ))}
        </select>
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
        {(filterStatus || filterTeam || filterLeague || filterSeason) && (
          <button
            className="btn-secondary"
            onClick={() => {
              setFilterStatus("");
              setFilterTeam("");
              setFilterLeague("");
              setFilterSeason("");
            }}
          >
            Clear filters
          </button>
        )}
        <span className="filter-count">
          {filtered.length} game{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {filtered.length === 0 ? (
        <p className="empty-message">No games match the current filters</p>
      ) : (
        <ul className="item-list">
          {filtered.map((g) => (
            <li key={g._id} className="item-row">
              <Link to={`/games/${g._id}`}>
                <strong>{g.homeTeam?.name}</strong> vs{" "}
                <strong>{g.awayTeam?.name}</strong>
                <span> - {new Date(g.date).toLocaleDateString()}</span>
                {g.league && <span> - {g.league.name}</span>}
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
      )}
    </main>
  );
};

export default Games;
