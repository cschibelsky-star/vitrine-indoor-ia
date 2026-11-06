import type { AdItem } from '../types';
import { telemetry } from './telemetry';

export const SIDE_AD_MS = 18000; // 18 segundos de exibicao fixa

interface SideAdState {
  index: number;
  active: { id: string; started: number } | null;
  deadline: number;
  token: number;
}

export class SideAdController {
  private state: SideAdState = {
    index: -1,
    active: null,
    deadline: 0,
    token: 0
  };
  private ads: AdItem[];
  private timer: number | null = null;

  constructor(ads: AdItem[]) {
    this.ads = ads.length ? ads : [
      { title: 'SUA MARCA EM\nDESTAQUE AQUI', text: 'Publicidade digital nos estabelecimentos.' },
      { title: 'ANUNCIE SEU\nNEGÓCIO', text: 'Campanhas locais com programação por tela.' }
    ];
  }

  public start() {
    this.tick();
    this.timer = window.setInterval(() => this.tick(), 250);
  }

  public stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private close(now: number, reason: string) {
    const old = this.state.active;
    if (!old) return;
    const elapsed = now - old.started;
    telemetry.log('anuncio_lateral_concluido', { id: old.id, type: 'side_ad' }, {
      reason,
      elapsedMs: elapsed,
      scheduledMs: SIDE_AD_MS,
      driftMs: elapsed - SIDE_AD_MS
    });
    this.state.active = null;
  }

  public advance(now: number = Date.now()) {
    if (this.state.active) {
      const drift = now - this.state.deadline;
      if (drift > 1200) {
        telemetry.log('atraso_lateral_detectado', { id: this.state.active.id, type: 'side_ad' }, {
          driftMs: drift,
          janelaOculta: document.hidden
        });
      }
      this.close(now, drift > 1200 ? 'temporizador_atrasado' : 'completed');
    }

    this.state.index = (this.state.index + 1) % this.ads.length;
    const item = this.ads[this.state.index];
    const itemId = `lateral-${this.state.index + 1}`;
    const token = ++this.state.token;

    const adBox = document.getElementById('ad');
    if (adBox) {
      adBox.classList.add('lateral-fade');
    }

    const commit = () => {
      if (token !== this.state.token) return;
      const titleEl = document.getElementById('adtitle');
      const descEl = document.getElementById('addesc');
      const qaAdEl = document.getElementById('qaAd');

      if (titleEl) titleEl.textContent = item.title;
      if (descEl) descEl.textContent = item.text;
      if (adBox) {
        adBox.classList.remove('hidden');
        adBox.classList.remove('lateral-fade');
      }
      if (qaAdEl) qaAdEl.textContent = `Publicidade lateral: ${itemId} / 18s`;
    };

    if (this.state.index === 0 && this.state.deadline === 0) {
      commit();
    } else {
      setTimeout(commit, 660);
    }

    this.state.active = { id: itemId, started: now };
    this.state.deadline = now + SIDE_AD_MS;
    telemetry.log('anuncio_lateral_iniciado', { id: itemId, type: 'side_ad' }, {
      scheduledMs: SIDE_AD_MS,
      area: 'lateral',
      visible: !document.hidden
    });
  }

  public tick() {
    const now = Date.now();
    if (!this.state.active || now >= this.state.deadline) {
      this.advance(now);
    }
  }
}
