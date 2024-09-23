export async function getFacebookAccessToken() {

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