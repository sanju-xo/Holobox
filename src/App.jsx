import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import holologo from './assets/images/holologo.png';
import './styles/App.css';
import loadingGif from './assets/images/loading.gif';
import Dashboard from './pages/Dashboard';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 600);
    }, 1800);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setIsLoading(false);
        setFadeOut(true);
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoggingIn(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsLoggingIn(false);
      
      // Show success popup
      setShowSuccess(true);
      
      // Wait 2 seconds then show dashboard
      setTimeout(() => {
        setShowSuccess(false);
        setIsLoggedIn(true);
      }, 2000);
    } catch (error) {
      setError('Invalid email or password');
      setIsLoggingIn(false);
    }
  };

  // Preloader with animated bubbles
  if (isLoading) {
    return (
      <div className={`preloader ${fadeOut ? 'fade-out' : ''}`}>
        <img src={loadingGif} alt="Loading..." className="loading-gif" />
      </div>
    );
  }

  // Dashboard (if logged in)
  if (isLoggedIn) {
    return <Dashboard />;
  }

  // Login screen
  return (
    <>
      <div className="app-container fade-in">
        <img src={holologo} alt="HoloBOX Logo" className="logo" />
        
        <div className="glass-box">
          <h1 className="login-title">Admin Login</h1>
          
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              className="login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoggingIn}
            />
            
            <input
              type="password"
              placeholder="Password"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoggingIn}
            />
            
            {error && (
              <div style={{
                color: '#ff4444',
                marginBottom: '15px',
                fontSize: '14px',
                textAlign: 'center'
              }}>
                {error}
              </div>
            )}
            
            <button 
              type="submit" 
              className="login-button"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccess && (
        <div className="success-overlay">
          <div className="success-popup">
            <div className="success-icon">✓</div>
            <h2 className="success-text">Login Successful!</h2>
            <p className="success-subtitle">Welcome to HoloBOX Admin</p>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
