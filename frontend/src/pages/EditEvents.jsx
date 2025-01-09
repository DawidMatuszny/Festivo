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
        console.log(response.data);
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
      const { image, ...dataToUpdate } = event;
      console.log("Sending data:", event);
      await api.put(`/events/edit/${id}/`, dataToUpdate,  {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
      navigate("/my-events");
    } catch (error) {
      console.log(error)
      toast.error("Nie udało się zaktualizować wydarzenia.");
    }
  };

  if (loading) return <p>Ładowanie...</p>;


  return (
    <div id="main">
      <div className="myevent-container">
        <div className="myevent-detail-card">
          <h1>Edytuj wydarzenie</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Tytuł</label>
              <input
                type="text"
                name="title"
                value={event.title}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Adres</label>
              <input
                type="text"
                name="address"
                value={event.address}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Data wydarzenia</label>
              <input
                type="datetime-local"
                name="event_date"
                value={new Date(event.event_date).toISOString().slice(0, 16)}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            <button type="submit" className="edit-button">
              Zapisz zmiany
            </button>
          </form>
        </div>
      </div>
      <ToastContainer position="top-center" />
    </div>
  );
};

export default EditEvent;
