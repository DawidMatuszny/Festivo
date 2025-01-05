import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import CreateEvents from "./pages/CreateEvent";
import Events from "./pages/Events";
import ShowEvent from "./pages/ShowEvent";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import UserEvents from "./pages/UserEvents";
import EditEvent from "./pages/EditEvents";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import CategoryEvents from './pages/CategoryEvents';
import "./styles/main.css"
import { UserProvider } from './UserContext';
import { NotificationProvider } from "./NotificationContext";

function Logout() {
  localStorage.clear();
  return <Navigate to="/" />;
}

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <NotificationProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/events/create" element={<ProtectedRoute><CreateEvents /></ProtectedRoute>} />
          <Route path="/events" element={<Events />} />
          <Route path="/event/:id" element={<ShowEvent />} />
          <Route path="/events/:category" element={<CategoryEvents />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/search" element={<Search />} />
          <Route path="/my-events" element={<UserEvents />} />
          <Route path="/edit-event/:id" element={<EditEvent />} />
        </Routes>
        </NotificationProvider>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;