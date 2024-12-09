import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../styles/events.css";
import image1 from '../assets/images/muzyka.jpg';

const Events = () => {
  const [categories, setCategories] = useState([]);  // Lista kategorii
  const [events, setEvents] = useState([]);  // Wydarzenia dla wybranej kategorii
  const [selectedCategory, setSelectedCategory] = useState("");  // Wybrana kategoria
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pobieranie dostępnych kategorii
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/event/categories/');
        setCategories(response.data);  // Zapisujemy kategorie w stanie
      } catch (err) {
        setError('Nie udało się pobrać kategorii.');
      }
    };
    fetchCategories();
  }, []);

  // Pobieranie wydarzeń dla wybranej kategorii
  useEffect(() => {
    if (selectedCategory) {
      const fetchEventsByCategory = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`http://127.0.0.1:8000/events/?category=${selectedCategory}`);
          setEvents(response.data);  // Zapisujemy wydarzenia w stanie
          setLoading(false);
        } catch (err) {
          setError('Nie udało się pobrać wydarzeń.');
          setLoading(false);
        }
      };
      fetchEventsByCategory();
    }
  }, [selectedCategory]);  // Używamy selectedCategory jako zależność

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);  // Ustawiamy wybraną kategorię
  };

  return (
    <div id='main'>
      <h1>Wydarzenia</h1>
      
      {/* Wybór kategorii */}
      <div>
      
        <label htmlFor="category">Wybierz kategorię:</label>
        <select id="category" onChange={handleCategoryChange}>
          <option value="">Wybierz kategorię</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <div class="mask-container">
        <div class="mask-background"></div>
        <div
      className="mask1"
      style={{
        width: '400px',
        height: '300px',
        backgroundImage: `url(${image1})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    ></div>
    </div>
      </div>
      
      {/* Wyświetlanie błędu, jeśli wystąpił */}
      {error && <div>{error}</div>}
      
      {/* Wyświetlanie loading state */}
      {loading && <div>Ładowanie wydarzeń...</div>}
      
      {/* Wyświetlanie wydarzeń */}
      <div>
        {events.length === 0 && !loading && <p>Brak wydarzeń w tej kategorii.</p>}
        {events.map((event) => (
          <div key={event.id} className="event-card">
            <h3>{event.title}</h3>
            <p>{new Date(event.event_date).toLocaleString()}</p>
            <p>{event.description}</p>
            <a href={`/event/${event.id}`}>Zobacz szczegóły</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;
