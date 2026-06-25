import { BrowserRouter, Route, Routes } from "react-router";
import { AppProvider } from "./context/AppContext";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Teams from "./pages/Teams.jsx";
import TeamDetail from "./pages/TeamDetail.jsx";
import Players from "./pages/Players.jsx";
import PlayerDetail from "./pages/PlayerDetail.jsx";
import Games from "./pages/Games.jsx";
import GameDetail from "./pages/GameDetail.jsx";

const App = () => (
  <AppProvider>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/teams/:id" element={<TeamDetail />} />
        <Route path="/players" element={<Players />} />
        <Route path="/players/:id" element={<PlayerDetail />} />
        <Route path="/games" element={<Games />} />
        <Route path="/games/:id" element={<GameDetail />} />
      </Routes>
    </BrowserRouter>
  </AppProvider>
);

export default App;
