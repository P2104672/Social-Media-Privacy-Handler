export const FB = window.FB;

export function initFacebookSdk() {
  return new Promise((resolve) => {
    // Load the SDK asynchronously
    (function(d, s, id){
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk')
);

        window.fbAsyncInit = function () {
            FB.init({
              appId: '1050996050019664', // Replace with your Facebook App ID
              cookie: true,
              xfbml: true,
              version: 'v2.7' // Use the same version as in your API calls
            });
            resolve();
          };

        FB.login(function(response) {
        if (response.authResponse) {
            console.log('Welcome!  Fetching your information.... ');
            FB.api('/me', {fields: 'name, email'}, function(response) {
                document.getElementById("profile").innerHTML = "Good to see you, " + response.name + ". i see your email address is " + response.email
            });
        } else { 

            console.log('User cancelled login or did not fully authorize.'); }
        });
    });
}
