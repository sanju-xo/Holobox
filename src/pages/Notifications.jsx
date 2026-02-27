import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import '../styles/Notifications.css';


const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');


  const parseTimestamp = (timestamp) => {
    if (!timestamp) return new Date();
    
    // If it's a Firestore Timestamp object with seconds
    if (timestamp && timestamp.seconds) {
      return new Date(timestamp.seconds * 1000);
    }
    
    // If it has toDate method (Firestore Timestamp)
    if (timestamp && timestamp.toDate && typeof timestamp.toDate === 'function') {
      return timestamp.toDate();
    }
    
    // If it's already a Date
    if (timestamp instanceof Date) {
      return timestamp;
    }
    
    // If it's a number (Unix timestamp in milliseconds)
    if (typeof timestamp === 'number') {
      return new Date(timestamp);
    }
    
    // If it's a string
    if (typeof timestamp === 'string') {
      try {
        let cleanedDate = timestamp
          .replace(' at ', ' ')
          .replace(/UTC[+-]\d{1,2}:\d{2}/, '')
          .replace(/GMT[+-]\d{4}/, '')
          .trim();
        
        const parsedDate = new Date(cleanedDate);
        if (!isNaN(parsedDate.getTime())) {
          return parsedDate;
        }
        return new Date(timestamp);
      } catch (e) {
        console.error('Error parsing timestamp:', e);
        return new Date();
      }
    }
    
    return new Date();
  };


  const fetchNotifications = async () => {
    setLoading(true);
    try {
      console.log('🔍 Fetching notifications from Firebase...');
      const notificationsRef = collection(db, 'notifications');
      const querySnapshot = await getDocs(notificationsRef);
      
      console.log('📦 Total notifications found:', querySnapshot.size);
      
      const notifData = [];
      
      querySnapshot.forEach((docSnapshot) => {
        const rawData = docSnapshot.data();
        
        console.log('==========================================');
        console.log('📄 Document ID:', docSnapshot.id);
        console.log('📄 Raw data:', rawData);
        console.log('📄 Data keys:', Object.keys(rawData));
        
        // Check if data is nested inside a 'data' property
        const data = rawData.data || rawData;
        
        console.log('📄 Actual data object:', data);
        console.log('📄 Title:', data.title);
        console.log('📄 Message:', data.message);
        console.log('📄 Type:', data.type);
        console.log('📄 isRead:', data.isRead);
        console.log('📄 isAdmin:', data.isAdmin);
        console.log('📄 Timestamp:', data.timestamp);
        console.log('📄 OrderId:', data.orderId);
        console.log('📄 UserId:', data.userId);
        console.log('📄 ImageUrl:', data.imageUrl);
        
        // CONDITION: Only include notifications where isAdmin is false or doesn't exist
        const isadmin = data.isadmin || rawData.isadmin || false;
        
        if (isadmin === false) {
          console.log('✅ Including notification (isadmin = false)');
          
          const notification = {
            id: docSnapshot.id,
            title: data.title || rawData.title || 'No Title',
            message: data.message || rawData.message || 'No message',
            type: data.type || rawData.type || 'info',
            read: data.isRead || rawData.isRead || false,
            createdAt: parseTimestamp(data.timestamp || rawData.timestamp),
            orderId: data.orderId || rawData.orderId || null,
            userId: data.userId || rawData.userId || null,
            
          };
          
          console.log('✅ Processed notification:', notification);
          notifData.push(notification);
        } else {
          console.log('⏭️ Skipping notification (isadmin = true)');
        }
        
        console.log('==========================================');
      });
      
      notifData.sort((a, b) => b.createdAt - a.createdAt);
      console.log('✅ All processed notifications (user only):', notifData);
      setNotifications(notifData);
    } catch (error) {
      console.error('❌ Error fetching notifications:', error);
      console.error('Error details:', error.message);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const markAsRead = async (id) => {
    try {
      console.log('📝 Marking as read:', id);
      const notifRef = doc(db, 'notifications', id);
      
      // Find the notification to check if data is nested
      //const notification = notifications.find(n => n.id === id);
      const notifSnapshot = await getDocs(collection(db, 'notifications'));
      const docData = notifSnapshot.docs.find(d => d.id === id)?.data();
      
      // Update in the correct location (nested or not)
      if (docData && docData.data) {
        // If nested, update inside data object
        await updateDoc(notifRef, { 'data.isRead': true });
      } else {
        // If not nested, update directly
        await updateDoc(notifRef, { isRead: true });
      }
      
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
      console.log('✅ Marked as read successfully');
    } catch (error) {
      console.error('❌ Error marking as read:', error);
      alert('Failed to mark as read. Check security rules.');
    }
  };


  const markAllAsRead = async () => {
    try {
      console.log('📝 Marking all as read...');
      
      // Fetch all docs to check structure
      const notifSnapshot = await getDocs(collection(db, 'notifications'));
      
      const updatePromises = notifications.filter(n => !n.read).map(n => {
        console.log('Updating:', n.id);
        const docData = notifSnapshot.docs.find(d => d.id === n.id)?.data();
        
        // Update based on structure
        if (docData && docData.data) {
          return updateDoc(doc(db, 'notifications', n.id), { 'data.isRead': true });
        } else {
          return updateDoc(doc(db, 'notifications', n.id), { isRead: true });
        }
      });
      
      await Promise.all(updatePromises);
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      console.log('✅ All marked as read');
    } catch (error) {
      console.error('❌ Error marking all as read:', error);
      alert('Failed to mark all as read. Check security rules.');
    }
  };


  const deleteNotification = async (id) => {
    if (!window.confirm('Delete this notification?')) return;
    try {
      console.log('🗑️ Deleting notification:', id);
      await deleteDoc(doc(db, 'notifications', id));
      setNotifications(notifications.filter(n => n.id !== id));
      console.log('✅ Deleted successfully');
    } catch (error) {
      console.error('❌ Error deleting:', error);
      alert('Failed to delete. Check security rules.');
    }
  };


  const formatDateTime = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) return 'Unknown';
    
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    
    return date.toLocaleString('en-IN', options);
  };


  const getIconForType = (type) => {
    switch(type) {
      case 'success': return '✅';
      case 'order': return '📦';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      case 'info': return 'ℹ️';
      default: return '🔔';
    }
  };


  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });


 
  const unreadCount = notifications.filter(n => !n.read ).length;



  return (
    <div className="notifications-page">
      <div className="page-header">
        <div className="header-left">
          <h1>🔔 Notifications</h1>
          <span className="unread-badge">{unreadCount} unread</span>
        </div>
        <button onClick={markAllAsRead} className="btn-primary" disabled={unreadCount === 0}>
          Mark all as read
        </button>
      </div>


      <div className="notifications-filters">
        <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
          All ({notifications.length})
        </button>
        <button className={`filter-btn ${filter === 'unread' ? 'active' : ''}`} onClick={() => setFilter('unread')}>
          Unread ({unreadCount})
        </button>
        <button className={`filter-btn ${filter === 'read' ? 'active' : ''}`} onClick={() => setFilter('read')}>
          Read ({notifications.length - unreadCount})
        </button>
      </div>


      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading notifications...</p>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔕</div>
          <h3>No notifications</h3>
          <p>You're all caught up! New notifications will appear here.</p>
        </div>
      ) : (
        <div className="notifications-list">
          {filteredNotifications.map(notif => (
            <div key={notif.id} className={`notification-card ${notif.read ? 'read' : 'unread'}`}>
              <div className={`notif-icon ${notif.type || 'info'}`}>
                {getIconForType(notif.type)}
              </div>
              <div className="notif-content">
                <h4 className="notif-title">{notif.title}</h4>
                <p className="notif-message">{notif.message}</p>
                
                {notif.orderId && (
                  <p className="notif-detail">
                    <strong>Order ID:</strong> {notif.orderId}
                  </p>
                )}
                
                {notif.userId && (
                  <p className="notif-detail">
                    <strong>User:</strong> {notif.userId.substring(0, 20)}...
                  </p>
                )}
                
                {notif.imageUrl && (
                  <img src={notif.imageUrl} alt="notification" className="notif-image" />
                )}
                
                <span className="notif-time">{formatDateTime(notif.createdAt)}</span>
              </div>
              <div className="notif-actions">
                {!notif.read && (
                  <button className="btn-mark-read" onClick={() => markAsRead(notif.id)} title="Mark as read">✓</button>
                )}
                <button className="btn-delete" onClick={() => deleteNotification(notif.id)} title="Delete">🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


export default Notifications;
