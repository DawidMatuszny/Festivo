import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { ToastContainer, toast } from "react-toastify";

const EditEvent = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [event, setEvent] = useState(null);
	const [loading, setLoading] = useState(true);
	const [imageFile, setImageFile] = useState(null);

	useEffect(() => {
		const fetchEvent = async () => {
		try {
			const response = await api.get(`/event/${id}/`);
			setEvent(response.data);
		} catch (error) {
			toast.error("Nie udało się pobrać szczegółów wydarzenia.");
		} finally {
			setLoading(false);
		}
		};

		fetchEvent();
	}, [id]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;

		if (name === "max_participants") {
		const newMaxParticipants = parseInt(value, 10);
		const currentParticipants = event.max_participants - event.available_spots;
		const newAvailableSpots = newMaxParticipants - currentParticipants;

		setEvent({
			...event,
			[name]: newMaxParticipants,
			available_spots: newAvailableSpots,
		});
		} else {
		setEvent({ ...event, [name]: value });
		}
	};

	const handleImageChange = (e) => {
		setImageFile(e.target.files[0]);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
		const { image, ...dataToUpdate } = event;

		const formData = new FormData();
		Object.keys(dataToUpdate).forEach((key) => {
			formData.append(key, dataToUpdate[key]);
		});

		if (imageFile) {
			formData.append("image", imageFile);
		}

		await api.put(`/events/edit/${id}/`, formData, {
			headers: {
			"Content-Type": "multipart/form-data",
			},
		});

		navigate(`/my-event/${event.id}`);
		} catch (error) {
		const errorMessage =
			error.response && error.response.data
			? error.response.data.detail
			: "Nie udało się zaktualizować wydarzenia.";
		toast.error(errorMessage);
		}
	};

	if (loading) return <p>Ładowanie...</p>;

	return (
		<div id="main">
		<div className="myevent-container">
			<div className="myevent-detail-card">
			<h1>Edytuj wydarzenie</h1>
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
				<label>Miejsce</label>
				<input
					type="text"
					name="place"
					value={event.place}
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
				<label>Opis</label>
				<textarea
					type="text"
					name="description"
					value={event.description}
					onChange={handleInputChange}
					className="form-input-desc"
				/>
				</div>
				<div className="form-group">
				<label>Miejsca</label>
				<input
					type="text"
					name="max_participants"
					value={event.max_participants}
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
				<div className="form-group">
				<label>Cena</label>
				<input
					type="text"
					name="price"
					value={event.price}
					onChange={handleInputChange}
					className="form-input"
				/>
				</div>

			
			
			</div>

			<div className="image-edit-card">
			<h2>Zmień zdjęcie wydarzenia</h2>
			<div className="image-preview-container">
				{event.image && (
				<img
					src={event.image}
					alt="Event Preview"
					className="image-thumbnail"
				/>
				)}
			</div>
			<input
				type="file"
				name="image"
				onChange={handleImageChange}
				className="form-input-file"
			/>
			</div>
			<form onSubmit={handleSubmit}>
			<button type="submit" className="edit-button">
				Zapisz zmiany
			</button>
			</form>
		</div>
		<ToastContainer position="top-center" />
		</div>
	);
};

export default EditEvent;