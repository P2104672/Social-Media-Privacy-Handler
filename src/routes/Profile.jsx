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

        setLoading(true); // Start loading state
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
                          username: null,
                          profilePicture: null,
                          email: null,
                          count_posts: null,
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
              const instagramResponse = await fetch(`https://graph.instagram.com/me?fields=id,username,profile_picture_url,followers_count,account_type,media_count,media,biography&access_token=${instagramAccessToken}`);
              if (!instagramResponse.ok) {
                  console.warn(`Failed to fetch Instagram user data: Token may be expired`);
                  setUserData(prevState => ({
                      ...prevState,
                      instagram: {
                          id: null,
                          username: null,
                          profile_picture_url: null,
                          media_count: null,
                          account_type: null,
                          biography: null,
                          followers_count: null,
                      },
                  }));
              } else {
                  const instagramData = await instagramResponse.json();
                  const ig_user_id = instagramData.id;
      
                  // Fetch additional Instagram profile data
                  const igResponse = await fetch(`https://graph.facebook.com/v21.0/${ig_user_id}?fields=biography,followers_count,profile_picture_url&access_token=${instagramAccessToken}`);
                  let additionalInstagramData = {
                      profile_picture_url: instagramData.profile_picture_url || 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png',
                      biography: instagramData.biography,
                      followers_count: instagramData.followers_count
                  };
      
                  if (igResponse.ok) {
                      const instagramProfileData = await igResponse.json();
                      additionalInstagramData = {
                          profile_picture_url: instagramProfileData.profile_picture_url || additionalInstagramData.profile_picture_url,
                          biography: instagramProfileData.biography || additionalInstagramData.biography,
                          followers_count: instagramProfileData.followers_count || additionalInstagramData.followers_count
                      };
                  } else {
                      console.warn(`Failed to fetch additional Instagram user data: Token may be expired`);
                  }
      
                  // Update user data state with the retrieved information
                  setUserData(prevState => ({
                      ...prevState,
                      instagram: {
                          id: instagramData.id,
                          username: instagramData.username,
                          ...additionalInstagramData,
                          media_count: instagramData.media_count,
                          account_type: instagramData.account_type,
                          
                      },
                  }));
              }
          } catch (error) {
              console.error('Error fetching Instagram data:', error);
          }
      
          // Fetch Threads user data
          try {
              const threadsResponse = await fetch(`https://graph.threads.net/v1.0/me?fields=id,name,threads_profile_picture_url,threads_biography&access_token=${threadsAccessToken}`);
              if (!threadsResponse.ok) {
                  console.warn(`Failed to fetch Threads user data: Token may be expired`);
                  setUserData(prevState => ({
                      ...prevState,
                      threads: {
                          id: null,
                          username: null,
                          profilePicture: null,
                          views: null,
                          likes: null,
                          threads_biography: null,
                      },
                  }));
              } else {
                  const threadsData = await threadsResponse.json();
                  const mediaId = threadsData.id; // Get media ID from threads data
      
                  // Check if mediaId is valid before fetching insights
                  if (mediaId) {
                      const insightsResponse = await fetch(`https://graph.threads.net/v1.0/${mediaId}/insights?&access_token=${threadsAccessToken}`);
                      let views = null;
                      let likes = null;
      
                      if (insightsResponse.ok) {
                          const insightsData = await insightsResponse.json();
                          views = insightsData.views; // Get views from insights data
                          likes = insightsData.likes; // Get likes from insights data
                      } else {
                          console.warn('Failed to fetch insights data');
                      }
      
                      // Update user data state with the retrieved information
                      setUserData(prevState => ({
                          ...prevState,
                          threads: {
                              username: threadsData.name,
                              profilePicture: threadsData.threads_profile_picture_url || 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Threads_logo.png/1024px-Threads_logo.png',
                              views: views,
                              likes: likes,
                              threads_biography: threadsData.threads_biography,
                          },
                      }));
                  } else {
                      console.warn('No media ID available to fetch insights');
                      setUserData(prevState => ({
                          ...prevState,
                          threads: {
                              username: threadsData.name,
                              profilePicture: threadsData.threads_profile_picture_url || 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Threads_logo.png/1024px-Threads_logo.png', // Placeholder icon
                              views: null,
                              likes: null,
                              threads_biography: threadsData.threads_biography
                          },
                      }));
                  }
              }
          } catch (error) {
              console.error('Error fetching Threads data:', error);
              setError('Failed to load user data. Please try again later.');
          } finally {
              setLoading(false); // End loading state
          }
      
      } catch (error) {
          console.error('Error in fetching user data:', error);
          setError('Failed to load user data. Please try again later.');
      } 
    }
      fetchUserData(); // Call the function to fetch user data//+
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
      <Sidebar />
      <h1>Your Profile</h1>
      <div className="profile-page">

        <div className="social-media-section">
          <h2>Social Media Accounts</h2>
          <ul>
            {userData.facebook && (
              <li className="social-media-item">
                <div className="social-media-name">
                <h2 className="social-name">Facebook</h2>
                </div>
                <div className="row">
                  <img 
                    src={userData.facebook.profilePicture || 'https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg'} 
                    alt="Facebook icon" 
                    className="social-icon" 
                  />
                  <span className="username">{userData.facebook.username || 'Please Login !'}</span>
                </div>
                <div className="row">
                  <p className="media-count">Number of Posts:<b>20</b></p>
                </div>
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
                  <h2 className="social-name">Instagram</h2>
                    <div className="row">
                        <img 
                            src={userData.instagram.profile_picture_url || 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png'} 
                            alt="Instagram icon" 
                            className="social-icon" 
                        />
                        <span className="username">{userData.instagram.username || 'Please Login !'}</span>
                    </div>
                    <div className="row">
                        <p className="media-count">Number of Posts: <b>{userData.instagram.media_count}</b></p>
                    </div>
                    <div className="row">
                        <p className="media-count">Account Type: <b>{userData.instagram.account_type}</b></p>
                    </div>

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
                <h2 className="social-name">Threads</h2>
                <div className="row">
                  <img 
                    src={userData.threads.profilePicture || 'https://upload.wikimedia.org/wikipedia/commons/d/db/Threads_%28app%29.png'} 
                    alt="Threads icon" 
                    className="social-icon" 
                  />
                  <span className="username">{userData.threads.username || 'Please Login !'}</span>
                </div>
                <div className='row'>
                  <span className="">{userData.threads.threads_biography}</span><br/>
                </div>
                <div className='row'>
                  <p className="">Number of Posts:<b>8</b></p>
                </div>
                <button onClick={() => setShowThreadsInput(!showThreadsInput)} className="transparent-button">
                  Update Token
                </button>
                {showThreadsInput && (
                  <div className="access-token-input">
                    <input
                      type="text"
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