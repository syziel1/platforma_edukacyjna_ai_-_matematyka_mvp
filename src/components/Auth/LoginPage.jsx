import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-bg-main flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-bg-card rounded-xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate('/')}
            className="text-text-color/60 hover:text-text-color mr-4"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-text-color">
            Logowanie wyłączone
          </h1>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
          <p className="text-red-700 text-sm">Funkcja logowania została wyłączona w tej wersji aplikacji.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;