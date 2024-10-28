import { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faThreads } from '@fortawesome/free-brands-svg-icons';
import FacebookLogin from '@greatsumini/react-facebook-login';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import './Profile.css';

const Profile= () => {
  const [user, setUser ] = useState(null);
  const [connectedPlatforms, setConnectedPlatforms] = useState({
    facebook: false,
    instagram: false,
    threads: false,
  });
  const [isFBInitialized, setIsFBInitialized] = useState(false);

  useEffect(() => {
    // Initialize Facebook SDK
    window.fbAsyncInit = function() {
      window.FB.init({
        appId: '1050996050019664',
        cookie: true,
        xfbml: true,
        version: 'v20.0'
      });
      setIsFBInitialized(true);
    };

    // Load Facebook SDK
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    // Fetch user data from an API
    axios.get('https://api.example.com/user')
      .then(response => {
        setUser (response.data);
        setConnectedPlatforms(response.data.connectedPlatforms);
      })
      .catch(error => console.error('Error fetching user data:', error));
  }, []);

  const handleFacebookLogin = (response) => {
    const userData = {
      name: response.name,
      email: response.email,
      picture: {
        data: {
          url: response.picture.data.url,
        },
      },
    };
    setUser (userData);
    setConnectedPlatforms(prev => ({ ...prev, facebook: true }));
  };

  const handleConnectPlatform = (platform) => {
    // Define the API endpoint for connecting the platform
    const apiEndpoint = `https://api.example.com/connect/${platform}`;
  
    // Make an API call to connect the platform
    axios.post(apiEndpoint)
      .then(({ data }) => {
        console.log(`${platform} connected successfully!`, data);
        setConnectedPlatforms(prevState => ({
          ...prevState,
          [platform]: true,
        }));
      })
      .catch(error => {
        console.error(`Error connecting to ${platform}:`, error);
        alert(`Failed to connect to ${platform}. Please try again.`);
      });
  };

  return (
    <div className="profile-page">
      <Sidebar />
      <h1>Profile Page</h1>
      <div className="profile-info">
        {user && (
          <div>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            {user.picture?.data?.url && (
              <img src={user.picture.data.url} alt={user.name} />
            )}
          </div>
        )}
        {!user && (
          <FacebookLogin
            appId="1050996050019664"
            onSuccess={handleFacebookLogin}
            onFail={(error) => console.log('Login Failed!', error)}
            fields="name,email,picture"
            scope="public_profile,email"
            disabled={!isFBInitialized}
          />
        )}
        <div className="connected-platforms">
          {connectedPlatforms.facebook && (
            <div>
              <FontAwesomeIcon icon={faFacebook} size="2x" />
              <span>Facebook</span>
            </div>
          )}
          {connectedPlatforms.instagram && (
            <div>
              <FontAwesomeIcon icon={faInstagram} size="2x" />
              <span>Instagram</span>
            </div>
          )}
          {connectedPlatforms.threads && (
            <div>
              <FontAwesomeIcon icon={faThreads} size="2x" />
              <span>Threads</span>
            </div>
          )}
          {!connectedPlatforms.facebook && (
            <button onClick={() => handleConnectPlatform('facebook')}>
              <FontAwesomeIcon icon={faFacebook} size="2x" />
              <span>Connect Facebook</span>
            </ button>
          )}
          {!connectedPlatforms.instagram && (
            <button onClick={() => handleConnectPlatform('instagram')}>
              <FontAwesomeIcon icon={faInstagram} size="2x" />
              <span>Connect Instagram</span>
            </button>
          )}
          {!connectedPlatforms.threads && (
            <button onClick={() => handleConnectPlatform('threads')}>
              <FontAwesomeIcon icon={faThreads} size="2x" />
              <span>Connect Threads</span>
            </button>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;