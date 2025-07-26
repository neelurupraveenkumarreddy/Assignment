import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./nar.css";

class Navbar extends Component {
  render() {
    return (
      <nav className="navbar">
        <div className="navbar-logo">
          <Link to="/">Banking System</Link>
        </div>
        <ul className="navbar-links">
          <li>
            <Link to="/">Customers</Link>
          </li>
        </ul>
      </nav>
    );
  }
}

export default Navbar;
