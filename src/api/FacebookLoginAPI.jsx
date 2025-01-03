// import { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
// import FacebookLogin from '@greatsumini/react-facebook-login';
// import axios from 'axios';
// import './FacebookLoginAPI.css';

// function FacebookLoginAPI({ onLoginSuccess }) {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [userData, setUserData] = useState(null);
//   // const [posts, setPosts] = useState([]);
//   const [isFBInitialized, setIsFBInitialized] = useState(false);

//   // const fetchPosts = useCallback(async (token) => {
//   //   try {
//   //     const response = await axios.get(`https://graph.facebook.com/v21.0/me/posts?fields=id,message,created_time&access_token=${token}`);
//   //     setPosts(response.data.data);
//   //   } catch (error) {
//   //     console.error('Error fetching posts:', error);
//   //   }
//   // }, []);

//   useEffect(() => {
//     // Initialize Facebook SDK
//     window.fbAsyncInit = function() {
//       window.FB.init({
//         appId: '1050996050019664',
//         cookie: true,
//         xfbml: true,
//         version: 'v21.0'
//       });
//       setIsFBInitialized(true);
//     };

//     // Load Facebook SDK
//     (function(d, s, id) {
//       var js, fjs = d.getElementsByTagName(s)[0];
//       if (d.getElementById(id)) return;
//       js = d.createElement(s); js.id = id;
//       js.src = "https://connect.facebook.net/en_US/sdk.js";
//       fjs.parentNode.insertBefore(js, fjs);
//     }(document, 'script', 'facebook-jssdk'));

//     // Check localStorage for existing login data
//     const storedUserData = localStorage.getItem('facebookUserData');
//     if (storedUserData) {
//       const parsedUserData = JSON.parse(storedUserData);
//       console.log('Stored user data:', parsedUserData); // Add this line
//       setIsLoggedIn(true);
//       setUserData(parsedUserData);
//       // fetchPosts(parsedUserData.accessToken);
      
//       if (onLoginSuccess && typeof onLoginSuccess === 'function') {
//         onLoginSuccess({
//           accessToken: parsedUserData.accessToken,
//           userId: parsedUserData.id,
//           provider: 'facebook'
//         });
//       }
//     }
//   }, [onLoginSuccess]); // Add this dependency array

//   const handleFacebookLogin = (response) => {
//     console.log('Login Success!', response);
//     const userData = {
//       accessToken: response.accessToken,
//       userID: response.userID,
//       // fetch additional user data separately
//     };
//     setIsLoggedIn(true);
//     setUserData(userData);
//     localStorage.setItem('facebookUserData', JSON.stringify(userData));
//     fetchUserData(response.accessToken);
//     // fetchPosts(response.accessToken);
//     if (onLoginSuccess && typeof onLoginSuccess === 'function') {
//       onLoginSuccess({
//         accessToken: response.accessToken,
//         userId: response.userID,
//         name: response.name,
//         email: response.email,
//         picture: response.picture,
//         provider: 'facebook'
//       });
//     }
//   };

//   const fetchUserData = async (token) => {
//     try {
//       const response = await axios.get(`https://graph.facebook.com/v21.0/me?fields=name,email,picture&access_token=${token}`);
//       console.log('Additional user data:', response.data); // Add this line
//       const additionalUserData = response.data;
//       setUserData(prevData => {
//         const newData = { ...prevData, ...additionalUserData };
//         console.log('Updated user data:', newData);
//         localStorage.setItem('facebookUserData', JSON.stringify(newData));
//         return newData;
//       });
//     } catch (error) {
//       console.error('Error fetching user data:', error);
//     }
//   };

//   const handleLogout = () => {
//     setIsLoggedIn(false);
//     setUserData(null);
//     // setPosts([]);
//     // Clear localStorage
//     localStorage.removeItem('facebookUserData');
//     // You might want to call FB.logout() here if using the Facebook SDK
//   };


//   if (!isLoggedIn) {
//     return (
//       <FacebookLogin
//         appId="1050996050019664"
//         onSuccess={handleFacebookLogin}
//         onFail={(error) => {
//           console.log('Login Failed!', error);
//         }}
//         fields="name,email,picture"
//         scope="public_profile,email,user_posts"
//         disabled={!isFBInitialized}
//       />
//     );
//   }

//   console.log('Current userData:', userData);

//   return (
//     <div>
//       <h2>Welcome {userData?.name || 'User'}</h2>
//       <p>User ID: {userData?.userID || userData?.id || 'Not available'}</p>
//       <p>Email: {userData?.email || 'Not available'}</p>
//       {userData?.picture?.data?.url ? (
//         <img src={userData.picture.data.url} alt={userData?.name || 'User'} />
//       ) : (
//         <p>Profile picture not available</p>
//       )}
//       <br/>
//       <button onClick={handleLogout}>Logout</button>
//       {}
//     </div>
//   );
// }

// FacebookLoginAPI.propTypes = {
//   onLoginSuccess: PropTypes.func,  // Make this prop optional
// };

// // Export the component as default
// export default FacebookLoginAPI;

