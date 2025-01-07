import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { ToastContainer, toast } from "react-toastify";

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
      <h1>{event.title}</h1>
      <p><strong>Adres:</strong> {event.address}</p>
      <p><strong>Data:</strong> {new Date(event.event_date).toLocaleDateString()}</p>
      <h2>Uczestnicy</h2>
      {participants.length === 0 ? (
        <p>Brak zapisanych uczestników.</p>
      ) : (
        <ul>
          {participants.map((participant) => (
            <li key={participant.id}>
              {participant.first_name} {participant.last_name} ({participant.email})
            </li>
          ))}
        </ul>
      )}
      <button onClick={() => navigate(`/edit-event/${id}`)}>Edytuj wydarzenie</button>
      <ToastContainer position="top-center" />
    </div>
  );
};

export default MyEventDetail;
