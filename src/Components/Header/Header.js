import React, { useEffect } from "react";
import './Header.css';
import logo from '../../Images/rankabl-logo.png';
import { Link } from "react-router-dom";

const Header = (props) => {
    useEffect(() => {
        if (window.location.pathname === '/') {
            document.getElementById('rank').classList.add('active');
        }
        if (window.location.pathname === '/rankings') {
            document.getElementById('rankings').classList.add('active');
        }
    }, [])

    return (
        <header className="header">
            <div className="header-logo">
                <img src={logo} alt='rankabl-logo' className='logo' />
                <h1 className="brand">rankabl</h1>
            </div>
            <div className="nav-container">
                <nav className="nav">
                    <ul className="nav-list">
                        <li className="nav-item" id='rank'>
                            <Link to={`/${(props.artistFilter && props.artistFilter.length > 0 && props.yearFilter && props.yearFilter > 0) ? '?artist=' + props.artistFilter.join('%2C') + '&years=' + props.yearFilter.join('%2C') : (props.artistFilter && props.artistFilter.length > 0) ? '?artist=' + props.artistFilter.join('%2C') : (props.yearFilter && props.yearFilter.length > 0) ? '?years=' + props.yearFilter.join('%2C') : ''}`}>RANK</Link>
                        </li>
                        <li className="nav-item" id='rankings'>
                            <Link to={props.headerParams ? '/rankings' + '?' + props.headerParams.toString() : '/rankings' }>RANKINGS</Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default Header;