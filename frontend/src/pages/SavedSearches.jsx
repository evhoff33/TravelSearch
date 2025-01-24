import React, { useEffect, useState } from 'react';
import { searchService } from '../services/SearchService';
import "../styles/SavedSearches.css";
import "../styles/Search.css";
import { useAuth } from "../components/AuthContext";
import LoadingIndicator from "../components/LoadingIndicator"; 
import { useLocation } from 'react-router-dom';

function SavedSearches() {
    const [savedSearch, setSavedSearch] = useState({ search_params: {} });
    const [allSavedSearches, setAllSavedSearches] = useState([]);
    const [successMessage, setSuccessMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { isAuthorized } = useAuth();
    const location = useLocation();

    useEffect(() => {
        loadSavedSearches();
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const savedSearchId = params.get('savedSearchId');
        if (savedSearchId) {
            const selectedSearch = allSavedSearches.find(search => search.id === parseInt(savedSearchId));
            if (selectedSearch) {
                setSavedSearch(selectedSearch);
            }
        }
    }, [location.search, allSavedSearches]);

    const loadSavedSearches = async () => {
        setIsLoading(true);
        try {
            const response = await searchService.getSavedSearches();
            if (response.data && response.data.length > 0) {
                setAllSavedSearches(response.data);
                setSavedSearch(response.data[response.data.length - 1]); 
            }
        } catch (error) {
            console.error('Error loading saved searches:', error);
            setError('Failed to load saved searches');
        } finally {
            setIsLoading(false);
        }
    };

    
    const handleDelete = async (searchId) => {
        if (!isAuthorized) {
            setError('You must be logged in to delete a saved search');
            return;
        }

        if (!window.confirm('Are you sure you want to delete this saved search?')) {
            return;
        }

        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            await searchService.deleteSearch(searchId);
            setAllSavedSearches(current => current.filter(search => search.id !== searchId));

            setAllSavedSearches(remaining => {
                if (remaining.length > 0) {
                    setSavedSearch(remaining[0]);
                } else {
                    setSavedSearch({ search_params: {} });
                }
                return remaining;
            });

            setSuccessMessage('Search deleted successfully');
        } catch (error) {
            console.error('Error deleting search:', error);
            setError(error.response?.data?.message || 'Failed to delete search');
        } finally {
            setIsLoading(false);
        }
    };





    const handleSearchChange = (event) => {
        const selectedSearch = allSavedSearches.find(
            search => search.id === parseInt(event.target.value)
        );
        if (selectedSearch) {
            setSavedSearch(selectedSearch);
        }
    };

    if (!isAuthorized) {
        return <div className="saved-searches-container">
            <h2>Please log in to view saved searches</h2>
        </div>;
    }

    if (isLoading) {
        return <div className="saved-searches-container">
            <div className="loading-state">
                <LoadingIndicator />
            </div>
        </div>;
    }

    if (!savedSearch) {
        return <div className="saved-searches-container">
            <h2>No saved searches found</h2>
        </div>;
    }

    return (
        <div>
            {allSavedSearches.length > 0 && (
                <div className="search-selector">
                    {error && <div className="error-message">{error}</div>}
                    {successMessage && <div className="success-message">{successMessage}</div>}

                    <label htmlFor="search-select">Select a saved search:</label>
                    <div className="select-container">
                        <select 
                            id="search-select"
                            value={savedSearch?.id || ''}
                            onChange={handleSearchChange}
                            className="search-select"
                        >
                            {allSavedSearches.map((search) => (
                                <option key={search.id} value={search.id}>
                                    {search.origin} to {search.destination} on {new Date(search.departure_date).toLocaleDateString()}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="search-actions">
                        <button className="button button-secondary" onClick={() => handleDelete(savedSearch.id)}>Delete</button>
                    </div>
                </div>
            )}

            <div className="container">
                <div className="column">
                    <h3>Flights</h3>
                    {savedSearch?.search_params?.flightResults?.data?.flights ? (
                        <ul className="flights-list">
                            {savedSearch.search_params.flightResults.data.flights.map((flight, index) => (
                                <li key={index} className="flight-item">
                                    {flight.segments[0].legs.map((leg, legIndex) => (
                                        <div key={legIndex} className="flight-leg">
                                            <div className="flight-header">
                                                <h4>{leg.marketingCarrier.displayName} Flight {leg.flightNumber}</h4>
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
                                                            {new Date(leg.departureDateTime).toLocaleTimeString([], {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            })}
                                                        </strong>
                                                        <div>{new Date(leg.departureDateTime).toLocaleDateString()}</div>
                                                    </div>
                                                    <div>•</div>
                                                    <div>
                                                        <div>Arrival</div>
                                                        <strong>
                                                            {new Date(leg.arrivalDateTime).toLocaleTimeString([], {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            })}
                                                        </strong>
                                                        <div>{new Date(leg.arrivalDateTime).toLocaleDateString()}</div>
                                                    </div>
                                                </div>
                                                <div>Aircraft: {leg.equipmentId}</div>
                                            </div>
                                            {flight.purchaseLinks && (
                                                <div className="flight-prices">
                                                    <h5>Best Available Prices</h5>
                                                    {flight.purchaseLinks
                                                        .sort((a, b) => a.totalPricePerPassenger - b.totalPricePerPassenger)
                                                        .slice(0, 3)
                                                        .map((link, priceIndex) => (
                                                            <div key={priceIndex} className="price-option">
                                                                <div className="price-info">
                                                                    <span>{link.partnerSuppliedProvider.displayName}</span>
                                                                    <strong>${link.totalPricePerPassenger.toFixed(2)}</strong>
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
                        <p>No flight data available</p>
                    )}
                </div>

                <div className="column">
                    <h3>Hotels</h3>
                    {savedSearch.search_params.hotelResults ? (
                        <ul>
                            {savedSearch.search_params.hotelResults.map((hotel, index) => (
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
                                            Last updated: {new Date(hotel.lastUpdate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <hr />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No hotel data available</p>
                    )}
                </div>

                <div className="column">
                    <h3>Activities</h3>
                    {savedSearch.search_params.activityResults ? (
                        <ul>
                            {savedSearch.search_params.activityResults.map((activity) => (
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
                                    </div>
                                    {activity.pictures && activity.pictures.length > 0 && (
                                        <img src={activity.pictures[0]} alt={activity.name} />
                                    )}
                                    <hr />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No activity data available</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SavedSearches;