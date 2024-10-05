"use client";
import { useState, useEffect } from 'react';
import Login from '../../components/Login';
import Register from '../../components/Register';
import Header from '../../components/Header';
import HomePage from '../../components/HomePage';
import Footer from '../../components/Footer';
import ForgotPassword from '../../components/ForgotPassword';
import Profile from '../../components/Profile'; 
import AdminPage from '../../components/AdminPage';
import { LanguageProvider } from '../LanguageContext';
import { AuthProvider, useAuth } from '../../components/AuthProvider';
import { jwtDecode } from 'jwt-decode';
import Search from '../../components/Search';

const MainApp = () => {
  const { auth, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState('login');
  const [userInfo, setUserInfo] = useState(null); 

  useEffect(() => {
    if (auth) {
      const decodedToken = jwtDecode(auth); 
      setUserInfo(decodedToken); 
  
      if (decodedToken.role === 'ADMIN') {
        setCurrentPage('admin');
      } else if (decodedToken.role === 'CLIENT') {
        setCurrentPage('home');
      }
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

  const handleNavigation = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      {currentPage === 'login' ? (
        <>
          <Header />
          <Login
            onRegisterClick={() => setCurrentPage('register')}
            onHomePageClick={(role) => {

              if(role === 'ADMIN') {
                handleNavigation('admin');
              } else if (role === 'CLIENT') {
                setCurrentPage('home');
              }

            }}
            onForgotPasswordClick={() => setCurrentPage('forgotPassword')}
          />
          <Footer />
        </>
      ) : currentPage === 'register' ? (
        <>
          <Header />
          <Register onBackToLogin={() => setCurrentPage('login')} />
          <Footer />
        </>
      ) : currentPage === 'forgotPassword' ? (
        <>
          <Header />
          <ForgotPassword onBackToLogin={() => setCurrentPage('login')} />
          <Footer />
        </>
      ) : currentPage === 'search' ? (
        <>
          <Header onNavigate={handleNavigation} />
          <Search />
          <Footer />
        </>
      ) : currentPage === 'profile' ? (
        <>
          <Header onNavigate={handleNavigation} />
          <Profile user={userInfo} />
          <Footer />
        </>
      ) : currentPage === 'home' ? (
        <>
          <Header onNavigate={handleNavigation} />
          <HomePage />
          <Footer />
        </>
      ) : currentPage === 'admin' ? (  
        <>
          <Header onNavigate={handleNavigation} />
          <AdminPage />  
          <Footer />
        </>
      ) : null}
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
