import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import "../styles/Main.css"
import { useState, useEffect } from "react";
import { ACCESS_TOKEN } from "../constants";
import { AiFillHome, AiFillCalendar, AiOutlineLogin, AiOutlineLogout } from 'react-icons/ai';
import { MdAccountCircle } from "react-icons/md";
import { SiSimplelogin } from "react-icons/si";
import { IoCreateOutline } from "react-icons/io5";
import { useUser } from '../UserContext';

function Navbar() {
  const { isLogin, logout } = useUser();

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
        {isLogin ? (
          <>
          <li className="navbar-item flexbox-left">
          <a href="/events/create" className="navbar-item-inner flexbox">
            <div className="navbar-item-inner-icon-wrapper flexbox">
            <IoCreateOutline />
            </div>
            <span className="link-text">Dodaj wydarzenie</span>
          </a>
          </li>
          <li className="navbar-item flexbox-left">
          <a href="/profile" className="navbar-item-inner flexbox">
          <div className="navbar-item-inner-icon-wrapper flexbox">
            <MdAccountCircle />
          </div>
          <span className="link-text">Moje konto</span>
          </a>
          </li>
          <li className="navbar-item flexbox-left">
          <a onClick= { logout } className="navbar-item-inner flexbox">
            <div className="navbar-item-inner-icon-wrapper flexbox">
            <AiOutlineLogout />
            </div>
            <span className="link-text">Wyloguj</span>
          </a>
          </li>
          </>
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
