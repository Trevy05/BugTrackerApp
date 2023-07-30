import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

import "./App.css";
import Navbar from "./components/NavBar/Navbar";
import Issues from "./components/Issues/Issues";
import ProjectList from "./components/ProjectList/ProjectList";
import TeamList from "./components/TeamList/TeamList";
import Dashboard from "./components/Dashboard/Dashboard";
import UserList from "./components/UserList/UserList";
import SignInUp from "./components/SignInUp/SignInUp";
import Invitations from "./components/Invitations/Invitations";
import UserProfile from "./components/UserProfile/UserProfile";

import "animate.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const handleAuthentication = (isAuthenticated) => {
    setIsAuthenticated(isAuthenticated);
  };

  return (
    <Router Router basename="/">
      <div className="App">
        {!isAuthenticated && (
          <SignInUp handleAuthentication={handleAuthentication} />
        )}
        {isAuthenticated && (
          <>
            <Navbar handleLogOut={handleAuthentication} />
            <div className="content">
              <UserProfile />
              <Routes>
                <Route path="/Dashboard" element={<Dashboard />} />
                <Route path="/Issues" element={<Issues />} />
                <Route path="/Projects" element={<ProjectList />} />
                <Route path="/Teams" element={<TeamList />} />
                <Route path="/Users" element={<UserList />} />
                <Route
                  path="/Invitations"
                  element={<Invitations currentUser={currentUser} />}
                />
              </Routes>
            </div>
          </>
        )}
      </div>
    </Router>
  );
}

export default App;
