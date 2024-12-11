import { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";
import { useNotification } from "../NotificationContext";
import "../styles/Profile.css";

function Profile() {
  const [email, setEmail] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { logout } = useUser();
  const { notify } = useNotification();

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
      const now = new Date();
      const upcoming = response.data.filter(event => new Date(event.event_date) >= now);
      const past = response.data.filter(event => new Date(event.event_date) < now);
      setUpcomingEvents(upcoming);
      setPastEvents(past);
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main id="main" className="profile-page">
      <section className="profile-header">
        <h1>{firstName} {lastName}</h1>
        <p>Email: {email}</p>
      </section>

      <section className="events-section">
        <h2>Nadchodzące wydarzenia</h2>
        {upcomingEvents.length > 0 ? (
          <ul className="events-list">
            {upcomingEvents.map(event => (
                <a href={`/event/${event.id}`} className="event-link">
              <li key={event.id} className="event-card">
                <h3>{event.title}</h3>
                <p>Data: {new Date(event.event_date).toLocaleString()}</p>
              </li>
              </a>
            ))}
          </ul>
        ) : (
          <p>Brak wydarzeń.</p>
        )}
      </section>

      <section className="events-section">
        <h2>Historia wydarzeń</h2>
        {pastEvents.length > 0 ? (
          <ul className="events-list">
            {pastEvents.map(event => (
              <li key={event.id} className="event-card">
                <h3>{event.title}</h3>
                <p>Data: {new Date(event.event_date).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>Brak wydarzeń.</p>
        )}
      </section>
    </main>
  );
}

export default Profile;
