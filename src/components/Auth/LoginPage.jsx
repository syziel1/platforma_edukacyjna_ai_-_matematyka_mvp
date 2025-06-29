import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useLanguage();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Adres e-mail jest wymagany';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Nieprawidłowy format adresu e-mail';
    }

    if (!formData.password) {
      newErrors.password = 'Hasło jest wymagane';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setErrors({ general: 'Nieprawidłowy adres e-mail lub hasło' });
        } else if (error.message.includes('Email not confirmed')) {
          setErrors({ general: 'Potwierdź swój adres e-mail przed zalogowaniem' });
        } else {
          setErrors({ general: error.message });
        }
        return;
      }

      if (data.user) {
        // Get user profile data
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        // Update auth context
        login({
          id: data.user.id,
          email: data.user.email,
          name: profile ? `${profile.first_name} ${profile.last_name}` : data.user.email,
          picture: data.user.user_metadata?.avatar_url,
          role: profile?.role,
          profile: profile
        });

        // Redirect to cockpit
        navigate('/cockpit');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        setErrors({ general: `Błąd logowania przez ${provider}: ${error.message}` });
      }
    } catch (error) {
      console.error(`${provider} OAuth error:`, error);
      setErrors({ general: `Wystąpił błąd podczas logowania przez ${provider}` });
    }
  };

  return (
    <div className="min-h-screen bg-bg-main flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-bg-card rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate('/')}
            className="text-text-color/60 hover:text-text-color mr-4"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-text-color">
            Zaloguj się
          </h1>
        </div>

        {/* General error */}
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
            <p className="text-red-700 text-sm">{errors.general}</p>
          </div>
        )}

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-text-color mb-1">
              Adres e-mail
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary/50 ${
                errors.email ? 'border-red-500 bg-red-50' : 'border-bg-neutral'
              }`}
              placeholder="twoj@email.com"
            />
            {errors.email && (
              <p className="text-red-600 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-text-color mb-1">
              Hasło
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary/50 pr-10 ${
                  errors.password ? 'border-red-500 bg-red-50' : 'border-bg-neutral'
                }`}
                placeholder="Wprowadź hasło"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-color/60"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-600 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Remember me and forgot password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.rememberMe}
                onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                className="rounded border-bg-neutral text-accent-primary focus:ring-accent-primary/50"
              />
              <span className="ml-2 text-sm text-text-color">Zapamiętaj mnie</span>
            </label>
            <Link
              to="/forgot-password"
              className="text-sm text-accent-primary hover:text-accent-primary/80"
            >
              Nie pamiętam hasła
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-accent-primary text-white py-3 px-4 rounded-lg hover:bg-accent-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Logowanie...' : 'Zaloguj się'}
          </button>
        </form>

        {/* OAuth Section */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-bg-neutral"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-bg-card text-text-color/60">
                Lub zaloguj się przez:
              </span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <button
              onClick={() => handleOAuthSignIn('google')}
              className="flex justify-center items-center px-4 py-2 border border-bg-neutral rounded-lg hover:bg-bg-neutral/50 transition-colors"
            >
              <span className="text-sm font-medium">Google</span>
            </button>
            <button
              onClick={() => handleOAuthSignIn('facebook')}
              className="flex justify-center items-center px-4 py-2 border border-bg-neutral rounded-lg hover:bg-bg-neutral/50 transition-colors"
            >
              <span className="text-sm font-medium">Facebook</span>
            </button>
            <button
              onClick={() => handleOAuthSignIn('zoom')}
              className="flex justify-center items-center px-4 py-2 border border-bg-neutral rounded-lg hover:bg-bg-neutral/50 transition-colors"
            >
              <span className="text-sm font-medium">Zoom</span>
            </button>
          </div>
        </div>

        {/* Register Link */}
        <div className="mt-6 text-center">
          <p className="text-text-color/60 text-sm">
            Nie masz jeszcze konta?{' '}
            <Link
              to="/register-role"
              className="text-accent-primary hover:text-accent-primary/80 font-medium"
            >
              Zarejestruj się
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;