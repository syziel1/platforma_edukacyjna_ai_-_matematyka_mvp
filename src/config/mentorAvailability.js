export const mentorAvailability = {
  // Informacje o mentorze
  mentorInfo: {
    name: 'mgr inż. Sylwester Zieliński',
    title: 'Mentor matematyki/informatyki',
    specialization: 'Matura rozszerzona z matematyki'
  },

  // Harmonogram spotkań (format 24h)
  schedule: {
    monday: { start: '08:30', end: '11:30' },
    tuesday: { start: '08:30', end: '11:30' },
    wednesday: { start: '08:30', end: '11:30' },
    thursday: { start: '08:30', end: '11:30' },
    friday: { start: '08:30', end: '11:30' },
    saturday: null, // Niedostępny
    sunday: null   // Niedostępny
  },
  
  // Symulacja zajętości mentora
  isBusy: false,
  
  // Funkcja sprawdzająca czy to czas spotkania (dokładnie o 8:30)
  isSessionTime() {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = niedziela, 1 = poniedziałek, itd.
    const currentTime = now.toTimeString().slice(0, 5); // Format HH:MM
    
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = dayNames[dayOfWeek];
    const todaySchedule = this.schedule[today];
    
    if (!todaySchedule) return false; // Dzień wolny
    
    // Sprawdź czy to dokładnie czas spotkania (8:30)
    return currentTime === '08:30';
  },
  
  // Funkcja sprawdzająca dostępność (szersze okno czasowe)
  isAvailable() {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const currentTime = now.toTimeString().slice(0, 5);
    
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = dayNames[dayOfWeek];
    const todaySchedule = this.schedule[today];
    
    if (!todaySchedule) return false;
    if (this.isBusy) return false;
    
    return currentTime >= todaySchedule.start && currentTime <= todaySchedule.end;
  },
  
  // Funkcja zwracająca status mentora
  getStatus() {
    if (this.isBusy) return 'busy';
    if (this.isSessionTime()) return 'session-time'; // Nowy status
    if (this.isAvailable()) return 'available';
    return 'unavailable';
  },
  
  // Funkcja zwracająca następne spotkanie
  getNextSessionDate() {
    const now = new Date();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    
    // Sprawdź kolejne 7 dni
    for (let i = 0; i < 7; i++) {
      const checkDate = new Date(now);
      checkDate.setDate(now.getDate() + i);
      const dayName = dayNames[checkDate.getDay()];
      const schedule = this.schedule[dayName];
      
      if (schedule) {
        const sessionDateTime = new Date(checkDate);
        const [hours, minutes] = schedule.start.split(':');
        sessionDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        
        // Jeśli to dzisiaj, sprawdź czy jeszcze nie minęła godzina
        if (i === 0 && sessionDateTime <= now) {
          continue; // Sprawdź następny dzień
        }
        
        return sessionDateTime;
      }
    }
    
    return null;
  },

  // Funkcja formatująca datę spotkania
  formatSessionDate(date) {
    if (!date) return null;
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sessionDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    const diffTime = sessionDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Dziś';
    } else if (diffDays === 1) {
      return 'Jutro';
    } else {
      const dayNames = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];
      return dayNames[date.getDay()];
    }
  }
};