import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faMultiply } from "@fortawesome/free-solid-svg-icons";

const Navbar = ({ handleLogOut }) => {
  const close = () => {
    const ele = document.getElementById("menu");
    ele.style.display = "none";
  };

  const open = () => {
    const ele = document.getElementById("menu");
    ele.style.display = "block";
  };

  const handleSignOut = () => {
    localStorage.removeItem("currentUser");
    handleLogOut(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <a href="#Home">Bug Tracker</a>
        <div className="hamburger">
          <FontAwesomeIcon icon={faBars} onClick={open} />
        </div>
      </div>
      <div className="navbar-menu" id="menu">
        <div className="close">
          <FontAwesomeIcon icon={faMultiply} onClick={close} />
        </div>
        <ul>
          <li className="animate_animated">
            <Link to="/Dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/Teams">Teams</Link>
          </li>
          <li>
            <Link to="/Projects">Projects</Link>
          </li>
          <li>
            <Link to="/Issues">Issues</Link>
          </li>
          <li>
            <Link to="/Users">Users</Link>
          </li>
          <li>
            <Link to="/Invitations">Invitations</Link>
          </li>
          <button className="btn-grad" onClick={handleSignOut}>
            Sign Out
          </button>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
