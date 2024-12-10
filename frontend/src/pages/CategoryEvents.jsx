import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import image1 from '../assets/images/image1.jpg';

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
     <div className="events-container">
      {events.length > 0 ? (
        events.map((event) => (
          <div key={event.id} className="event-card">
            <div className="event-image">
              <img src={event.image_url || image1 } alt={event.title} />
            </div>
            <div className="event-content">
              <h3 className="event-title">{event.title}</h3>
              <p className="event-date">{new Date(event.event_date).toLocaleString()}</p>
              <p className="event-description">{event.description}</p>
              <a href={`/event/${event.id}`} className="event-link">Zobacz więcej</a>
            </div>
          </div>
        ))
      ) : (
        <p className="no-events">Brak wydarzeń dla tej kategorii.</p>
      )}
    </div>
    </div>
  );
};

export default CategoryEvents;
