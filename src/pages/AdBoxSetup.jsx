import React, { useState } from 'react';
import '../styles/AdBoxSetup.css';

const AdBoxSetup = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBox, setSelectedBox] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for ad boxes
  const [adBoxes, setAdBoxes] = useState([
    {
      id: 1,
      name: 'Mall Road, Kochi',
      deviceId: 'HCB-001-KCH',
      location: 'Mall Road, Kochi, Kerala',
      status: 'online',
      ipAddress: '192.168.1.101',
      lastSeen: '2 minutes ago',
      uptime: '15 days',
      screenResolution: '1920x1080',
      brightness: 85,
      volume: 70,
      temperature: 42,
      adsPlayed: 1250,
      impressions: 12450,
      firmware: 'v2.4.1',
      connectedSince: '2026-01-01'
    },
    {
      id: 2,
      name: 'MG Road, Bangalore',
      deviceId: 'HCB-002-BLR',
      location: 'MG Road, Bangalore, Karnataka',
      status: 'online',
      ipAddress: '192.168.1.102',
      lastSeen: '5 minutes ago',
      uptime: '22 days',
      screenResolution: '1920x1080',
      brightness: 90,
      volume: 65,
      temperature: 38,
      adsPlayed: 1580,
      impressions: 15200,
      firmware: 'v2.4.1',
      connectedSince: '2025-12-15'
    },
    {
      id: 3,
      name: 'Park Street, Kolkata',
      deviceId: 'HCB-003-KOL',
      location: 'Park Street, Kolkata, West Bengal',
      status: 'online',
      ipAddress: '192.168.1.103',
      lastSeen: '1 minute ago',
      uptime: '8 days',
      screenResolution: '1920x1080',
      brightness: 80,
      volume: 75,
      temperature: 40,
      adsPlayed: 890,
      impressions: 8900,
      firmware: 'v2.4.0',
      connectedSince: '2026-01-06'
    },
    {
      id: 4,
      name: 'Connaught Place, Delhi',
      deviceId: 'HCB-004-DEL',
      location: 'Connaught Place, New Delhi',
      status: 'offline',
      ipAddress: '192.168.1.104',
      lastSeen: '2 hours ago',
      uptime: '0 days',
      screenResolution: '1920x1080',
      brightness: 0,
      volume: 0,
      temperature: 0,
      adsPlayed: 2100,
      impressions: 20500,
      firmware: 'v2.3.5',
      connectedSince: '2025-11-20'
    },
    {
      id: 5,
      name: 'Marine Drive, Mumbai',
      deviceId: 'HCB-005-MUM',
      location: 'Marine Drive, Mumbai, Maharashtra',
      status: 'warning',
      ipAddress: '192.168.1.105',
      lastSeen: '10 minutes ago',
      uptime: '30 days',
      screenResolution: '1920x1080',
      brightness: 75,
      volume: 80,
      temperature: 58,
      adsPlayed: 3250,
      impressions: 32000,
      firmware: 'v2.4.1',
      connectedSince: '2025-12-01'
    }
  ]);

  const [boxForm, setBoxForm] = useState({
    name: '',
    deviceId: '',
    location: '',
    ipAddress: '',
    screenResolution: '1920x1080',
    brightness: 85,
    volume: 70
  });

  const filteredBoxes = adBoxes.filter(box => {
    const matchesStatus = filterStatus === 'all' || box.status === filterStatus;
    const matchesSearch = box.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          box.deviceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          box.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleAddBox = () => {
    if (!boxForm.name || !boxForm.deviceId || !boxForm.location || !boxForm.ipAddress) {
      alert('Please fill in all required fields');
      return;
    }

    const newBox = {
      id: adBoxes.length + 1,
      ...boxForm,
      status: 'online',
      lastSeen: 'Just now',
      uptime: '0 days',
      temperature: 35,
      adsPlayed: 0,
      impressions: 0,
      firmware: 'v2.4.1',
      connectedSince: new Date().toISOString().split('T')[0]
    };

    setAdBoxes([...adBoxes, newBox]);
    setShowAddModal(false);
    setBoxForm({
      name: '',
      deviceId: '',
      location: '',
      ipAddress: '',
      screenResolution: '1920x1080',
      brightness: 85,
      volume: 70
    });
    alert('Ad Box added successfully!');
  };

  const handleEditBox = () => {
    if (!selectedBox) return;

    setAdBoxes(adBoxes.map(box => 
      box.id === selectedBox.id 
        ? { ...box, ...boxForm }
        : box
    ));
    setShowEditModal(false);
    setSelectedBox(null);
    alert('Ad Box updated successfully!');
  };

  const handleDeleteBox = (boxId) => {
    if (window.confirm('Are you sure you want to delete this ad box?')) {
      setAdBoxes(adBoxes.filter(box => box.id !== boxId));
      alert('Ad Box deleted successfully');
    }
  };

  const handleRestart = (boxId) => {
    alert(`Restarting device ${boxId}...`);
    // In real implementation, send restart command to device
  };

  const handleUpdateFirmware = (boxId) => {
    alert(`Updating firmware for device ${boxId}...`);
    // In real implementation, trigger firmware update
  };

  const openEditModal = (box) => {
    setSelectedBox(box);
    setBoxForm({
      name: box.name,
      deviceId: box.deviceId,
      location: box.location,
      ipAddress: box.ipAddress,
      screenResolution: box.screenResolution,
      brightness: box.brightness,
      volume: box.volume
    });
    setShowEditModal(true);
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'online': return 'status-online';
      case 'offline': return 'status-offline';
      case 'warning': return 'status-warning';
      default: return '';
    }
  };

  const onlineCount = adBoxes.filter(box => box.status === 'online').length;
  const offlineCount = adBoxes.filter(box => box.status === 'offline').length;
  const warningCount = adBoxes.filter(box => box.status === 'warning').length;

  return (
    <div className="adbox-page">
      <div className="page-header">
        <div>
          <h1>Ad Box Management</h1>
          <p className="page-subtitle">Monitor and configure holographic display devices</p>
        </div>
        <button className="btn-add-box" onClick={() => setShowAddModal(true)}>
          ➕ Add New Ad Box
        </button>
      </div>

      {/* Scroll Container */}
      <div className="adbox-scroll">
        {/* Status Summary */}
        <div className="status-summary">
          <div className="summary-card online">
            <div className="summary-icon">✓</div>
            <div className="summary-info">
              <h3>Online</h3>
              <p className="summary-number">{onlineCount}</p>
            </div>
          </div>
          <div className="summary-card offline">
            <div className="summary-icon">✕</div>
            <div className="summary-info">
              <h3>Offline</h3>
              <p className="summary-number">{offlineCount}</p>
            </div>
          </div>
          <div className="summary-card warning">
            <div className="summary-icon">⚠</div>
            <div className="summary-info">
              <h3>Warning</h3>
              <p className="summary-number">{warningCount}</p>
            </div>
          </div>
          <div className="summary-card total">
            <div className="summary-icon">📦</div>
            <div className="summary-info">
              <h3>Total Devices</h3>
              <p className="summary-number">{adBoxes.length}</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="controls-section">
          <div className="view-filters">
            <button 
              className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
              onClick={() => setFilterStatus('all')}
            >
              All ({adBoxes.length})
            </button>
            <button 
              className={`filter-btn ${filterStatus === 'online' ? 'active' : ''}`}
              onClick={() => setFilterStatus('online')}
            >
              Online ({onlineCount})
            </button>
            <button 
              className={`filter-btn ${filterStatus === 'offline' ? 'active' : ''}`}
              onClick={() => setFilterStatus('offline')}
            >
              Offline ({offlineCount})
            </button>
            <button 
              className={`filter-btn ${filterStatus === 'warning' ? 'active' : ''}`}
              onClick={() => setFilterStatus('warning')}
            >
              Warning ({warningCount})
            </button>
          </div>

          <div className="search-and-view">
            <input 
              type="text"
              placeholder="🔍 Search devices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <div className="view-toggle">
              <button 
                className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                ⊞
              </button>
              <button 
                className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                ☰
              </button>
            </div>
          </div>
        </div>

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="boxes-grid">
            {filteredBoxes.map(box => (
              <div key={box.id} className={`box-card ${box.status}`}>
                <div className="box-header">
                  <div className="box-name-status">
                    <h3>{box.name}</h3>
                    <span className={`status-indicator ${getStatusClass(box.status)}`}>
                      {box.status}
                    </span>
                  </div>
                  <div className="box-actions-menu">
                    <button className="menu-btn">⋮</button>
                    <div className="dropdown-menu">
                      <button onClick={() => openEditModal(box)}>✏️ Edit</button>
                      <button onClick={() => handleRestart(box.id)}>🔄 Restart</button>
                      <button onClick={() => handleUpdateFirmware(box.id)}>⬆️ Update Firmware</button>
                      <button onClick={() => handleDeleteBox(box.id)}>🗑️ Delete</button>
                    </div>
                  </div>
                </div>

                <div className="box-details">
                  <div className="detail-row">
                    <span className="detail-label">Device ID:</span>
                    <span className="detail-value">{box.deviceId}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Location:</span>
                    <span className="detail-value">{box.location}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">IP Address:</span>
                    <span className="detail-value">{box.ipAddress}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Last Seen:</span>
                    <span className="detail-value">{box.lastSeen}</span>
                  </div>
                </div>

                <div className="box-metrics">
                  <div className="metric-item">
                    <div className="metric-icon">🌡️</div>
                    <div className="metric-info">
                      <span className="metric-label">Temp</span>
                      <span className="metric-value">{box.temperature}°C</span>
                    </div>
                  </div>
                  <div className="metric-item">
                    <div className="metric-icon">💡</div>
                    <div className="metric-info">
                      <span className="metric-label">Brightness</span>
                      <span className="metric-value">{box.brightness}%</span>
                    </div>
                  </div>
                  <div className="metric-item">
                    <div className="metric-icon">🔊</div>
                    <div className="metric-info">
                      <span className="metric-label">Volume</span>
                      <span className="metric-value">{box.volume}%</span>
                    </div>
                  </div>
                  <div className="metric-item">
                    <div className="metric-icon">⏱️</div>
                    <div className="metric-info">
                      <span className="metric-label">Uptime</span>
                      <span className="metric-value">{box.uptime}</span>
                    </div>
                  </div>
                </div>

                <div className="box-stats">
                  <div className="stat">
                    <span className="stat-label">Ads Played</span>
                    <span className="stat-value">{box.adsPlayed.toLocaleString()}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Impressions</span>
                    <span className="stat-value">{box.impressions.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="boxes-list">
            <table className="boxes-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Device Name</th>
                  <th>Device ID</th>
                  <th>Location</th>
                  <th>IP Address</th>
                  <th>Temperature</th>
                  <th>Uptime</th>
                  <th>Firmware</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBoxes.map(box => (
                  <tr key={box.id}>
                    <td>
                      <span className={`status-badge ${getStatusClass(box.status)}`}>
                        {box.status}
                      </span>
                    </td>
                    <td><strong>{box.name}</strong></td>
                    <td>{box.deviceId}</td>
                    <td>{box.location}</td>
                    <td>{box.ipAddress}</td>
                    <td>
                      <span className={box.temperature > 50 ? 'temp-high' : 'temp-normal'}>
                        {box.temperature}°C
                      </span>
                    </td>
                    <td>{box.uptime}</td>
                    <td>{box.firmware}</td>
                    <td>
                      <div className="table-actions">
                        <button className="btn-action" onClick={() => openEditModal(box)} title="Edit">
                          ✏️
                        </button>
                        <button className="btn-action" onClick={() => handleRestart(box.id)} title="Restart">
                          🔄
                        </button>
                        <button className="btn-action" onClick={() => handleDeleteBox(box.id)} title="Delete">
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredBoxes.length === 0 && (
          <div className="no-results">
            <p>No ad boxes found</p>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Ad Box</h2>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Device Name *</label>
                <input 
                  type="text"
                  placeholder="e.g., Mall Road, Kochi"
                  value={boxForm.name}
                  onChange={(e) => setBoxForm({...boxForm, name: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Device ID *</label>
                <input 
                  type="text"
                  placeholder="e.g., HCB-001-KCH"
                  value={boxForm.deviceId}
                  onChange={(e) => setBoxForm({...boxForm, deviceId: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Location *</label>
                <input 
                  type="text"
                  placeholder="e.g., Mall Road, Kochi, Kerala"
                  value={boxForm.location}
                  onChange={(e) => setBoxForm({...boxForm, location: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>IP Address *</label>
                <input 
                  type="text"
                  placeholder="e.g., 192.168.1.101"
                  value={boxForm.ipAddress}
                  onChange={(e) => setBoxForm({...boxForm, ipAddress: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Screen Resolution</label>
                <select 
                  value={boxForm.screenResolution}
                  onChange={(e) => setBoxForm({...boxForm, screenResolution: e.target.value})}
                >
                  <option value="1920x1080">1920x1080 (Full HD)</option>
                  <option value="2560x1440">2560x1440 (2K)</option>
                  <option value="3840x2160">3840x2160 (4K)</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Brightness (%)</label>
                  <input 
                    type="number"
                    min="0"
                    max="100"
                    value={boxForm.brightness}
                    onChange={(e) => setBoxForm({...boxForm, brightness: parseInt(e.target.value)})}
                  />
                </div>

                <div className="form-group">
                  <label>Volume (%)</label>
                  <input 
                    type="number"
                    min="0"
                    max="100"
                    value={boxForm.volume}
                    onChange={(e) => setBoxForm({...boxForm, volume: parseInt(e.target.value)})}
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleAddBox}>
                Add Ad Box
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedBox && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Ad Box</h2>
              <button className="close-btn" onClick={() => setShowEditModal(false)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Device Name *</label>
                <input 
                  type="text"
                  value={boxForm.name}
                  onChange={(e) => setBoxForm({...boxForm, name: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Device ID *</label>
                <input 
                  type="text"
                  value={boxForm.deviceId}
                  onChange={(e) => setBoxForm({...boxForm, deviceId: e.target.value})}
                  disabled
                />
              </div>

              <div className="form-group">
                <label>Location *</label>
                <input 
                  type="text"
                  value={boxForm.location}
                  onChange={(e) => setBoxForm({...boxForm, location: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>IP Address *</label>
                <input 
                  type="text"
                  value={boxForm.ipAddress}
                  onChange={(e) => setBoxForm({...boxForm, ipAddress: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Screen Resolution</label>
                <select 
                  value={boxForm.screenResolution}
                  onChange={(e) => setBoxForm({...boxForm, screenResolution: e.target.value})}
                >
                  <option value="1920x1080">1920x1080 (Full HD)</option>
                  <option value="2560x1440">2560x1440 (2K)</option>
                  <option value="3840x2160">3840x2160 (4K)</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Brightness (%)</label>
                  <input 
                    type="number"
                    min="0"
                    max="100"
                    value={boxForm.brightness}
                    onChange={(e) => setBoxForm({...boxForm, brightness: parseInt(e.target.value)})}
                  />
                </div>

                <div className="form-group">
                  <label>Volume (%)</label>
                  <input 
                    type="number"
                    min="0"
                    max="100"
                    value={boxForm.volume}
                    onChange={(e) => setBoxForm({...boxForm, volume: parseInt(e.target.value)})}
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleEditBox}>
                Update Ad Box
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdBoxSetup;
