// for Instagram Access Token

export const getInstagramAccessToken = async () => {
    try {
      const accessToken = '2';
      
      // Generate a new access token
      // https://developers.facebook.com/tools/accesstoken/
      if (!accessToken) {
        throw new Error('No access token available');
      }
      
      return { accessToken };
    } catch (error) {
      console.error('Error fetching Instagram access token:', error);
      throw error;
    }
  };