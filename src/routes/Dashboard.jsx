// src/pages/Dashboard.jsx
import Sidebar from '../components/Sidebar';
import './Dashboard.css';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome to your dashboard! Here you can manage your social media accounts and privacy settings.</p>
      </div>
      <div className="dashboard-content">
        <Link to="/"><div className="dashboard-card">
          <h3>Account Summary</h3>
          <p>Overview of connected social media accounts.</p>
        </div></Link>
        <Link to="/"><div className="dashboard-card">
          <h3>Manage Posts</h3>
          <p>Search, manage, and delete your posts across all platforms.</p>
        </div></Link>
        <Link to="/"><div className="dashboard-card">
          <h3>Privacy Settings</h3>
          <p>Adjust your privacy settings for each connected account.</p>
        </div></Link>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
