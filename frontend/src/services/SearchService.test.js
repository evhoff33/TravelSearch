
import { describe, it, expect, vi } from 'vitest';
import { searchService } from './SearchService';
import api from '../api';

vi.mock('../api', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    delete: vi.fn()
  }
}));

describe('SearchService', () => {
  beforeEach(() => {
    localStorage.setItem('access_token', 'fake-token');
  });

  afterEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('saves search successfully', async () => {
    const mockSearchData = { origin: 'NYC', destination: 'LAX' };
    api.post.mockResolvedValueOnce({ data: mockSearchData });

    const result = await searchService.saveSearch(mockSearchData);
    
    expect(api.post).toHaveBeenCalledWith(
      '/api/saved-searches/',
      mockSearchData,
      expect.any(Object)
    );
    expect(result.data).toEqual(mockSearchData);
  });

  it('gets saved searches successfully', async () => {
    const mockSearches = [{ id: 1, origin: 'NYC' }];
    api.get.mockResolvedValueOnce({ data: mockSearches });

    const result = await searchService.getSavedSearches();
    
    expect(api.get).toHaveBeenCalledWith(
      '/api/saved-searches/',
      expect.any(Object)
    );
    expect(result.data).toEqual(mockSearches);
  });

  it('deletes search successfully', async () => {
    const searchId = 1;
    api.delete.mockResolvedValueOnce({ data: { message: 'Deleted' } });

    await searchService.deleteSearch(searchId);
    
    expect(api.delete).toHaveBeenCalledWith(
      `/api/saved-searches/${searchId}/`,
      expect.any(Object)
    );
  });
});