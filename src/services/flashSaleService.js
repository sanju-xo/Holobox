import { db } from '../config/firebase';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';

// Get flash sale config
export const getFlashSaleConfig = async () => {
  try {
    const flashSaleRef = doc(db, 'config', 'flashSale');
    const docSnap = await getDoc(flashSaleRef);
    
    if (docSnap.exists()) {
      console.log('✅ Flash sale config fetched');
      return docSnap.data();
    } else {
      console.log('⚠️ No flash sale config found');
      return null;
    }
  } catch (error) {
    console.error('❌ Error fetching flash sale config:', error);
    throw error;
  }
};

// Update flash sale config
export const updateFlashSaleConfig = async (configData) => {
  try {
    const flashSaleRef = doc(db, 'config', 'flashSale');
    
    await setDoc(flashSaleRef, {
      isActive: configData.isActive,
      endTime: configData.endTime,
      updatedAt: serverTimestamp()
    }, { merge: true });
    
    console.log('✅ Flash sale config updated');
  } catch (error) {
    console.error('❌ Error updating flash sale config:', error);
    throw error;
  }
};

// Enable flash sale
export const enableFlashSale = async (endTime) => {
  try {
    await updateFlashSaleConfig({
      isActive: true,
      endTime: endTime
    });
    console.log('✅ Flash sale enabled');
  } catch (error) {
    console.error('❌ Error enabling flash sale:', error);
    throw error;
  }
};

// Disable flash sale
export const disableFlashSale = async () => {
  try {
    await updateFlashSaleConfig({
      isActive: false,
      endTime: null
    });
    console.log('✅ Flash sale disabled');
  } catch (error) {
    console.error('❌ Error disabling flash sale:', error);
    throw error;
  }
};
