import { useState, useEffect } from "react";
import "../styles/Form.css";
import api from "../api";
import Navbar from "../components/Navbar";
import { useUser } from "../UserContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../NotificationContext";

function CreateEvents() {
    const [title, setTitle] = useState("");
    const [eventdate, setEventdate] = useState("");
    const [place, setPlace] = useState("");
    const [address, setAddress] = useState("");
    const [description, setDescription] = useState("");
    const [maxparticipants, setMaxparticipants] =useState(0);
    const [category, setCategory] = useState("");
    const [availablecategories, setAvailablecategories] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const { logout } = useUser();
    const { notify } = useNotification(); 
    const navigate = useNavigate();

    useEffect(() => {
        const fetchcategories = async () => {
          try {
            const res = await api.get("/event/categories/");
            setAvailablecategories(res.data);
            setCategory(res.data[0].id);    
          } catch (error) {
            console.error("Błąd pobierania kategorii:", error);
          }
        };
        fetchcategories();
    }, []);
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post("events/create/", {
                title, 
                event_date:eventdate, 
                place,
                address,
                description, 
                max_participants:maxparticipants, 
                category});
            toast.success("Wydarzenie zostało pomyślnie dodane!");

        } catch (error) {
            if (error.response && error.response.data) {
                const backendErrors = error.response.data;
                setErrors(backendErrors); 
              } else {
                setErrors({ general: "Wystąpił błąd. Spróbuj ponownie." });
              }
            if (error.originalError.status === 401) {
                notify("Sesja wygasła, zaloguj się ponownie!");
                logout();
            }
            } finally {
                setLoading(false);
            }
            
        };

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
            <p className='errors'>{errors.title}</p>
            <input
                className="form-input"
                type="datetime-local"
                value={eventdate}
                onChange={(e) => setEventdate(e.target.value)}
                placeholder="Data"
                required
                />
            <p className='errors'>{errors.event_date}</p>
            <input
                className="form-input"
                type="text"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                placeholder="Miejsce wydarzenia"
                required
                />
            <p className='errors'>{errors.place}</p>
             <input
                className="form-input"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Adres wydarzenia"
                required
                />
            <p className='errors'>{errors.address}</p>
            <textarea
                className="form-input-desc"
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
            <label htmlFor="categories">Tagi</label>
            <select
                className="form-input"
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
            >
                {availablecategories.map((tag) => (
                    <option key={tag.id} value={tag.id}>
                        {tag.name}
                    </option>
                ))}
            </select>

            <button className="form-button" type="submit" disabled={loading}>
            {"Dodaj"}
            </button>
        </form>
    </div>
    <ToastContainer position="top-center"/>
    </div>
    );
}

export default CreateEvents