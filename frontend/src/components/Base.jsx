import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import "../styles/Base.css";

const Base = ({ children }) => {
  const location = useLocation();
  const { isAuthorized, username, firstName, lastName, isStaff, isSuperuser } =
    useAuth();

  return (
    <div className="base-container">
      <nav className="navbar navbar-inverse navbar-fixed-top">
        <div className="container-fluid">
          <div className="navbar-header">
            <button
              type="button"
              className="navbar-toggle"
              data-toggle="collapse"
              data-target="#myNavbar"
            >
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <Link className="navbar-brand" to="/">
              Trip Planner
            </Link>
          </div>
          <div className="collapse navbar-collapse" id="myNavbar">
            <ul className="nav navbar-nav">
              <li className={location.pathname === "/" ? "active" : ""}>
                <Link to="/">Home</Link>
              </li>
              <li className={location.pathname === "/search" ? "active" : ""}>
                <Link to="/search">
                  Search - Hotels, Flights, and Attractions
                </Link>
              </li>
              <li
                className={
                  location.pathname === "/transportation" ? "active" : ""
                }
              >
                <Link to="/transportation">Find Transportation</Link>
              </li>
              <li
                className={
                  location.pathname === "/savesearch" ? "active" : ""
                }
              >
                <Link to="/savesearch">Saved Searches</Link>
              </li>
            </ul>
            <ul className="nav navbar-nav navbar-right">
              {isAuthorized ? (
                <>
                  <li>
                    <p className="greeting">
                      Welcome, {firstName} {lastName} ({username})!
                    </p>
                  </li>
                  <li>
                    <Link to="/logout">
                      <span className="glyphicon glyphicon-log-out"></span>{" "}
                      Logout
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/register">
                      <span className="glyphicon glyphicon-user"></span> Sign Up
                    </Link>
                  </li>
                  <li>
                    <Link to="/login">
                      <span className="glyphicon glyphicon-log-in"></span> Login
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <div className="body-content">{children}</div>

      <footer className="container-fluid text-center footer">
        <p>&copy; 2024 University of Nebraska Omaha. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Base;
