import React from 'react';
import { X, Github, Linkedin, Calendar, Users, Target, Lightbulb } from 'lucide-react';

const AboutProjectModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleScheduleMeeting = () => {
    window.open('https://calendar.app.google/uEjrzw5pTsbMwcbc8', '_blank');
  };

  const handleGithubClick = () => {
    window.open('https://github.com/syziel1/platforma_edukacyjna_ai_-_matematyka_mvp', '_blank');
  };

  const handleLinkedinClick = () => {
    window.open('https://www.linkedin.com/in/sylwekpl', '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-text-color flex items-center gap-2">
            <Target className="w-6 h-6 text-accent-primary" />
            O projekcie Edu-Future
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-md hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Project Description */}
          <div className="bg-gradient-to-r from-accent-primary/10 to-accent-secondary/10 rounded-lg p-6 border border-accent-primary/20">
            <h3 className="text-xl font-bold text-text-color mb-3 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-accent-primary" />
              Misja projektu
            </h3>
            <p className="text-text-color leading-relaxed mb-4">
              <strong>Edu-Future</strong> to innowacyjna platforma edukacyjna zaprojektowana, aby zrewolucjonizować 
              naukę matematyki poprzez personalizację, grywalizację i wsparcie sztucznej inteligencji.
            </p>
            <p className="text-text-color leading-relaxed">
              Naszą misją jest stworzenie spójnej i logicznej podróży edukacyjnej, w której uczeń nie tylko 
              rozwiązuje problemy, ale przede wszystkim rozumie <strong>cel i sens nauki</strong>.
            </p>
          </div>

          {/* Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="font-bold text-blue-800 mb-2">🎯 Nauka przez Problem-Solving</h4>
              <p className="text-blue-700 text-sm">
                Każdy temat zaczyna się od praktycznego problemu z życia wziętego.
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <h4 className="font-bold text-green-800 mb-2">🤖 Personalizowany Mentor AI</h4>
              <p className="text-green-700 text-sm">
                Dedykowany asystent AI dostosowuje się do indywidualnego tempa nauki.
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <h4 className="font-bold text-purple-800 mb-2">🎮 Grywalizacja</h4>
              <p className="text-purple-700 text-sm">
                Nauka odbywa się poprzez serię interaktywnych gier i wyzwań.
              </p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
              <h4 className="font-bold text-orange-800 mb-2">👨‍🏫 Wsparcie Mentorów</h4>
              <p className="text-orange-700 text-sm">
                Platforma łączy uczniów z prawdziwymi nauczycielami i korepetytorami.
              </p>
            </div>
          </div>

          {/* Team Section */}
          <div className="bg-nav-bg/5 rounded-lg p-6 border border-nav-bg/20">
            <h3 className="text-xl font-bold text-text-color mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-nav-bg" />
              Zespół projektu
            </h3>
            
            {/* Project Leader */}
            <div className="bg-white rounded-lg p-4 border border-nav-bg/30 mb-4">
              <div className="flex items-center gap-4 mb-3">
                {/* Zdjęcie mentora - placeholder, który można podmienić */}
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-accent-primary shadow-lg">
                  <img 
                    src="/mentor-photo.jpg"
                    alt="Sylwester Zieliński"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback do inicjałów jeśli zdjęcie nie zostanie znalezione
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  {/* Fallback z inicjałami */}
                  <div 
                    className="w-full h-full bg-gradient-to-br from-accent-primary to-accent-secondary rounded-full flex items-center justify-center text-white font-bold text-xl"
                    style={{ display: 'none' }}
                  >
                    SZ
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-text-color text-lg">Sylwester Zieliński</h4>
                  <p className="text-text-color/70">Lider Projektu, Wizjoner, Prototypowanie UI</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleLinkedinClick}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                >
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </button>
                <button
                  onClick={handleScheduleMeeting}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                >
                  <Calendar className="w-4 h-4" />
                  Umów spotkanie
                </button>
              </div>
            </div>

            {/* Other Team Members */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/50 rounded-lg p-3 border border-nav-bg/20">
                <h5 className="font-bold text-text-color">Arkadiusz Słota</h5>
                <p className="text-text-color/70 text-sm">Architektura Systemów, Programista AI (RAG & Gen AI)</p>
              </div>
              <div className="bg-white/50 rounded-lg p-3 border border-nav-bg/20">
                <h5 className="font-bold text-text-color">Mateusz Tyburski</h5>
                <p className="text-text-color/70 text-sm">Automatyzacja, Wsparcie Techniczne</p>
              </div>
              <div className="bg-white/50 rounded-lg p-3 border border-nav-bg/20">
                <h5 className="font-bold text-text-color">Michał Marini</h5>
                <p className="text-text-color/70 text-sm">Procesy, Analityka</p>
              </div>
            </div>
          </div>

          {/* Technology Stack */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-text-color mb-4">🛠️ Stos technologiczny</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white rounded-lg p-3 text-center border border-gray-200">
                <div className="text-2xl mb-1">⚛️</div>
                <div className="text-sm font-medium text-text-color">React.js</div>
              </div>
              <div className="bg-white rounded-lg p-3 text-center border border-gray-200">
                <div className="text-2xl mb-1">⚡</div>
                <div className="text-sm font-medium text-text-color">Vite</div>
              </div>
              <div className="bg-white rounded-lg p-3 text-center border border-gray-200">
                <div className="text-2xl mb-1">🤖</div>
                <div className="text-sm font-medium text-text-color">Google Gemini</div>
              </div>
              <div className="bg-white rounded-lg p-3 text-center border border-gray-200">
                <div className="text-2xl mb-1">🎨</div>
                <div className="text-sm font-medium text-text-color">Tailwind CSS</div>
              </div>
            </div>
          </div>

          {/* Repository Link */}
          <div className="bg-gray-900 rounded-lg p-6 text-white">
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              <Github className="w-5 h-5" />
              Kod źródłowy
            </h3>
            <p className="text-gray-300 mb-4">
              Projekt jest rozwijany jako open source. Sprawdź kod źródłowy i śledź postępy rozwoju.
            </p>
            <button
              onClick={handleGithubClick}
              className="flex items-center gap-2 bg-white text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors font-medium"
            >
              <Github className="w-4 h-4" />
              Zobacz repozytorium
            </button>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-accent-primary to-accent-secondary rounded-lg p-6 text-white text-center">
            <h3 className="text-xl font-bold mb-3">🚀 Dołącz do rewolucji w edukacji!</h3>
            <p className="mb-4 opacity-90">
              Chcesz być częścią projektu lub masz pytania? Skontaktuj się z liderem projektu.
            </p>
            <button
              onClick={handleScheduleMeeting}
              className="bg-white text-accent-primary hover:bg-gray-100 px-6 py-3 rounded-lg transition-colors font-bold flex items-center gap-2 mx-auto"
            >
              <Calendar className="w-5 h-5" />
              Umów spotkanie z Sylwestrem
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 text-center text-gray-500 text-sm">
          <p>© 2024 Edu-Future. Projekt rozwijany w ramach Bolt Hackathon.</p>
        </div>
      </div>
    </div>
  );
};

export default AboutProjectModal;