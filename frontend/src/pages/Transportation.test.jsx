import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Transportation from './Transportation';
import api from '../api';

vi.mock('../api', () => ({
  default: {
    get: vi.fn()
  }
}));

describe('Transportation Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders car rental search form', () => {
    render(<Transportation />);
    expect(screen.getByLabelText(/pick-up location/i)).toBeInTheDocument();
  });

  it('handles car search form submission', async () => {
    const mockResponse = { data: { quotes: [] } };
    api.get.mockResolvedValueOnce(mockResponse);

    render(<Transportation />);

    // Fill in all required fields
    fireEvent.change(screen.getByLabelText(/pick-up location/i), {
      target: { value: 'New York' }
    });
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 2);
    
    fireEvent.change(screen.getByLabelText(/pick-up date/i), {
      target: { value: tomorrow.toISOString().split('T')[0] }
    });
    
    fireEvent.change(screen.getByLabelText(/drop-off date/i), {
      target: { value: dayAfter.toISOString().split('T')[0] }
    });
    
    fireEvent.change(screen.getByLabelText(/pick-up time/i), {
      target: { value: '10:00' }
    });
    
    fireEvent.change(screen.getByLabelText(/drop-off time/i), {
      target: { value: '10:00' }
    });

    // Submit form
    const submitButton = screen.getByRole('button', { type: 'submit' });
    fireEvent.submit(submitButton.closest('form'));

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/api/cars/', {
        params: expect.objectContaining({
          pickupLocation: 'New York',
          pickupTime: '10:00'
        })
      });
    });
  });
});