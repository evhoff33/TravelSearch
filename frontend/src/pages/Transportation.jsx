import React, { useState } from 'react';
import api from '../api';
import '../styles/Transportation.css';
import LoadingIndicator from '../components/LoadingIndicator';

function Transportation() {
  const [form, setForm] = useState({
    pickupLocation: '',
    pickupDate: '',
    dropoffDate: '',
    pickupTime: '',
    dropoffTime: ''
  });

  const [carQuotes, setCarQuotes] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const response = await api.get('/api/cars/', {
        params: {
          pickupLocation: form.pickupLocation,
          pickupDate: form.pickupDate,
          dropoffDate: form.dropoffDate,
          pickupTime: form.pickupTime,
          dropoffTime: form.dropoffTime
        }
      });

      console.log('Raw car response:', response);
      setCarQuotes(response.data.quotes);
      setError(null);
    } catch (error) {
      console.error('Error fetching car data:', error.response ? error.response.data : error.message);
      setError(error.message || 'Failed to fetch car rental information');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="transportation-container">
      {/* Animated images */}
      <img 
        src="https://cdn.pixabay.com/animation/2023/02/24/13/48/13-48-07-331_512.gif" 
        alt="Animated Left" 
        className="left-animated-image" 
      />
      <img 
        src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExczlhZGpzZjgzaWM4aDJhMTluZ2VvcnQ5cnkxZm1uNWptc2gyYnhnMiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/rWh5k5EwfS03h2fPaT/giphy.webp" 
        alt="Animated Right" 
        className="right-animated-image" 
      />

      {isLoading && <LoadingIndicator />}
      <h1>Search for Cars, Compare Prices</h1>
      <form className="transportation-form" onSubmit={handleSearch}>
        <label htmlFor="pickupLocation">Pick-up Location:</label>
        <input
          id="pickupLocation"
          type="text"
          name="pickupLocation"
          value={form.pickupLocation}
          onChange={handleChange}
          required
        />

        <label htmlFor="pickupDate">Pick-up Date:</label>
        <input
          id="pickupDate"
          type="date"
          name="pickupDate"
          value={form.pickupDate}
          onChange={handleChange}
          min={new Date().toISOString().split('T')[0]}
          required
        />

        <label htmlFor="dropoffDate">Drop-off Date:</label>
        <input
          id="dropoffDate"
          type="date"
          name="dropoffDate"
          value={form.dropoffDate}
          onChange={handleChange}
          min={form.pickupDate}
          required
        />

        <label htmlFor="pickupTime">Pick-up Time:</label>
        <input
          id="pickupTime"
          type="time"
          name="pickupTime"
          value={form.pickupTime}
          onChange={handleChange}
          required
        />

        <label htmlFor="dropoffTime">Drop-off Time:</label>
        <input
          id="dropoffTime"
          type="time"
          name="dropoffTime"
          value={form.dropoffTime}
          onChange={handleChange}
          required
        />

        <button type="submit">Search</button>
      </form>

      <div className="car-quotes-placeholder">
        {error && <p className="error-message">{error}</p>}
        {carQuotes && carQuotes.length > 0 ? (
          <div className="car-results">
            <h2>Available Cars</h2>
            <ul>
              {carQuotes.map((quote, index) => (
                <li key={index} className="car-item">
                  <div className="car-details">
                    <img
                      src={quote.vndr_img_rounded}
                      alt={`${quote.vndr} logo`}
                      className="car-provider-logo"
                    />
                    <h3>{quote.car_name}</h3>
                    <p>Brand: {quote.vndr}</p>
                    <p className="price">Price: ${quote.price}</p>
                    <p>Seats: {quote.seat}</p>
                    <a
                      href={quote.dplnk}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="book-now-button"
                    >
                      Book Now
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No car rental quotes available for the selected dates and location. Please try again later.</p>
        )}
      </div>
    </div>
  );
}

export default Transportation;
