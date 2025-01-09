import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { ToastContainer, toast } from "react-toastify";
import "../styles/MyEventDetail.css"
import defaultuser from "../assets/images/defaultuser.png";

const MyEventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await api.get(`/event/my-event/${id}/`);
        setEvent(response.data.event);
        setParticipants(response.data.participants);
        console.log(response.data.participants)
      } catch (error) {
        toast.error("Nie udało się pobrać szczegółów wydarzenia.");
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  if (loading) return <p>Ładowanie...</p>;

  return (
    <div id="main">
      <div className="myevent-container">
        <div className="myevent-detail-card">
          <h1>{event.title}</h1>
          <p><strong>Adres:</strong> {event.address}</p>
          <p><strong>Data:</strong> {new Date(event.event_date).toLocaleDateString()}</p>
          <p><strong>Wolne miejsca:</strong> {event.available_spots}</p>
          <button className="edit-button" onClick={() => navigate(`/edit-event/${id}`)}>
            Edytuj wydarzenie
          </button>
        </div>

        <div className="participant-list-card">
          <h2>Uczestnicy ({event.max_participants - event.available_spots})</h2>
          {participants.length === 0 ? (
            <p>Brak zapisanych uczestników.</p>
          ) : (
            <ul className="participant-list">
              {participants.map((participant) => (
                <li key={participant.id} className="participant-item">
                  <img
                    src={participant.profile_picture || defaultuser}
                    alt={`${participant.first_name} ${participant.last_name}`}
                    className="participant-image"
                  />
                  <div className="participant-info">
                    <p>
                      {participant.first_name} {participant.last_name}
                    </p>
                    <p>{participant.email}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <ToastContainer position="top-center" />
    </div>
  );
};

export default MyEventDetail;
