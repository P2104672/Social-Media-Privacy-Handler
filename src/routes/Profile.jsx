import { useEffect, useState } from 'react';
import './Profile.css';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { faFacebook, faInstagram, faThreads } from '@fortawesome/free-brands-svg-icons';

const ProfilePage = () => {
  const [user, setUser ] = useState(null);
  const [connectedPlatforms, setConnectedPlatforms] = useState({});

  useEffect(() => {
    axios.get('https://api.example.com/user')
      .then(response => {
        setUser (response.data);
        setConnectedPlatforms(response.data.connectedPlatforms);
      })
      .catch(error => console.error('Error fetching user data:', error));
  }, []);

  const handleConnectPlatform = (platform) => {
    let apiEndpoint;
  
    // Set the actual API endpoint based on the platform
    switch (platform) {
      case 'facebook':
        apiEndpoint = 'https://your-api-url.com/connect/facebook'; // Replace with your actual Facebook connect URL
        break;
      case 'instagram':
        apiEndpoint = 'https://api.instagram.com/oauth/authorize?client_id=1084505316407721&redirect_uri=https://localhost:3000&scope=user_profile,user_media&response_type=code'; // Replace with your actual Instagram connect URL
        break;
      case 'threads':
        apiEndpoint = 'https://graph.threads.net/v1.0/me?ields=id,username,name,threads_profile_picture_url,threads_biography&access_token=${accessToken}'; //From Threads API Document
        break;
      default:
        console.error('Unknown platform:', platform);
        return;
    }
  
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
          </div>
        )}
        <div className="connected-platforms">
          {connectedPlatforms.facebook && (
            <div>
              <FontAwesomeIcon icon={faFacebook} size="2x" />
              <span>Facebook: {connectedPlatforms.facebook.username}</span>
            </div>
          )}
          {connectedPlatforms.instagram && (
            <div>
              <FontAwesomeIcon icon={faInstagram} size="2x" />
              <span>Instagram: {connectedPlatforms.instagram.username}</span>
            </div>
          )}
          {connectedPlatforms.threads && (
            <div>
              <FontAwesomeIcon icon={faThreads} size="2x" />
              <span>Threads: {connectedPlatforms.threads.username}</span>
            </div>
          )}
          {!connectedPlatforms.facebook && (
            <button onClick={() => handleConnectPlatform('facebook')}>
              <FontAwesomeIcon icon={faFacebook} size="2x" />
              <span>Connect Facebook</span>
            </button>
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

export default ProfilePage;