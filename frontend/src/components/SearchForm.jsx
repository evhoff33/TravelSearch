// src/components/SearchForm.js
import React, { useState } from 'react';
import { searchService } from '../services/SearchService';

const SearchForm = () => {
    const [searchData, setSearchData] = useState({
        origin: '',
        destination: '',
        departure_date: '',
        return_date: '',
        search_params: {}
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // First, make your API call to Amadeus/Skyscanner
            // const flightResults = await makeFlightSearch(searchData);
            
            // Then save the search
            await searchService.saveSearch(searchData);
            alert('Search saved successfully!');
        } catch (error) {
            console.error('Error saving search:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={searchData.origin}
                onChange={(e) => setSearchData({
                    ...searchData,
                    origin: e.target.value
                })}
                placeholder="Origin"
            />
            {/* Add other form fields */}
            <button type="submit">Search and Save</button>
        </form>
    );
};

export default SearchForm;