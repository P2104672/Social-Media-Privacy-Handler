import axios from 'axios';

// Add this import at the top of the file
import { initFacebookSdk, FB } from '../utils/facebookSdk';

async function getFacebookPosts(userAccessToken) {
  const url = 'https://graph.facebook.com/v18.0/me/feed';
  const params = {
    access_token: userAccessToken,
    fields: 'id,message,created_time,permalink_url,full_picture,type',
    limit: 100
  };

  // Replace the FB.getLoginStatus call with this
  await initFacebookSdk();
  const fbLoginStatus = await new Promise(resolve => FB.getLoginStatus(resolve));
  if (fbLoginStatus.status === 'connected') {
    userAccessToken = fbLoginStatus.authResponse.accessToken;
  }

  try {
    const response = await axios.get(url, { params });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching Facebook posts:', error);
    throw error;
  }
}

async function getSinglePost(userAccessToken, postId) {
  const url = `https://graph.facebook.com/v18.0/${postId}`;
  const params = {
    access_token: userAccessToken,
    fields: 'id,message,created_time,permalink_url,full_picture,type'
  };

  try {
    const response = await axios.get(url, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching single Facebook post:', error);
    throw error;
  }
}

// Add a function to manage (update/delete) posts
async function manageFacebookPost(userAccessToken, postId, action, updatedMessage = null) {
  const url = `https://graph.facebook.com/v18.0/${postId}`;
  const params = { access_token: userAccessToken };

  try {
    let response;
    if (action === 'update' && updatedMessage) {
      response = await axios.post(url, { ...params, message: updatedMessage });
    } else if (action === 'delete') {
      response = await axios.delete(url, { params });
    } else {
      throw new Error('Invalid action or missing updated message');
    }
    return response.data;
  } catch (error) {
    console.error('Error managing Facebook post:', error);
    throw error;
  }
}

async function publishFacebookPost(userAccessToken, message, link = null) {
  const url = 'https://graph.facebook.com/v18.0/me/feed';
  const params = { 
    access_token: userAccessToken,
    message: message
  };
  
  if (link) {
    params.link = link;
  }

  try {
    const response = await axios.post(url, params);
    return response.data;
  } catch (error) {
    console.error('Error publishing Facebook post:', error);
    throw error;
  }
}

export { getFacebookPosts, getSinglePost, manageFacebookPost, publishFacebookPost };
