'use client'
import Login from '../components/Login'
import Register from '../components/Register'
import Header from '../components/Header'
import HomePage from '../components/HomePage'
import { useState, useEffect } from 'react'

export default function Home() {
  const [currentPage, setCurrentPage] = useState('login');
  const [isClient, setIsClient] = useState(false)
 
  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <div>Loading...</div>; // Placeholder while waiting for client-side rendering
  }

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
        </>
      )}
    </div>
  );
};