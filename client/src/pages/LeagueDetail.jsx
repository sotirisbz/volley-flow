import { Link, useParams } from "react-router";
import { useApp } from "../context/AppContext.jsx";
import { useEffect, useState } from "react";
import {
  assignTeamToLeague,
  getLeagueById,
  getLeagueStandings,
  getLeagueTeams,
} from "../services/api.js";
import Spinner from "../components/Spinner.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";

const LeagueDetail = () => {
  const { id } = useParams();
  const { teams, seasons } = useApp();
  const [league, setLeague] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [seasonId, setSeasonId] = useState("");
  const [roster, setRoster] = useState([]);
  const [standings, setStandings] = useState([]);
  const [rosterLoading, setRosterLoading] = useState(false);

  const [addTeamId, setAddTeamId] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [assignErr, setAssignErr] = useState(null);

  const effectiveSeasonId = seasonId || seasons[0]?._id || "";

  useEffect(() => {
    const load = async () => {
      try {
        const l = await getLeagueById(id);
        setLeague(l);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  useEffect(() => {
    const loadSeasonData = async () => {
      if (!effectiveSeasonId) {
        setRoster([]);
        setStandings([]);
        return;
      }
      setRosterLoading(true);

      try {
        const [teamsInLeague, table] = await Promise.all([
          getLeagueTeams(id, effectiveSeasonId),
          getLeagueStandings(id, effectiveSeasonId),
        ]);
        setRoster(teamsInLeague);
        setStandings(table);
      } catch (err) {
        setError(err.message);
      } finally {
        setRosterLoading(false);
      }
    };

    loadSeasonData();
  }, [id, effectiveSeasonId]);

  const refreshSeasonData = async () => {
    if (!effectiveSeasonId) return;
    const [teamsInLeague, table] = await Promise.all([
      getLeagueTeams(id, effectiveSeasonId),
      getLeagueStandings(id, effectiveSeasonId),
    ]);
    setRoster(teamsInLeague);
    setStandings(table);
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!addTeamId || !effectiveSeasonId) return;
    setAssigning(true);
    setAssignErr(null);
    try {
      await assignTeamToLeague({
        team: addTeamId,
        leage: id,
        season: effectiveSeasonId,
      });
      setAddTeamId("");
      await refreshSeasonData();
    } catch (err) {
      setAssignErr(err.message);
    } finally {
      setAssigning(false);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage message={error} />;

  const rosterTeamIds = new Set(roster.map((t) => t._id));
  const availableTeams = teams.filter((t) => !rosterTeamIds.has(t._id));

  return (
    <main className="page">
      <Link to="/leagues">Back to Leagues</Link>
      <h1>{league.name}</h1>
      <p>
        <strong>{league.country}</strong> - {league.gender} - Tier {league.tier}
        {league.group && <> - {league.group}</>}
      </p>

      <div className="filter-bar">
        <select
          value={effectiveSeasonId}
          onChange={(e) => setSeasonId(e.target.value)}
        >
          <option value="">Select a season</option>\
          {seasons.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {!effectiveSeasonId ? (
        <p className="empty-message">
          {seasons.length === 0
            ? "No seasons exist yet, add one from the Leagues page first."
            : "Select a season to view teams and standings."}
        </p>
      ) : rosterLoading ? (
        <Spinner />
      ) : (
        <>
          <h2>Standings</h2>
          {standings.length === 0 ? (
            <p className="empty-message">
              No completed games yet for this season.
            </p>
          ) : (
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Team</th>
                  <th>P</th>
                  <th>W</th>
                  <th>L</th>
                  <th>Sets</th>
                  <th>Points</th>
                  <th>Pts</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((row) => (
                  <tr key={row.team._id}>
                    <td>
                      <Link to={`/teams/${row.team._id}`}>{row.team.name}</Link>
                    </td>
                    <td>{row.played}</td>
                    <td>{row.wins}</td>
                    <td>{row.losses}</td>
                    <td>
                      {row.setsWon} - {row.setsLost}
                    </td>
                    <td>
                      {row.pointsFor} - {row.pointsAgainst}
                    </td>
                    <td>
                      <strong>{row.leaguePoints}</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <h2>Teams in this Season</h2>
          <form className="form-card" onSubmit={handleAssign}>
            {assignErr && <ErrorMessage message={assignErr} />}
            <select
              value={addTeamId}
              onChange={(e) => setAddTeamId(e.target.value)}
              required
            >
              <option value="">Add a team to this league/season *</option>
              {availableTeams.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name}
                </option>
              ))}
            </select>
            <button type="submit" disabled={assigning}>
              {assigning ? "Adding..." : "Add Team"}
            </button>
          </form>

          {roster.length === 0 ? (
            <p className="empty-message">
              No teams registered for this season yet.
            </p>
          ) : (
            <ul className="item-list">
              {roster.map((t) => (
                <li key={t._id} className="item-row">
                  <Link to={`/teams/${t._id}`}>
                    <strong>{t.name}</strong>{" "}
                    {t.city && <span> - {t.city}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </main>
  );
};

export default LeagueDetail;
