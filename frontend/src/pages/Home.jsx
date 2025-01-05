import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import '../styles/home.css';
import image1 from '../assets/images/image1.jpg';
import logo from '../assets/images/logo.jpg';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleItems, setVisibleItems] = useState(3); 
  const [events, setEvents] = useState([]);
  const sliderRef = useRef(null);
  const totalItems = 10; 
  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/events/');
      const sortedEvents = response.data
        .filter(event => new Date(event.event_date) > new Date()) 
        .sort((a, b) => new Date(a.event_date) - new Date(b.event_date))
        .slice(0, totalItems);
      setEvents(sortedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < totalItems - visibleItems) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const updateSliderPosition = () => {
    if (sliderRef.current && sliderRef.current.children.length > 0) {
      const itemWidth = sliderRef.current.children[0].offsetWidth + 20; 
      sliderRef.current.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
    }
  };

   const updateVisibleItems = () => {
    if (sliderRef.current && sliderRef.current.children.length > 0) {
      const itemWidth = sliderRef.current.children[0].offsetWidth + 20;
      const containerWidth = sliderRef.current.parentElement.offsetWidth;
      const newVisibleItems = Math.floor(containerWidth / itemWidth); 
      setVisibleItems(newVisibleItems);
    }
  };

  useEffect(() => {
    updateSliderPosition();
    console.log(currentIndex);
  }, [currentIndex, visibleItems]);

 
  useEffect(() => {
    updateVisibleItems(); 
    window.addEventListener('resize', updateVisibleItems); 

    return () => {
      window.removeEventListener('resize', updateVisibleItems); 
    };
  }, []);

  const handleEventClick = (eventId) => {
    navigate(`/event/${eventId}`); 
  };

  return (
    <div id="main">
  <div 
    className="logo" 
    style={{ backgroundImage: `url(${logo})` }} 
  ></div>
  <div className="slider-container">
    <h2 className="sliders-heading">Nadchodzące wydarzenia</h2>
    <button 
      className="button prev" 
      onClick={handlePrev} 
      disabled={currentIndex === 0}
    >
      ←
    </button>
    <div className="slider" ref={sliderRef}>
      {events.map((event) => (
        <div className="item" key={event.id}  onClick={() => handleEventClick(event.id)} style={{ cursor: "pointer" }}>
          <div className="sliders-description">
            <h3>{event.title}</h3>
            <p>{event.address}</p>
            <p> {new Date(event.event_date).toLocaleDateString()}</p>
          </div>
          <div
            className="image"
            style={{ backgroundImage: `url(${event.image ? event.image : image1})` }}
          ></div>
        </div>
      ))}
    </div>
    <button 
      className="button next" 
      onClick={handleNext} 
      disabled={currentIndex >= events.length - visibleItems}
    >
      →
    </button>
  </div>
</div>
  );
};

  

export default Home;