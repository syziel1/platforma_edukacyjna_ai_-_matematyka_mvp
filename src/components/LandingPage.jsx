import React, { useEffect, useRef } from 'react';
import { ArrowRight, Clock, HelpCircle, Frown, User, Zap, Target, Play, Calendar, MessageCircle } from 'lucide-react';

const LandingPage = ({ onEnterApp }) => {
  const audioRef = useRef(null);

  // Auto-play welcome audio when component mounts
  useEffect(() => {
    const playWelcomeAudio = async () => {
      try {
        if (audioRef.current) {
          audioRef.current.volume = 0.7; // Set volume to 70%
          await audioRef.current.play();
        }
      } catch (error) {
        // Auto-play might be blocked by browser policy
        console.log('Auto-play was prevented by browser policy');
      }
    };

    // Small delay to ensure component is fully mounted
    const timer = setTimeout(playWelcomeAudio, 1000);
    return () => clearTimeout(timer);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-bg-main">
      {/* Hidden audio element for welcome message */}
      <audio
        ref={audioRef}
        preload="auto"
        className="hidden"
      >
        <source src="/audio/Welcome.en.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/images/jungle_galaxy.jpg)',
            filter: 'brightness(0.7)'
          }}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
        
        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Education that makes sense.
            <br />
            <span className="text-accent-secondary">And brings joy.</span>
          </h1>
          
          <h2 className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed max-w-3xl mx-auto">
            Discover Edu-Future – Poland's first platform that combines the wisdom of real mentors 
            with the power of artificial intelligence to prepare your child for tomorrow's challenges.
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={onEnterApp}
              className="bg-gradient-to-r from-accent-primary to-accent-secondary text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-accent-primary/90 hover:to-accent-secondary/90 transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center gap-2"
            >
              Start your mission!
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => scrollToSection('solution')}
              className="font-bold text-white hover:text-accent-secondary transition-colors duration-300 flex items-center gap-2 underline"
            >
              ↓ Learn more ↓
            </button>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="solution" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-text-color mb-12">
            Does learning have to be a boring obligation?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-text-color mb-3">Lack of time and attention</h3>
              <p className="text-text-color/70 leading-relaxed">
                Teachers are overloaded, and students don't always receive the individual support they need.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-text-color mb-3">Abstract knowledge</h3>
              <p className="text-text-color/70 leading-relaxed">
                Students often ask "What's this for?", not seeing the connection between school theory and real life.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Frown className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-text-color mb-3">Low motivation</h3>
              <p className="text-text-color/70 leading-relaxed">
                Standard teaching methods don't engage or inspire, leading to discouragement and stress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16 bg-gradient-to-br from-nav-bg/10 to-accent-primary/10">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-text-color mb-12">
            Meet Edu-Future: The Synergy of Human and Technology
          </h2>
          
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <img 
                src="/images/Edu_future.jpg"
                alt="Edu-Future - Synergy of human and technology"
                className="justify-center h-64 md:h-80 object-cover rounded-xl shadow-xl"
                onError={(e) => {
                  // Fallback if image doesn't load
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'block';
                }}
              />
              {/* Fallback content */}
              <div 
                className="w-full h-64 md:h-80 bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 rounded-xl shadow-xl flex items-center justify-center border border-accent-primary/30"
                style={{ display: 'none' }}
              >
                <div className="text-center">
                  <div className="text-6xl mb-4">🚀</div>
                  <h3 className="text-xl font-bold text-text-color">Edu-Future</h3>
                  <p className="text-text-color/70">The future of education</p>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2">
              <p className="text-lg text-text-color mb-8 leading-relaxed">
                At Edu-Future, we don't force learning – we redesign it from the ground up. 
                Our unique method is based on two pillars:
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-nav-bg rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-text-color mb-2">Mentor's Wisdom</h3>
                    <p className="text-text-color/70 leading-relaxed">
                      Access to experienced teachers who inspire, explain, and guide through the most challenging topics.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-text-color mb-2">AI Power</h3>
                    <p className="text-text-color/70 leading-relaxed">
                      Personalized AI assistant, available 24/7, that patiently helps solve problems, 
                      adapting to each student's pace and learning style.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-text-color mb-12">
            Your Learning Adventure in 3 Steps
          </h2>
          
          <div className="space-y-12">
            {/* Step 1 */}
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="lg:w-1/2 order-2 lg:order-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-accent-primary rounded-full flex items-center justify-center text-white font-bold text-xl">
                    1
                  </div>
                  <h3 className="text-2xl font-bold text-text-color">Discover your "Explorer Cockpit"</h3>
                </div>
                <p className="text-text-color/70 leading-relaxed text-lg">
                  Log in and see your personalized mission for today. Your cockpit is the command center 
                  where you track progress, manage goals, and plan your next steps.
                </p>
              </div>
              <div className="lg:w-1/2 order-1 lg:order-2">
                <div className="bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 p-6 rounded-xl border border-accent-primary/30">
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="w-6 h-6 text-accent-primary" />
                    <span className="font-bold text-text-color">Your mission for today</span>
                  </div>
                  <div className="text-sm text-text-color/70">
                    🎯 Spend 30 minutes learning daily<br/>
                    📚 Optimize chicken coop area<br/>
                    🎮 Play 3D math game
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="lg:w-1/2">
                <div className="bg-gradient-to-br from-nav-bg/20 to-accent-primary/20 p-6 rounded-xl border border-nav-bg/30">
                  <div className="flex items-center gap-2 mb-4">
                    <Play className="w-6 h-6 text-nav-bg" />
                    <span className="font-bold text-text-color">Mathematical Jungle & Constellation</span>
                  </div>
                  <div className="text-sm text-text-color/70">
                    🌴 Explore the Mathematical Jungle<br/>
                    ⭐ Discover the Constellation of Skills<br/>
                    🏆 Earn points and achievements
                  </div>
                </div>
              </div>
              <div className="lg:w-1/2">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-nav-bg rounded-full flex items-center justify-center text-white font-bold text-xl">
                    2
                  </div>
                  <h3 className="text-2xl font-bold text-text-color">Learn through action and fun</h3>
                </div>
                <p className="text-text-color/70 leading-relaxed text-lg">
                  Solve practical problems like "Chicken Coop Area Optimization", or train skills in the "Mathematical Jungle". 
                  Earn points, beat records, and watch your "Constellation of Skills" grow.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="lg:w-1/2 order-2 lg:order-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-accent-secondary rounded-full flex items-center justify-center text-white font-bold text-xl">
                    3
                  </div>
                  <h3 className="text-2xl font-bold text-text-color">Get support when you need it</h3>
                </div>
                <p className="text-text-color/70 leading-relaxed text-lg">
                  Stuck? Chat with our AI assistant or schedule a meeting with a real mentor with one click, 
                  who will help you understand any topic.
                </p>
              </div>
              <div className="lg:w-1/2 order-1 lg:order-2">
                <div className="bg-gradient-to-br from-accent-secondary/20 to-nav-bg/20 p-6 rounded-xl border border-accent-secondary/30">
                  <div className="flex items-center gap-2 mb-4">
                    <MessageCircle className="w-6 h-6 text-accent-secondary" />
                    <span className="font-bold text-text-color">Schedule meeting with mentor</span>
                  </div>
                  <div className="text-sm text-text-color/70">
                    🤖 AI assistant available 24/7<br/>
                    👨‍🏫 Math mentor meetings<br/>
                    📅 Schedule session with one click
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gradient-to-br from-nav-bg/10 to-accent-primary/10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-text-color mb-8">
            Who's behind Edu-Future?
          </h2>
          
          <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
            <div className="md:w-1/3">
              <img 
                src="/images/Syziel_AIMentor_profile_photo.jpg"
                alt="Sylwester Zieliński"
                className="w-48 h-48 rounded-full object-cover mx-auto shadow-xl border-4 border-white"
              />
            </div>
            <div className="md:w-2/3 text-left">
              <p className="text-lg text-text-color leading-relaxed mb-6">
                We are a team of enthusiasts with a mission to revolutionize Polish education. 
                The project is led by <strong>Sylwester Zieliński</strong>, who for over 30 years has been connecting the worlds of technology and education, 
                helping others develop future skills.
              </p>
              <p className="text-lg text-text-color leading-relaxed">
                Edu-Future is the fruit of this experience, created from a deep belief that every student deserves education 
                that inspires them. We develop the project as part of the world's largest hackathon, <strong>#WorldsLargestHackathon</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-nav-bg to-accent-primary text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready for Education that makes sense?
          </h2>
          
          <p className="text-xl mb-8 leading-relaxed opacity-90">
            Join the first explorers of Edu-Future. Sign up, test our platform, 
            and help us shape the future of learning in Poland.
          </p>
          
          <button
            onClick={onEnterApp}
            className="bg-white text-nav-bg px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center gap-2 mx-auto"
          >
            Start using it now!
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-text-color text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-white/70">
            © 2025 Albatros. Sylwester Zieliński. All rights reserved. 
            Project developed as part of bolt.new Hackathon.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;