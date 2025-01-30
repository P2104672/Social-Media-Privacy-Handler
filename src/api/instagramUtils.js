// for Instagram Access Token, the app name: Ins_fyp_Dec
// api/instagramUtils.js



let instagramAccessToken = ' ';

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
  