import { useState, useEffect } from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';

const clientId = "544721700557-k663mu7847o4a1bctnuq5jh104qe982h.apps.googleusercontent.com";

function Login() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadGoogleAPI = () => {
            window.gapi.load('auth2', () => {
                window.gapi.auth2.init({
                    client_id: clientId,
                }).then(() => {
                    checkLoginStatus();
                    setIsLoading(false);
                }).catch(error => {
                    console.error("Error initializing Google API:", error);
                    setIsLoading(false);
                });
            });
        };

        if (window.gapi) {
            loadGoogleAPI();
        } else {
            const script = document.createElement('script');
            script.src = "https://apis.google.com/js/platform.js";
            script.async = true;
            script.defer = true;
            script.onload = loadGoogleAPI;
            document.body.appendChild(script);
        }
    }, []);

    useEffect(() => {
        console.log("Current user state:", user);
    }, [user]);

    const checkLoginStatus = () => {
        const auth2 = window.gapi.auth2.getAuthInstance();
        if (auth2.isSignedIn.get()) {
            const googleUser = auth2.currentUser.get();
            const profile = googleUser.getBasicProfile();
            setUser({
                name: profile.getName(),
                email: profile.getEmail(),
            });
        }
    };

    const onSuccess = (res) => {
        console.log("Login Success! Current user: ", res.profileObj);
        setUser(res.profileObj);
    }

    const onFailure = (res) => {
        console.log("Login Failure! res: ", res);
        setUser(null);
    }

    const onLogoutSuccess = () => {
        console.log("Logout Success!");
        setUser(null);
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {!user ? (
                <div id="signInButton">
                    <GoogleLogin 
                        clientId={clientId} 
                        buttonText='Sign in with Google' 
                        onSuccess={onSuccess} 
                        onFailure={onFailure} 
                        cookiePolicy={'single_host_origin'} 
                        isSignedIn={true}
                    />
                </div>
            ) : (
                <div>
                    <h2>Welcome, {user.name}!</h2>
                    <p>Email: {user.email}</p>
                    <GoogleLogout
                        clientId={clientId}
                        buttonText="Logout"
                        onLogoutSuccess={onLogoutSuccess}
                    />
                </div>
            )}
            <div>
                <h3>Debug Info:</h3>
                <pre>{JSON.stringify(user, null, 2)}</pre>
            </div>
        </div>
    );
}

export default Login;