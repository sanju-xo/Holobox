import { db } from '../config/firebase';
import { 
  collection, 
  addDoc, 
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
  limit 
} from 'firebase/firestore';

// Send notification to app users
export const sendNotification = async (notificationData) => {
  try {
    const notificationsRef = collection(db, 'notifications');
    const docRef = await addDoc(notificationsRef, {
      title: notificationData.title,
      message: notificationData.message,
      type: notificationData.type || 'info',
      targetRole: notificationData.targetRole || 'all',
      read: false,
      sentFrom: 'admin-panel',
      createdAt: serverTimestamp()
    });
    
    console.log('✅ Notification sent:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error sending notification:', error);
    throw error;
  }
};

// Get recent notifications
export const getRecentNotifications = async (limitCount = 10) => {
  try {
    const notificationsRef = collection(db, 'notifications');
    const q = query(
      notificationsRef, 
      orderBy('createdAt', 'desc'), 
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    
    const notifications = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return notifications;
  } catch (error) {
    console.error('❌ Error fetching notifications:', error);
    throw error;
  }
};
