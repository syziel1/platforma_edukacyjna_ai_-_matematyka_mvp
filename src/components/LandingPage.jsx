import React from 'react';
import { ArrowRight, Clock, HelpCircle, Frown, User, Zap, Target, Play, Calendar, MessageCircle } from 'lucide-react';

const LandingPage = ({ onEnterApp }) => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-bg-main">
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
            Edukacja, która ma sens.
            <br />
            <span className="text-accent-secondary">I sprawia radość.</span>
          </h1>
          
          <h2 className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed max-w-3xl mx-auto">
            Odkryj Edu Future – pierwszą w Polsce platformę, która łączy mądrość prawdziwych mentorów 
            z mocą sztucznej inteligencji, aby przygotować Twoje dziecko na wyzwania jutra.
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={onEnterApp}
              className="bg-gradient-to-r from-accent-primary to-accent-secondary text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-accent-primary/90 hover:to-accent-secondary/90 transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center gap-2"
            >
              Rozpocznij swoją misję!
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => scrollToSection('solution')}
              className="font-bold text-white hover:text-accent-secondary transition-colors duration-300 flex items-center gap-2 underline"
            >
              ↓ Dowiedz się więcej ↓
            </button>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="solution" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-text-color mb-12">
            Czy nauka musi być nudnym obowiązkiem?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-text-color mb-3">Brak czasu i uwagi</h3>
              <p className="text-text-color/70 leading-relaxed">
                Nauczyciele są przeciążeni, a uczniowie nie zawsze otrzymują indywidualne wsparcie, którego potrzebują.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-text-color mb-3">Abstrakcyjna wiedza</h3>
              <p className="text-text-color/70 leading-relaxed">
                Uczniowie często pytają "Po co mi to?", nie widząc połączenia między szkolną teorią a realnym życiem.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Frown className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-text-color mb-3">Niska motywacja</h3>
              <p className="text-text-color/70 leading-relaxed">
                Standardowe metody nauczania nie angażują i nie inspirują, prowadząc do zniechęcenia i stresu.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16 bg-gradient-to-br from-nav-bg/10 to-accent-primary/10">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-text-color mb-12">
            Poznaj Edu Future: Synergia Człowieka i Technologii
          </h2>
          
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <img 
                src="/images/Edu_future.jpg"
                alt="Edu Future - Synergia człowieka i technologii"
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
                  <h3 className="text-xl font-bold text-text-color">Edu Future</h3>
                  <p className="text-text-color/70">Przyszłość edukacji</p>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2">
              <p className="text-lg text-text-color mb-8 leading-relaxed">
                W Edu Future nie zmuszamy do nauki – my ją projektujemy na nowo. 
                Nasza unikalna metoda opiera się na dwóch filarach:
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-nav-bg rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-text-color mb-2">Mądrość Mentora</h3>
                    <p className="text-text-color/70 leading-relaxed">
                      Dostęp do doświadczonych nauczycieli, którzy inspirują, tłumaczą i prowadzą przez najtrudniejsze zagadnienia.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-text-color mb-2">Moc AI</h3>
                    <p className="text-text-color/70 leading-relaxed">
                      Spersonalizowany asystent AI, dostępny 24/7, który cierpliwie pomaga rozwiązywać problemy, 
                      dostosowując się do tempa i stylu nauki każdego ucznia.
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
            Twoja Przygoda z Nauką w 3 Krokach
          </h2>
          
          <div className="space-y-12">
            {/* Step 1 */}
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="lg:w-1/2 order-2 lg:order-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-accent-primary rounded-full flex items-center justify-center text-white font-bold text-xl">
                    1
                  </div>
                  <h3 className="text-2xl font-bold text-text-color">Odkryj swój "Kokpit Odkrywcy"</h3>
                </div>
                <p className="text-text-color/70 leading-relaxed text-lg">
                  Zaloguj się i zobacz swoją spersonalizowaną misję na dziś. Twój kokpit to centrum dowodzenia, 
                  gdzie śledzisz postępy, zarządzasz celami i planujesz kolejne kroki.
                </p>
              </div>
              <div className="lg:w-1/2 order-1 lg:order-2">
                <div className="bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 p-6 rounded-xl border border-accent-primary/30">
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="w-6 h-6 text-accent-primary" />
                    <span className="font-bold text-text-color">Twoja misja na dziś</span>
                  </div>
                  <div className="text-sm text-text-color/70">
                    🎯 Spędź 30 minut na nauce<br/>
                    📚 Kontynuuj: Optymalizacja Kurnika<br/>
                    🎮 Zagraj w Matematyczną Dżunglę
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
                    <span className="font-bold text-text-color">Matematyczna Dżungla & Konstelacja</span>
                  </div>
                  <div className="text-sm text-text-color/70">
                    🌴 Eksploruj dżunglę matematyczną<br/>
                    ⭐ Odkrywaj konstelację kompetencji<br/>
                    🏆 Zdobywaj punkty i osiągnięcia
                  </div>
                </div>
              </div>
              <div className="lg:w-1/2">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-nav-bg rounded-full flex items-center justify-center text-white font-bold text-xl">
                    2
                  </div>
                  <h3 className="text-2xl font-bold text-text-color">Ucz się przez działanie i zabawę</h3>
                </div>
                <p className="text-text-color/70 leading-relaxed text-lg">
                  Rozwiązuj praktyczne problemy, jak "Optymalizacja Kurnika", lub trenuj umiejętności w "Matematycznej Dżungli". 
                  Zdobywaj punkty, bij rekordy i zobacz, jak rośnie Twoja "Konstelacja Kompetencji".
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
                  <h3 className="text-2xl font-bold text-text-color">Sięgnij po wsparcie, kiedy go potrzebujesz</h3>
                </div>
                <p className="text-text-color/70 leading-relaxed text-lg">
                  Utknąłeś? Porozmawiaj z naszym asystentem AI lub jednym kliknięciem umów spotkanie z prawdziwym mentorem, 
                  który pomoże Ci zrozumieć każde zagadnienie.
                </p>
              </div>
              <div className="lg:w-1/2 order-1 lg:order-2">
                <div className="bg-gradient-to-br from-accent-secondary/20 to-nav-bg/20 p-6 rounded-xl border border-accent-secondary/30">
                  <div className="flex items-center gap-2 mb-4">
                    <MessageCircle className="w-6 h-6 text-accent-secondary" />
                    <span className="font-bold text-text-color">Umów spotkanie z mentorem</span>
                  </div>
                  <div className="text-sm text-text-color/70">
                    🤖 Asystent AI dostępny 24/7<br/>
                    👨‍🏫 Spotkania z mentorem matematyki<br/>
                    📅 Zaplanuj sesję jednym kliknięciem
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
            Kto stoi za Edu Future?
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
                Jesteśmy zespołem pasjonatów z misją zrewolucjonizowania polskiej edukacji. 
                Na czele projektu stoi <strong>Sylwester Zieliński</strong>, który od ponad 30 lat łączy świat technologii i edukacji, 
                pomagając innym rozwijać kompetencje przyszłości.
              </p>
              <p className="text-lg text-text-color leading-relaxed">
                Edu Future to owoc tego doświadczenia, stworzony z głębokiej wiary, że każdy uczeń zasługuje na edukację, 
                która go inspiruje. Projekt rozwijamy w ramach największego na świecie hackathonu, <strong>#WorldsLargestHackathon</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-nav-bg to-accent-primary text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Gotów na Edukację, która ma sens?
          </h2>
          
          <p className="text-xl mb-8 leading-relaxed opacity-90">
            Dołącz do grona pierwszych odkrywców Edu Future. Zarejestruj się, przetestuj naszą platformę 
            i pomóż nam kształtować przyszłość nauki w Polsce.
          </p>
          
          <button
            onClick={onEnterApp}
            className="bg-white text-nav-bg px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center gap-2 mx-auto"
          >
            Zacznij korzystać już teraz!
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-text-color text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-white/70">
            © 2024 Edu-Future. Wszystkie prawa zastrzeżone. 
            Autor: Sylwester Zieliński. Projekt rozwijany w ramach Bolt Hackathon.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;