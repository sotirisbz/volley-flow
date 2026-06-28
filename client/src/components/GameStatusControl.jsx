import { useState } from "react";
import ErrorMessage from "./ErrorMessage.jsx";
import { updateGameStatus } from "../services/api.js";

const TRANSITIONS = {
  scheduled: { label: "Start Game", next: "in_progress" },
  in_progress: { label: "Complete Game", next: "completed" },
};

const GameStatusControl = ({ game, onUpdate }) => {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const transition = TRANSITIONS[game.status];

  if (!transition) return null;

  const handleClick = async () => {
    setSaving(true);
    setError(null);
    try {
      const updated = await updateGameStatus(game._id, {
        status: transition.next,
      });
      onUpdate(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="status-control">
      {error && <ErrorMessage message={error} />}
      <button className="btn-status" onClick={handleClick} disabled={saving}>
        {saving ? "Updating..." : transition.label}
      </button>
    </div>
  );
};

export default GameStatusControl;
