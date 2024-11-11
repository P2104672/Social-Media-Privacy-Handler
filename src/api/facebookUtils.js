// src/api/facebookUtils.js

let facebookAccessToken = '';

export const getFacebookAccessToken = async () => {
    try {
        if (!facebookAccessToken) {
            throw new Error('No access token available');
        }
        return { accessToken: facebookAccessToken };
    } catch (error) {
        console.error('Error fetching Facebook access token:', error);
        throw error;
    }
};

export const setFacebookAccessToken = (newToken) => {
    facebookAccessToken = newToken; // Update the access token
};