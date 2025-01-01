import { useState, useEffect } from "react";
import api from "../api";
import { useUser } from "../UserContext";
import { useNotification } from "../NotificationContext";
import Calendar from "react-calendar";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";
import "react-calendar/dist/Calendar.css";

function Profile() {
  const [email, setEmail] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { logout } = useUser();
  const { notify } = useNotification();
  const navigate = useNavigate();

  const fetchUserProfile = async () => {
    try {
      const response = await api.get("/userapi/profile/");
      setEmail(response.data.email);
      setFirstName(response.data.first_name);
      setLastName(response.data.last_name);
    } catch (error) {
      setError("Failed to fetch user profile.");
      notify(error.message);
      logout();
    }
  };

  const fetchUserEvents = async () => {
    try {
      const response = await api.get("/userapi/events/");
      const mappedEvents = response.data.map(event => ({
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
      return events.some(event => event.event_date.toDateString() === date.toDateString())
        ? "event-day"
        : null;
    }
  };

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const dayEvents = events.filter(event => event.event_date.toDateString() === date.toDateString());
      if (dayEvents.length > 0) {
        return <div className="event-dot"></div>;
      }
    }
    return null;
  };

  const getEventsForSelectedDate = () => {
    if (!selectedDate) return [];
    return events.filter(event => event.event_date.toDateString() === selectedDate.toDateString());
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const eventsForSelectedDate = getEventsForSelectedDate();

  return (
    <main id="main" className="profile-page">
      <section className="profile-header">
        <h1>{firstName} {lastName}</h1>
        <p>Email: {email}</p>
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
            <h3>Wydarzenia na {selectedDate ? selectedDate.toLocaleDateString() : "wybrany dzień"}</h3>
            {eventsForSelectedDate.length > 0 ? (
              <ul className="events-list">
                {eventsForSelectedDate.map(event => (
                  <li
                    key={event.id}
                    className="event-card"
                    onClick={() => handleEventClick(event.id)} // Obsługa kliknięcia
                    style={{ cursor: "pointer" }} // Styl kursora
                  >
                    <h4>{event.title}</h4>
                    <p>{event.event_date.toLocaleTimeString()}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Brak wydarzeń tego dnia.</p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Profile;
