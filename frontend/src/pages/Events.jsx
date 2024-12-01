import React, { useState, useEffect } from 'react';
import axios from "axios";
import Navbar from "../components/Navbar";
import "../styles/Events.css";

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const fetchEvents = async () => {
        try {
        const response = await axios.get('http://127.0.0.1:8000/events/');
        const sortedEvents = response.data.sort((a, b) => {
            return new Date(a.event_date) - new Date(b.event_date);
          });
          setEvents(sortedEvents);
        setLoading(false);
        } catch (err) {
        setError('Nie udało się pobrać wydarzeń.');
        setLoading(false);
        }
    };

  
    useEffect(() => {
        fetchEvents();
    }, []);

    
    return (
        <div id="main"> 
        <div className="events-container">
        <h1>Nadchodzące wydarzenia</h1>
        <div className="events-list">
            {events.map((event) => (
            <div className="event-card" key={event.id}>
                
                <div className="event-details">
                <h3 className="event-title">{event.title}</h3>
                <p className="event-date">{new Date(event.event_date).toLocaleString()}</p>
                <p className="event-description">{event.description}</p>
                <a href={`/event/${event.id}`} className="event-link">
                    Zobacz
                </a>
                </div>
            </div>
            ))}
        </div>
        </div>
        </div>
    );
};

export default Events;
