import './App.css'
// import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'
import Login from './components/Login'
import {gapi} from 'gapi-script';

import { useEffect } from 'react'

const clientId = "544721700557-k663mu7847o4a1bctnuq5jh104qe982h.apps.googleusercontent.com";
function App() {

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: clientId,
        scope:" "
      })}
      
    gapi.load('client: auth2', start);
  });

  return (
    <div className="app-container">
      <Sidebar />
      <h1>Homg Page</h1>
      <Login />
      <Footer />
    </div>
  )
}

export default App
