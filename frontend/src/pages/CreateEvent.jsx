import { useState } from "react";
import "../styles/Form.css";
import api from "../api";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function CreateEvents() {
    const [title, setTitle] = useState("");
    const [eventdate, setEventdate] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [maxparticipants, setMaxparticipants] =useState(0);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await api.post("events/create/", {title, event_date:eventdate, location, description, max_participants:maxparticipants});
            
        } catch (error) {
            if (error.response && error.response.data) {
                const backendErrors = error.response.data;
                setErrors(backendErrors); 
              } else {
                setErrors({ general: "Wystąpił błąd. Spróbuj ponownie." });
              }
            } finally {
                setLoading(false);
            }
            
        }
    return (
        <div> 
        <Navbar />
        <div className="form-back">
        <form onSubmit={handleSubmit} className="form-container">
        <h1>Dodawanie wydarzenia</h1>
        
            <input
                className="form-input"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nazwa wydarzenia"
                required
                />
            <input
                className="form-input"
                type="datetime-local"
                value={eventdate}
                onChange={(e) => setEventdate(e.target.value)}
                placeholder="Data"
                required
                />
            <input
                className="form-input"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Lokalizacja wydarzenia"
                required
                />
            <input
                className="form-input"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Opis"
                required
                />
            <input
                className="form-input"
                type="number"
                value={maxparticipants}
                onChange={(e) => setMaxparticipants(e.target.value)}
                placeholder="Liczba miejsc"
                required
                />
                <button className="form-button" type="submit" disabled={loading}>
                {"Dodaj"}
        </button>
        </form>
    </div>
    </div>
    )
}

export default CreateEvents