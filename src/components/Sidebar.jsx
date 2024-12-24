import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faHome, faUser , faChartBar, faSearch } from '@fortawesome/free-solid-svg-icons';
import './Sidebar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (event.clientX <= 20) {
        setIsOpen(true);
      } else if (!isOpen && event.clientX > 250) {
        setIsOpen(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isOpen]);

  return (
    <>
      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
        </button>
        <nav className="sidebar-nav">
          <Link to="/" className="sidebar-link">
            <FontAwesomeIcon icon={faHome} />
            <span>Home</span>
          </Link>
          <Link to="/profile" className="sidebar-link">
            <FontAwesomeIcon icon={faUser } />
            <span>Profile</span>
          </Link>
          <Link to="/search" className="sidebar-link">
            <FontAwesomeIcon icon={faSearch} />
            <span>Search</span>
          </Link>
          <Link to="/DashboardSocialMeida" className="sidebar-link">
            <FontAwesomeIcon icon={faChartBar} />
            <span>Dashboard</span>
          </Link>
        </nav>
      </div>
      <div className={`container ${!isOpen ? 'centered' : ''}`}>
        {/* Main content goes here */}
      </div>
    </>
  );
};

export default Sidebar;