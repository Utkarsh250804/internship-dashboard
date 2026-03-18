import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container-fluid">

        <Link className="navbar-brand" to="/">React Exercises</Link>

        <div className="navbar-nav">
          <Link className="nav-link" to="/counter">Counter</Link>
          <Link className="nav-link" to="/fetch">Fetch API</Link>
          <Link className="nav-link" to="/pagination">Pagination</Link>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;