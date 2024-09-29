'use client';
import { useState, useEffect, use } from 'react';
import Login from '../components/Login';
import Register from '../components/Register';
import Header from '../components/Header';
import HomePage from '../components/HomePage';
import Footer from '../components/Footer';
import { LanguageProvider } from './LanguageContext';
import { AuthProvider, useAuth } from '../components/AuthProvider';
import { jwtDecode } from 'jwt-decode';

const MainApp = () => {
  const { auth, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState('login');

  useEffect(() => {
    if (auth) {
      setCurrentPage('home');
    } else {
      setCurrentPage('login');
    }
  }, [auth]);

  useEffect(() => {
    if (auth) {
      const decodedToken = jwtDecode(auth);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        logout();
      }
    }
  }, [auth, logout]);



  return (
    <div>
      {currentPage === 'login' ? (
        <Login onRegisterClick={() => setCurrentPage('register')} onHomePageClick={() => setCurrentPage('home')} />
      ) : currentPage === 'register' ? (
        <Register onBackToLogin={() => setCurrentPage('login')} />
      ) : (
        <>
          <Header />
          <HomePage />
          <Footer />
        </>
      )}
    </div>
  );
};

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div>Loading...</div>; 
  }

  return (
    <AuthProvider>
      <LanguageProvider>
        <MainApp />
      </LanguageProvider>
    </AuthProvider>
  );
};
