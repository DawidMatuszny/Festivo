import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from "axios";
import api from "../api";
import Navbar from "../components/Navbar";

const ShowEvent = () => {
    const { id } = useParams();
    const [eventData, setEventData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://127.0.0.1:8000/event/${id}/`);
                setEventData(response.data);
            } catch (err) {
                setError('Failed to fetch event details');
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id]);

    if (loading) return <p>Loading event details...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!eventData) return <p>No event found.</p>;

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await api.post(`/event/register/`, { event: id});
          } catch (error) {
            console.error(error.response?.data || "Unknown error");
            if (error.response && error.response.data) {
              const backendErrors = error.response.data;
              setError(backendErrors); 
            } else {
              setError({ general: "Wystąpił błąd. Spróbuj ponownie." });
            }
          } finally {
          }
    };

    return (
        <div id='main'>
            <h1>{eventData.title}</h1>
            <p>Date: {new Date(eventData.event_date).toLocaleString()}</p>
            <p>Location: {eventData.location}</p>
            <p>Description: {eventData.description}</p>
            <button onClick={handleSubmit}>Kliknij mnie</button>
        </div>
    );
};

export default ShowEvent;
