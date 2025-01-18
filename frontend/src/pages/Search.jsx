import { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import image1 from "../assets/images/image1.jpg";
import { ToastContainer, toast } from "react-toastify";

function Search() {
  const location = useLocation();
  const initialResults = location.state?.results || [];
  const [results, setResults] = useState(initialResults);
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setShowLoading(false);
    setHasSearched(true);

    const timer = setTimeout(() => {
      setShowLoading(true);
    }, 300);

    try {
      const params = new URLSearchParams();
      if (title) params.append("q", title);
      if (address) params.append("address", address);
      if (dateFrom) params.append("date_from", dateFrom);
      if (dateTo) params.append("date_to", dateTo);

      const response = await axios.get(`http://127.0.0.1:8000/event/search/?${params.toString()}`);
      setResults(response.data);
    } catch (error) {
      console.error("Błąd podczas wyszukiwania:", error);
    } finally {
      clearTimeout(timer);
      setLoading(false);
      setShowLoading(false);
    }
  };

  return (
    <div id="main">
      <div>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Tytuł wydarzenia..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="search-input"
          />
          <input
            type="text"
            placeholder="Miejsce wydarzenia..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="search-input"
          />
          <input
            type="date"
            placeholder="Data od..."
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="search-input"
          />
          <input
            type="date"
            placeholder="Data do..."
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">
            {loading ? "Szukam..." : "Szukaj"}
          </button>
        </form>
        <div>
          {loading && showLoading ? (
            <p>Ładowanie wyników...</p>
          ) : hasSearched && results.length === 0 ? (
            <p>Brak wyników.</p>
          ) : (
            <div className="event-container">
              {results.map((event) => (
                <a
                  key={event.id}
                  href={`/event/${event.id}`}
                  className="event-card"
                  style={{ textDecoration: "none" }}
                >
                  <div
                    className="event-image"
                    style={{
                      backgroundImage: `url(${event.image ? event.image : image1})`,
                    }}
                  ></div>
                  <div className="event-info">
                    <div className="event-description">
                      <h3>{event.title}</h3>
                      <p>{event.address}</p>
                    </div>
                    <div className="event-data-and-prize">
                      <div className="event-date">
                        <p>{new Date(event.event_date).toLocaleDateString()}</p>
                      </div>
                      <div className="event-price">
                        <p>{event.price > 0 ? `${event.price} zł` : "Bezpłatne!"}</p>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
      <ToastContainer position="top-center" />
    </div>
  );
};

export default Search;
