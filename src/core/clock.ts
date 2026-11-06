/**
 * Relógio oficial sincronizado com timezone América/São Paulo (Brasília).
 */
export function setupClock(options: {
  dateElId?: string;
  timeElId?: string;
  secondsElId?: string;
  qaClockElId?: string;
} = {}): () => void {
  const dateEl = document.getElementById(options.dateElId || 'date');
  const timeEl = document.getElementById(options.timeElId || 'time');
  const secEl = document.getElementById(options.secondsElId || 'seconds');
  const qaEl = document.getElementById(options.qaClockElId || 'qaClock');

  const tick = () => {
    const d = new Date();
    const timeZone = 'America/Sao_Paulo';

    if (dateEl) {
      dateEl.textContent = new Intl.DateTimeFormat('pt-BR', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        timeZone
      }).format(d).toUpperCase();
    }

    if (timeEl) {
      timeEl.textContent = new Intl.DateTimeFormat('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone
      }).format(d);
    }

    if (secEl) {
      secEl.textContent = 'SEGUNDOS: ' + new Intl.DateTimeFormat('pt-BR', {
        second: '2-digit',
        timeZone
      }).format(d);
    }

    if (qaEl) {
      qaEl.textContent = 'Hora de Brasília: ' + new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'full',
        timeStyle: 'medium',
        timeZone
      }).format(d) + ' | UTC: ' + d.toISOString() + ' (referência técnica)';
    }
  };

  tick();
  const timer = setInterval(tick, 1000);

  const handleVisibility = () => {
    if (!document.hidden) tick();
  };

  window.addEventListener('visibilitychange', handleVisibility);
  window.addEventListener('focus', tick);

  return () => {
    clearInterval(timer);
    window.removeEventListener('visibilitychange', handleVisibility);
    window.removeEventListener('focus', tick);
  };
}
