import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { getTeamById, getPlayers } from "../services/api.js";
import Spinner from "../components/Spinner.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";

const TeamDetail = () => {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [t, p] = await Promise.all([getTeamById(id), getPlayers(id)]);
        setTeam(t);
        setPlayers(p);
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
      <Link to="/teams">Back to Teams</Link>
      <h1>{team.name}</h1>
      {team.city && <p>{team.city}</p>}

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
