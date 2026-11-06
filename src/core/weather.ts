/**
 * Módulo de previsão do tempo via Open-Meteo (sem chave de API).
 */
const weatherDesc = (code: number | null | undefined): string => {
  const map: Record<number, string> = {
    0: 'Céu limpo',
    1: 'Predomínio de sol',
    2: 'Parcialmente nublado',
    3: 'Nublado',
    45: 'Nevoeiro',
    48: 'Nevoeiro',
    51: 'Garoa',
    53: 'Garoa',
    55: 'Garoa',
    61: 'Chuva',
    63: 'Chuva',
    65: 'Chuva intensa',
    80: 'Pancadas de chuva',
    81: 'Pancadas de chuva',
    82: 'Chuva forte',
    95: 'Trovoadas'
  };
  return (code !== null && code !== undefined && map[code]) || 'Condição atual';
};

async function fetchWithTimeout(url: string, timeoutMs = 8500): Promise<any> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal, cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

export function setupWeather(options: {
  tempElId?: string;
  descElId?: string;
  qaElId?: string;
  cityName?: string;
} = {}): () => void {
  const tempEl = document.getElementById(options.tempElId || 'temp');
  const descEl = document.getElementById(options.descElId || 'weather');
  const qaEl = document.getElementById(options.qaElId || 'qaWeather');
  const cityQuery = options.cityName || 'Sumaré';

  let isBusy = false;
  let lastWeatherAt = 0;

  const refresh = async () => {
    if (isBusy) return;
    isBusy = true;

    if (descEl) descEl.textContent = 'Consultando clima…';
    if (qaEl) qaEl.textContent = `Clima: consultando Open-Meteo (${cityQuery})`;

    try {
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityQuery)}&count=10&language=pt&format=json&countryCode=BR`;
      const geo = await fetchWithTimeout(geoUrl);
      const results = geo.results || [];

      const targetCity = results.find((x: any) => {
        const name = String(x.name || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
        const admin = String(x.admin1 || '').toLowerCase();
        return name === cityQuery.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase() && admin.includes('são paulo');
      }) || results[0];

      if (!targetCity) throw new Error(`Localidade ${cityQuery} não confirmada`);

      const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${targetCity.latitude}&longitude=${targetCity.longitude}&current=temperature_2m,weather_code&timezone=America%2FSao_Paulo`;
      const forecast = await fetchWithTimeout(forecastUrl);

      const temp = forecast.current?.temperature_2m;
      const code = forecast.current?.weather_code;
      if (typeof temp !== 'number') throw new Error('Temperatura ausente');

      lastWeatherAt = Date.now();
      if (tempEl) tempEl.textContent = `${Math.round(temp)}°C`;
      if (descEl) descEl.textContent = `${weatherDesc(code)} · Open-Meteo`;
      if (qaEl) qaEl.textContent = `Clima: ${cityQuery}/SP · ${temp}°C · Open-Meteo`;
    } catch (err: any) {
      if (!lastWeatherAt) {
        if (tempEl) tempEl.textContent = '--°C';
        if (descEl) descEl.textContent = 'Clima indisponível';
      } else {
        if (descEl) descEl.textContent = 'Última leitura · verificar conexão';
      }
      if (qaEl) qaEl.textContent = `Clima: consulta indisponível (${err.message}). Sem dados inventados.`;
    } finally {
      isBusy = false;
    }
  };

  refresh();
  const interval = setInterval(refresh, 15 * 60 * 1000); // 15 min

  const staleCheck = setInterval(() => {
    if (lastWeatherAt && Date.now() - lastWeatherAt > 35 * 60 * 1000) {
      if (tempEl) tempEl.textContent = '--°C';
      if (descEl) descEl.textContent = 'Clima desatualizado';
    }
  }, 60000);

  const btn = document.getElementById('refreshWeather');
  if (btn) btn.onclick = refresh;

  return () => {
    clearInterval(interval);
    clearInterval(staleCheck);
  };
}
