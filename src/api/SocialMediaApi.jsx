import { getFirestore, doc, getDoc } from 'firebase/firestore';

export const fetchConnectedAccounts = async (userId) => {
  const db = getFirestore();
  const userDocRef = doc(db, 'users', userId);
  
  try {
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.connectedAccounts || {};
    } else {
      console.log('No such user document!');
      return {};
    }
  } catch (error) {
    console.error('Error fetching connected accounts:', error);
    return {};
  }
};

// // Add other social media related API functions here as needed
