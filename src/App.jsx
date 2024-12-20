import './App.css'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'
import {gapi} from 'gapi-script';
import { useEffect } from 'react'

// facebook APP id=1050996050019664
const clientId = "544721700557-k663mu7847o4a1bctnuq5jh104qe982h.apps.googleusercontent.com";

function App() {
  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: clientId,
        scope: ""
      }).then(() => {
        // Handle successful initialization
        console.log('GAPI client initialized');
      }).catch((error) => {
        console.error('Error initializing GAPI client', error);
      });
    }
    
    gapi.load('client:auth2', start);
  }, []);

  useEffect(() => {
    window.fbAsyncInit = function() {
      window.FB.init({
        appId: '1050996050019664',
        cookie: true,
        xfbml: true,
        version: 'v2.7'
      });
      
      window.FB.AppEvents.logPageView();   
    };
  }, []);


  return (
    <div className="app-container">
      <Sidebar />
      <h1>Social Media Privacy Handler</h1>
      <p>Welcome to Social Media Privacy Handler, this is an application that helps you manage your social media posts in one place.</p>
      <p>Student Name: LO PUI I, Eva</p>
      <p>Supervisor: Rebecca Chio</p>
      <h2>There are the tutorial of getting access for this application :</h2>
      <Footer />
    </div>
  )
}

export default App
