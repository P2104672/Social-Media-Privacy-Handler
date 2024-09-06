import './App.css'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'
import {gapi} from 'gapi-script';
import { useEffect } from 'react'
import FacebookLoginAPI from './api/FacebookLoginAPI'
import Login from './components/Login'
// Remove this line: import { handleLoginSuccess } from './api/FacebookLoginAPI';

// facebook APP id=1050996050019664
const clientId = "544721700557-k663mu7847o4a1bctnuq5jh104qe982h.apps.googleusercontent.com";

function App() {
  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: clientId,
        scope:" "
      })
    }
    
    gapi.load('client:auth2', start);
  }, []);

  const handleLoginSuccess = (loginData) => {
    console.log('Login successful in App.jsx:', loginData);
    // Add any app-level login handling logic here
  };

  return (
    <div className="app-container">
      <Sidebar />
      <h1>Social Media Privacy Handler</h1>
      <Login/>
      <FacebookLoginAPI onLoginSuccess={handleLoginSuccess} />
      <Footer />
    </div>
  )
}

export default App
