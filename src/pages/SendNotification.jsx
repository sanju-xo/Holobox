import React, { useState } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import '../styles/SendNotification.css';

const SendNotification = () => {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info',
    userId: '',
    orderId: '',
    imageUrl: ''
  });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.message) {
      alert('Title and message are required!');
      return;
    }

    setSending(true);
    
    try {
      // Create notification document with nested data structure (matching your Firebase)
      await addDoc(collection(db, 'notifications'), {
        data: {
          title: formData.title,
          message: formData.message,
          type: formData.type,
          isRead: false,
          isadmin: true,
          timestamp: Timestamp.now(),
          ...(formData.userId && { userId: formData.userId }),
          ...(formData.orderId && { orderId: formData.orderId }),
          ...(formData.imageUrl && { imageUrl: formData.imageUrl })
        }
      });

      setSuccess(true);
      setFormData({
        title: '',
        message: '',
        type: 'info',
        userId: '',
        orderId: '',
        imageUrl: ''
      });

      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('Failed to send notification: ' + error.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="send-notification-page">
      <div className="page-header">
        <h1>📤 Send Notification</h1>
        <p className="subtitle">Send notifications to app users</p>
      </div>

      <div className="notification-form-container">
        <form onSubmit={handleSubmit} className="notification-form">
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="e.g., Order Placed Successfully!"
              required
            />
          </div>

          <div className="form-group">
            <label>Message *</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              placeholder="e.g., Your order #12345 has been placed."
              rows="4"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              >
                <option value="info">Info (ℹ️)</option>
                <option value="success">Success (✅)</option>
                <option value="order">Order (📦)</option>
                <option value="warning">Warning (⚠️)</option>
                <option value="error">Error (❌)</option>
              </select>
            </div>

            <div className="form-group">
              <label>User ID (Optional)</label>
              <input
                type="text"
                value={formData.userId}
                onChange={(e) => setFormData({...formData, userId: e.target.value})}
                placeholder="Enter user ID"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Order ID (Optional)</label>
              <input
                type="text"
                value={formData.orderId}
                onChange={(e) => setFormData({...formData, orderId: e.target.value})}
                placeholder="e.g., 1768968496313"
              />
            </div>

            <div className="form-group">
              <label>Image URL (Optional)</label>
              <input
                type="text"
                value={formData.imageUrl}
                onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                placeholder="https://example.com/image.png"
              />
            </div>
          </div>

          <button type="submit" className="btn-send" disabled={sending}>
            {sending ? '📤 Sending...' : '📤 Send Notification'}
          </button>
        </form>

        {success && (
          <div className="success-message">
            ✅ Notification sent successfully!
          </div>
        )}
      </div>
    </div>
  );
};

export default SendNotification;
