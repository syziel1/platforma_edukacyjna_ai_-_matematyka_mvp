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
            About Edu-Future Project
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
              Project Mission
            </h3>
            <p className="text-text-color leading-relaxed mb-4">
              <strong>Edu-Future</strong> is an innovative educational platform designed to revolutionize 
              mathematics learning through personalization, gamification, and artificial intelligence support.
            </p>
            <p className="text-text-color leading-relaxed">
              Our mission is to create a coherent and logical educational journey where students not only 
              solve problems but primarily understand the <strong>purpose and meaning of learning</strong>.
            </p>
          </div>

          {/* Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="font-bold text-blue-800 mb-2">🎯 Problem-Based Learning</h4>
              <p className="text-blue-700 text-sm">
                Every topic starts with a practical, real-world problem.
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <h4 className="font-bold text-green-800 mb-2">🤖 Personalized AI Mentor</h4>
              <p className="text-green-700 text-sm">
                Dedicated AI assistant adapts to individual learning pace.
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <h4 className="font-bold text-purple-800 mb-2">🎮 Gamification</h4>
              <p className="text-purple-700 text-sm">
                Learning through interactive games and challenges.
              </p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
              <h4 className="font-bold text-orange-800 mb-2">👨‍🏫 Mentor Support</h4>
              <p className="text-orange-700 text-sm">
                Platform connects students with real teachers and tutors.
              </p>
            </div>
          </div>

          {/* Team Section */}
          <div className="bg-nav-bg/5 rounded-lg p-6 border border-nav-bg/20">
            <h3 className="text-xl font-bold text-text-color mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-nav-bg" />
              Project Team
            </h3>
            
            {/* Project Leader */}
            <div className="bg-white rounded-lg p-4 border border-nav-bg/30 mb-4">
              <div className="flex items-center gap-4 mb-3">
                {/* Mentor photo - placeholder that can be replaced */}
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-accent-primary shadow-lg">
                  <img 
                    src="/mentor-photo.jpg"
                    alt="Sylwester Zieliński"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to initials if photo not found
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  {/* Fallback with initials */}
                  <div 
                    className="w-full h-full bg-gradient-to-br from-accent-primary to-accent-secondary rounded-full flex items-center justify-center text-white font-bold text-xl"
                    style={{ display: 'none' }}
                  >
                    SZ
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-text-color text-lg">Sylwester Zieliński</h4>
                  <p className="text-text-color/70">Project Leader, Visionary, UI Prototyping</p>
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
                  Schedule Meeting
                </button>
              </div>
            </div>

            {/* Other Team Members */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/50 rounded-lg p-3 border border-nav-bg/20">
                <h5 className="font-bold text-text-color">Arkadiusz Słota</h5>
                <p className="text-text-color/70 text-sm">System Architecture, AI Developer (RAG & Gen AI)</p>
              </div>
              <div className="bg-white/50 rounded-lg p-3 border border-nav-bg/20">
                <h5 className="font-bold text-text-color">Mateusz Tyburski</h5>
                <p className="text-text-color/70 text-sm">Automation, Technical Support</p>
              </div>
              <div className="bg-white/50 rounded-lg p-3 border border-nav-bg/20">
                <h5 className="font-bold text-text-color">Michał Marini</h5>
                <p className="text-text-color/70 text-sm">Processes, Analytics</p>
              </div>
            </div>
          </div>

          {/* Technology Stack */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-text-color mb-4">🛠️ Technology Stack</h3>
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
              Source Code
            </h3>
            <p className="text-gray-300 mb-4">
              The project is developed as open source. Check the source code and follow development progress.
            </p>
            <button
              onClick={handleGithubClick}
              className="flex items-center gap-2 bg-white text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors font-medium"
            >
              <Github className="w-4 h-4" />
              View Repository
            </button>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-accent-primary to-accent-secondary rounded-lg p-6 text-white text-center">
            <h3 className="text-xl font-bold mb-3">🚀 Join the Education Revolution!</h3>
            <p className="mb-4 opacity-90">
              Want to be part of the project or have questions? Contact the project leader.
            </p>
            <button
              onClick={handleScheduleMeeting}
              className="bg-white text-accent-primary hover:bg-gray-100 px-6 py-3 rounded-lg transition-colors font-bold flex items-center gap-2 mx-auto"
            >
              <Calendar className="w-5 h-5" />
              Schedule Meeting with Sylwester
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 text-center text-gray-500 text-sm">
          <p>© 2025 Edu Future. All rights reserved. Author: Sylwester Zieliński. Project developed as part of bolt.new Hackathon.</p> 
        </div>
      </div>
    </div>
  );
};

export default AboutProjectModal;