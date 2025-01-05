import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { ToastContainer, toast } from "react-toastify";


const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/event/${id}/`);
        setEvent(response.data);
      } catch (err) {
        setError("Nie udało się pobrać szczegółów wydarzenia.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEvent({ ...event, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/events/edit/${id}/`, event,  {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
      navigate("/my-events");
    } catch (error) {
      toast.error("Nie udało się zaktualizować wydarzenia.");
    }
  };

  if (loading) return <p>Ładowanie...</p>;

  return (
    <div id="main">
      <h1>Edytuj wydarzenie</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Tytuł:</label>
          <input
            type="text"
            name="title"
            value={event.title}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Adres:</label>
          <input
            type="text"
            name="address"
            value={event.address}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Data wydarzenia:</label>
          <input
            type="datetime-local"
            name="event_date"
            value={new Date(event.event_date).toISOString().slice(0, 16)}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit">Zapisz zmiany</button>
      </form>
      <ToastContainer position="top-center"/>
    </div>
  );
};

export default EditEvent;
