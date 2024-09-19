import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
import { useState, useEffect } from 'react';

import Home from './pages/Home';
import About from './pages/About';

import Login from './pages/Login'
import SignUp from './pages/Signup'

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

import { useAuthContext } from './hooks/useAuthContext';

// Navbar
import MyNavbar from './components/MyNavbar';

//Notifiche


function App() {
  const { user } = useAuthContext();
  const [permission, setPermission] = useState<NotificationPermission>(Notification.permission);

  const showNotification = (title: string, options?: NotificationOptions) => {
    if (permission === 'granted') {
      new Notification(title, options);
    } else {
      console.warn('Notification permission not granted');
    }
  };

  const askNotificationPermission = () => {
    if (permission !== 'granted') {
      Notification.requestPermission().then((perm) => {
        setPermission(perm);
        if (perm === 'granted') {
          showNotification('Grazie per aver attivato le notifiche!');
        }
      });
    }
  };

  useEffect(() => {
    if(user && user.flags.notifica_desktop) {
      askNotificationPermission();
      if (permission === 'granted') {
        showNotification('Benvenuto su Selfie!');
      }
    }
  }, [user]);

  return (
    <>
      <Router>
        {user ? <MyNavbar /> : null}
        <Routes> 
          <Route Component={() => (user ? <Home /> :  <Navigate to="/login" />)} path="/" />
          <Route Component={() => (user ? <About /> : <Navigate to="/login" />)} path="/about"></Route>
          <Route Component={() => (!user ? <Login /> : <Navigate to="/" />)} path="/login"></Route>
          <Route Component={() => (!user ? <SignUp /> : <Navigate to="/" />)} path="/signup"></Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
