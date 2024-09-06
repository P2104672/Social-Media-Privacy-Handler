// src/routes/Profile.jsx
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { fetchConnectedAccounts } from '../api/SocialMediaApi.jsx';
import './Profile.css';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import firebaseApp from '../firebase'; // Import the initialized Firebase app

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connectedAccounts, setConnectedAccounts] = useState([]); // Add this line

  useEffect(() => {
    const auth = getAuth(firebaseApp); // Pass the Firebase app to getAuth
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        loadConnectedAccounts(currentUser.uid);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loadConnectedAccounts = async (userId) => {
    try {
      const accounts = await fetchConnectedAccounts(userId);
      setConnectedAccounts(accounts);
    } catch (error) {
      console.error('Error fetching connected accounts:', error);
    }
  };

  // ... existing handleSignInOrSignUp functions ...

  if (loading) {
    return <div>Loading...</div>;
  }

  console.log('Current user:', user); // Add this line for debugging

  return (
    <div className='profile-container'>
      <Sidebar />
      <h1>Profile</h1>
      <div className="profile">
        {user ? (
          <>
            <h2>Welcome, {user.displayName || 'User'}!</h2>
            <p>Email: {user.email}</p>
            <h3>Connected Accounts:</h3>
            <ul>
              {connectedAccounts.map((account, index) => (
                <li key={index}>{account.platform}: {account.username}</li>
              ))}
            </ul>
          </>
        ) : (
          <p>Please sign in to view your profile.</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
