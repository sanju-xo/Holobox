import React, { useState } from 'react';
import '../styles/AdReview.css';

const AdReview = () => {
  const [filterStatus, setFilterStatus] = useState('pending');
  const [selectedAd, setSelectedAd] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for ads pending review
  const [ads, setAds] = useState([
    {
      id: 1,
      campaignName: 'Summer Sale 2026',
      submittedBy: 'Agent John Doe',
      submittedDate: '2026-01-12',
      category: 'Fashion',
      fileType: 'image',
      fileUrl: 'https://via.placeholder.com/800x600/667eea/ffffff?text=Summer+Sale',
      duration: '30 days',
      locations: ['Mall Road, Kochi', 'MG Road, Bangalore'],
      budget: '₹15,000',
      status: 'pending',
      description: 'Promotional campaign for summer collection featuring latest trends and exclusive discounts.'
    },
    {
      id: 2,
      campaignName: 'Electronics Mega Sale',
      submittedBy: 'Agent Sarah Smith',
      submittedDate: '2026-01-12',
      category: 'Electronics',
      fileType: 'video',
      fileUrl: 'https://via.placeholder.com/800x600/764ba2/ffffff?text=Electronics+Sale',
      duration: '15 days',
      locations: ['Phoenix Mall, Mumbai'],
      budget: '₹25,000',
      status: 'pending',
      description: 'Limited time offer on electronics with up to 50% discount on selected items.'
    },
    {
      id: 3,
      campaignName: 'New Restaurant Opening',
      submittedBy: 'Agent Mike Johnson',
      submittedDate: '2026-01-11',
      category: 'Food & Beverage',
      fileType: 'image',
      fileUrl: 'https://via.placeholder.com/800x600/4caf50/ffffff?text=Restaurant+Grand+Opening',
      duration: '7 days',
      locations: ['City Center, Delhi'],
      budget: '₹8,000',
      status: 'pending',
      description: 'Grand opening celebration with special menu and offers for first 100 customers.'
    },
    {
      id: 4,
      campaignName: 'Fitness Center Membership',
      submittedBy: 'Agent Emily Brown',
      submittedDate: '2026-01-10',
      category: 'Health & Wellness',
      fileType: 'image',
      fileUrl: 'https://via.placeholder.com/800x600/ff9800/ffffff?text=Fitness+Center',
      duration: '60 days',
      locations: ['Brigade Road, Bangalore', 'Anna Salai, Chennai'],
      budget: '₹30,000',
      status: 'approved',
      description: 'New year fitness membership offers with personal training sessions included.'
    },
    {
      id: 5,
      campaignName: 'Real Estate Launch',
      submittedBy: 'Agent David Wilson',
      submittedDate: '2026-01-09',
      category: 'Real Estate',
      fileType: 'video',
      fileUrl: 'https://via.placeholder.com/800x600/f44336/ffffff?text=Real+Estate',
      duration: '90 days',
      locations: ['Marine Drive, Mumbai'],
      budget: '₹50,000',
      status: 'rejected',
      rejectionReason: 'Content does not meet quality standards. Please resubmit with higher resolution images.'
    }
  ]);

  const filteredAds = ads.filter(ad => {
    const matchesStatus = filterStatus === 'all' || ad.status === filterStatus;
    const matchesSearch = ad.campaignName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ad.submittedBy.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleViewDetails = (ad) => {
    setSelectedAd(ad);
    setShowModal(true);
  };

  const handleApprove = (adId) => {
    setAds(ads.map(ad => 
      ad.id === adId ? { ...ad, status: 'approved' } : ad
    ));
    setShowModal(false);
    alert('Ad approved successfully!');
  };

  const handleReject = (adId) => {
    if (!rejectReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    setAds(ads.map(ad => 
      ad.id === adId ? { ...ad, status: 'rejected', rejectionReason: rejectReason } : ad
    ));
    setRejectReason('');
    setShowModal(false);
    alert('Ad rejected and agent notified');
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'pending': return 'status-pending';
      case 'approved': return 'status-approved';
      case 'rejected': return 'status-rejected';
      default: return '';
    }
  };

  const pendingCount = ads.filter(ad => ad.status === 'pending').length;
  const approvedCount = ads.filter(ad => ad.status === 'approved').length;
  const rejectedCount = ads.filter(ad => ad.status === 'rejected').length;

  return (
    <div className="ad-review-page">
      <div className="page-header">
        <div>
          <h1>Ad Review & Moderation</h1>
          <p className="page-subtitle">Review and approve submitted advertising campaigns</p>
        </div>
      </div>

      {/* Scroll Container */}
      <div className="ad-review-scroll">
        {/* Stats Cards */}
        <div className="review-stats">
          <div className="stat-card pending">
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <h3>Pending Review</h3>
              <p className="stat-number">{pendingCount}</p>
            </div>
          </div>
          <div className="stat-card approved">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>Approved</h3>
              <p className="stat-number">{approvedCount}</p>
            </div>
          </div>
          <div className="stat-card rejected">
            <div className="stat-icon">❌</div>
            <div className="stat-info">
              <h3>Rejected</h3>
              <p className="stat-number">{rejectedCount}</p>
            </div>
          </div>
        </div>

        {/* Filter and Search */}
        <div className="filters-section">
          <div className="filter-tabs">
            <button 
              className={`filter-tab ${filterStatus === 'all' ? 'active' : ''}`}
              onClick={() => setFilterStatus('all')}
            >
              All ({ads.length})
            </button>
            <button 
              className={`filter-tab ${filterStatus === 'pending' ? 'active' : ''}`}
              onClick={() => setFilterStatus('pending')}
            >
              Pending ({pendingCount})
            </button>
            <button 
              className={`filter-tab ${filterStatus === 'approved' ? 'active' : ''}`}
              onClick={() => setFilterStatus('approved')}
            >
              Approved ({approvedCount})
            </button>
            <button 
              className={`filter-tab ${filterStatus === 'rejected' ? 'active' : ''}`}
              onClick={() => setFilterStatus('rejected')}
            >
              Rejected ({rejectedCount})
            </button>
          </div>

          <div className="search-box">
            <input 
              type="text"
              placeholder="🔍 Search by campaign name or agent..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Ads Grid */}
        <div className="ads-grid">
          {filteredAds.map(ad => (
            <div key={ad.id} className="ad-card">
              <div className="ad-thumbnail">
                {ad.fileType === 'image' ? (
                  <img src={ad.fileUrl} alt={ad.campaignName} />
                ) : (
                  <div className="video-thumbnail">
                    <span className="video-icon">🎬</span>
                    <p>Video Ad</p>
                  </div>
                )}
                <span className={`status-badge ${getStatusBadgeClass(ad.status)}`}>
                  {ad.status.charAt(0).toUpperCase() + ad.status.slice(1)}
                </span>
              </div>

              <div className="ad-info">
                <h3>{ad.campaignName}</h3>
                <div className="ad-meta">
                  <p><strong>Submitted by:</strong> {ad.submittedBy}</p>
                  <p><strong>Date:</strong> {ad.submittedDate}</p>
                  <p><strong>Category:</strong> {ad.category}</p>
                  <p><strong>Duration:</strong> {ad.duration}</p>
                  <p><strong>Budget:</strong> {ad.budget}</p>
                </div>

                <div className="ad-actions">
                  <button 
                    className="btn-view"
                    onClick={() => handleViewDetails(ad)}
                  >
                    👁️ View Details
                  </button>
                  {ad.status === 'pending' && (
                    <>
                      <button 
                        className="btn-approve"
                        onClick={() => handleApprove(ad.id)}
                      >
                        ✅ Approve
                      </button>
                      <button 
                        className="btn-reject"
                        onClick={() => {
                          setSelectedAd(ad);
                          setShowModal(true);
                        }}
                      >
                        ❌ Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAds.length === 0 && (
          <div className="no-results">
            <p>No ads found</p>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showModal && selectedAd && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Ad Campaign Details</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="detail-section">
                <h3>Campaign Preview</h3>
                <div className="preview-container">
                  {selectedAd.fileType === 'image' ? (
                    <img src={selectedAd.fileUrl} alt={selectedAd.campaignName} />
                  ) : (
                    <div className="video-preview">
                      <span className="video-icon-large">🎬</span>
                      <p>Video Preview</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="detail-section">
                <h3>Campaign Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Campaign Name:</span>
                    <span className="info-value">{selectedAd.campaignName}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Submitted By:</span>
                    <span className="info-value">{selectedAd.submittedBy}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Submission Date:</span>
                    <span className="info-value">{selectedAd.submittedDate}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Category:</span>
                    <span className="info-value">{selectedAd.category}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Duration:</span>
                    <span className="info-value">{selectedAd.duration}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Budget:</span>
                    <span className="info-value">{selectedAd.budget}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">File Type:</span>
                    <span className="info-value">{selectedAd.fileType.toUpperCase()}</span>
                  </div>
                  <div className="info-item full-width">
                    <span className="info-label">Locations:</span>
                    <span className="info-value">{selectedAd.locations.join(', ')}</span>
                  </div>
                  <div className="info-item full-width">
                    <span className="info-label">Description:</span>
                    <span className="info-value">{selectedAd.description}</span>
                  </div>
                  {selectedAd.status === 'rejected' && selectedAd.rejectionReason && (
                    <div className="info-item full-width rejection-reason">
                      <span className="info-label">Rejection Reason:</span>
                      <span className="info-value">{selectedAd.rejectionReason}</span>
                    </div>
                  )}
                </div>
              </div>

              {selectedAd.status === 'pending' && (
                <div className="detail-section">
                  <h3>Rejection Reason (Optional)</h3>
                  <textarea
                    className="rejection-textarea"
                    placeholder="Enter reason for rejection..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    rows="4"
                  />
                </div>
              )}
            </div>

            {selectedAd.status === 'pending' && (
              <div className="modal-footer">
                <button className="btn-cancel" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button className="btn-reject-modal" onClick={() => handleReject(selectedAd.id)}>
                  ❌ Reject Ad
                </button>
                <button className="btn-approve-modal" onClick={() => handleApprove(selectedAd.id)}>
                  ✅ Approve Ad
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdReview;
