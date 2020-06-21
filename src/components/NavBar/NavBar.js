import React from "react";
import styles from "./NavBar.module.css";
import { NavLink, Link } from "react-router-dom";

function NavBar() {
  return (
    <div className={styles.navItems}>
      <header className={styles.navHeader}>
        <h1 className={styles.appHeader}>
          <Link to="/">Pro-Organizer</Link>
        </h1>
      </header>
      <ul className={styles.navLinks}>
        <li>
          <NavLink exact to="/" activeClassName={styles.active}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/createboard" activeClassName={styles.active}>
            Create a board{" "}
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default NavBar;
