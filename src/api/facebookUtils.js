export const getFacebookAccessToken = async () => {
  try {
    const accessToken = 'EAAO74BY4xVABO2H2kZBfevkaRhMlOvO5d4NVrKVo1bhx3ESjZCdIRA5EinKmVg9lyjzlZBKyCn6nRmk1qjwzDcxBhq6eavrFWeQdxcz7K5KaHIA5AkFZAiYwxm0rqaWsl8cxnS82F8VCTmKHG7LOHnGZCgZCZBhnqZAgNdp9kiQ7vUeFw3cnyEMWginc6wZDZD';
    
    // Generate a new access token
    // https://developers.facebook.com/tools/accesstoken/
    if (!accessToken) {
      throw new Error('No access token available');
    }
    
    return { accessToken };
  } catch (error) {
    console.error('Error fetching Facebook access token:', error);
    throw error;
  }
};
