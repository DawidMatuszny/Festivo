import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import image1 from '../assets/images/image1.jpg';
import "../styles/events.css";

const CategoryEvents = () => {
	const { categoryID, categoryName } = useParams();
	const [events, setEvents] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchEvents = async () => {
			try {
				const response = await axios.get(`http://127.0.0.1:8000/events/?category=${categoryID}`);
				const upcomingEvents = response.data.filter(event => new Date(event.event_date) > new Date());
				setEvents(upcomingEvents);
				setLoading(false);
			} catch (err) {
				setError('Nie udało się pobrać wydarzeń.');
				setLoading(false);
			}
		};
		fetchEvents();
	}, [categoryID]);

	return (
		<div id='main'>
			<div className='event-header'>
				<p>Wydarzenia <strong>{categoryName}</strong></p>
			</div>
			<div className="event-container">
				{events.map((event) => (
					<a
						key={event.id}
						href={`/event/${event.id}`}
						className="event-card"
						style={{ textDecoration: 'none' }}
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
									<p>{event.price ? `${event.price} zł` : "Bezpłatne!"}</p>
								</div>
							</div>
						</div>
					</a>
				))}
			</div>
		</div>
	);
};


export default CategoryEvents;
