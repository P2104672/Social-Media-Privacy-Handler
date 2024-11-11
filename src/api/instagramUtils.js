// for Instagram Access Token, the app name: ins_fyp_new
// api/instagramUtils.js



let instagramAccessToken = '1';

export const getInstagramAccessToken = async () => {
    try {
        if (!instagramAccessToken) {
            throw new Error('No access token available');
        }
        return { accessToken: instagramAccessToken };
    } catch (error) {
        console.error('Error fetching Instagram access token:', error);
        throw error;
    }
};

export const setInstagramAccessToken = (newToken) => {
    instagramAccessToken = newToken; // Update the access token
};
  