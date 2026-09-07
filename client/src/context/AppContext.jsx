import { createContext, useContext, useState, useEffect } from "react";
import { getLeagues, getSeasons, getTeams } from "../services/api.js";

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [teams, setTeams] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const data = await getTeams();
      setTeams(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSeasons = async () => {
    try {
      setLoading(true);
      const data = await getSeasons();
      setSeasons(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeagues = async () => {
    try {
      setLoading(true);
      const data = await getLeagues();
      setLeagues(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      try {
        const [teamsData, seasonsData, leaguesData] = await Promise.all([
          getTeams(),
          getSeasons(),
          getLeagues(),
        ]);

        setTeams(teamsData);
        setSeasons(seasonsData);
        setLeagues(leaguesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, []);

  return (
    <AppContext.Provider
      value={{
        teams,
        setTeams,
        seasons,
        leagues,
        loading,
        error,
        fetchTeams,
        fetchSeasons,
        fetchLeagues,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
