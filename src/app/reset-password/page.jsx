'use client';
import ResetPassword from '../../components/ResetPassword'; 
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { LanguageProvider } from '../LanguageContext';
import { AuthProvider } from '../../components/AuthProvider';

const ResetPasswordPage = () => {
    return (
    <>
    <AuthProvider>
    <LanguageProvider>
        <Header/>
            <ResetPassword />          
        <Footer />
    </LanguageProvider>
    </AuthProvider>
    </>
    );
};

export default ResetPasswordPage;