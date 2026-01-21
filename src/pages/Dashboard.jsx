import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import '../styles/Dashboard.css';
import UserManagement from './UserManagement';
import Analytics from './Analytics';
import Settings from './Settings';
import CreateAd from './CreateAd';
import AdReview from './AdReview';
import AllAds from './AllAds';
import Scheduling from './Scheduling';
import AdBoxSetup from './AdBoxSetup';
import SystemLogs from './SystemLogs';
import FlashSaleControl from './FlashSaleControl';
import Notifications from './Notifications';
import holologo from '../assets/images/holologo.png';
import { logoutAdmin } from '../services/authService';
import SendNotification from './SendNotification';

const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const parseTimestamp = (timestamp) => {
    console.log('🕐 Raw timestamp:', timestamp, typeof timestamp);
    
    if (!timestamp) return new Date();
    
    if (timestamp.seconds) {
      const date = new Date(timestamp.seconds * 1000);
      console.log('✅ Parsed from seconds:', date);
      return date;
    }
    
    if (timestamp.toDate && typeof timestamp.toDate === 'function') {
      const date = timestamp.toDate();
      console.log('✅ Parsed from toDate:', date);
      return date;
    }
    
    if (timestamp instanceof Date) {
      console.log('✅ Already a Date:', timestamp);
      return timestamp;
    }
    
    if (typeof timestamp === 'number') {
      const date = new Date(timestamp);
      console.log('✅ Parsed from number:', date);
      return date;
    }
    
    if (typeof timestamp === 'string') {
      try {
        let cleanedDate = timestamp
          .replace(' at ', ' ')
          .replace(/UTC[+-]\d{1,2}:\d{2}/, '')
          .replace(/GMT[+-]\d{4}/, '')
          .trim();
        
        const parsedDate = new Date(cleanedDate);
        
        if (!isNaN(parsedDate.getTime())) {
          console.log('✅ Parsed from string:', parsedDate);
          return parsedDate;
        }
        
        const directParse = new Date(timestamp);
        console.log('✅ Direct parse:', directParse);
        return directParse;
      } catch (e) {
        console.error('❌ Error parsing timestamp string:', e);
        return new Date();
      }
    }
    
    console.warn('⚠️ Unknown timestamp format, using current time');
    return new Date();
  };

  const fetchNotifications = async () => {
    try {
      console.log('🔍 Fetching notifications for dashboard...');
      const notificationsRef = collection(db, 'notifications');
      const querySnapshot = await getDocs(notificationsRef);
      console.log('📦 Notifications found:', querySnapshot.size);
      
      const notifData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        console.log('📄 Doc:', doc.id, data);
        const createdAt = parseTimestamp(data.timestamp || data.createdAt);
        
        return {
          id: doc.id,
          title: data.title || 'No Title',
          message: data.message || 'No message',
          type: data.type || 'info',
          read: data.read || false,
          createdAt: createdAt
        };
      });
      
      notifData.sort((a, b) => b.createdAt - a.createdAt);
      console.log('✅ Loaded notifications:', notifData);
      setNotifications(notifData);
    } catch (error) {
      console.error('❌ Error fetching notifications:', error);
      setNotifications([]);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-profile') && !event.target.closest('.profile-dropdown')) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = async () => {
  if (window.confirm('Are you sure you want to logout?')) {
    try {
      await logoutAdmin();
      // No need for window.location.reload() here, authService handles it
    } catch (error) {
      console.error('Error logging out:', error);
      alert('Error logging out. Please try again.');
    }
  }
};


  const renderPage = () => {
    switch(currentPage) {
      case 'users': return <UserManagement />;
      case 'analytics': return <Analytics />;
      case 'settings': return <Settings />;
      case 'create-ad': return <CreateAd />;
      case 'ad-review': return <AdReview />;
      case 'all-ads': return <AllAds />;
      case 'scheduling': return <Scheduling />;
      case 'ad-boxes': return <AdBoxSetup />;
      case 'logs': return <SystemLogs />;
      case 'flash-sale': return <FlashSaleControl />;
      case 'notifications': return <Notifications />;
      case 'sendnotification': return <SendNotification/>;

      default:
        return (
          <div className="dashboard-content">
            <div className="page-header">
              <h1>Dashboard Overview</h1>
              <p>Here's what's happening today.</p>
            </div>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>📱</div>
                <div className="stat-info">
                  <p className="stat-label">Total Ads</p>
                  <h3 className="stat-value">156</h3>
                  <span className="stat-change positive">+12% from last month</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon" style={{background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)'}}>✅</div>
                <div className="stat-info">
                  <p className="stat-label">Active Ads</p>
                  <h3 className="stat-value">89</h3>
                  <span className="stat-change positive">+8% from last month</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon" style={{background: 'linear-gradient(135deg, #f6ad55 0%, #ed8936 100%)'}}>⏳</div>
                <div className="stat-info">
                  <p className="stat-label">Pending Review</p>
                  <h3 className="stat-value">23</h3>
                  <span className="stat-change neutral">Needs attention</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon" style={{background: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)'}}>💰</div>
                <div className="stat-info">
                  <p className="stat-label">Revenue (Today)</p>
                  <h3 className="stat-value">₹12,450</h3>
                  <span className="stat-change positive">+5% from yesterday</span>
                </div>
              </div>
            </div>
            <div className="charts-section">
              <div className="chart-card">
                <h3>Impressions Overview</h3>
                <p className="chart-subtitle">Showing impressions trend over last 7 days</p>
                <div className="placeholder-chart" style={{height: '200px', background: 'linear-gradient(135deg, #667eea22 0%, #764ba222 100%)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>📊 Chart Placeholder</div>
              </div>
              <div className="chart-card">
                <h3>Demographics</h3>
                <p className="chart-subtitle">Age distribution of viewers</p>
                <div className="placeholder-chart" style={{height: '200px', background: 'linear-gradient(135deg, #48bb7822 0%, #38a16922 100%)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>📈 Chart Placeholder</div>
              </div>
            </div>
            <div className="activity-section">
              <div className="section-header">
                <h2>Recent Activity</h2>
                <button className="view-all-btn" onClick={() => setCurrentPage('notifications')}>View All</button>
              </div>
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-icon success">✅</div>
                  <div className="activity-content">
                    <p className="activity-title"><strong>Ad Approved</strong> - "Summer Sale Campaign"</p>
                    <span className="activity-time">2 hours ago</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon info">👤</div>
                  <div className="activity-content">
                    <p className="activity-title"><strong>New User Registered</strong> - Agent John Doe</p>
                    <span className="activity-time">3 hours ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src={holologo} alt="HoloBOX Logo" className="sidebar-logo" />
        </div>
        <nav className="sidebar-nav">
          <button className={`nav-item ${currentPage === 'dashboard' ? 'active' : ''}`} onClick={() => setCurrentPage('dashboard')}><span className="icon">📊</span><span>Dashboard</span></button>
          <button className={`nav-item ${currentPage === 'all-ads' ? 'active' : ''}`} onClick={() => setCurrentPage('all-ads')}><span className="icon">📱</span><span>All Products</span></button>
          <button className={`nav-item ${currentPage === 'create-ad' ? 'active' : ''}`} onClick={() => setCurrentPage('create-ad')}><span className="icon">➕</span><span>Create Product</span></button>
          <button className={`nav-item ${currentPage === 'flash-sale' ? 'active' : ''}`} onClick={() => setCurrentPage('flash-sale')}><span className="icon">⚡</span><span>Flash Sale</span></button>
          <button className={`nav-item ${currentPage === 'notifications' ? 'active' : ''}`} onClick={() => setCurrentPage('notifications')}><span className="icon">🔔</span><span>Notifications</span></button>
          <button className={`nav-item ${currentPage === 'sendnotification' ? 'active' : ''}`} onClick={() => setCurrentPage('sendnotification')}><span className="icon">➕</span><span>Send Notifications</span> </button>

          <button className={`nav-item ${currentPage === 'ad-review' ? 'active' : ''}`} onClick={() => setCurrentPage('ad-review')}><span className="icon">✅</span><span>Ad Review</span></button>
          <button className={`nav-item ${currentPage === 'scheduling' ? 'active' : ''}`} onClick={() => setCurrentPage('scheduling')}><span className="icon">📅</span><span>Scheduling</span></button>
          <button className={`nav-item ${currentPage === 'ad-boxes' ? 'active' : ''}`} onClick={() => setCurrentPage('ad-boxes')}><span className="icon">📦</span><span>Ad Boxes</span></button>
          <button className={`nav-item ${currentPage === 'analytics' ? 'active' : ''}`} onClick={() => setCurrentPage('analytics')}><span className="icon">📈</span><span>Analytics</span></button>
          <button className={`nav-item ${currentPage === 'users' ? 'active' : ''}`} onClick={() => setCurrentPage('users')}><span className="icon">👥</span><span>User Management</span></button>
          <button className={`nav-item ${currentPage === 'logs' ? 'active' : ''}`} onClick={() => setCurrentPage('logs')}><span className="icon">📋</span><span>System Logs</span></button>
          <button className={`nav-item ${currentPage === 'settings' ? 'active' : ''}`} onClick={() => setCurrentPage('settings')}><span className="icon">⚙️</span><span>Settings</span></button>
          <button className="nav-item logout" onClick={handleLogout}><span className="icon">🚪</span><span>Logout</span></button>
        </nav>
      </aside>
      <div className="main-wrapper">
        <header className="top-bar">
          <div className="top-bar-left">
            <h2>Dashboard</h2>
          </div>
          <div className="top-bar-actions">
            <div className="user-profile" onClick={() => setShowProfile(!showProfile)}>
              <div className="user-avatar">A</div>
              <span className="user-name">Admin</span>
              <span className="dropdown-arrow">▼</span>
            </div>
            {showProfile && (
              <div className="profile-dropdown">
                <div className="profile-info">
                  <div className="profile-avatar-large">A</div>
                  <h4>Admin</h4>
                  <p>admin@hologram.com</p>
                  <span className="user-role">Administrator</span>
                </div>
                <div className="profile-menu">
                  <button onClick={() => setCurrentPage('settings')}>⚙️ Settings</button>
                  <button onClick={handleLogout}>🚪 Logout</button>
                </div>
              </div>
            )}
          </div>
        </header>
        <main className="page-content">{renderPage()}</main>
      </div>
    </div>
  );
};

export default Dashboard;
