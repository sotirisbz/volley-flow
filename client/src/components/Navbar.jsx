import { NavLink } from "react-router";

const Navbar = () => (
  <nav className="navbar">
    <span className="navbar-brand">VolleyFlow</span>
    <div className="navbar-links">
      <NavLink to="/">Home</NavLink>
      <NavLink to="/teams">Teams</NavLink>
      <NavLink to="/players">Players</NavLink>
      <NavLink to="/games">Games</NavLink>
    </div>
  </nav>
);

export default Navbar;
