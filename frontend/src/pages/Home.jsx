import { useState, useEffect } from "react";
import { searchService } from '../services/SearchService';
import { useAuth } from "../components/AuthContext";
import "../styles/Home.css";
import "../styles/Search.css";

function Home() {
  const [savedSearches, setSavedSearches] = useState([]);
  const { isAuthorized } = useAuth();

  useEffect(() => {
    if (isAuthorized) {
      loadSavedSearches();
    }
  }, [isAuthorized]);

  const loadSavedSearches = async () => {
    try {
      const response = await searchService.getSavedSearches();
      setSavedSearches(response.data);
    } catch (error) {
      console.error('Error loading saved searches:', error);
    }
  };

  const services = [
    { 
      text: "Find the Perfect Accommodation" ,
      image: "https://media.istockphoto.com/id/1336116827/photo/suitcase-delivered-standing-in-hotel-room-concept-of-hotel-service-and-travel.jpg?s=612x612&w=0&k=20&c=IC_afKa6Fwgrb7nTGz8OF-2KsHIioahL-eyZIjmZxVU=",
    },
    { 
      text: "Book Your Flights" ,
      image: "https://media.istockphoto.com/id/955952680/photo/passengers-commercial-airplane-flying-above-clouds.jpg?s=612x612&w=0&k=20&c=9bZsGq8-uZaPXR1lCztXur4JRlI1gNksYOOSZzfXPAA=",
    },
    { 
      text: "Discover Local Attractions" ,
      image: "https://media.istockphoto.com/id/526258817/photo/big-ben-in-sunny-day-london.jpg?s=612x612&w=0&k=20&c=HAXEm-xBehvg2q6JmAEir0N7iBPtCuJntpewWL8zIrQ=",
    },
  ];

  const carouselItems = [
    {
      img: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?fm=jpg&q=60&w=3000",
      title: "Plan Your Dream Vacation",
      description: "Find the best deals on hotels, flights, rental cars & more, with full pricing transparency.",
    },
    {
      img: "https://images.unsplash.com/photo-1500835556837-99ac94a94552?fm=jpg&q=60&w=3000",
      title: "Plan Your Dream Vacation",
      description: "Find the best deals on hotels, flights, rental cars & more, with full pricing transparency.",
    },
    {
      img: "https://images.unsplash.com/photo-1615544261596-dc0a4898f2c0?q=80&w=1170",
      title: "Plan Your Dream Vacation",
      description: "Find the best deals on hotels, flights, rental cars & more, with full pricing transparency.",
    },
    {
      img: "https://images.unsplash.com/photo-1573397340180-f4086e429df7?q=80&w=1170",
      title: "Plan Your Dream Vacation",
      description: "Find the best deals on hotels, flights, rental cars & more, with full pricing transparency.",
    },
  ];

  return (
    <div>
      {isAuthorized && (
        <div className="saved-searches-container">
          <h3>Your Saved Searches</h3>
          {savedSearches.length > 0 ? (
            <div className="saved-searches-grid">
              {savedSearches.map((search) => (
                <div 
                  key={search.id} 
                  className="saved-search-card"
                  onClick={() => window.location.href = `/savesearch?savedSearchId=${search.id}`}
                >
                  <h4>Trip to {search.destination}</h4>
                  <p><strong>From:</strong> {search.origin}</p>
                  <p><strong>To:</strong> {search.destination}</p>
                  <p><strong>Date:</strong> {new Date(search.departure_date).toLocaleDateString()}</p>
                  <p><strong>Click to view details</strong></p>
                </div>
              ))}
            </div>
          ) : (
            <p>No saved searches yet. Start planning your trip!</p>
          )}
        </div>
      )}

      <div className="carousel-container">
        <div id="myCarousel" className="carousel slide" data-ride="carousel">
          <ol className="carousel-indicators">
            {carouselItems.map((_, index) => (
              <li
                key={index}
                data-target="#myCarousel"
                data-slide-to={index}
                className={index === 0 ? "active" : ""}
              ></li>
            ))}
          </ol>

          <div className="carousel-inner" role="listbox">
            {carouselItems.map((item, index) => (
              <div key={index} className={`item ${index === 0 ? "active" : ""}`}>
                <img src={item.img} alt={item.title} />
                <div className="carousel-caption">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <a className="left carousel-control" href="#myCarousel" role="button" data-slide="prev">
            <span className="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
            <span className="sr-only">Previous</span>
          </a>
          <a className="right carousel-control" href="#myCarousel" role="button" data-slide="next">
            <span className="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
            <span className="sr-only">Next</span>
          </a>
        </div>
      </div>

      <div className="services">
        <h2>Our Services</h2>
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-item">
              <p>{service.text}</p>
              <img src={service.image} />
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: "400px" }}></div>
    </div>
  );
}

export default Home;
