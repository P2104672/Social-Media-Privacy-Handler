import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { app } from '../firebase'; // Make sure this import points to your Firebase configuration file

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

// // Add other social media related API functions here as needed
