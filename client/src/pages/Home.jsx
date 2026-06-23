import { Link } from "react-router";
import { useApp } from "../context/AppContext.jsx";

const Home = () => {
  const { teams } = useApp();

  return (
    <main className="page home-page">
      <h1>Welcome to VolleyFlow</h1>
      <p>Track your volleyball team stats and game scores all in one place.</p>
      <div className="home-cards">
        <Link to="/teams" className="home-card">
          Teams <span>{teams.length}</span>
        </Link>
        <Link to="/players" className="home-card">
          Players
        </Link>
        <Link to="/games" className="home-card">
          Games
        </Link>
      </div>
    </main>
  );
};

export default Home;
