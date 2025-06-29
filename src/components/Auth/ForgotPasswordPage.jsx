import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useLanguage } from '../../contexts/LanguageContext';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Adres e-mail jest wymagany';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Nieprawidłowy format adresu e-mail';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        setErrors({ general: error.message });
        return;
      }

      setEmailSent(true);
    } catch (error) {
      console.error('Password reset error:', error);
      setErrors({ general: 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-bg-card rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-text-color mb-4">
            Link wysłany!
          </h2>
          <p className="text-text-color/70 mb-6 leading-relaxed">
            Wysłaliśmy link do resetowania hasła na adres <strong>{email}</strong>. 
            Sprawdź swoją skrzynkę pocztową i kliknij w link, aby ustawić nowe hasło.
          </p>
          <div className="space-y-3">
            <Link
              to="/login"
              className="block w-full bg-accent-primary text-white py-3 px-4 rounded-lg hover:bg-accent-primary/90 transition-colors font-medium text-center"
            >
              Powrót do logowania
            </Link>
            <button
              onClick={() => {
                setEmailSent(false);
                setEmail('');
              }}
              className="block w-full text-accent-primary hover:text-accent-primary/80 py-2 font-medium"
            >
              Wyślij ponownie
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-main flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-bg-card rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate('/login')}
            className="text-text-color/60 hover:text-text-color mr-4"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-text-color">
            Resetowanie hasła
          </h1>
        </div>

        <div className="text-center mb-6">
          <p className="text-text-color/70">
            Wprowadź swój adres e-mail, a wyślemy Ci link do resetowania hasła.
          </p>
        </div>

        {/* General error */}
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
            <p className="text-red-700 text-sm">{errors.general}</p>
          </div>
        )}

        {/* Reset form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-text-color mb-1">
              Adres e-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) {
                  setErrors(prev => ({ ...prev, email: '' }));
                }
              }}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary/50 ${
                errors.email ? 'border-red-500 bg-red-50' : 'border-bg-neutral'
              }`}
              placeholder="twoj@email.com"
            />
            {errors.email && (
              <p className="text-red-600 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-accent-primary text-white py-3 px-4 rounded-lg hover:bg-accent-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Wysyłanie...' : 'Wyślij link do resetowania hasła'}
          </button>
        </form>

        {/* Back to login */}
        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-accent-primary hover:text-accent-primary/80 text-sm font-medium"
          >
            Powrót do logowania
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;