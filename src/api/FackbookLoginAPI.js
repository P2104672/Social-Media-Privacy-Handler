export async function getFacebookAccessToken() {
    // In a real application, you would fetch this from a secure backend
    // For now, we'll return a mock token
    try {
      const response = await fetch('/api/FacebookLoginAPI');
      if (!response.ok) {
        throw new Error('Failed to fetch access token');
      }
      const data = await response.json();
      return { accessToken: data.accessToken };
    } catch (error) {
      console.error('Error fetching Facebook access token:', error);
      throw error;
    }
  }