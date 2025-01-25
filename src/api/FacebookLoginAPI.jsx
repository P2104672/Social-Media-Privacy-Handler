import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import FacebookLogin from '@greatsumini/react-facebook-login';
import axios from 'axios';

function FacebookLoginAPI({ onLoginSuccess }) {
  const [users, setUsers] = useState([]); // Change to an array to hold multiple users
  const [posts, setPosts] = useState([]);
  const [isFBInitialized, setIsFBInitialized] = useState(false);

  const fetchPosts = useCallback(async (token) => {
    try {
      const response = await axios.get(`https://graph.facebook.com/v20.0/me/posts?fields=id,message&access_token=${token}`);
      return response.data.data; // Return posts to be set later
    } catch (error) {
      console.error('Error fetching posts:', error);
      return [];
    }
  }, []);

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
  }, []);

  const handleFacebookLogin = async (response) => {
    console.log('Login Success!', response);
    const userData = {
      accessToken: response.accessToken,
      userID: response.userID,
      name: response.name,
      email: response.email,
      picture: response.picture,
    };

    // Add the new user to the users array
    setUsers((prevUsers) => [...prevUsers, userData]);

    // Fetch posts for the new user
    const userPosts = await fetchPosts(response.accessToken);
    setPosts((prevPosts) => [...prevPosts, { userID: response.userID, posts: userPosts }]);

    if (onLoginSuccess && typeof onLoginSuccess === 'function') {
      onLoginSuccess(userData);
    }
  };

  const handleLogout = (userID) => {
    setUsers(users.filter(user => user.userID !== userID));
    setPosts(posts.filter(post => post.userID !== userID));
  };

  const deletePost = async (userID, postId) => {
    const user = users.find(user => user.userID === userID);
    if (user) {
      try {
        await axios.delete(`https://graph.facebook.com/v20.0/${postId}?access_token=${user.accessToken}`);
        setPosts(posts.map(post => post.userID === userID ? { ...post, posts: post.posts.filter(p => p.id !== postId) } : post));
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  const updatePost = async (userID, postId, newMessage) => {
    const user = users.find(user => user.userID === userID);
    if (user) {
      try {
        await axios.post(`https://graph.facebook.com/v20.0/${postId}?message=${encodeURIComponent(newMessage)}&access_token=${user.accessToken}`);
        setPosts(posts.map(post => post.userID === userID ? { ...post, posts: post.posts.map(p => p.id === postId ? { ...p, message: newMessage } : p) } : post));
      } catch (error) {
        console.error('Error updating post:', error);
      }
    }
  };

  if (users.length === 0) {
    return (
      <FacebookLogin
        appId="296731560198623"
        onSuccess={handleFacebookLogin}
        onFail={(error) => {
          console.log('Login Failed!', error);
        }}
        fields="name,email,picture"
        scope="public_profile,email,user_posts"
        disabled={!isFBInitialized}
      />
    );
  }

  return (
    <div>
      {users.map(user => (
        <div key={user.userID}>
          <h2>Welcome {user.name}</h2>
          <p>User ID: {user.userID}</p>
          {user.picture?.data?.url ? (
            <img src={user.picture.data.url} alt={user.name} />
          ) : (
            <p>Profile picture not available</p>
          )}
          <button onClick={() => handleLogout(user.userID)}>Logout</button>
          <h3>Your Posts:</h3>
          {posts.filter(post => post.userID === user.userID).flatMap(post => post.posts).map(post => (
            <div key={post.id}>
              <p>{post.message}</p>
              <button onClick={() => deletePost(user.userID, post.id)}>Delete</button>
              <button onClick={() => {
                const newMessage = prompt('Enter new message:', post.message);
                if (newMessage) updatePost(user.userID, post.id, newMessage);
              }}>Edit</button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

FacebookLoginAPI.propTypes = {
  onLoginSuccess: PropTypes.func,
};

export default FacebookLoginAPI;