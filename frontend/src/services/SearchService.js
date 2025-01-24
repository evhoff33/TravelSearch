// src/services/searchService.js

import api from "../api";
//const API_URL = 'http://localhost:8071/api/';

export const searchService = {
    saveSearch: async (searchData) => {
        return await api.post('/api/saved-searches/', searchData, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        });
    },

    getSavedSearches: async () => {
        return await api.get('/api/saved-searches/', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        });
    },

    deleteSearch: async (id) => {
        try {
            return await api.delete(`/api/saved-searches/${id}/`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });

        } catch (error) {
            console.error('Delete search error:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
            throw new Error(error.response?.data?.message || 'Server error during delete');
        }
    }    

};