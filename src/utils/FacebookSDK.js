export const FB = window.FB;

export function initFacebookSdk() {
  return new Promise((resolve) => {
    // Load the SDK asynchronously
    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    window.fbAsyncInit = function () {
      FB.init({
        appId: 'YOUR_APP_ID', // Replace with your Facebook App ID
        cookie: true,
        xfbml: true,
        version: 'v18.0' // Use the same version as in your API calls
      });
      resolve();
    };
  });
}
