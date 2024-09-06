import { useState, useEffect } from 'react';

function useGoogleAuth(clientId) {
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
    }, [clientId]);

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

    return { user, isLoading, onSuccess, onFailure, onLogoutSuccess };
}

export default useGoogleAuth;
