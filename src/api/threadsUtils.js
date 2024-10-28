// threadsUtils.js
import axios from 'axios';

const threadsUtils = {
  getThreadsAccessToken: async () => {
    try {
      const accessToken = '1';
      
      if (!accessToken) {
        throw new Error('No access token available');
      }
      
      return { accessToken };
    } catch (error) {
      console.error('Error fetching Threads access token:', error);
      throw error;
    }
  },

  fetchPosts: async (accessToken) => {
    try {
      const response = await axios.get(`https://graph.threads.net/v1.0/me?ields=id,username,name,threads_profile_picture_url,threads_biography&access_token=${accessToken}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  },

  deletePost: async (postId, accessToken) => {
    try {
      await axios.delete(`https://graph.threads.net/v1.0/me?ields=id,username,name,threads_profile_picture_url,threads_biography&access_token=${accessToken}"`);
      return true;
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  },

  editPost: async (postId, newCaption, accessToken) => {
    try {
      await axios.post(`https://graph.threads.net/v1.0/me?ields=id,username,name,threads_profile_picture_url,threads_biography&access_token=${accessToken}"`);
      return true;
    } catch (error) {
      console.error('Error editing post:', error);
      throw error;
    }
  },
};

export default threadsUtils;