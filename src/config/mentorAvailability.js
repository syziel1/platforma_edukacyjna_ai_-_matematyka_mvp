export const mentorAvailability = {
  // Godziny dostępności mentora (format 24h)
  schedule: {
    monday: { start: '08:00', end: '12:00' },
    tuesday: { start: '08:00', end: '12:00' },
    wednesday: { start: '08:00', end: '12:00' },
    thursday: { start: '08:00', end: '12:00' },
    friday: { start: '08:00', end: '12:00' },
    saturday: null, // Niedostępny
    sunday: null   // Niedostępny
  },
  
  // Symulacja zajętości mentora (można rozszerzyć o API)
  isBusy: false,
  
  // Funkcja sprawdzająca dostępność
  isAvailable() {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = niedziela, 1 = poniedziałek, itd.
    const currentTime = now.toTimeString().slice(0, 5); // Format HH:MM
    
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = dayNames[dayOfWeek];
    const todaySchedule = this.schedule[today];
    
    if (!todaySchedule) return false; // Dzień wolny
    if (this.isBusy) return false; // Mentor zajęty
    
    return currentTime >= todaySchedule.start && currentTime <= todaySchedule.end;
  },
  
  // Funkcja zwracająca status mentora
  getStatus() {
    if (this.isBusy) return 'busy';
    if (this.isAvailable()) return 'available';
    return 'unavailable';
  },
  
  // Funkcja zwracająca następną dostępność
  getNextAvailability() {
    const now = new Date();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    
    // Sprawdź kolejne 7 dni
    for (let i = 0; i < 7; i++) {
      const checkDate = new Date(now);
      checkDate.setDate(now.getDate() + i);
      const dayName = dayNames[checkDate.getDay()];
      const schedule = this.schedule[dayName];
      
      if (schedule) {
        const nextDateTime = new Date(checkDate);
        const [hours, minutes] = schedule.start.split(':');
        nextDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        
        // Jeśli to dzisiaj, sprawdź czy jeszcze nie minęła godzina rozpoczęcia
        if (i === 0 && nextDateTime <= now) {
          continue; // Sprawdź następny dzień
        }
        
        return nextDateTime;
      }
    }
    
    return null; // Brak dostępności w najbliższych 7 dniach
  }
};