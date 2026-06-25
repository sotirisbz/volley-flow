const BASE = "/api";

const request = async (path, options = {}) => {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

// Teams
export const getTeams = () => request("/teams");
export const getTeamById = (id) => request(`/teams/${id}`);
export const createTeam = (body) =>
  request("/teams", { method: "POST", body: JSON.stringify(body) });
export const updateTeam = (id, body) =>
  request(`/teams/${id}`, { method: "PUT", body: JSON.stringify(body) });
export const deleteTeam = (id) => request(`/teams/${id}`, { method: "DELETE" });

// Players
export const getPlayers = (teamId) =>
  request(`/players${teamId ? `?team=${teamId}` : ""}`);
export const getPlayerById = (id) => request(`/players/${id}`);
export const createPlayer = (body) =>
  request("/players", { method: "POST", body: JSON.stringify(body) });
export const updatePlayer = (id, body) =>
  request(`/players/${id}`, { method: "PUT", body: JSON.stringify(body) });
export const deletePlayer = (id) =>
  request(`/players/${id}`, { method: "DELETE" });

// Games
export const getGames = (params) =>
  request(`/games${params ? `?${params}` : ""}`);
export const getGameById = (id) => request(`/games/${id}`);
export const createGame = (body) =>
  request("/games", { method: "POST", body: JSON.stringify(body) });
export const updateGameStatus = (id, body) =>
  request(`/games/${id}/status`, { method: "PUT", body: JSON.stringify(body) });
export const updateSets = (id, body) =>
  request(`/games/${id}/sets`, { method: "PUT", body: JSON.stringify(body) });
export const deleteGame = (id) => request(`/games/${id}`, { method: "DELETE" });

// Stats
export const getStatsByGame = (gameId) => request(`/stats/game/${gameId}`);
export const getStatsByPlayer = (playerId) =>
  request(`/stats/player/${playerId}`);
export const createStats = (body) =>
  request("/stats", { method: "POST", body: JSON.stringify(body) });
export const updateStats = (id, body) =>
  request(`/stats/${id}`, { method: "PUT", body: JSON.stringify(body) });
export const deleteStats = (id) =>
  request(`/stats/${id}`, { method: "DELETE" });
