// for Instagram Access Token

export const getInstagramAccessToken = async () => {
    try {
      const accessToken = 'IGQWRQOUQxaG9lWGdLaHZADMEVCQ3VhRGRWSXpSZAlRBSzdrNHVBS192azl1cUFQUlNhaHhyd0hDdlJsbTVzclY4M193R0FnR3FMX2xDcFBYLVJXVzA0UWRjYUw3aUpqM2xQYjJscjZAkMmFQZAzdDTUNxV1F6ZAk9lWWsZD';
      
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