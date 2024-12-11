import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from "axios";
import api from "../api";
import "../styles/EventDetail.css";

const ShowEvent = () => {
    const { id } = useParams();
    const [eventData, setEventData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [registrationError, setRegistrationError] = useState(null);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://127.0.0.1:8000/event/${id}/`);
                setEventData(response.data);
            } catch (err) {
                setError('Nie udało się pobrać szczegółów wydarzenia.');
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id]);

    const handleRegister = async () => {
        try {
            await api.post(`/event/register/`, { event: id });
            alert("Rejestracja zakończona sukcesem!");
        } catch (error) {
            const errorMsg = error.response?.data?.detail || "Wystąpił błąd podczas rejestracji.";
            setRegistrationError(errorMsg);
        }
    };

    if (loading) return <p className="loading">Ładowanie szczegółów wydarzenia...</p>;
    if (error) return <p className="error">{error}</p>;
    if (!eventData) return <p className="no-event">Nie znaleziono wydarzenia.</p>;

    return (
        <div id='main'>
            <div className="center-container">
            <div className="event-detail-container">
                <div className="event-header">
                    <h1 className="event-title">{eventData.title}</h1>
                    <p className="event-date">
                        {new Date(eventData.event_date).toLocaleString()}
                    </p>
                </div>

                <div className="event-image-container">
                    <img src={eventData.image} alt={eventData.title} className="event-detail-image" />
                </div>

                <div className="event-description">
                    <h2>Opis wydarzenia</h2>
                    <p>{eventData.description}</p>
                </div>

                <div className="event-details">
                    <h3>Szczegóły wydarzenia:</h3>
                    <ul>
                        <li><strong>Data:</strong> {new Date(eventData.event_date).toLocaleDateString()}</li>
                        <li><strong>Godzina:</strong> {new Date(eventData.event_date).toLocaleTimeString()}</li>
                        <li><strong>Miejsce:</strong> {eventData.place}</li>
                        <li><strong>Adres:</strong> {eventData.address}</li>
                        <li><strong>Cena:</strong> {eventData.price ? `${eventData.price} PLN` : "Bezpłatne"}</li>
                    </ul>
                </div>

                <div className="event-registration">
                    <button className="register-button" onClick={handleRegister}>Zapisz się na wydarzenie!</button>
                    {registrationError && <p className="registration-error">{registrationError}</p>}
                </div>
            </div>
        </div>
        </div>
    );
};

export default ShowEvent;
