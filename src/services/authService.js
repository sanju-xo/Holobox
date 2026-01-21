import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

export const loginAdmin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const logoutAdmin = async () => {
  try {
    await signOut(auth);
    localStorage.clear();
    sessionStorage.clear();
    // Force page reload to show login screen
    window.location.reload();
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};
