// src/routes/Profile.jsx
// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { auth } from '../firebaseConfig';
// import { fetchGoogleLinkedAccounts } from '../api/googleApi';
import './Profile.css';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
const Profile = () => {
  // const [user, setUser] = useState(null);
  // const [linkedAccounts, setLinkedAccounts] = useState([]);
  // const navigate = useNavigate();

  // useEffect(() => {
  //   const unsubscribe = auth.onAuthStateChanged((user) => {
  //     if (user) {
  //       setUser(user);
  //       loadLinkedAccounts(user.accessToken);
  //     } else {
  //       navigate('/login');
  //     }
  //   });

  //   return () => unsubscribe();
  // }, [navigate]);

  // const loadLinkedAccounts = async (accessToken) => {
  //   const accounts = await fetchGoogleLinkedAccounts(accessToken);
  //   setLinkedAccounts(accounts);
  // };

  return (
    <div className='profile-container'>
      
        <Sidebar />
        <h1>Profile</h1>
        {/* {user && (
          <>
            <h2>Welcome, {user.displayName}!</h2>
            <p>Email: {user.email}</p>
            <div className="linked-accounts">
              <h3>Linked Social Media Accounts</h3>
              <ul>
                {linkedAccounts.map((account, index) => (
                  <li key={index}>{account.name}</li>
                ))}
              </ul>
            </div>
          </>
        )} */}
        <div className="profile">
        <p>Welcome user</p>
        
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
