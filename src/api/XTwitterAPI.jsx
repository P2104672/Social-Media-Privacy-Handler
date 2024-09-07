import axios from 'axios';

const BASE_URL = 'https://api.twitter.com/2';

async function getUserTweets(userAccessToken, userId) {
  console.log('getUserTweets called with userId:', userId);
  if (!userId) {
    console.error('User ID is undefined');
    return [];
  }
  const url = `${BASE_URL}/users/${userId}/tweets`;
  try {
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${userAccessToken}`
      },
      params: {
        'tweet.fields': 'created_at,text,public_metrics',
        'expansions': 'author_id',
        'user.fields': 'name,username,profile_image_url'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user tweets:', error);
    return [];
  }
}

async function deleteTweet(userAccessToken, tweetId) {
  const url = `${BASE_URL}/tweets/${tweetId}`;
  try {
    const response = await axios.delete(url, {
      headers: {
        'Authorization': `Bearer ${userAccessToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting tweet:', error);
    throw error;
  }
}

async function updateTweet(userAccessToken, tweetId, newText) {
  const url = `${BASE_URL}/tweets/${tweetId}`;
  try {
    const response = await axios.put(url, {
      text: newText
    }, {
      headers: {
        'Authorization': `Bearer ${userAccessToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating tweet:', error);
    throw error;
  }
}

async function getTweets(userAccessToken) {
  const url = `${BASE_URL}/tweets`;
  try {
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${userAccessToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching tweets:', error);
    return [];
  }
}

export { getUserTweets, deleteTweet, updateTweet, getTweets };
