import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import image1 from '../assets/images/image1.jpg';
import "../styles/events.css";

const CategoryEvents = () => {
  const { category } = useParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/events/?category=${category}`);
        setEvents(response.data);
        setLoading(false);
      } catch (err) {
        setError('Nie udało się pobrać wydarzeń.');
        setLoading(false);
      }
    };
    fetchEvents();
  }, [category]);

  return (
    <div id='main'>
    <div className="event-container">
      {events.map((event) => (
        <a key={event.id} href={`/event/${event.id}`} className="event-card" style={{ textDecoration: 'none' }}>
          <div
            className="event-image"
            style={{
              backgroundImage: `url(${event.image ? event.image : image1})`, }}
          ></div>
          <div className="event-description">
            <h3>{event.title}</h3>
            <p>{event.description}</p>
          </div>
        </a>
      ))}
    </div>
    </div>
  );
};

export default CategoryEvents;
