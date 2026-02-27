import { useState, useEffect } from 'react';
import '../styles/Dashboard.css';

import UserManagement from './UserManagement';
import Settings from './Settings';
import CreateAd from './CreateAd';
import AllAds from './AllAds';
import FlashSaleControl from './FlashSaleControl';
import Notifications from './Notifications';
import SendNotification from './SendNotification';
import PendingProducts from './PendingProducts';

import holologo from '../assets/images/holologo.png';
import { logoutAdmin } from '../services/authService';

const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState('all-ads');
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest('.user-profile') &&
        !event.target.closest('.profile-dropdown')
      ) {
        setShowProfile(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      try {
        await logoutAdmin();
      } catch (error) {
        console.error('Error logging out:', error);
        alert('Error logging out. Please try again.');
      }
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'users':
        return <UserManagement />;
      case 'settings':
        return <Settings />;
      case 'create-ad':
        return <CreateAd />;
      case 'all-ads':
        return <AllAds />;
      case 'flash-sale':
        return <FlashSaleControl />;
      case 'notifications':
        return <Notifications />;
      case 'sendnotification':
        return <SendNotification />;
      case 'pendingproducts':
        return <PendingProducts />;
      default:
        return <AllAds />;
    }
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src={holologo} alt="HoloBOX Logo" className="sidebar-logo" />
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${currentPage === 'all-ads' ? 'active' : ''}`}
            onClick={() => setCurrentPage('all-ads')}
          >
            📱 All Products
          </button>

          <button
            className={`nav-item ${currentPage === 'create-ad' ? 'active' : ''}`}
            onClick={() => setCurrentPage('create-ad')}
          >
            ➕ Create Product
          </button>

          <button
            className={`nav-item ${currentPage === 'flash-sale' ? 'active' : ''}`}
            onClick={() => setCurrentPage('flash-sale')}
          >
            ⚡ Flash Sale
          </button>

          <button
            className={`nav-item ${currentPage === 'notifications' ? 'active' : ''}`}
            onClick={() => setCurrentPage('notifications')}
          >
            🔔 Notifications
          </button>

          <button
            className={`nav-item ${currentPage === 'sendnotification' ? 'active' : ''}`}
            onClick={() => setCurrentPage('sendnotification')}
          >
            ➕ Send Notifications
          </button>

          <button
            className={`nav-item ${currentPage === 'users' ? 'active' : ''}`}
            onClick={() => setCurrentPage('users')}
          >
            👥 User Management
          </button>

          <button
            className={`nav-item ${currentPage === 'settings' ? 'active' : ''}`}
            onClick={() => setCurrentPage('settings')}
          >
            ⚙️ Settings
          </button>

          <button
            className={`nav-item ${currentPage === 'pendingproducts' ? 'active' : ''}`}
            onClick={() => setCurrentPage('pendingproducts')}
          >
            ⏳ Pending Products
          </button>

          <button className="nav-item logout" onClick={handleLogout}>
            🚪 Logout
          </button>
        </nav>
      </aside>

      <div className="main-wrapper">
        <header className="top-bar">
          <h2>Dashboard</h2>

          <div className="user-profile" onClick={() => setShowProfile(!showProfile)}>
            <div className="user-avatar">A</div>
            <span className="user-name">Admin</span>
            ▼
          </div>

          {showProfile && (
            <div className="profile-dropdown">
              <div className="profile-info">
                <h4>Admin</h4>
                <p>admin@hologram.com</p>
                <span>Administrator</span>
              </div>
              <button onClick={() => setCurrentPage('settings')}>
                ⚙️ Settings
              </button>
              <button onClick={handleLogout}>🚪 Logout</button>
            </div>
          )}
        </header>

        <main className="page-content">{renderPage()}</main>
      </div>
    </div>
  );
};

export default Dashboard;