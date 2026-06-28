import { useState } from "react";
import { updateSets } from "../services/api.js";
import ErrorMessage from "./ErrorMessage.jsx";

const SetScoreEditor = ({ game, onUpdate }) => {
  const [sets, setSets] = useState(game.sets ?? []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const persist = async (nextSets) => {
    setSaving(true);
    setError(null);
    try {
      const updated = await updateSets(game._id, { sets: nextSets });
      setSets(updated.sets);
      onUpdate(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePointChange = (idx, side, value) => {
    const nextSets = sets.map((s, i) =>
      i === idx ? { ...s, [side]: Number(value) } : s,
    );
    setSets(nextSets);
  };

  const handleBlur = () => persist(sets);

  const addSet = () => {
    const nextSets = [
      ...sets,
      { setNumber: sets.length + 1, homePoints: 0, awayPoints: 0 },
    ];
    persist(nextSets);
  };

  const removeLastSet = () => {
    if (sets.length === 0) return;
    persist(sets.slice(0, -1));
  };

  return (
    <div className="set-editor">
      {error && <ErrorMessage message={error} />}

      <table className="stats-table">
        <thead>
          <tr>
            <th>Set</th>
            <th>{game.homeTeam?.name}</th>
            <th>{game.awayTeam?.name}</th>
          </tr>
        </thead>
        <tbody>
          {sets.map((s, idx) => (
            <tr key={idx}>
              <td>{s.setNumber}</td>
              <td>
                <input
                  className="score-input"
                  type="number"
                  min="0"
                  value={s.homePoints}
                  onChange={(e) =>
                    handlePointChange(idx, "homePoints", e.target.value)
                  }
                  onBlur={handleBlur}
                  disabled={saving}
                />
              </td>
              <td>
                <input
                  className="score-input"
                  type="number"
                  min="0"
                  value={s.homePoints}
                  onChange={(e) =>
                    handlePointChange(idx, "awayPoints", e.target.value)
                  }
                  onBlur={handleBlur}
                  disabled={saving}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="set-actions">
        <button className="btn-secondary" onClick={addSet} disabled={saving}>
          + Add Set
        </button>
        {sets.length > 0 && (
          <button
            className="btn-danger"
            onClick={removeLastSet}
            disabled={saving}
          >
            Remove Last Set
          </button>
        )}
        {saving && <span className="saving-hint">Saving...</span>}
      </div>
    </div>
  );
};

export default SetScoreEditor;
