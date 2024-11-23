import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import { useState, useEffect } from "react";
import { ACCESS_TOKEN } from "../constants";

function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            setIsLoggedIn(true); 
        } else {
            setIsLoggedIn(false);  
        }
    }, []);

    return (
        <nav className="navbar">
            <ul className="navbar-list">
                <li className="navbar-item">
                    <Link to="/" className="navbar-link">Home</Link>
                </li>
                <li className="navbar-item">
                    <Link to="/events" className="navbar-link">Wydarzenia</Link>
                </li>
                <div className="navbar-right">
                    {isLoggedIn ? (
                    <li className="navbar-item">
                        <Link to="/logout" className="navbar-link">Wyloguj</Link>
                    </li>
                    ) : (
                        <>
                            <li className="navbar-item">
                                <Link to="/login" className="navbar-link">Logowanie</Link>
                            </li>
                            <li className="navbar-item">
                                <Link to="/register" className="navbar-link">Rejestracja</Link>
                            </li>
                        </>
                    )}
                </div>
            </ul>
        </nav>
    );
}

export default Navbar;
