export const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://bhjrt72dfk.execute-api.us-east-1.amazonaws.com/$default";

export const shortenUrl = async (original_url: string, password?: string) => {
  try {
    const response = await fetch(`${API_BASE}/shorten`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: original_url, ...(password ? { password } : {}) })
    });

    console.log('Response:', response);
    const data = await response.text();
    console.log('Response data:', data);

    if (!response.ok) {
      const error = JSON.parse(data);
      throw new Error(error.error || "Something went wrong");
    }

    return JSON.parse(data);
  } catch (error) {
    console.error('Error in shortenUrl:', error);
    throw error;
  }
};

export const getAnalytics = async (short_code: string) => {
  try {
    const response = await fetch(`${API_BASE}/analytics/${short_code}`, {
      method: 'GET'
    });

    const data = await response.text();
    console.log('Analytics response:', data);

    if (!response.ok) {
      const error = JSON.parse(data);
      throw new Error(error.error || "Short code not found");
    }

    return JSON.parse(data);
  } catch (error) {
    console.error('Error in getAnalytics:', error);
    throw error;
  }
};
