import './styles/player.css';
import { setupScaler } from './core/scaler';
import { setupClock } from './core/clock';
import { setupWeather } from './core/weather';
import { telemetry, M11_VERSION } from './core/telemetry';
import { Scheduler } from './core/scheduler';
import { SideAdController } from './core/sideAd';

import storiesData from './data/stories.json';
import adsData from './data/ads.json';
import playlistData from './data/playlist.json';
import defaultWidgets from './data/widgets.json';

import type { PlaylistConfig, StoryItem, AdItem, WidgetData } from './types';

// 1. Layout 1536x864 responsivo e relógio em tempo real
setupScaler();
setupClock();

// 2. Telemetria inicial
telemetry.log('player_iniciado', null, { version: M11_VERSION });

// 3. Widgets locais (persistência no navegador)
const LOCAL_KEY = 'vitrine-indoor-widgets-v28';

interface WidgetLocalMap {
  event: keyof WidgetData;
  health: keyof WidgetData;
  economy: keyof WidgetData;
}

const WIDGET_MAP: WidgetLocalMap = {
  event: 'event',
  health: 'health',
  economy: 'economy'
};

function applyLocal(): WidgetData {
  let data: WidgetData = { ...defaultWidgets } as WidgetData;
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (raw) data = { ...data, ...JSON.parse(raw) };
  } catch (_) {}

  for (const name of Object.keys(WIDGET_MAP) as Array<keyof WidgetLocalMap>) {
    const id = WIDGET_MAP[name];
    const widgetEl = document.getElementById(id);
    const sourceEl = document.getElementById(id + 'Source');
    const val = data[name];
    if (widgetEl) {
      widgetEl.textContent = val || '';
    }
    if (sourceEl) {
      sourceEl.textContent = val ? `Cadastro local · ${data.source || 'sem fonte'}` : 'Demonstração · sem publicação';
    }
  }
  return data;
}

applyLocal();

// 4. Painel de edição de widgets
function editorToggle(state: boolean) {
  const editor = document.getElementById('localEditor');
  if (!editor) return;
  editor.hidden = !state;
  if (state) {
    const v = applyLocal();
    for (const name of Object.keys(WIDGET_MAP) as Array<keyof WidgetLocalMap>) {
      const inputId = 'edit' + name.charAt(0).toUpperCase() + name.slice(1);
      const input = document.getElementById(inputId) as HTMLInputElement | null;
      if (input) input.value = (v[name] as string) || '';
    }
    const sourceInput = document.getElementById('editSource') as HTMLInputElement | null;
    if (sourceInput) sourceInput.value = v.source || '';
  }
}

const openEditor = document.getElementById('openEditor');
if (openEditor) openEditor.onclick = () => editorToggle(true);
const closeEditor = document.getElementById('closeEditor');
if (closeEditor) closeEditor.onclick = () => editorToggle(false);
const saveLocal = document.getElementById('saveLocal');
if (saveLocal) saveLocal.onclick = () => {
  const val: WidgetData = {
    event: (document.getElementById('editEvent') as HTMLInputElement)?.value.trim() || '',
    health: (document.getElementById('editHealth') as HTMLInputElement)?.value.trim() || '',
    economy: (document.getElementById('editEconomy') as HTMLInputElement)?.value.trim() || '',
    source: (document.getElementById('editSource') as HTMLInputElement)?.value.trim() || ''
  };
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(val));
  } catch (_) {
    alert('Não foi possível salvar no navegador; dados permanecerão somente nesta sessão.');
  }
  applyLocal();
  editorToggle(false);
};
const clearLocal = document.getElementById('clearLocal');
if (clearLocal) clearLocal.onclick = () => {
  localStorage.removeItem(LOCAL_KEY);
  applyLocal();
  editorToggle(false);
};

// 5. Clima de Sumaré via Open-Meteo
setupWeather({ cityName: 'Sumaré' });

// 6. Players de Vídeo e Integrações
const scheduler = new Scheduler(playlistData as PlaylistConfig, storiesData as StoryItem[]);
const sideAds = new SideAdController(adsData as AdItem[]);

// Inicia controladores em loops independentes
scheduler.start();
sideAds.start();

// 7. Painel Técnico (QA) & atalhos de teclado
const qaPanel = document.getElementById('qaPanel');
function toggleTechnical() {
  const active = document.body.classList.toggle('technical');
  if (qaPanel) qaPanel.hidden = !active;
}
const btnTest = document.getElementById('test');
if (btnTest) btnTest.onclick = toggleTechnical;
const btnCloseTest = document.getElementById('closeTest');
if (btnCloseTest) btnCloseTest.onclick = () => {
  if (qaPanel) qaPanel.hidden = true;
  document.body.classList.remove('technical');
};

function fullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen?.();
  } else {
    document.exitFullscreen?.();
  }
}
const btnFull = document.getElementById('full');
if (btnFull) btnFull.onclick = fullscreen;

const btnNextNews = document.getElementById('nextNews');
if (btnNextNews) btnNextNews.onclick = () => scheduler.advance();
const btnNextAd = document.getElementById('nextAd');
if (btnNextAd) btnNextAd.onclick = () => sideAds.advance();

// Botão de teste da intro institucional (Tecla I)
function triggerIntroTest() {
  // Localiza item institucional de vídeo e força início
  const items = (playlistData as PlaylistConfig).items.filter(x => x.type === 'video' && x.enabled);
  if (items.length) {
    telemetry.log('teste_intro_iniciado', items[0]);
    scheduler.startItem(items[0]);
  }
}

window.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 'f') fullscreen();
  if (e.key.toLowerCase() === 't') toggleTechnical();
  if (e.key.toLowerCase() === 'i' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName || '')) {
    e.stopImmediatePropagation();
    e.preventDefault();
    triggerIntroTest();
  }
  if (e.key === 'ArrowRight') scheduler.advance();
});
