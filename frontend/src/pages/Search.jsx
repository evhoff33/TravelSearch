import React, { useState, useEffect } from "react";
import api from "../api";
import "../styles/Search.css";
import LoadingIndicator from "../components/LoadingIndicator";
import { useAuth } from "../components/AuthContext";
import { searchService } from "../services/SearchService";

function Search() {
  const { isAuthorized } = useAuth();

  const [form, setForm] = useState({
    origin_string: '',
    destination_string: '',
    travel_date: '',
    radius: '10'
  });

  const [showRawData, setShowRawData] = useState(false);
  const [flightInfoResults, setFlightInfoResults] = useState(null);
  const [locationInfoResults, setLocationInfoResults] = useState(null);
  const [error, setError] = useState(null);
  const [attractionsData, setAttractionsData] = useState(null);
  const [locationData, setLocationData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      // Get origin airport code
      const originAirportResponse = await api.get("/api/getairports/", {
        params: { search_string: form.origin_string || "Omaha, NE" },
      });

      // Get destination airport code
      const destAirportResponse = await api.get("/api/getairports/", {
        params: { search_string: form.destination_string },
      });

      if (
        !originAirportResponse.data.length ||
        !destAirportResponse.data.length
      ) {
        throw new Error(
          "Could not find airport codes for the specified locations"
        );
      }

      // console.log(originAirportResponse.data);
      // console.log(destAirportResponse.data);

      // Get flights using airport codes
      const flightsResponse = await api.get("/api/getflights/", {
        params: {
          airport_code_from: originAirportResponse.data,
          airport_code_to: destAirportResponse.data,
          date: form.travel_date,
        },
      });

      const [attractionsResponse, hotelsResponse] = await Promise.all([
        api.get("/api/attractions/", {
          params: { location: form.destination_string, radius: form.radius },
        }),
        api.get("/api/hotels/", {
          params: { location: form.destination_string, radius: form.radius },
        }),
      ]);

      setFlightInfoResults(flightsResponse);
      setAttractionsData(attractionsResponse.data);
      setLocationInfoResults(hotelsResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message || "Failed to fetch information");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSearch = async () => {
    try {
      const searchData = {
        origin: form.origin_string,
        destination: form.destination_string,
        departure_date: form.travel_date,
        search_params: {
          flightResults: flightInfoResults?.data,
          hotelResults: locationInfoResults?.data,
          activityResults: attractionsData?.data
        }
      };
      await searchService.saveSearch(searchData);
    } catch (error) {
      setError('Failed to save search');
      console.error('Error saving search:', error);
    }
  };

  const handleSelectSavedSearch = (savedSearch) => {
    setForm({
      origin_string: savedSearch.origin,
      destination_string: savedSearch.destination,
      travel_date: savedSearch.departure_date,
    });

    setFlightInfoResults(savedSearch.search_params.flightResults);
    setLocationInfoResults(savedSearch.search_params.hotelResults);
    setAttractionsData(savedSearch.search_params.activityResults);
  };

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        return;
      }
    };
  
    checkAuth();
  }, []);

  return (
    <div>
      {isLoading && <LoadingIndicator />}

      <form className="search-form" onSubmit={handleSubmit}>
        <h3 className="title"><u>Search For Your Next Trip</u>:</h3>

        <label htmlFor="origin_string">Origin:</label>
        <input
          id="origin_string"
          type="text"
          name="origin_string"
          value={form.origin_string}
          onChange={handleChange}
        />

        <label htmlFor="destination_string">Destination:</label>
        <input
          id="destination_string"
          type="text"
          name="destination_string"
          value={form.destination_string}
          onChange={handleChange}
        />

        <label htmlFor="travel_date">Travel Date:</label>
        <input
          id="travel_date"
          type="date"
          name="travel_date"
          value={form.travel_date}
          onChange={handleChange}
          min={new Date().toISOString().split("T")[0]}
        />

        <label htmlFor="radius">Radius (miles):</label>
        <input
          id="radius"
          type="number"
          name="radius"
          value={form.radius || "10"}
          onChange={handleChange}
          max="50"
        />
        <div className="search-buttons">
          <button type="submit">Search Now</button>
          {isAuthorized && (flightInfoResults || locationInfoResults || attractionsData) && (
            <button 
              type="button" 
              onClick={(e) => {
                e.preventDefault();
                handleSaveSearch();
                handleSubmit(e);
              }}
            >
              Save Search
            </button>
          )}
        </div>
      </form>

      {locationData && (
        <div className="location-info">
          <p>Latitude: {locationData.latitude}</p>
          <p>Longitude: {locationData.longitude}</p>
          <p>Address: {locationData.address}</p>
        </div>
      )}

      {/* Static Images Section */}
      <div className="static-images">
        <img src="https://images.unsplash.com/photo-1483450388369-9ed95738483c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGZsaWdodHxlbnwwfHwwfHx8MA%3D%3D" alt="Image 1" />
        <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGhvdGVsfGVufDB8fDB8fHww" alt="Image 2" />
        <img src="https://images.unsplash.com/photo-1723274566354-fe9af2cc28ea?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Image 3" />
      </div>

      <div className="container">
        <div className="column">
          <h3>Flights</h3>
          {showRawData && flightInfoResults && (
            <pre>{JSON.stringify(flightInfoResults.data, null, 2)}</pre>
          )}
          {flightInfoResults &&
          flightInfoResults.data &&
          flightInfoResults.data.data &&
          flightInfoResults.data.data.flights ? (
            <ul className="flights-list">
              {flightInfoResults.data.data.flights.map((flight, index) => (
                <li key={index} className="flight-item">
                  {flight.segments[0].legs.map((leg, legIndex) => (
                    <div key={legIndex} className="flight-leg">
                      <div className="flight-header">
                        <h4>
                          {leg.marketingCarrier.displayName} Flight{" "}
                          {leg.flightNumber}
                        </h4>
                      </div>
                      <div className="flight-details">
                        <div className="flight-route">
                          <strong>{leg.originStationCode}</strong>
                          <span>→</span>
                          <strong>{leg.destinationStationCode}</strong>
                        </div>
                        <div className="flight-times">
                          <div>
                            <div>Departure</div>
                            <strong>
                              {new Date(
                                leg.departureDateTime
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </strong>
                            <div>
                              {new Date(
                                leg.departureDateTime
                              ).toLocaleDateString()}
                            </div>
                          </div>
                          <div>•</div>
                          <div>
                            <div>Arrival</div>
                            <strong>
                              {new Date(leg.arrivalDateTime).toLocaleTimeString(
                                [],
                                { hour: "2-digit", minute: "2-digit" }
                              )}
                            </strong>
                            <div>
                              {new Date(
                                leg.arrivalDateTime
                              ).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div>Aircraft: {leg.equipmentId}</div>
                      </div>
                      {flight.purchaseLinks && (
                        <div className="flight-prices">
                          <h5>Best Available Prices</h5>
                          {flight.purchaseLinks
                            .sort(
                              (a, b) =>
                                a.totalPricePerPassenger - 
                                b.totalPricePerPassenger
                            )
                            .slice(0, 3)
                            .map((link, priceIndex) => (
                              <div key={priceIndex} className="price-option">
                                <div className="price-info">
                                  <span>
                                    {link.partnerSuppliedProvider.displayName}
                                  </span>
                                  <strong>
                                    ${link.totalPricePerPassenger.toFixed(2)}
                                  </strong>
                                </div>
                                <a
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="book-now-button"
                                >
                                  Book Now
                                </a>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  ))}
                  <hr />
                </li>
              ))}
            </ul>
          ) : (
            <p></p>
          )}
        </div>

        <div className="column">
          <h3>Hotels</h3>
          {showRawData && locationInfoResults && (
            <pre>{JSON.stringify(locationInfoResults.data, null, 2)}</pre>
          )}
          {locationInfoResults ? (
            locationInfoResults.data ? (
              <ul>
                {locationInfoResults.data.map((hotel, index) => (
                  <li key={hotel.hotelId || index}>
                    <div className="info">
                      <h4>{hotel.name}</h4>
                      <a
                        href={`https://www.google.com/maps?q=${hotel.geoCode.latitude},${hotel.geoCode.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="maps-link"
                      >
                        Open in Google Maps
                      </a>
                      <p className="last-update">
                        Last updated:{" "}
                        {new Date(hotel.lastUpdate).toLocaleDateString()}
                      </p>
                    </div>
                    <hr />
                  </li>
                ))}
              </ul>
            ) : (
              <p>No hotels found in this area.</p>
            )
          ) : (
            <p></p>
          )}
        </div>

        <div className="column">
          <h3>Activities</h3>
          {showRawData && attractionsData && (
            <pre>{JSON.stringify(attractionsData.data, null, 2)}</pre>
          )}
          {attractionsData && attractionsData.data ? (
            <ul>
              {attractionsData.data.map((activity) => (
                <li key={activity.id}>
                  <div className="info">
                    <h4>{activity.name}</h4>
                    <p>{activity.shortDescription}</p>
                    <a
                      href={`https://www.google.com/maps?q=${activity.geoCode.latitude},${activity.geoCode.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="maps-link"
                    >
                      Open in Google Maps
                    </a>
                    <a
                      href={activity.bookingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Book Now
                    </a>
                  </div>
                  {activity.pictures && activity.pictures.length > 0 && (
                    <img src={activity.pictures[0]} alt={activity.name} />
                  )}
                  <hr />
                </li>
              ))}
            </ul>
          ) : (
            <p>No activities found</p>
          )}
        </div>
      </div>

      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default Search;
