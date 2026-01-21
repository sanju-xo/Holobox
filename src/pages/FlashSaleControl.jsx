import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import '../styles/FlashSaleControl.css';

const FlashSaleControl = () => {
  const [flashSaleData, setFlashSaleData] = useState({
    isActive: false,
    endTime: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlashSaleConfig = async () => {
      try {
        const docRef = doc(db, 'config', 'flashSale');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFlashSaleData({
            isActive: data.isActive || false,
            endTime: data.endTime ? formatDateTimeForInput(data.endTime) : ''
          });
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching flash sale config:', error);
        setLoading(false);
      }
    };

    fetchFlashSaleConfig();
  }, []);

  const formatDateTimeForInput = (dateField) => {
    if (!dateField) return '';
    
    let date;
    if (dateField.seconds) {
      date = new Date(dateField.seconds * 1000);
    } else if (dateField.toDate) {
      date = dateField.toDate();
    } else {
      date = new Date(dateField);
    }
    
    return date.toISOString().slice(0, 16);
  };

  const handleToggleActive = async () => {
    try {
      const newActive = !flashSaleData.isActive;
      
      if (newActive && !flashSaleData.endTime) {
        alert('Please set end time before activating flash sale');
        return;
      }

      await setDoc(doc(db, 'config', 'flashSale'), {
        isActive: newActive,
        endTime: flashSaleData.endTime ? new Date(flashSaleData.endTime) : null,
        updatedAt: new Date()
      });

      setFlashSaleData({ ...flashSaleData, isActive: newActive });
      alert(`Flash Sale ${newActive ? 'Activated' : 'Deactivated'}!`);
    } catch (error) {
      console.error('Error updating flash sale:', error);
      alert('Failed to update flash sale');
    }
  };

  const handleSaveEndTime = async () => {
    if (!flashSaleData.endTime) {
      alert('Please select an end time');
      return;
    }

    try {
      await setDoc(doc(db, 'config', 'flashSale'), {
        isActive: flashSaleData.isActive,
        endTime: new Date(flashSaleData.endTime),
        updatedAt: new Date()
      });

      alert('Flash Sale end time saved!');
    } catch (error) {
      console.error('Error saving end time:', error);
      alert('Failed to save end time');
    }
  };

  if (loading) {
    return (
      <div className="flash-sale-control">
        <div className="control-card">
          <p>Loading flash sale configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flash-sale-control">
      <div className="control-header">
        <h1>⚡ Flash Sale Control</h1>
        <p>Manage global flash sale for all products</p>
      </div>

      <div className="control-card">
        {/* Status Section */}
        <div className="status-section">
          <div className="status-indicator">
            <div className={`status-light ${flashSaleData.isActive ? 'active' : 'inactive'}`}></div>
            <h2>Flash Sale Status: {flashSaleData.isActive ? 'Active' : 'Inactive'}</h2>
          </div>
          
          <button 
            className={`btn-toggle ${flashSaleData.isActive ? 'btn-deactivate' : 'btn-activate'}`}
            onClick={handleToggleActive}
          >
            {flashSaleData.isActive ? 'Deactivate Flash Sale' : 'Activate Flash Sale'}
          </button>
        </div>

        {/* Time Section */}
        <div className="time-section">
          <h3>⏰ Flash Sale End Time</h3>
          <div className="time-input-group">
            <input
              type="datetime-local"
              value={flashSaleData.endTime}
              onChange={(e) => setFlashSaleData({ ...flashSaleData, endTime: e.target.value })}
            />
            <button className="btn-save-time" onClick={handleSaveEndTime}>
              💾 Save End Time
            </button>
          </div>
          {flashSaleData.endTime && (
            <p className="time-display">
              Ends: {new Date(flashSaleData.endTime).toLocaleString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlashSaleControl;
