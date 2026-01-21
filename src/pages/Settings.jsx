import React, { useState, useEffect } from 'react';
import '../styles/Settings.css';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: 'Admin User',
    email: 'admin@holocube.com',
    phone: '+91 9876543210',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [systemSettings, setSystemSettings] = useState({
    defaultAdDuration: '30',
    moderationSensitivity: 'medium',
    depthEstimation: '0.8',
    maxFileSize: '10'
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    adApprovalAlerts: true,
    paymentAlerts: true,
    systemErrorAlerts: true,
    newUserAlerts: false
  });

  const [theme, setTheme] = useState('light');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Load saved theme on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
  }, []);

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (profileData.newPassword !== profileData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
    setProfileData({...profileData, currentPassword: '', newPassword: '', confirmPassword: ''});
  };

  const handleSystemSettingsSave = () => {
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const handleNotificationToggle = (key) => {
    setNotifications({...notifications, [key]: !notifications[key]});
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 2000);
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
    // Apply theme immediately and store in localStorage
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <div className="settings-page">
      {showSuccessMessage && (
        <div className="success-message">
          ✓ Changes saved successfully!
        </div>
      )}

      <div className="page-header">
        <h1>Settings</h1>
        <p className="page-subtitle">Manage your account and system preferences</p>
      </div>

      {/* Settings Tabs */}
      <div className="settings-tabs">
        <button 
          className={`settings-tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          👤 Profile
        </button>
        <button 
          className={`settings-tab ${activeTab === 'system' ? 'active' : ''}`}
          onClick={() => setActiveTab('system')}
        >
          ⚙️ System
        </button>
        <button 
          className={`settings-tab ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          🔔 Notifications
        </button>
        <button 
          className={`settings-tab ${activeTab === 'appearance' ? 'active' : ''}`}
          onClick={() => setActiveTab('appearance')}
        >
          🎨 Appearance
        </button>
      </div>

      {/* Settings Content Container with Scroll */}
      <div className="settings-scroll-container">
        {/* Profile Settings */}
        {activeTab === 'profile' && (
          <div className="settings-content">
            <div className="settings-section">
              <h2>Profile Information</h2>
              <p className="section-description">Update your account details and profile picture</p>

              {/* Profile Picture */}
              <div className="profile-picture-section">
                <div className="profile-pic-large">
                  <span>👤</span>
                </div>
                <div className="profile-pic-actions">
                  <button className="upload-pic-btn">Upload New Picture</button>
                  <p className="pic-info">JPG, PNG or GIF. Max size 2MB</p>
                </div>
              </div>

              {/* Profile Form */}
              <form onSubmit={handleProfileUpdate} className="settings-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input 
                      type="email" 
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input 
                    type="tel" 
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  />
                </div>

                <button type="submit" className="save-btn">Save Changes</button>
              </form>
            </div>

            {/* Change Password */}
            <div className="settings-section">
              <h2>Change Password</h2>
              <p className="section-description">Update your password to keep your account secure</p>

              <form onSubmit={handlePasswordChange} className="settings-form">
                <div className="form-group">
                  <label>Current Password</label>
                  <input 
                    type="password" 
                    placeholder="Enter current password"
                    value={profileData.currentPassword}
                    onChange={(e) => setProfileData({...profileData, currentPassword: e.target.value})}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>New Password</label>
                    <input 
                      type="password" 
                      placeholder="Enter new password"
                      value={profileData.newPassword}
                      onChange={(e) => setProfileData({...profileData, newPassword: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Confirm New Password</label>
                    <input 
                      type="password" 
                      placeholder="Confirm new password"
                      value={profileData.confirmPassword}
                      onChange={(e) => setProfileData({...profileData, confirmPassword: e.target.value})}
                    />
                  </div>
                </div>

                <button type="submit" className="save-btn">Update Password</button>
              </form>
            </div>
          </div>
        )}

        {/* System Settings */}
        {activeTab === 'system' && (
          <div className="settings-content">
            <div className="settings-section">
              <h2>System Configuration</h2>
              <p className="section-description">Configure system-wide settings for ad processing</p>

              <div className="settings-form">
                <div className="form-group">
                  <label>Default Ad Duration (days)</label>
                  <select 
                    value={systemSettings.defaultAdDuration}
                    onChange={(e) => setSystemSettings({...systemSettings, defaultAdDuration: e.target.value})}
                  >
                    <option value="7">7 Days</option>
                    <option value="15">15 Days</option>
                    <option value="30">30 Days</option>
                    <option value="60">60 Days</option>
                    <option value="90">90 Days</option>
                  </select>
                  <p className="field-hint">Default duration for new ad campaigns</p>
                </div>

                <div className="form-group">
                  <label>Content Moderation Sensitivity</label>
                  <select 
                    value={systemSettings.moderationSensitivity}
                    onChange={(e) => setSystemSettings({...systemSettings, moderationSensitivity: e.target.value})}
                  >
                    <option value="low">Low - Less strict</option>
                    <option value="medium">Medium - Balanced</option>
                    <option value="high">High - Very strict</option>
                  </select>
                  <p className="field-hint">Controls how strictly content is moderated</p>
                </div>

                <div className="form-group">
                  <label>2D → 3D Depth Estimation (0.1 - 1.0)</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    min="0.1" 
                    max="1.0"
                    value={systemSettings.depthEstimation}
                    onChange={(e) => setSystemSettings({...systemSettings, depthEstimation: e.target.value})}
                  />
                  <p className="field-hint">Controls 3D conversion depth intensity</p>
                </div>

                <div className="form-group">
                  <label>Max File Upload Size (MB)</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="100"
                    value={systemSettings.maxFileSize}
                    onChange={(e) => setSystemSettings({...systemSettings, maxFileSize: e.target.value})}
                  />
                  <p className="field-hint">Maximum allowed file size for ad uploads</p>
                </div>

                <button onClick={handleSystemSettingsSave} className="save-btn">
                  Save System Settings
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notification Settings */}
        {activeTab === 'notifications' && (
          <div className="settings-content">
            <div className="settings-section">
              <h2>Notification Preferences</h2>
              <p className="section-description">Choose what notifications you want to receive</p>

              <div className="notification-settings">
                <div className="notification-item">
                  <div className="notification-info">
                    <h3>Email Notifications</h3>
                    <p>Receive notifications via email</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={notifications.emailNotifications}
                      onChange={() => handleNotificationToggle('emailNotifications')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="notification-item">
                  <div className="notification-info">
                    <h3>Push Notifications</h3>
                    <p>Receive browser push notifications</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={notifications.pushNotifications}
                      onChange={() => handleNotificationToggle('pushNotifications')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="notification-item">
                  <div className="notification-info">
                    <h3>Ad Approval Alerts</h3>
                    <p>Get notified when ads need approval</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={notifications.adApprovalAlerts}
                      onChange={() => handleNotificationToggle('adApprovalAlerts')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="notification-item">
                  <div className="notification-info">
                    <h3>Payment Alerts</h3>
                    <p>Receive alerts for payment transactions</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={notifications.paymentAlerts}
                      onChange={() => handleNotificationToggle('paymentAlerts')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="notification-item">
                  <div className="notification-info">
                    <h3>System Error Alerts</h3>
                    <p>Get notified about system errors and issues</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={notifications.systemErrorAlerts}
                      onChange={() => handleNotificationToggle('systemErrorAlerts')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="notification-item">
                  <div className="notification-info">
                    <h3>New User Alerts</h3>
                    <p>Get notified when new users register</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={notifications.newUserAlerts}
                      onChange={() => handleNotificationToggle('newUserAlerts')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Appearance Settings */}
        {activeTab === 'appearance' && (
          <div className="settings-content">
            <div className="settings-section">
              <h2>Appearance</h2>
              <p className="section-description">Customize how the admin panel looks</p>

              <div className="theme-settings">
                <h3>Theme</h3>
                <p className="theme-description">Select your preferred theme mode</p>
                <div className="theme-options">
                  <div 
                    className={`theme-option ${theme === 'light' ? 'active' : ''}`}
                    onClick={() => handleThemeChange('light')}
                  >
                    <div className="theme-preview light">
                      <div className="preview-header"></div>
                      <div className="preview-content"></div>
                    </div>
                    <p>Light Mode</p>
                    {theme === 'light' && <span className="check-icon">✓</span>}
                  </div>

                  <div 
                    className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
                    onClick={() => handleThemeChange('dark')}
                  >
                    <div className="theme-preview dark">
                      <div className="preview-header"></div>
                      <div className="preview-content"></div>
                    </div>
                    <p>Dark Mode</p>
                    {theme === 'dark' && <span className="check-icon">✓</span>}
                  </div>
                </div>
                <div className="theme-status">
                  <p>Current theme: <strong>{theme === 'light' ? 'Light Mode' : 'Dark Mode'}</strong></p>
                  <p className="theme-note">Note: Theme changes will be applied to the entire application</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
