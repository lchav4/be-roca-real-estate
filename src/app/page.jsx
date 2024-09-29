'use client';
import { useState, useEffect } from 'react';
import Login from '../components/Login';
import Register from '../components/Register';
import Header from '../components/Header';
import HomePage from '../components/HomePage';
import Footer from '../components/Footer';
import { LanguageProvider } from './LanguageContext';
import { AuthProvider, useAuth } from '../components/AuthProvider';

const MainApp = () => {
  const { auth } = useAuth();
  const [currentPage, setCurrentPage] = useState('login');

  useEffect(() => {
    if (auth) {
      setCurrentPage('home');
    } else {
      setCurrentPage('login');
    }
  }, [auth]);

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
    <AuthProvider> {/* Envuelve toda la aplicación con el AuthProvider */}
      <LanguageProvider>
        <MainApp />
      </LanguageProvider>
    </AuthProvider>
  );
};
