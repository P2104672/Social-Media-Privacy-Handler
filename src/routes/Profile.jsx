// Profile.jsx
import { useEffect, useState } from 'react';
import { getFacebookAccessToken, setFacebookAccessToken } from '../api/facebookUtils';
import { getInstagramAccessToken, setInstagramAccessToken } from '../api/instagramUtils';
import threadsUtils from '../api/threadsUtils';
import './Profile.css'; // Import your CSS file for styling
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const Profile = () => {
  const [userData, setUserData] = useState({
    facebook: null,
    instagram: null,
    threads: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newFacebookToken, setNewFacebookToken] = useState('');
  const [newInstagramToken, setNewInstagramToken] = useState('');
  const [newThreadsToken, setNewThreadsToken] = useState('');
  const [showFacebookInput, setShowFacebookInput] = useState(false);
  const [showInstagramInput, setShowInstagramInput] = useState(false);
  const [showThreadsInput, setShowThreadsInput] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const { accessToken: facebookAccessToken } = await getFacebookAccessToken();
        const { accessToken: instagramAccessToken } = await getInstagramAccessToken();
        const { accessToken: threadsAccessToken } = await threadsUtils.getThreadsAccessToken();

        // Fetch Facebook user data
        try {
          const facebookResponse = await fetch(`https://graph.facebook.com/me?fields=id,name,picture,email&access_token=${facebookAccessToken}`);
          if (!facebookResponse.ok) {
            console.warn(`Failed to fetch Facebook user data: Token may be expired`);
            setUserData(prevState => ({
              ...prevState,
              facebook: {
                username: null, // Set username to null if token is expired
                profilePicture: null,
                email: null,
              },
            }));
          } else {
            const facebookData = await facebookResponse.json();
            setUserData(prevState => ({
              ...prevState,
              facebook: {
                username: facebookData.name,
                profilePicture: facebookData.picture.data.url,
                email: facebookData.email,
              },
            }));
          }
        } catch (err) {
          console.warn('Error fetching Facebook data:', err);
        }

        // Fetch Instagram user data
        try {
          const instagramResponse = await fetch(`https://graph.instagram.com/me?fields=id,username,profile_picture_url&access_token=${instagramAccessToken}`);
          if (!instagramResponse.ok) {
            console.warn(`Failed to fetch Instagram user data: Token may be expired`);
            setUserData(prevState => ({
              ...prevState,
              instagram: {
                username: null, // Set username to null if token is expired
                profilePicture: null,
              },
            }));
          } else {
            const instagramData = await instagramResponse.json();
            setUserData(prevState => ({
              ...prevState,
              instagram: {
                username: instagramData.username,
                profilePicture: instagramData.profile_picture_url || 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png', 
              },
            }));
          }
        } catch (err) {
          console.warn('Error fetching Instagram data:', err);
        }

        // Fetch Threads user data
        try {
          const threadsResponse = await fetch(`https://graph.threads.net/v1.0/me?fields=id,name,threads_profile_picture_url&access_token=${threadsAccessToken}`);
          if (!threadsResponse.ok) {
            console.warn(`Failed to fetch Threads user data: Token may be expired`);
            setUserData(prevState => ({
              ...prevState,
              threads: {
                username: null, // Set username to null if token is expired
                profilePicture: null,
              },
            }));
          } else {
            const threadsData = await threadsResponse.json();
            setUserData(prevState => ({
              ...prevState,
              threads: {
                username: threadsData.name,
                profilePicture: threadsData.threads_profile_picture_url || 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Threads_logo.png/1024px-Threads_logo.png', // Placeholder icon
              },
            }));
          }
        } catch (err) {
          console.warn('Error fetching Threads data:', err);
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);
  
  const handleFacebookTokenChange = (e) => {
    setNewFacebookToken(e.target.value);
  };

  const handleInstagramTokenChange = (e) => {
    setNewInstagramToken(e.target.value);
  };

  const handleThreadsTokenChange = (e) => {
    setNewThreadsToken(e.target.value);
  };

  const handleFacebookTokenSubmit = () => {
    setFacebookAccessToken(newFacebookToken); // Update the Facebook access token
    console.log('Updated Facebook Access Token:', newFacebookToken);
    setNewFacebookToken(''); 
    setShowFacebookInput(false);
  };

  const handleInstagramTokenSubmit = () => {
    setInstagramAccessToken(newInstagramToken); // Update the Instagram access token
    console.log('Updated Instagram Access Token:', newInstagramToken);
    setNewInstagramToken(''); 
    setShowInstagramInput(false); 
  };

  const handleThreadsTokenSubmit = () => {
    threadsUtils.setAccessToken(newThreadsToken); // Update the Threads access token
    console.log('Updated Threads Access Token:', newThreadsToken);
    setNewThreadsToken('');
    setShowThreadsInput(false); 
  };

  if (loading) {
    return <div className="loader">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className='profile-container'>
      <div className="profile-page">
        <Sidebar />
        <h1>Your Profile</h1>
        <div className="social-media-section">
          <h2>Social Media Accounts</h2>
          <ul>
            {userData.facebook && (
              <li className="social-media-item">
                <img src={userData.facebook.profilePicture || 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Facebook_f_logo_%282019%29.svg'} alt="Facebook icon" className="social-icon" />
                <span>{userData.facebook.username || 'Username not available'}</span>
                <button onClick={() => setShowFacebookInput(!showFacebookInput)} className="transparent-button">
                  Update Token
                </button>
                {showFacebookInput && (
                  <div className="access-token-input">
                    <input
                      type="text"
                      value={newFacebookToken}
                      onChange={handleFacebookTokenChange}
                      placeholder="Enter your Facebook access token"
                    />
                    <button onClick={handleFacebookTokenSubmit} className="transparent-submit-button">Submit</button>
                  </div>
                )}
              </li>
            )}
            {userData.instagram && (
              <li className="social-media-item">
                <img src={userData.instagram.profilePicture || 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png'} alt="Instagram icon" className="social-icon" />
                <span>{userData.instagram.username || 'Username not available'}</span>
                <button onClick={() => setShowInstagramInput(!showInstagramInput)} className="transparent-button">
                  Update Token
                </button>
                {showInstagramInput && (
                  <div className="access-token-input">
                    <input
                      type="text"
                      value={newInstagramToken}
                      onChange={handleInstagramTokenChange}
                      placeholder="Enter your Instagram access token"
                    />
                    <button onClick={handleInstagramTokenSubmit} className="transparent-submit-button">Submit</button>
                  </div>
                )}
              </li>
            )}
            {userData.threads && (
              <li className="social-media-item">
                <img src={userData.threads.profilePicture || 'https://upload.wikimedia.org/wikipedia/commons/d/db/Threads_%28app%29.png'} alt="Threads icon" className="social-icon" />
                <span>{userData.threads.username || 'Not Available'}</span>
                <button onClick={() => setShowThreadsInput(!showThreadsInput)} className="transparent-button">
                  Update Token
                </button>
                {showThreadsInput && (
                  <div className="access-token-input">
                    <input
                      type=" text"
                      value={newThreadsToken}
                      onChange={handleThreadsTokenChange}
                      placeholder="Enter your Threads access token"
                    />
                    <button onClick={handleThreadsTokenSubmit} className="transparent-submit-button">Submit</button>
                  </div>
                )}
              </li>
            )}
          </ul>
        </div>
        <Footer />
      </div>
    </div>
  );
};
export default Profile;