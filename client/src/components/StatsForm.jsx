import { useState } from "react";
import { createStats, updateStats } from "../services/api.js";
import ErrorMessage from "./ErrorMessage.jsx";

const EMPTY_STATS = {
  kills: 0,
  attackAttempts: 0,
  attackErrors: 0,
  aces: 0,
  serveAttempts: 0,
  serveErrors: 0,
  digs: 0,
  receptionErrors: 0,
  blocks: 0,
  blockErrors: 0,
  assists: 0,
};

const FIELDS = [
  { key: "kills", label: "Kills" },
  { key: "attackAttempts", label: "Attack Attempts" },
  { key: "attackErrors", label: "Attack Errors" },
  { key: "aces", label: "Aces" },
  { key: "serveAttempts", label: "Serve Attempts" },
  { key: "serve Errors", label: "Serve Errors" },
  { key: "digs", label: "Digs" },
  { key: "receptionErrors", label: "Reception Errors" },
  { key: "blocks", label: "Blocks" },
  { key: "blockErrors", label: "Block Errors" },
  { key: "assists", label: "Assists" },
];

const StatsForm = ({ game, players, existingStats, onSaved }) => {
  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [values, setValues] = useState(EMPTY_STATS);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // when a player is selected, pre-fills their team and any existing stats
  const handlePlayerChange = (playerId) => {
    setSelectedPlayer(playerId);
    setError(null);
    setSuccess(null);

    const player = players.find((p) => p._id === playerId);
    if (player) setSelectedTeam(player.team?._id ?? player.team ?? "");

    const existing = existingStats.find((s) => s.player._id === playerId);
    setValues(
      existing
        ? {
            kills: existing.kills,
            attackAttempts: existing.attackAttempts,
            attackErrors: existing.attackErrors,
            aces: existing.aces,
            serveAttempts: existing.serveAttempts,
            serveErrors: existing.serveErrors,
            digs: existing.digs,
            receptionErrors: existing.receptionErrors,
            blocks: existing.blocks,
            blockErrors: existing.blockErrors,
            assists: existing.assists,
          }
        : EMPTY_STATS,
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPlayer) return;
    setSaving(true);
    setError(null);
    setSuccess(null);

    const existing = existingStats.find((s) => s.player._id === selectedPlayer);

    try {
      if (existing) {
        await updateStats(existing._id, values);
        setSuccess("Stats updated successfully.");
      } else {
        await createStats({
          game: game.id,
          player: selectedPlayer,
          team: selectedTeam,
          ...values,
        });
        setSuccess("Stats saved successfully");
      }
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const isEditing = !!existingStats.find(
    (s) => s.player._id === selectedPlayer,
  );

  return (
    <div className="stats-form-wrapper">
      <form className="form-card" onSubmit={handleSubmit}>
        <h3>{isEditing ? "Edit Player Stats" : "Add Player Stats"}</h3>

        {error && <ErrorMessage message={error} />}
        {success && <p className="success-message">{success}</p>}

        <select
          value={selectedPlayer}
          onChange={(e) => handlePlayerChange(e.target.value)}
          required
        >
          <option value="">Select Player *</option>
          {players.map((p) => (
            <option key={p._id} value={p._id}>
              #{p.number} {p.name} ({p.team?.name ?? "No team"})
            </option>
          ))}
        </select>

        <div className="stats-grid">
          {FIELDS.map(({ key, label }) => (
            <label key={key} className="stats-field">
              <span>{label}</span>
              <input
                type="number"
                min="0"
                value={values[key]}
                onChange={(e) =>
                  setValues({ ...values, [key]: Number(e.target.value) })
                }
                disabled={!selectedPlayer}
              />
            </label>
          ))}
        </div>

        <button type="submit" disabled={saving || !selectedPlayer}>
          {saving ? "Saving..." : isEditing ? "Update Stats" : "Save Stats"}
        </button>
      </form>
    </div>
  );
};

export default StatsForm;
