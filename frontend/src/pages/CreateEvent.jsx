import { useState, useEffect } from "react";
import "../styles/Form.css";
import api from "../api";
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
    const [image, setImage] = useState(null);
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
    
    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append("title", title);
        formData.append("event_date", eventdate);
        formData.append("place", place);
        formData.append("address", address);
        formData.append("description", description);
        formData.append("max_participants", maxparticipants);
        formData.append("category", category);

        if (image) {
            formData.append("image", image);
        }

        try {
            const res = await api.post("events/create/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            toast.success("Wydarzenie zostało pomyślnie dodane!");

            setTitle("");
            setEventdate("");
            setPlace("");
            setAddress("");
            setDescription("");
            setMaxparticipants(0);
            setCategory(availablecategories.length > 0 ? availablecategories[0].id : "");
            setImage(null);
            setErrors({});
            
        } catch (error) {
            if (error.response && error.response.data) {
                const backendErrors = error.response.data;
                setErrors(backendErrors);
                console.log(backendErrors)
            } else {
                setErrors({ general: "Wystąpił błąd. Spróbuj ponownie." });
            }
            if (error.originalError && error.originalError.status === 401) {
                notify("Sesja wygasła, zaloguj się ponownie!");
                logout();
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div id="main"> 
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
            {errors.title && <p className="form-error">{errors.title}</p>}
            <input
                className="form-input"
                type="datetime-local"
                value={eventdate}
                onChange={(e) => setEventdate(e.target.value)}
                placeholder="Data"
                required
                />
            {errors.event_date && <p className="form-error">{errors.event_date}</p>}
            <input
                className="form-input"
                type="text"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                placeholder="Miejsce wydarzenia"
                required
                />
            {errors.place && <p className="form-error">{errors.place}</p>}
             <input
                className="form-input"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Adres wydarzenia"
                required
                />
            {errors.address && <p className="form-error">{errors.address}</p>}
            <textarea
                className="form-input-desc"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Opis"
                required
                />
            {errors.description && <p className="form-error">{errors.description}</p>}
            <input
                className="form-input"
                type="number"
                value={maxparticipants}
                onChange={(e) => setMaxparticipants(e.target.value)}
                placeholder="Liczba miejsc"
                required
                />
            {errors.max_participants && <p className="form-error">{errors.max_participants}</p>}
            <label htmlFor="categories">Kategoria</label>
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
            <input
                className="form-input"
                type="file"
                onChange={handleFileChange}
            />
            <p className="errors">{errors.image}</p>

            <button className="form-button" type="submit" disabled={loading}>
                {loading ? "Dodawanie..." : "Dodaj"}
            </button>
        </form>
    </div>
    <ToastContainer position="top-center"/>
    </div>
    );
}

export default CreateEvents