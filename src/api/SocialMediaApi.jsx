import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { app } from '../firebase'; // Make sure this import points to your Firebase configuration file
import { getUserTweets, deleteTweet, updateTweet } from './XTwitterAPI';


const db = getFirestore(app);

export const fetchConnectedAccounts = async (email) => {
  try {
    const userRef = doc(db, 'users', email);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data().connectedAccounts || [];
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error fetching connected accounts:', error);
    throw error;
  }
};

export const connectSocialMedia = async (email, platform) => {
  try {
    const userRef = doc(db, 'users', email);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      await updateDoc(userRef, {
        connectedAccounts: arrayUnion(platform)
      });
    } else {
      await setDoc(userRef, {
        connectedAccounts: [platform]
      });
    }

    return { success: true, message: `Connected to ${platform}` };
  } catch (error) {
    console.error(`Error connecting to ${platform}:`, error);
    throw error;
  }
};

// Ensure these functions are exported
export const fetchFacebookPosts = async () => {
  try {
    // Check if FB object and its api method exist
    if (window.FB && window.FB.api) {
      return new Promise((resolve, reject) => {
        window.FB.api('/me/posts', (response) => {
          if (response && !response.error) {
            resolve(response.data);
          } else {
            reject(response.error);
          }
        });
      });
    } else {
      throw new Error('Facebook SDK not loaded or initialized');
    }
  } catch (error) {
    console.error('Error fetching Facebook posts:', error);
    return [];
  }
};

export const fetchInstagramPosts = async () => { /* ... */ };
export const fetchXPosts = async (userAccessToken, userId) => {
  if (!userId) {
    console.error('userId is undefined in fetchXPosts');
    return [];
  }
  return await getUserTweets(userAccessToken, userId);
};

export const deletePost = async (platform, postId, userAccessToken) => {
  if (platform === 'twitter') {
    try {
      await deleteTweet(userAccessToken, postId);
      console.log(`Deleted post ${postId} from ${platform}`);
    } catch (error) {
      console.error(`Error deleting post from ${platform}:`, error);
      throw error;
    }
  } else {
    console.log(`Deleting post ${postId} from ${platform} is not implemented`);
  }
};

export const editPost = async (platform, postId, newContent, userAccessToken) => {
  if (platform === 'twitter') {
    try {
      await updateTweet(userAccessToken, postId, newContent);
      console.log(`Edited post ${postId} on ${platform}`);
    } catch (error) {
      console.error(`Error editing post on ${platform}:`, error);
      throw error;
    }
  } else {
    console.log(`Editing post ${postId} on ${platform} is not implemented`);
  }
};

export const createPost = async (platform, content) => {
  console.log(`Creating new post on ${platform} with content: ${content}`);
  // Implement actual post creation logic here
};

// // Add other social media related API functions here as needed
