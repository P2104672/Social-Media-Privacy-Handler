// import { useEffect } from 'react';

// const LINKEDIN_CLIENT_SECRET = 'your_client_secret';
// const LINKEDIN_CLIENT_ID = 'your_client_id';
// const LINKEDIN_CALLBACK_URL = 'https://localhost:3000';
// const linkedinOAuthURL = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(
//   LINKEDIN_CALLBACK_URL
// )}&scope=r_liteprofile%20r_emailaddress`;

// const LinkedInOAuth = () => {
//   const handleLogin = async (code) => {
//     try {
//       // Exchange the code for an access token
//       const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
//         method: 'POST',
//         body: new URLSearchParams({
//           grant_type: 'authorization_code',
//           code,
//           redirect_uri: LINKEDIN_CALLBACK_URL,
//           client_id: LINKEDIN_CLIENT_ID,
//           client_secret: LINKEDIN_CLIENT_SECRET
//         })
//       });
//       const data = await response.json();
//       const accessToken = data.access_token;

//       // Fetch the user's LinkedIn profile
//       const userProfileResponse = await fetch(
//         'https://api.linkedin.com/v2/me?projection=(id,firstName,lastName)',
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`
//           }
//         }
//       );
//       const userProfile = await userProfileResponse.json();

//       // Handle the user profile data (e.g., store it in your database and log the user in)
//       console.log(
//         `Welcome, ${userProfile.firstName.localized.en_US} ${userProfile.lastName.localized.en_US}!`
//       );
//     } catch (error) {
//       console.error('Error during LinkedIn OAuth:', error);
//     }
//   };

//   const handleLinkedInCallback = () => {
//     const queryString = window.location.search;
//     const urlParams = new URLSearchParams(queryString);
//     const code = urlParams.get('code');
//     if (code) handleLogin(code);
//   };

//   useEffect(() => {
//     handleLinkedInCallback();
//   }, []);

//   return (
//     <div>
//       <a href={linkedinOAuthURL}>Sign in with LinkedIn</a>
//     </div>
//   );
// };

// export default LinkedInOAuth;