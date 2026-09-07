import { useState } from "react";
import { Link } from "react-router";
import { useApp } from "../context/AppContext.jsx";
import {
  createLeague,
  createSeason,
  deleteLeague,
  deleteSeason,
} from "../services/api.js";
import Spinner from "../components/Spinner.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";

const GENDERS = ["men", "women"];

const Leagues = () => {
  const { leagues, seasons, loading, error, fetchLeagues, fetchSeasons } =
    useApp();

  const [leagueForm, setLeagueForm] = useState({
    name: "",
    country: "GR",
    gender: "",
    tier: "",
    group: "",
  });
  const [seasonForm, setSeasonForm] = useState({
    name: "",
    startDate: "",
    endDate: "",
  });
  const [savingLeague, setSavingLeague] = useState(false);
  const [savingSeason, setSavingSeason] = useState(false);
  const [leagueErr, setLeagueErr] = useState(null);
  const [seasonErr, setSeasonErr] = useState(null);

  const handleCreateSeason = async (e) => {
    e.preventDefault();
    setSavingSeason(true);
    setSeasonErr(null);
    try {
      await createSeason(seasonForm);
      setSeasonForm({ name: "", startDate: "", endDate: "" });
      await fetchSeasons();
    } catch (err) {
      setSeasonErr(err.message);
    } finally {
      setSavingSeason(false);
    }
  };

  const handleCreateLeague = async (e) => {
    e.preventDefault();
    setSavingLeague(true);
    setLeagueErr(null);
    try {
      await createLeague({
        ...leagueForm,
        tier: Number(leagueForm.tier),
        group: leagueForm.group || undefined,
      });
      setLeagueForm({
        name: "",
        country: "GR",
        gender: "",
        tier: "",
        group: "",
      });
      await fetchLeagues();
    } catch (err) {
      setLeagueErr(err);
    } finally {
      setSavingLeague(false);
    }
  };

  const hanldeDeleteSeason = async (id) => {
    if (!confirm("Delete this season? Leagues using it will keep the games."))
      return;
    try {
      await deleteSeason(id);
      await fetchSeasons();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteLeague = async (id) => {
    if (!confirm("Delete this League?")) return;
    try {
      await deleteLeague(id);
      await fetchLeagues();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage message={error} />;

  const sortedLeagues = [...leagues].sort(
    (a, b) =>
      a.country.localeCompare(b.country) ||
      a.gender.localeCompare(b.gender) ||
      a.tier - b.tier,
  );

  return (
    <main className="page">
      <h1>Leagues</h1>

      <form className="form-card" onSubmit={handleCreateSeason}>
        <h2>Add Season</h2>
        {seasonErr && <ErrorMessage message={seasonErr} />}
        <input
          placeholder="Season name * (e.g. 2026-2027)"
          value={seasonForm.name}
          onChange={(e) =>
            setSeasonErr({ ...seasonForm, name: e.target.value })
          }
          required
        />
        <input
          type="date"
          value={seasonForm.startDate}
          onChange={(e) =>
            setSeasonForm({ ...seasonForm, startDate: e.target.value })
          }
          required
        />
        <input
          type="date"
          value={seasonForm.endDate}
          onChange={(e) =>
            setSeasonForm({ ...seasonForm, endDate: e.target.value })
          }
          required
        />
        <button type="submit" disabled={savingSeason}>
          {savingSeason ? "Saving..." : "Add Season"}
        </button>
      </form>

      {seasons.length > 0 && (
        <ul className="item-list">
          {seasons.map((s) => (
            <li key={s._id} className="item-row">
              <span>
                <strong>{s.name}</strong>
                <span>
                  {" "}
                  - {new Date(s.startDate).toLocaleDateString()} to{" "}
                  {new Date(s.endDate).toLocaleDateString()}
                </span>
              </span>
              <button
                className="btn-danger"
                onClick={() => hanldeDeleteSeason(s._id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      <form className="form-card" onSubmit={handleCreateLeague}>
        <h2>Add League</h2>
        {leagueErr && <ErrorMessage message={leagueErr} />}
        <input
          placeholder="League name * (e.g. A1 Ethniki)"
          value={leagueForm.name}
          onChange={(e) =>
            setLeagueForm({ ...leagueForm, name: e.target.value })
          }
          required
        />
        <input
          placeholder="Country * (e.g. GR)"
          value={leagueForm.country}
          onChange={(e) =>
            setLeagueForm({ ...leagueForm, country: e.target.value })
          }
          required
        />
        <select
          value={leagueForm.gender}
          onChange={(e) =>
            setLeagueForm({ ...leagueForm, gender: e.target.value })
          }
          required
        >
          <option value="">Gender *</option>
          {GENDERS.map((g) => (
            <option value={g} key={g}>
              {g}
            </option>
          ))}
        </select>

        <input
          type="number"
          min="1"
          placeholder="Tier * (1 = top division)"
          value={leagueForm.tier}
          onChange={(e) =>
            setLeagueForm({ ...leagueForm, tier: e.target.value })
          }
          required
        />
        <input
          placeholder="Group - optional (e.g. North Zone)"
          value={leagueForm.group}
          onChange={(e) =>
            setLeagueForm({ ...leagueForm, group: e.target.value })
          }
        />
        <button type="submit" disabled={savingLeague}>
          {savingLeague ? "Saving..." : "Add League"}
        </button>
      </form>

      {sortedLeagues.length === 0 ? (
        <p className="empty-message">No leagues yet.</p>
      ) : (
        <ul className="item-list">
          {sortedLeagues.map((l) => (
            <li key={l._id} className="item-row">
              <Link to={`/leagues/${l._id}`}>
                <strong>{l.name}</strong>
                <span>
                  {" "}
                  - {l.country} - {l.gender} - Tier {l.tier}
                </span>
                {l.group && <span> - {l.group}</span>}
              </Link>
              <button
                className="btn-danger"
                onClick={() => handleDeleteLeague(l._id)}
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

export default Leagues;
