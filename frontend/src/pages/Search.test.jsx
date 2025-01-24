import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider } from '../components/AuthContext';
import Search from './Search';
import api from '../api';

// Mock the api module
vi.mock('../api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn()
  }
}));

describe('Search Component', () => {
  it('renders search form fields', () => {
    render(
      <AuthProvider>
        <Search />
      </AuthProvider>
    );
    
    expect(screen.getByLabelText(/origin/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/destination/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/travel date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/radius/i)).toBeInTheDocument();
  });

  it('handles form submission', async () => {
    api.get.mockResolvedValueOnce({ data: ['ABC'] }) // Origin airport
         .mockResolvedValueOnce({ data: ['XYZ'] }) // Destination airport
         .mockResolvedValueOnce({ 
           data: { 
             data: { 
               flights: [] 
             } 
           } 
         }) // Flights
         .mockResolvedValueOnce({ data: { data: [] } }) // Attractions
         .mockResolvedValueOnce({ data: [] }); // Hotels

    render(
      <AuthProvider>
        <Search />
      </AuthProvider>
    );

    fireEvent.change(screen.getByLabelText(/origin/i), { target: { value: 'New York' } });
    fireEvent.change(screen.getByLabelText(/destination/i), { target: { value: 'London' } });
    fireEvent.change(screen.getByLabelText(/travel date/i), { 
      target: { value: '2024-12-31' } 
    });
    fireEvent.click(screen.getByText(/search now/i));

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledTimes(5);
    });
  });
});