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
import PropertyResults from '../../components/PropertyResults';
import PropertyInformation from '../../components/PropertyInformation';

const MainApp = () => {
  const { auth, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState('login');
  const [userInfo, setUserInfo] = useState(null); 
  const [filteredProperties, setFilteredProperties] = useState([]); 
  const [selectedProperty, setSelectedProperty] = useState(null); // Para almacenar la propiedad seleccionada

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

  const handleNavigation = (page, property = null) => {
    setCurrentPage(page);
    if (property) {
      setSelectedProperty(property); // Guardamos la propiedad seleccionada
    }
  };

  const toPropertyResults = (properties) => {
    setFilteredProperties(properties);
    setCurrentPage('propertyResults');
  };

  return (
    <div>
      {currentPage === 'login' ? (
        <>
          <Header />
          <Login
            onRegisterClick={() => setCurrentPage('register')}
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
          <Header onNavigate={handleNavigation}  />
          <Search toPropertyResults={toPropertyResults} />
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
      ) : currentPage === 'propertyResults' ? (  
        <>
          <Header onNavigate={handleNavigation}/>
          <PropertyResults 
            properties={filteredProperties} 
            onNavigate={handleNavigation} 
          /> 
          <Footer />
        </>
      ): currentPage === 'propertyInformation' ? (  
        <>
          <Header onNavigate={handleNavigation}/>
          <PropertyInformation property={selectedProperty} /> 
          <Footer />
        </>
      ): null}
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
