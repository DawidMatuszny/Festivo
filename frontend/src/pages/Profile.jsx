import { useState, useEffect } from "react";
import api from "../api";
import { useUser } from "../UserContext";
import { useNotification } from "../NotificationContext";
import Calendar from "react-calendar";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";
import "react-calendar/dist/Calendar.css";
import defaultuser from "../assets/images/defaultuser.png";
import { ToastContainer, toast } from "react-toastify";

function Profile() {
  const [email, setEmail] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { logout } = useUser();
  const { notify } = useNotification();
  const navigate = useNavigate();

  const fetchUserProfile = async () => {
    try {
      const response = await api.get("/userapi/profile/");
      setEmail(response.data.email);
      setFirstName(response.data.first_name);
      setLastName(response.data.last_name);
      setProfilePicture(response.data.profile_picture);
    } catch (error) {
      setError("Failed to fetch user profile.");
      notify(error.message);
      logout();
    }
  };

  const fetchUserEvents = async () => {
    try {
      const response = await api.get("/userapi/events/");
      const mappedEvents = response.data.map((event) => ({
        ...event,
        event_date: new Date(event.event_date),
      }));
      setEvents(mappedEvents);
    } catch (error) {
      setError("Failed to fetch user events.");
      notify(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profile_picture", file);

      try {
        const response = await api.post("/userapi/upload-profile-picture/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setProfilePicture(response.data.profile_picture);
        notify("Zdjęcie profilowe zostało zaktualizowane!");
      } catch (error) {
        notify("Nie udało się zaktualizować zdjęcia profilowego.");
      }
    }
    fetchUserProfile();
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Nowe hasło i potwierdzenie hasła muszą być takie same.");
      return;
    }
  
    try {
      const response = await api.post("/userapi/change-password/", {
        old_password: oldPassword,
        new_password: newPassword,
      });
      toast.success(response.data.message);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowChangePassword(false);
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Nie udało się zmienić hasła.";
      if (Array.isArray(error.response?.data?.error)) {
        error.response.data.error.forEach((msg) => toast.error(msg));
      } else {
        toast.error(errorMessage);
      }
    }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchUserEvents();
  }, []);

  const handleDayClick = (date) => {
    setSelectedDate(date);
  };

  const handleEventClick = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      return events.some((event) => event.event_date.toDateString() === date.toDateString())
        ? "event-day"
        : null;
    }
  };

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const dayEvents = events.filter(
        (event) => event.event_date.toDateString() === date.toDateString()
      );
      if (dayEvents.length > 0) {
        return <div className="event-dot"></div>;
      }
    }
    return null;
  };

  const getEventsForSelectedDate = () => {
    if (!selectedDate) return [];
    return events
      .filter((event) => event.event_date.toDateString() === selectedDate.toDateString())
      .sort((a, b) => a.event_date - b.event_date); 
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const eventsForSelectedDate = getEventsForSelectedDate();

  return (
    <main id="main" className="profile-page">
      <section className="profile-header">
        <div className="profile-picture-container">
          <label htmlFor="profile-picture-upload" className="profile-picture-label">
            <div className="overlay">
              <span className="edit-text">Edytuj zdjęcie</span>
            </div>
            <img
              src={profilePicture || defaultuser}
              alt="Profile"
              className="profile-picture"
            />
          </label>
          <input
            id="profile-picture-upload"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleProfilePictureUpload}
          />
        </div>
        <h1>
          {firstName} {lastName}
        </h1>
        <p>{email}</p>
        <button
          className="btn-prof"
          onClick={() => setShowChangePassword(!showChangePassword)}
        >
          Zmień hasło
        </button>
        <button
          className="btn-prof"
          onClick={() => navigate('/my-events')}
          
        >
          Moje wydarzenia
        </button>
        {showChangePassword && (
          <div className="change-password-form-container">
            <form className="change-password-form" onSubmit={handlePasswordChange}>
              <div className="form-group">
                <label htmlFor="old-password">Obecne hasło</label>
                <input
                  type="password"
                  id="old-password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="new-password">Nowe hasło</label>
                <input
                  type="password"
                  id="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirm-password">Potwierdź nowe hasło</label>
                <input
                  type="password"
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn">Zapisz zmiany</button>
            </form>
          </div>
        )}
      </section>

      <section className="calendar-section">
        <h2>Kalendarz wydarzeń</h2>
        <div className="calendar-container">
          <div className="calendar-wrapper">
            <Calendar
              onClickDay={handleDayClick}
              tileClassName={tileClassName}
              tileContent={tileContent}
            />
          </div>
          <div className="events-list-container">
            <h3>
              Wydarzenia na {selectedDate ? selectedDate.toLocaleDateString() : "wybrany dzień"}
            </h3>
            {eventsForSelectedDate.length > 0 ? (
              <ul className="events-list">
                {eventsForSelectedDate.map((event) => (
                  <li
                    key={event.id}
                    className="event-card-p"
                    onClick={() => handleEventClick(event.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <h4>{event.title}</h4>
                    <p>{event.event_date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Brak wydarzeń tego dnia.</p>
            )}
          </div>
          <ToastContainer position="top-center"/>
        </div>
      </section>
    </main>
  );
}

export default Profile;
