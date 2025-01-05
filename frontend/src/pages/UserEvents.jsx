import React, { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import "../styles/events.css";
import { ToastContainer, toast } from "react-toastify";


const UserEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get("userapi/created-events/");
        setEvents(response.data);
      } catch (error) {
        toast.error("Nie udało się pobrać wydarzeń.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <p>Ładowanie...</p>;

  return (
    <div id="main">
      <h1>Twoje wydarzenia</h1>
      <div className="event-container">
        {events.map((event) => (
          <div key={event.id} className="event-card">
            <h3>{event.title}</h3>
            <p>{event.address}</p>
            <p>{new Date(event.event_date).toLocaleDateString()}</p>
            <Link to={`/edit-event/${event.id}`}>Edytuj</Link>
          </div>
        ))}
      </div>
      <ToastContainer position="top-center"/>
    </div>
  );
};

export default UserEvents;
