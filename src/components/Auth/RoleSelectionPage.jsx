import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, GraduationCap, Users } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const RoleSelectionPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const roles = [
    {
      id: 'teacher',
      title: 'Nauczyciel',
      description: 'Prowadź zajęcia i zarządzaj swoim kalendarzem',
      icon: GraduationCap,
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600'
    },
    {
      id: 'guardian',
      title: 'Opiekun',
      description: 'Zarządzaj nauką swoich dzieci',
      icon: Users,
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600'
    },
    {
      id: 'student',
      title: 'Uczeń',
      description: 'Ucz się i rozwijaj swoje umiejętności',
      icon: User,
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600'
    }
  ];

  const handleRoleSelect = (roleId) => {
    navigate(`/register?role=${roleId}`);
  };

  return (
    <div className="min-h-screen bg-bg-main flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-text-color mb-4">
            Dołącz do Edu-Future
          </h1>
          <p className="text-xl text-text-color/70">
            Wybierz swoją rolę, aby rozpocząć przygodę z nauką
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => handleRoleSelect(role.id)}
              className={`${role.color} ${role.hoverColor} text-white p-8 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 group`}
            >
              <div className="text-center">
                <div className="flex justify-center mb-6">
                  <role.icon className="w-16 h-16 group-hover:animate-bounce" />
                </div>
                
                <h3 className="text-2xl font-bold mb-4">
                  {role.title}
                </h3>
                
                <p className="text-white/90 leading-relaxed">
                  {role.description}
                </p>
              </div>
            </button>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-text-color/60 mb-4">
            Masz już konto?
          </p>
          <button
            onClick={() => navigate('/login')}
            className="text-accent-primary hover:text-accent-primary/80 font-semibold underline"
          >
            Zaloguj się tutaj
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionPage;