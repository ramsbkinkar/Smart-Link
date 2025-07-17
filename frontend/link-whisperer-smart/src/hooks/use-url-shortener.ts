import { useMutation, useQuery } from '@tanstack/react-query';
import { API_BASE } from '@/lib/api';

interface ShortenUrlRequest {
  url: string;
  password?: string;
}

interface ShortenUrlResponse {
  short_url: string;
  original_url: string;
  password_protected: boolean;
}

interface AnalyticsResponse {
  short_code: string;
  original_url: string;
  clicks: number;
  created_at: number;
  expiry_time: number;
  password_protected: boolean;
}

export const useShortenUrl = () => {
  return useMutation({
    mutationFn: async (data: ShortenUrlRequest) => {
      try {
        console.log('Sending request to:', `${API_BASE}/shorten`);
        console.log('Request data:', data);
        
        const response = await fetch(`${API_BASE}/shorten`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ url: data.url, ...(data.password ? { password: data.password } : {}) })
        });

        console.log('Response status:', response.status);
        const responseText = await response.text();
        console.log('Response text:', responseText);

        if (!response.ok) {
          let errorMessage = 'Failed to shorten URL';
          try {
            const errorData = JSON.parse(responseText);
            errorMessage = errorData.error || errorMessage;
          } catch (e) {
            errorMessage = responseText || errorMessage;
          }
          throw new Error(errorMessage);
        }

        let responseData: ShortenUrlResponse;
        try {
          responseData = JSON.parse(responseText);
          return responseData;
        } catch (e) {
          console.error('Failed to parse response JSON:', e);
          throw new Error('Invalid response format from server');
        }
      } catch (error) {
        console.error('Error in useShortenUrl:', error);
        throw error;
      }
    },
  });
};

export const useUrlAnalytics = (shortCode: string) => {
  return useQuery({
    queryKey: ['analytics', shortCode],
    queryFn: async () => {
      if (!shortCode) return null;
      
      try {
        console.log('Fetching analytics for:', shortCode);
        const response = await fetch(`${API_BASE}/analytics/${shortCode}`, {
          method: 'GET'
        });
        
        console.log('Analytics response status:', response.status);
        const responseText = await response.text();
        console.log('Analytics response text:', responseText);

        if (!response.ok) {
          let errorMessage = 'Failed to fetch analytics';
          try {
            const errorData = JSON.parse(responseText);
            errorMessage = errorData.error || errorMessage;
          } catch (e) {
            errorMessage = responseText || errorMessage;
          }
          throw new Error(errorMessage);
        }

        let analyticsData: AnalyticsResponse;
        try {
          analyticsData = JSON.parse(responseText);
          return analyticsData;
        } catch (e) {
          console.error('Failed to parse analytics JSON:', e);
          throw new Error('Invalid response format from server');
        }
      } catch (error) {
        console.error('Error in useUrlAnalytics:', error);
        throw error;
      }
    },
    enabled: Boolean(shortCode),
  });
}; 