// import  { useState, useEffect } from 'react';
// import axios from 'axios';
// import PropTypes from 'prop-types';
// //
// //Access Token: 741862900365565953-cw3Eu9zzuPVbSA63sCS6BxRY0w2IRJ5
// // Access Token Secret: nbYpnOtXsetVomWUY0GT3I0AswIGnP8a7THvFn6lzeGlU
// const TwitterFetch = ({ userId }) => {
//   const [tweets, setTweets] = useState([]);
//   const [error, setError] = useState(null);

//   const fetchTweets = async () => {
//     try {
//       const response = await axios.get(`/api/twitter/tweets?userId=${userId}`);
//       setTweets(response.data.data); // Adjust based on the actual response structure
//     } catch (err) {
//       console.error('Error fetching tweets:', err);
//       setError('Failed to fetch tweets');
//     }
//   };

//   useEffect(() => {
//     if (userId) {
//       fetchTweets();
//     }
//   }, [userId]);

//   return (
//     <div>
//       <h2>Your Tweets</h2>
//       {error && <p>{error}</p>}
//       {tweets.map((tweet) => (
//         <div key={tweet.id}>
//           <p>{tweet.text}</p>
//         </div>
//       ))}
//     </div>
//   );
// };

// // Prop types validation
// TwitterFetch.propTypes = {
//   userId: PropTypes.string.isRequired, // Validate that userId is a string and required
// };

// export default TwitterFetch;