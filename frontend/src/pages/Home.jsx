import React from 'react';
import ImageSlider from '../components/ImageSlider'; 
import '../styles/home.css'; 
import Navbar from "../components/Navbar";

function Home() {
    return (
      <div>
        <Navbar />
        <div className="home-container">
          <header className="home-header">
            <h1>Witaj na stronie głównej!</h1>
            <p>Witaj w naszej aplikacji. Cieszymy się, że tu jesteś!</p>
          </header>

          <section className="home-slider">
            {/* Tutaj dodajemy nasz komponent slajdera */}
            <ImageSlider />
          </section>

          <footer className="home-footer">
            <p>© 2024 Twoja Firma</p>
          </footer>
        </div>
      </div>
    );
}

export default Home;
