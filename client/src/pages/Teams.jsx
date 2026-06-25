import { useState } from "react";
import { Link } from "react-router";
import { useApp } from "../context/AppContext.jsx";
import { createTeam, deleteTeam } from "../services/api.js";
import Spinner from "../components/Spinner.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";

const Teams = () => {
  const { teams, loading, error, fetchTeams } = useApp();
  const [form, setForm] = useState({ name: "", city: "" });
  const [saving, setSaving] = useState(false);
  const [formErr, setFormErr] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormErr(null);
    try {
      await createTeam(form);
      setForm({ name: "", city: "" });
      await fetchTeams();
    } catch (err) {
      setFormErr(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this team?")) return;
    try {
      await deleteTeam(id);
      await fetchTeams();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <main className="page">
      <h1>Teams</h1>

      <form className="form-card" onSubmit={handleSubmit}>
        <h2>Add Team</h2>
        {formErr && <ErrorMessage message={formErr} />}
        <input
          placeholder="Team name *"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          placeholder="City"
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
        />
        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Add Team"}
        </button>
      </form>

      <ul className="item-list">
        {teams.map((t) => (
          <li key={t._id} className="item-row">
            <Link to={`/teams/${t._id}`}>
              <strong>{t.name}</strong>
              {t.city && <span> - {t.city}</span>}
            </Link>
            <button className="btn-danger" onClick={() => handleDelete(t._id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default Teams;
