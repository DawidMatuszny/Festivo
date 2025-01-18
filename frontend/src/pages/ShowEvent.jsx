import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from "axios";
import api from "../api";
import "../styles/EventDetail.css";
import defaultimage from '../assets/images/image1.jpg';
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../NotificationContext";

const ShowEvent = () => {
    const { id } = useParams();
    const [eventData, setEventData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { notify } = useNotification(); 

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
            if (eventData.price > 0) {
                const response = await api.post(`/create-checkout-session/${id}/`);
                if (response.data?.url) {
                    window.location.href = response.data.url;
                } else {
                    toast.error("Nie udało się rozpocząć procesu płatności.");
                }
            } else {
                await api.post(`/event/register/`, { event: id });
                toast.success("Rejestracja zakończona sukcesem!");
            }
        } catch (error) {
            if (error.response?.status === 401) {
                navigate('/login');
                notify("Musisz być zalogowany, aby zarejestrować się na wydarzenie.");
            } else {
                const errorMsg = error.response?.data?.error || "Wystąpił błąd podczas rejestracji.";
                toast.error(errorMsg);
            }
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
                    </div>

                    <div className="event-image-container">
                        <img src={eventData.image || defaultimage} alt={eventData.title} className="event-detail-image" />
                    </div>

                    <div className="event-descriptions">
                        <p>{eventData.description}</p>
                    </div>

                    <div className="event-details">
                        <h3>Szczegóły wydarzenia:</h3>
                        <ul>
                            <li><strong>Data:</strong> {new Date(eventData.event_date).toLocaleDateString()}</li>
                            <li><strong>Godzina:</strong> {new Date(eventData.event_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</li>
                            <li><strong>Miejsce:</strong> {eventData.place}</li>
                            <li><strong>Adres:</strong> {eventData.address}</li>
                            <li><strong>Cena:</strong> {eventData.price > 0 ? `${eventData.price} PLN` : "Bezpłatne"}</li>
                        </ul>
                    </div>

                    <div className="event-registration">
                        <button className="register-button" onClick={handleRegister}>
                            {eventData.price > 0 ? "Zapisz się na wydarzenie i zapłać" : "Zapisz się na wydarzenie"}
                        </button>
                    </div>
                </div>
            </div>
        <ToastContainer position="top-center"/>
        </div>
    );
};

export default ShowEvent;