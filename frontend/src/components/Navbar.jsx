import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import "../styles/Main.css"
import { useState, useEffect } from "react";
import { ACCESS_TOKEN } from "../constants";
import { AiFillHome, AiFillCalendar, AiOutlineLogin, AiOutlineLogout } from 'react-icons/ai';
import { SiSimplelogin } from "react-icons/si";

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
      <nav id="navbar">
        <ul className="navbar-items flexbox-col">
          <li className="navbar-item flexbox-left">
            <a href="/" className="navbar-item-inner flexbox">
              <div className="navbar-item-inner-icon-wrapper flexbox">
              <AiFillHome />
              </div>
              <span className="link-text">Home</span>
            </a>

          </li>
          <li className="navbar-item flexbox-left">
            <a href="/events" className="navbar-item-inner flexbox">
              <div className="navbar-item-inner-icon-wrapper flexbox">
              <AiFillCalendar />
              </div>
              <span className="link-text">Wydarzenia</span>
            </a>
          </li>
        </ul>
        
          
        <ul className="navbar-items flexbox-col">
        {isLoggedIn ? (
          <li className="navbar-item flexbox-left">
          <a href="/logout" className="navbar-item-inner flexbox">
            <div className="navbar-item-inner-icon-wrapper flexbox">
            <AiOutlineLogout />
            </div>
            <span className="link-text">Wyloguj</span>
          </a>
        </li>
        ) :(
          <>
          <li className="navbar-item flexbox-left">
            <a href="/login" className="navbar-item-inner flexbox">
              <div className="navbar-item-inner-icon-wrapper flexbox">
              <AiOutlineLogin />
              </div>
              <span className="link-text">Zaloguj się</span>
            </a>
          </li>
          <li className="navbar-item flexbox-left">
            <a href="/register" className="navbar-item-inner flexbox">
              <div className="navbar-item-inner-icon-wrapper flexbox">
              <SiSimplelogin />
              </div>
              <span className="link-text">Stwórz konto</span>
            </a>
          </li>
          </>
        )}
        </ul>
      </nav>
    );
}

export default Navbar;
