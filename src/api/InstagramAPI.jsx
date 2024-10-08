import axios from 'axios';
// Instagram 應用程式編號 1201668870922234
// Instagram 應用程式密鑰 916306894d64639136c121d18b3d417d

const INSTAGRAM_API_BASE_URL = 'https://graph.instagram.com/v12.0';

export async function getInstagramPosts(userAccessToken) {
  try {
    const url = `${INSTAGRAM_API_BASE_URL}/me/media`;
    const params = {
      fields: 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,username',
      access_token: userAccessToken,
    };

    const response = await axios.get(url, { params });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching Instagram posts:', error);
    throw error;
  }
}

export async function getUserProfile(userAccessToken) {
  try {
    const url = `${INSTAGRAM_API_BASE_URL}/me`;
    const params = {
      fields: 'id,username',
      access_token: userAccessToken,
    };

    const response = await axios.get(url, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}
