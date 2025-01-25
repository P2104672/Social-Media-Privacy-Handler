  import './App.css'
  import Sidebar from './components/Sidebar';
  import Footer from './components/Footer';

  import {gapi} from 'gapi-script';
  import { useEffect, useState } from 'react';
  import { AuthProvider } from './context/AuthContext';


  import img1 from './guideimage/1.png'; 
  import img2 from './guideimage/2.png';
  import img3 from './guideimage/3.png';
  import img4 from './guideimage/4.png';
  import img5 from './guideimage/5.png';
  import img6 from './guideimage/6.png';
  import img7 from './guideimage/7.png';
  import img8 from './guideimage/8.png';
  import img9 from './guideimage/9.png';
  import img10 from './guideimage/10.png';
  import img11 from './guideimage/11.png';
  import img12 from './guideimage/12.png';
  import img1314 from './guideimage/1314.png';
  import img15 from './guideimage/15.png';
  import img16 from './guideimage/16.png';
  import img1718 from './guideimage/1718.png';
  import img19 from './guideimage/19.png';
  import img20 from './guideimage/20.png';
  import img21 from './guideimage/21.png';

  import Timg12 from './guideimage/T12.png'; 
  import Timg3 from './guideimage/T3.png';
  import Timg4 from './guideimage/T4.png';
  import Timg5 from './guideimage/T5.png';
  import Timg6 from './guideimage/T6.png';
  import Timg7 from './guideimage/T7.png';
  import Timg8 from './guideimage/T8.png';
  import Timg9 from './guideimage/T9.png';
  import Timg10 from './guideimage/T10.png';
  import Timg11 from './guideimage/T11.png';
  import Timg112 from './guideimage/T112.png';
  import Timg13 from './guideimage/T13.png';
  import Timg1415 from './guideimage/T1415.png';
  import Timg16 from './guideimage/T16.png';
  import Timg17 from './guideimage/T17.png';

  // facebook APP id=1050996050019664
  const clientId = "544721700557-k663mu7847o4a1bctnuq5jh104qe982h.apps.googleusercontent.com";

  function App() {
    // const [isFacebookOpen, setIsFacebookOpen] = useState(false);
    const [isInstagramOpen, setIsInstagramOpen] = useState(false);
    const [isThreadsOpen, setIsThreadsOpen] = useState(false);

    // const toggleFacebook = () => setIsFacebookOpen(!isFacebookOpen);
    const toggleInstagram = () => setIsInstagramOpen(!isInstagramOpen);
    const toggleThreads = () => setIsThreadsOpen(!isThreadsOpen);

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
      <AuthProvider>
      <div className="app-container">
        <Sidebar />
        <div className="introduction">
          <h1>Social Media Privacy Handler</h1>
          <p>Welcome to the <strong>Social Media Privacy Handler</strong>!</p>
          <p>This application allows you to effortlessly manage and view your social media posts all in one place, eliminating the need to navigate through different platforms separately.</p>
          <p><strong>Student Name:</strong> LO PUI I, Eva</p>
          <p><strong>Supervisor:</strong> Rebecca Chio</p>
          <h2>Tutorials for Accessing the Application:</h2>
          <h3>Notice: Only <b  style={{ color: '#FFFDD0', }}>PUBLIC ACCOUNT</b> can be accessed by this application.</h3>
        </div>


        <div className="user-guide">
        
        {/* <div className="section">
          <h3 onClick={toggleFacebook} className="section-title" 
          style={{ 
            color: 'white', // Text color
            backgroundColor: '#3b5998', // Facebook color
            cursor: 'pointer', // Pointer cursor on hover
            padding: '10px', // Optional: padding for better appearance
            borderRadius: '50px' // Optional: rounded corners
          }}>
            Facebook {isFacebookOpen ? '-' : '+'}
          </h3>
          {isFacebookOpen && (
            <div className="section-content">
              <div className="image-grid">
                <img src={img1} alt="Guide 1" />
                <img src={img2} alt="Guide 2" />
                <img src={img3} alt="Guide 3" />
                <img src={img4} alt="Guide 4" />
                <img src={img5} alt="Guide 5" />
                <img src={img6} alt="Guide 6" />
                <img src={img7} alt="Guide 7" />
                <img src={img8} alt="Guide 8" />
                <img src={img9} alt="Guide 9" />
                <img src={img10} alt="Guide 10" />
                <img src={img11} alt="Guide 11" />
                <img src={img12} alt="Guide 12" />
                <img src={img1314} alt="Guide 13" />
                <img src={img15} alt="Guide 14" />
                <img src={img16} alt="Guide 15" />
                <img src={img1718} alt="Guide 16" />
                <img src={img19} alt="Guide 17" />
                <img src={img20} alt="Guide 18" />
                <img src={img21} alt="Guide 19" />
              </div>
            </div>
          )}
        </div> */}
        <div className="section">
          <h3 onClick={toggleInstagram} className="section-title" 
          style={{ 
            color: 'white', // Text color
            backgroundColor: '#C13584', // Instagram color
            cursor: 'pointer', // Pointer cursor on hover
            padding: '10px', // Optional: padding for better appearance
            borderRadius: '50px' // Optional: rounded corners
          }}>
            Instagram {isInstagramOpen ? '-' : '+'}
          </h3>
          {isInstagramOpen && (
            <div className="section-content">
              <div className="image-grid">
                <img src={img1} alt="Guide 1" />
                <img src={img2} alt="Guide 2" />
                <img src={img3} alt="Guide 3" />
                <img src={img4} alt="Guide 4" />
                <img src={img5} alt="Guide 5" />
                <img src={img6} alt="Guide 6" />
                <img src={img7} alt="Guide 7" />
                <img src={img8} alt="Guide 8" />
                <img src={img9} alt="Guide 9" />
                <img src={img10} alt="Guide 10" />
                <img src={img11} alt="Guide 11" />
                <img src={img12} alt="Guide 12" />
                <img src={img1314} alt="Guide 13" />
                <img src={img15} alt="Guide 14" />
                <img src={img16} alt="Guide 15" />
                <img src={img1718} alt="Guide 16" />
                <img src={img19} alt="Guide 17" />
                <img src={img20} alt="Guide 18" />
                <img src={img21} alt="Guide 19" />
              </div>
            </div>
          )}
        </div>
        
        <div className="section">
          <h3 onClick={toggleThreads} className="section-title" 
          style={{ 
            color: 'white', // Text color
            backgroundColor: '#262626', // Threads color (dark gray)
            cursor: 'pointer', // Pointer cursor on hover
            padding: '10px', // Optional: padding for better appearance
            borderRadius: '50px' // Optional: rounded corners
          }}>
            Threads {isThreadsOpen ? '-' : '+'}
          </h3>
          {isThreadsOpen && (
            <div className="section-content">
              <div className="image-grid">
                <img src={Timg12} alt="Guide 1" />
                <img src={Timg3} alt="Guide 2" />
                <img src={Timg4} alt="Guide 3" />
                <img src={Timg5} alt="Guide 4" />
                <img src={Timg6} alt="Guide 5" />
                <img src={Timg7} alt="Guide 6" />
                <img src={Timg8} alt="Guide 7" />
                <img src={Timg9} alt="Guide 8" />
                <img src={Timg10} alt="Guide 9" />
                <img src={Timg11} alt="Guide 10" />
                <img src={Timg112} alt="Guide 11" />
                <img src={Timg13} alt="Guide 12" />
                <img src={Timg1415} alt="Guide 13" />
                <img src={Timg16} alt="Guide 14" />
                <img src={Timg17} alt="Guide 15" />
              </div>
            </div>
          )}
        </div>
              </div>

        <Footer />
      </div>
      </AuthProvider>
    )
  }

  export default App
