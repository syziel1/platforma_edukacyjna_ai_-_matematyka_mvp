import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, User, GraduationCap, Users } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useLanguage } from '../../contexts/LanguageContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();
  
  const role = searchParams.get('role') || 'student';
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const roleConfig = {
    teacher: {
      title: 'Nauczyciel',
      icon: GraduationCap,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    guardian: {
      title: 'Opiekun',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    student: {
      title: 'Uczeń',
      icon: User,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    }
  };

  const currentRole = roleConfig[role] || roleConfig.student;

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Imię jest wymagane';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Nazwisko jest wymagane';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Adres e-mail jest wymagany';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Nieprawidłowy format adresu e-mail';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Numer telefonu jest wymagany';
    }

    if (!formData.password) {
      newErrors.password = 'Hasło jest wymagane';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Hasło musi mieć co najmniej 8 znaków';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Potwierdzenie hasła jest wymagane';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Hasła nie są identyczne';
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
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            role: role,
            phone_number: formData.phoneNumber
          }
        }
      });

      if (error) {
        if (error.message.includes('User already registered')) {
          setErrors({ email: 'Użytkownik z tym adresem e-mail już istnieje' });
        } else {
          setErrors({ general: error.message });
        }
        return;
      }

      setRegistrationSuccess(true);
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ general: 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignUp = async (provider) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            role: role
          }
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

  if (registrationSuccess) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-bg-card rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">✅</span>
          </div>
          <h2 className="text-2xl font-bold text-text-color mb-4">
            Dziękujemy za rejestrację!
          </h2>
          <p className="text-text-color/70 mb-6 leading-relaxed">
            Wysłaliśmy link weryfikacyjny na Twój adres e-mail. 
            Potwierdź go, aby aktywować konto.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-accent-primary text-white py-3 px-4 rounded-lg hover:bg-accent-primary/90 transition-colors font-medium"
          >
            Przejdź do logowania
          </button>
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
            onClick={() => navigate('/register-role')}
            className="text-text-color/60 hover:text-text-color mr-4"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center">
            <currentRole.icon className={`w-6 h-6 ${currentRole.color} mr-2`} />
            <h1 className="text-xl font-bold text-text-color">
              Rejestracja - {currentRole.title}
            </h1>
          </div>
        </div>

        {/* Role indicator */}
        <div className={`${currentRole.bgColor} ${currentRole.borderColor} border rounded-lg p-3 mb-6`}>
          <p className={`text-sm ${currentRole.color} font-medium`}>
            Rejestrujesz się jako {currentRole.title.toLowerCase()}
          </p>
        </div>

        {/* General error */}
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
            <p className="text-red-700 text-sm">{errors.general}</p>
          </div>
        )}

        {/* Registration form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-text-color mb-1">
              Imię *
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary/50 ${
                errors.firstName ? 'border-red-500 bg-red-50' : 'border-bg-neutral'
              }`}
              placeholder="Wprowadź swoje imię"
            />
            {errors.firstName && (
              <p className="text-red-600 text-xs mt-1">{errors.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-text-color mb-1">
              Nazwisko *
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary/50 ${
                errors.lastName ? 'border-red-500 bg-red-50' : 'border-bg-neutral'
              }`}
              placeholder="Wprowadź swoje nazwisko"
            />
            {errors.lastName && (
              <p className="text-red-600 text-xs mt-1">{errors.lastName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-text-color mb-1">
              Adres e-mail *
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

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-text-color mb-1">
              Numer telefonu *
            </label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary/50 ${
                errors.phoneNumber ? 'border-red-500 bg-red-50' : 'border-bg-neutral'
              }`}
              placeholder="+48 123 456 789"
            />
            {errors.phoneNumber && (
              <p className="text-red-600 text-xs mt-1">{errors.phoneNumber}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-text-color mb-1">
              Hasło *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary/50 pr-10 ${
                  errors.password ? 'border-red-500 bg-red-50' : 'border-bg-neutral'
                }`}
                placeholder="Minimum 8 znaków"
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

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-text-color mb-1">
              Potwierdź hasło *
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary/50 pr-10 ${
                  errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-bg-neutral'
                }`}
                placeholder="Powtórz hasło"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-color/60"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-600 text-xs mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-accent-primary text-white py-3 px-4 rounded-lg hover:bg-accent-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Rejestrowanie...' : 'Zarejestruj się'}
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
                Lub zarejestruj się przez:
              </span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <button
              onClick={() => handleOAuthSignUp('google')}
              className="flex justify-center items-center px-4 py-2 border border-bg-neutral rounded-lg hover:bg-bg-neutral/50 transition-colors"
            >
              <span className="text-sm font-medium">Google</span>
            </button>
            <button
              onClick={() => handleOAuthSignUp('facebook')}
              className="flex justify-center items-center px-4 py-2 border border-bg-neutral rounded-lg hover:bg-bg-neutral/50 transition-colors"
            >
              <span className="text-sm font-medium">Facebook</span>
            </button>
            <button
              onClick={() => handleOAuthSignUp('zoom')}
              className="flex justify-center items-center px-4 py-2 border border-bg-neutral rounded-lg hover:bg-bg-neutral/50 transition-colors"
            >
              <span className="text-sm font-medium">Zoom</span>
            </button>
          </div>
        </div>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-text-color/60 text-sm">
            Masz już konto?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-accent-primary hover:text-accent-primary/80 font-medium"
            >
              Zaloguj się
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;