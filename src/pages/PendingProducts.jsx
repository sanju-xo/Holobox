import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import '../styles/PendingProducts.css';

const PendingProducts = () => {
  const [pendingAds, setPendingAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPendingAds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const fetchPendingAds = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔍 Starting to fetch pending_products...');
      console.log('📊 Filter:', filter);
      console.log('🔥 DB instance:', db);
      
      let q;
      if (filter === 'all') {
        console.log('📂 Fetching ALL products from pending_products');
        q = collection(db, 'pending_products');
      } else {
        console.log('🔍 Fetching products with status:', filter);
        q = query(
          collection(db, 'pending_products'),
          where('status', '==', filter)
        );
      }
      
      console.log('⏳ Executing query...');
      const querySnapshot = await getDocs(q);
      console.log('✅ Query completed. Documents found:', querySnapshot.size);
      
      if (querySnapshot.empty) {
        console.warn('⚠️ No documents found in pending_products collection');
      }
      
      const ads = querySnapshot.docs.map(docSnap => {
        const data = docSnap.data();
        console.log('📄 Document ID:', docSnap.id, 'Data:', data);
        return {
          id: docSnap.id,
          ...data
        };
      });
      
      // Sort by submission date
      ads.sort((a, b) => {
        const dateA = a.submittedAt?.toDate ? a.submittedAt.toDate() : new Date(0);
        const dateB = b.submittedAt?.toDate ? b.submittedAt.toDate() : new Date(0);
        return dateB - dateA;
      });
      
      console.log('✅ Final ads array:', ads);
      setPendingAds(ads);
      setLoading(false);
    } catch (error) {
      console.error('❌ Error fetching ads:', error);
      console.error('❌ Error code:', error.code);
      console.error('❌ Error message:', error.message);
      setError(error.message);
      setLoading(false);
    }
  };

  const handleApprove = async (adId) => {
    if (!window.confirm('Approve this product?')) return;
    
    try {
      console.log('✅ Approving product:', adId);
      const adRef = doc(db, 'pending_products', adId);
      await updateDoc(adRef, {
        status: 'approved',
        approvedAt: new Date(),
        approvedBy: 'Admin'
      });
      
      console.log('✅ Product approved successfully');
      fetchPendingAds();
      alert('Product approved successfully!');
    } catch (error) {
      console.error('❌ Error approving ad:', error);
      alert('Failed to approve product: ' + error.message);
    }
  };

  const handleReject = async (adId) => {
    const reason = prompt('Enter rejection reason (optional):');
    
    try {
      console.log('❌ Rejecting product:', adId);
      const adRef = doc(db, 'pending_products', adId);
      await updateDoc(adRef, {
        status: 'rejected',
        rejectedAt: new Date(),
        rejectedBy: 'Admin',
        rejectionReason: reason || 'No reason provided'
      });
      
      console.log('✅ Product rejected successfully');
      fetchPendingAds();
      alert('Product rejected');
    } catch (error) {
      console.error('❌ Error rejecting ad:', error);
      alert('Failed to reject product: ' + error.message);
    }
  };

  const handleDelete = async (adId) => {
    if (!window.confirm('Permanently delete this product? This cannot be undone.')) return;
    
    try {
      console.log('🗑️ Deleting product:', adId);
      await deleteDoc(doc(db, 'pending_products', adId));
      console.log('✅ Product deleted successfully');
      fetchPendingAds();
      alert('Product deleted successfully');
    } catch (error) {
      console.error('❌ Error deleting ad:', error);
      alert('Failed to delete product: ' + error.message);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { class: 'status-pending', text: 'Pending' },
      approved: { class: 'status-approved', text: 'Approved' },
      rejected: { class: 'status-rejected', text: 'Rejected' }
    };
    const badge = badges[status] || badges.pending;
    return <span className={`status-badge ${badge.class}`}>{badge.text}</span>;
  };

  if (loading) {
    return (
      <div className="pending-products-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pending-products-container">
        <div className="error-message">
          <h2>⚠️ Error Loading Products</h2>
          <p>{error}</p>
          <button onClick={fetchPendingAds} className="retry-button">
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pending-products-container">
      <div className="header">
        <h1>Product Approval Management</h1>
        <div className="stats">
          <span className="stat-badge">Total: {pendingAds.length}</span>
        </div>
        <div className="filter-buttons">
          <button 
            className={filter === 'all' ? 'active' : ''} 
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={filter === 'pending' ? 'active' : ''} 
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button 
            className={filter === 'approved' ? 'active' : ''} 
            onClick={() => setFilter('approved')}
          >
            Approved
          </button>
          <button 
            className={filter === 'rejected' ? 'active' : ''} 
            onClick={() => setFilter('rejected')}
          >
            Rejected
          </button>
          <button 
            className="refresh-button" 
            onClick={fetchPendingAds}
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {pendingAds.length === 0 ? (
        <div className="no-ads">
          <p>📭 No products found for the selected filter</p>
          <p className="hint">Try selecting "All" to see all products</p>
        </div>
      ) : (
        <div className="ads-grid">
          {pendingAds.map(ad => (
            <div key={ad.id} className="ad-card">
              <div className="ad-image">
                {ad.imageUrl ? (
                  <img src={ad.imageUrl} alt={ad.name || 'Product'} />
                ) : (
                  <div className="no-image">No Image</div>
                )}
              </div>
              
              <div className="ad-content">
                <div className="ad-header">
                  <h3>{ad.name || 'Unnamed Product'}</h3>
                  {getStatusBadge(ad.status)}
                </div>
                
                <div className="ad-details">
                  <div className="detail-row">
                    <span className="label">Age Group:</span>
                    <span className="value">{ad.ageGroup || 'N/A'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Gender:</span>
                    <span className="value">{ad.gender || 'N/A'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Ethnicity:</span>
                    <span className="value">{ad.ethnicity || 'N/A'}</span>
                  </div>
                  {ad.notes && ad.notes !== '""' && (
                    <div className="detail-row notes">
                      <span className="label">Notes:</span>
                      <span className="value">{ad.notes}</span>
                    </div>
                  )}
                  <div className="detail-row">
                    <span className="label">Submitted:</span>
                    <span className="value">
                      {ad.submittedAt?.toDate ? 
                        new Date(ad.submittedAt.toDate()).toLocaleString('en-IN', {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        }) : 
                        'Unknown'}
                    </span>
                  </div>
                  
                  {ad.status === 'approved' && ad.approvedAt && (
                    <div className="detail-row approved-info">
                      <span className="label">Approved:</span>
                      <span className="value">
                        {ad.approvedAt.toDate ? 
                          new Date(ad.approvedAt.toDate()).toLocaleString('en-IN', {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                          }) :
                          'Unknown'}
                      </span>
                    </div>
                  )}
                  
                  {ad.status === 'rejected' && (
                    <>
                      <div className="detail-row rejected-info">
                        <span className="label">Rejected:</span>
                        <span className="value">
                          {ad.rejectedAt?.toDate ? 
                            new Date(ad.rejectedAt.toDate()).toLocaleString('en-IN', {
                              dateStyle: 'medium',
                              timeStyle: 'short'
                            }) : 
                            'Unknown'}
                        </span>
                      </div>
                      {ad.rejectionReason && (
                        <div className="detail-row">
                          <span className="label">Reason:</span>
                          <span className="value">{ad.rejectionReason}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
                
                <div className="ad-actions">
                  {ad.status === 'pending' && (
                    <>
                      <button 
                        className="btn-approve"
                        onClick={() => handleApprove(ad.id)}
                      >
                        ✓ Approve
                      </button>
                      <button 
                        className="btn-reject"
                        onClick={() => handleReject(ad.id)}
                      >
                        ✗ Reject
                      </button>
                    </>
                  )}
                  <button 
                    className="btn-delete"
                    onClick={() => handleDelete(ad.id)}
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingProducts;
