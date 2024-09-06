import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import FacebookLogin from '@greatsumini/react-facebook-login';
import axios from 'axios';

function FacebookLoginAPI({ onLoginSuccess }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Check localStorage for existing login data
    const storedUserData = localStorage.getItem('facebookUserData');
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setIsLoggedIn(true);
      setUserData(parsedUserData);
      fetchPosts(parsedUserData.accessToken);
      
      // Only call onLoginSuccess if it's provided
      if (onLoginSuccess && typeof onLoginSuccess === 'function') {
        onLoginSuccess({
          accessToken: parsedUserData.accessToken,
          userId: parsedUserData.id,
          provider: 'facebook'
        });
      }
    }
  }, [onLoginSuccess]);  // Add onLoginSuccess to the dependency array

  const responseFacebook = async (response) => {
    console.log('Facebook response:', response);
    setIsLoggedIn(true);
    
    // Fetch user profile to get email
    const profileResponse = await fetch(`https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${response.accessToken}`);
    const profileData = await profileResponse.json();
    console.log('Profile data:', profileData);
    
    setUserData(profileData);
    // Store user data in localStorage
    localStorage.setItem('facebookUserData', JSON.stringify({...profileData, accessToken: response.accessToken}));
    await fetchPosts(response.accessToken);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null);
    setPosts([]);
    // Clear localStorage
    localStorage.removeItem('facebookUserData');
    // You might want to call FB.logout() here if using the Facebook SDK
  };

  const fetchPosts = async (token) => {
    try {
      const response = await axios.get(`https://graph.facebook.com/v12.0/me/posts?fields=id,message&access_token=${token}`);
      setPosts(response.data.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const deletePost = async (postId) => {
    try {
      await axios.delete(`https://graph.facebook.com/v12.0/${postId}?access_token=${userData.accessToken}`);
      setPosts(posts.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const updatePost = async (postId, newMessage) => {
    try {
      await axios.post(`https://graph.facebook.com/v12.0/${postId}?message=${encodeURIComponent(newMessage)}&access_token=${userData.accessToken}`);
      setPosts(posts.map(post => post.id === postId ? {...post, message: newMessage} : post));
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  if (!isLoggedIn) {
    return (
      <FacebookLogin
        appId="1050996050019664"
        onSuccess={responseFacebook}
        onFail={(error) => {
          console.log('Login Failed!', error);
        }}
        onProfileSuccess={(response) => {
          console.log('Get Profile Success!', response);
        }}
        fields="name,email,picture"
      />
    );
  }

  console.log('Current userData:', userData);

  return (
    <div>
      <h2>Welcome {userData?.name || 'User'}</h2>
      <p>Email: {userData?.email || 'Not available'}</p>
      {userData?.picture?.data?.url && (
        <img src={userData.picture.data.url} alt={userData?.name || 'User'} />
      )}
      <br/>
      <button onClick={handleLogout}>Logout</button>
      <h3>Your Posts:</h3>
      {posts.map(post => (
        <div key={post.id}>
          <p>{post.message}</p>
          <button onClick={() => deletePost(post.id)}>Delete</button>
          <button onClick={() => {
            const newMessage = prompt('Enter new message:', post.message);
            if (newMessage) updatePost(post.id, newMessage);
          }}>Edit</button>
        </div>
      ))}
    </div>
  );
}

FacebookLoginAPI.propTypes = {
  onLoginSuccess: PropTypes.func,  // Make this prop optional
};

// Export the component as default
export default FacebookLoginAPI;