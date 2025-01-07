import React, { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import "../styles/events.css";
import { ToastContainer, toast } from "react-toastify";
import image1 from "../assets/images/image1.jpg";


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
          <Link
            key={event.id}
            to={`/my-event/${event.id}`}
            className="event-card"
            style={{ textDecoration: "none" }}
          >
            <div
              className="event-image"
              style={{
                backgroundImage: `url(${event.image ? event.image : image1})`,
              }}
            ></div>
            <div className="event-description">
              <h3>{event.title}</h3>
              <p>{event.address}</p>
            </div>
            <div className="event-date">
              <p>{new Date(event.event_date).toLocaleDateString()}</p>
            </div>
          </Link>
        ))}
      </div>
      <ToastContainer position="top-center" />
    </div>
  );
};

export default UserEvents;