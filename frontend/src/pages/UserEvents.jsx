import React, { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import "../styles/events.css";
import { ToastContainer, toast } from "react-toastify";
import image1 from "../assets/images/image1.jpg";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../NotificationContext";


const UserEvents = () => {
	const [events, setEvents] = useState([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();
	const { notify } = useNotification(); 

	useEffect(() => {
		const fetchEvents = async () => {
		try {
			const response = await api.get("userapi/created-events/");
			const upcomingEvents = response.data.filter(event => new Date(event.event_date) > new Date());
			setEvents(upcomingEvents);
		} catch (error) {
			if (error.originalError && error.originalError.status === 401) {
			navigate('/login');
			notify(error.message);
		} else {
			toast.error("Nie udało się pobrać wydarzeń.");
		}
		} finally {
			setLoading(false);
		}
		};

		fetchEvents();
	}, []);

	if (loading) return <p>Ładowanie...</p>;

	return (
		<div id="main">
			<div className='event-header'>
				<p><strong>Twoje wydarzenia</strong></p>
			</div>
			<div className="event-container">
				{events.map((event) => (
					<Link
						key={event.id}
						to={`/my-event/${event.id}`}
						className="event-card"
						style={{ textDecoration: "none" }}
					>
						<div
							className="event-image"
							style={{
								backgroundImage: `url(${event.image ? event.image : image1})`,
							}}
						></div>
						<div className='event-info'>
							<div className="event-description">
								<h3>{event.title}</h3>
								<p>{event.address}</p>
							</div>
							<div className='event-data-and-prize'>
								<div className='event-date'>
									<p>{new Date(event.event_date).toLocaleDateString()}</p>
								</div>
								<div className='event-price'>
									<p>{event.price > 0 ? `${event.price} zł` : "Bezpłatne!"}</p>
								</div>
							</div>
						</div>
					</Link>
				))}
			</div>
			<ToastContainer position="top-center" />
		</div>
	);
};

export default UserEvents;