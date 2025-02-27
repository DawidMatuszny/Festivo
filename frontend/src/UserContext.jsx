import React, { createContext, useState, useContext, useEffect } from 'react';
import { ACCESS_TOKEN, REFRESH_TOKEN } from './constants';
import { useNavigate } from "react-router-dom";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem(ACCESS_TOKEN)) {
      setIsLogin(true);
    }
  }, []);

  const login = (accessToken, refreshToken) => {
    localStorage.setItem(ACCESS_TOKEN, accessToken);
    localStorage.setItem(REFRESH_TOKEN, refreshToken);
    setIsLogin(true);
  };

  const logout = () => {
    setTimeout(() => {
        localStorage.clear();
        navigate("/login");
    setIsLogin(false);
    }, 200);
  };

  return (
    <UserContext.Provider value={{ isLogin, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);