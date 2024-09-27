'use client';
import styles from './page.module.css'
import Login from '../components/Login'
import Register from '../components/Register'
import Header from '../components/Header'
import HomePage from '../components/HomePage'
import { useState } from 'react'

export default function Home() {
  const [currentPage, setCurrentPage] = useState('login');

  return (
    <div>
      {currentPage === 'login' ? (
        <Login onRegisterClick = {() => setCurrentPage('register')} onHomePageClick = {() => setCurrentPage('home')}/>
      ) : currentPage === 'register' ? (
        <Register onBackToLogin = {() => setCurrentPage('login')} />
      ) : (<><Header/><HomePage /></>)}
    </div>
  );
};
