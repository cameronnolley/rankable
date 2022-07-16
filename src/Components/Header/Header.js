import React from "react";
import './Header.css';
import logo from '../../Images/rankabl-logo.png';
import { Link } from "react-router-dom";

const Header = (props) => {
  return (
    <header className="header">
        <div className="header-logo">
            <img src={logo} alt='rankabl-logo' className='logo' />
            <h1 className="brand">rankabl</h1>
        </div>
        <div className="nav-container">
            <nav className="nav">
                <ul className="nav-list">
                    <li className="nav-item">
                        <Link to='/'>RANK</Link>
                    </li>
                    <li className="nav-item">
                        <Link to='/rankings'>RANKINGS</Link>
                    </li>
                </ul>
            </nav>
        </div>
    </header>
  );
}

export default Header;