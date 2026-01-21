import React, { useState } from 'react';
import '../styles/SystemLogs.css';

const SystemLogs = () => {
  const [filterType, setFilterType] = useState('all');
  const [filterUser, setFilterUser] = useState('all');
  const [filterDate, setFilterDate] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLog, setSelectedLog] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Mock log data
  const [logs] = useState([
    {
      id: 1,
      timestamp: '2026-01-14 18:45:32',
      type: 'user',
      action: 'Login',
      user: 'admin@hologram.com',
      userName: 'Admin User',
      description: 'User logged into the system',
      ipAddress: '192.168.1.100',
      device: 'Chrome on Windows',
      status: 'success',
      details: { method: 'Email/Password', location: 'Kochi, India' }
    },
    {
      id: 2,
      timestamp: '2026-01-14 18:30:15',
      type: 'ad',
      action: 'Ad Created',
      user: 'john.doe@example.com',
      userName: 'John Doe',
      description: 'Created new ad "Summer Sale 2026"',
      ipAddress: '192.168.1.102',
      device: 'Safari on MacOS',
      status: 'success',
      details: { adId: 'AD-2026-001', adName: 'Summer Sale 2026', category: 'Retail' }
    },
    {
      id: 3,
      timestamp: '2026-01-14 18:15:48',
      type: 'system',
      action: 'Firmware Update',
      user: 'system',
      userName: 'System',
      description: 'Ad Box firmware updated to v2.4.1',
      ipAddress: '192.168.1.101',
      device: 'Ad Box HCB-001-KCH',
      status: 'success',
      details: { deviceId: 'HCB-001-KCH', fromVersion: 'v2.4.0', toVersion: 'v2.4.1' }
    },
    {
      id: 4,
      timestamp: '2026-01-14 17:58:22',
      type: 'security',
      action: 'Failed Login Attempt',
      user: 'unknown@example.com',
      userName: 'Unknown User',
      description: 'Failed login attempt - incorrect password',
      ipAddress: '45.123.67.89',
      device: 'Firefox on Linux',
      status: 'failure',
      details: { attempts: 3, blocked: false }
    },
    {
      id: 5,
      timestamp: '2026-01-14 17:45:10',
      type: 'user',
      action: 'User Created',
      user: 'admin@hologram.com',
      userName: 'Admin User',
      description: 'Created new user account for jane.smith@example.com',
      ipAddress: '192.168.1.100',
      device: 'Chrome on Windows',
      status: 'success',
      details: { newUser: 'jane.smith@example.com', role: 'Advertiser' }
    },
    {
      id: 6,
      timestamp: '2026-01-14 17:30:05',
      type: 'ad',
      action: 'Ad Approved',
      user: 'reviewer@hologram.com',
      userName: 'Reviewer',
      description: 'Approved ad "Electronics Sale"',
      ipAddress: '192.168.1.105',
      device: 'Chrome on Android',
      status: 'success',
      details: { adId: 'AD-2026-002', adName: 'Electronics Sale', reviewTime: '5 minutes' }
    },
    {
      id: 7,
      timestamp: '2026-01-14 17:15:33',
      type: 'system',
      action: 'Backup Created',
      user: 'system',
      userName: 'System',
      description: 'Automated database backup completed',
      ipAddress: '192.168.1.1',
      device: 'Server',
      status: 'success',
      details: { size: '2.3 GB', duration: '45 seconds' }
    },
    {
      id: 8,
      timestamp: '2026-01-14 17:00:18',
      type: 'adbox',
      action: 'Device Offline',
      user: 'system',
      userName: 'System',
      description: 'Ad Box went offline - connection lost',
      ipAddress: '192.168.1.104',
      device: 'Ad Box HCB-004-DEL',
      status: 'warning',
      details: { deviceId: 'HCB-004-DEL', lastSeen: '2 hours ago', reason: 'Connection timeout' }
    },
    {
      id: 9,
      timestamp: '2026-01-14 16:45:55',
      type: 'payment',
      action: 'Payment Received',
      user: 'john.doe@example.com',
      userName: 'John Doe',
      description: 'Payment of ₹15,000 received for campaign #1234',
      ipAddress: '192.168.1.102',
      device: 'Safari on MacOS',
      status: 'success',
      details: { amount: '₹15,000', method: 'UPI', transactionId: 'TXN123456789' }
    },
    {
      id: 10,
      timestamp: '2026-01-14 16:30:42',
      type: 'security',
      action: 'Password Changed',
      user: 'jane.smith@example.com',
      userName: 'Jane Smith',
      description: 'User changed their password',
      ipAddress: '192.168.1.108',
      device: 'Chrome on Windows',
      status: 'success',
      details: { method: 'Security settings' }
    },
    {
      id: 11,
      timestamp: '2026-01-14 16:15:28',
      type: 'ad',
      action: 'Ad Scheduled',
      user: 'john.doe@example.com',
      userName: 'John Doe',
      description: 'Scheduled ad "Summer Sale" for 2026-01-15',
      ipAddress: '192.168.1.102',
      device: 'Safari on MacOS',
      status: 'success',
      details: { adId: 'AD-2026-001', scheduledDate: '2026-01-15', timeSlot: '09:00-12:00' }
    },
    {
      id: 12,
      timestamp: '2026-01-14 16:00:12',
      type: 'user',
      action: 'User Deleted',
      user: 'admin@hologram.com',
      userName: 'Admin User',
      description: 'Deleted user account test.user@example.com',
      ipAddress: '192.168.1.100',
      device: 'Chrome on Windows',
      status: 'success',
      details: { deletedUser: 'test.user@example.com', reason: 'Account inactive' }
    },
    {
      id: 13,
      timestamp: '2026-01-14 15:45:38',
      type: 'system',
      action: 'System Maintenance',
      user: 'system',
      userName: 'System',
      description: 'Scheduled maintenance started',
      ipAddress: '192.168.1.1',
      device: 'Server',
      status: 'info',
      details: { duration: '30 minutes', affectedServices: 'Analytics' }
    },
    {
      id: 14,
      timestamp: '2026-01-14 15:30:25',
      type: 'adbox',
      action: 'Device Restart',
      user: 'admin@hologram.com',
      userName: 'Admin User',
      description: 'Manually restarted Ad Box HCB-002-BLR',
      ipAddress: '192.168.1.100',
      device: 'Chrome on Windows',
      status: 'success',
      details: { deviceId: 'HCB-002-BLR', reason: 'Performance optimization' }
    },
    {
      id: 15,
      timestamp: '2026-01-14 15:15:07',
      type: 'security',
      action: 'API Key Generated',
      user: 'john.doe@example.com',
      userName: 'John Doe',
      description: 'Generated new API key for integration',
      ipAddress: '192.168.1.102',
      device: 'Safari on MacOS',
      status: 'success',
      details: { keyName: 'Production API Key', permissions: 'Read/Write' }
    }
  ]);

  const getTypeIcon = (type) => {
    switch(type) {
      case 'user': return '👤';
      case 'ad': return '📢';
      case 'system': return '⚙️';
      case 'security': return '🔒';
      case 'adbox': return '📦';
      case 'payment': return '💳';
      default: return '📋';
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'success': return 'status-success';
      case 'failure': return 'status-failure';
      case 'warning': return 'status-warning';
      case 'info': return 'status-info';
      default: return '';
    }
  };

  const getTypeClass = (type) => {
    switch(type) {
      case 'user': return 'type-user';
      case 'ad': return 'type-ad';
      case 'system': return 'type-system';
      case 'security': return 'type-security';
      case 'adbox': return 'type-adbox';
      case 'payment': return 'type-payment';
      default: return '';
    }
  };

  const getRelativeTime = (timestamp) => {
    const now = new Date();
    const logTime = new Date(timestamp);
    const diffMs = now - logTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const filteredLogs = logs.filter(log => {
    const matchesType = filterType === 'all' || log.type === filterType;
    const matchesUser = filterUser === 'all' || log.user === filterUser;
    const matchesSearch = searchTerm === '' || 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesDate = true;
    if (filterDate !== 'all') {
      const logDate = new Date(log.timestamp);
      const now = new Date();
      const diffHours = (now - logDate) / (1000 * 60 * 60);
      
      switch(filterDate) {
        case 'today':
          matchesDate = diffHours < 24;
          break;
        case 'week':
          matchesDate = diffHours < 168;
          break;
        case 'month':
          matchesDate = diffHours < 720;
          break;
        default:
          matchesDate = true;
      }
    }
    
    return matchesType && matchesUser && matchesSearch && matchesDate;
  });

  const uniqueUsers = [...new Set(logs.map(log => log.user))];

  const logTypeStats = {
    all: logs.length,
    user: logs.filter(l => l.type === 'user').length,
    ad: logs.filter(l => l.type === 'ad').length,
    system: logs.filter(l => l.type === 'system').length,
    security: logs.filter(l => l.type === 'security').length,
    adbox: logs.filter(l => l.type === 'adbox').length,
    payment: logs.filter(l => l.type === 'payment').length,
  };

  const handleViewDetails = (log) => {
    setSelectedLog(log);
    setShowDetailsModal(true);
  };

  const handleExportLogs = () => {
    alert('Exporting logs as CSV...');
    // In real implementation, generate and download CSV file
  };

  return (
    <div className="logs-page">
      <div className="page-header">
        <div>
          <h1>System Logs</h1>
          <p className="page-subtitle">Monitor system activity and audit trail</p>
        </div>
        <button className="btn-export" onClick={handleExportLogs}>
          📥 Export Logs
        </button>
      </div>

      {/* Scroll Container */}
      <div className="logs-scroll">
        {/* Stats Overview */}
        <div className="logs-stats">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <span className="stat-label">Total Logs</span>
              <span className="stat-value">{logs.length}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <span className="stat-label">Successful</span>
              <span className="stat-value">{logs.filter(l => l.status === 'success').length}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⚠️</div>
            <div className="stat-info">
              <span className="stat-label">Warnings</span>
              <span className="stat-value">{logs.filter(l => l.status === 'warning').length}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">❌</div>
            <div className="stat-info">
              <span className="stat-label">Failures</span>
              <span className="stat-value">{logs.filter(l => l.status === 'failure').length}</span>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="filters-section">
          <div className="filter-group">
            <label>Type</label>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="all">All Types ({logTypeStats.all})</option>
              <option value="user">👤 User ({logTypeStats.user})</option>
              <option value="ad">📢 Ad ({logTypeStats.ad})</option>
              <option value="system">⚙️ System ({logTypeStats.system})</option>
              <option value="security">🔒 Security ({logTypeStats.security})</option>
              <option value="adbox">📦 Ad Box ({logTypeStats.adbox})</option>
              <option value="payment">💳 Payment ({logTypeStats.payment})</option>
            </select>
          </div>

          <div className="filter-group">
            <label>User</label>
            <select value={filterUser} onChange={(e) => setFilterUser(e.target.value)}>
              <option value="all">All Users</option>
              {uniqueUsers.map((user, index) => (
                <option key={index} value={user}>{user}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Time Period</label>
            <select value={filterDate} onChange={(e) => setFilterDate(e.target.value)}>
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
          </div>

          <div className="filter-group search-group">
            <label>Search</label>
            <input 
              type="text"
              placeholder="🔍 Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Logs Timeline */}
        <div className="logs-timeline">
          <div className="timeline-header">
            <h3>Activity Timeline</h3>
            <span className="results-count">{filteredLogs.length} result{filteredLogs.length !== 1 ? 's' : ''}</span>
          </div>

          <div className="timeline-content">
            {filteredLogs.map(log => (
              <div key={log.id} className={`timeline-item ${getStatusClass(log.status)}`}>
                <div className="timeline-marker">
                  <span className={`type-badge ${getTypeClass(log.type)}`}>
                    {getTypeIcon(log.type)}
                  </span>
                </div>
                
                <div className="timeline-card">
                  <div className="log-header">
                    <div className="log-main-info">
                      <h4 className="log-action">{log.action}</h4>
                      <p className="log-description">{log.description}</p>
                    </div>
                    <div className="log-meta">
                      <span className="log-time">{getRelativeTime(log.timestamp)}</span>
                      <span className={`status-badge ${getStatusClass(log.status)}`}>
                        {log.status}
                      </span>
                    </div>
                  </div>

                  <div className="log-details-compact">
                    <div className="detail-item">
                      <span className="detail-icon">👤</span>
                      <span className="detail-text">{log.userName}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">🌐</span>
                      <span className="detail-text">{log.ipAddress}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">💻</span>
                      <span className="detail-text">{log.device}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">🕐</span>
                      <span className="detail-text">{log.timestamp}</span>
                    </div>
                  </div>

                  <button 
                    className="btn-view-details"
                    onClick={() => handleViewDetails(log)}
                  >
                    View Details →
                  </button>
                </div>
              </div>
            ))}

            {filteredLogs.length === 0 && (
              <div className="no-logs">
                <p>No logs found matching your filters</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedLog && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="modal-content log-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-section">
                <span className={`type-badge-large ${getTypeClass(selectedLog.type)}`}>
                  {getTypeIcon(selectedLog.type)}
                </span>
                <h2>Log Details</h2>
              </div>
              <button className="close-btn" onClick={() => setShowDetailsModal(false)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="log-detail-section">
                <h3>Basic Information</h3>
                <div className="detail-grid">
                  <div className="detail-row">
                    <span className="label">Action:</span>
                    <span className="value">{selectedLog.action}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Status:</span>
                    <span className={`value status-badge ${getStatusClass(selectedLog.status)}`}>
                      {selectedLog.status}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Type:</span>
                    <span className="value">{selectedLog.type}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Timestamp:</span>
                    <span className="value">{selectedLog.timestamp}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Description:</span>
                    <span className="value">{selectedLog.description}</span>
                  </div>
                </div>
              </div>

              <div className="log-detail-section">
                <h3>User & Device Information</h3>
                <div className="detail-grid">
                  <div className="detail-row">
                    <span className="label">User:</span>
                    <span className="value">{selectedLog.userName}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Email:</span>
                    <span className="value">{selectedLog.user}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">IP Address:</span>
                    <span className="value">{selectedLog.ipAddress}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Device:</span>
                    <span className="value">{selectedLog.device}</span>
                  </div>
                </div>
              </div>

              <div className="log-detail-section">
                <h3>Additional Details</h3>
                <div className="details-json">
                  <pre>{JSON.stringify(selectedLog.details, null, 2)}</pre>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowDetailsModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemLogs;
