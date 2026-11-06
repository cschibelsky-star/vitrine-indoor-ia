import type { PlaylistConfig, PlaylistItem, StoryItem } from '../types';
import { telemetry } from './telemetry';

interface ActiveItem {
  item: PlaylistItem;
  startedAt: Date;
}

export class Scheduler {
  private config: PlaylistConfig;
  private stories: StoryItem[];
  private active: ActiveItem | null = null;
  private position = -1;
  private nextAt = 0;
  private timer: number | null = null;
  private fadeTicket = 0;

  constructor(config: PlaylistConfig, stories: StoryItem[]) {
    this.config = config;
    this.stories = stories;
  }

  public start() {
    this.tick();
    this.timer = window.setInterval(() => this.tick(), 500);
  }

  public stop() {
    if (this.timer) clearInterval(this.timer);
  }

  private eligible(item: PlaylistItem): boolean {
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const toMin = (t: string) => {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m;
    };
    return !!item.enabled && nowMinutes >= toMin(item.from || '00:00') && nowMinutes <= toMin(item.until || '23:59');
  }

  private fadeSwap(render: () => void) {
    const ticket = ++this.fadeTicket;
    const box = document.getElementById('news');
    if (!box) {
      render();
      return;
    }
    box.classList.add('indoor-fading');
    setTimeout(() => {
      if (ticket !== this.fadeTicket) return;
      try {
        render();
      } finally {
        requestAnimationFrame(() => box.classList.remove('indoor-fading'));
      }
    }, 470);
  }

  public startItem(item: PlaylistItem, now = Date.now()) {
    this.active = { item, startedAt: new Date() };
    this.nextAt = now + (item.duration * 1000);

    telemetry.log('conteudo_iniciado', item, {
      scheduledMs: item.duration * 1000,
      visible: !document.hidden
    });

    const newsBox = document.getElementById('news');
    if (item.type === 'video') {
      const vid = document.getElementById('indoorInstitutional') as HTMLVideoElement | null;
      if (newsBox) newsBox.classList.add('playing');
      if (vid) {
        vid.currentTime = 0;
        vid.play().catch(() => {
          telemetry.log('midia_falhou', item, { reason: 'autoplay_blocked' });
          const fallback = document.getElementById('indoorFallback');
          if (fallback) fallback.style.display = 'flex';
        });
      }
      return;
    }

    if (newsBox) newsBox.classList.remove('playing');

    this.fadeSwap(() => {
      const st = this.stories[item.imageIndex ?? 0];
      if (!st) return;

      const tagEl = document.getElementById('tag');
      const titleEl = document.getElementById('headline');
      const descEl = document.getElementById('summary');
      const imgEl = document.getElementById('newsImg') as HTMLImageElement | null;
      const qaEl = document.getElementById('qaNews');

      if (imgEl) imgEl.src = st.img;
      if (tagEl) tagEl.textContent = st.tag;
      if (titleEl) titleEl.textContent = st.title;
      if (descEl) descEl.textContent = st.text;
      if (newsBox) newsBox.classList.remove('hidden');
      if (qaEl) qaEl.textContent = `${st.tag}: ${st.title}`;
    });
  }

  private close(reason = 'completed', now = Date.now()) {
    const cur = this.active;
    if (!cur) return;
    const elapsed = now - cur.startedAt.getTime();
    telemetry.log('conteudo_concluido', cur.item, {
      reason,
      elapsedMs: elapsed,
      scheduledMs: cur.item.duration * 1000,
      driftMs: elapsed - (cur.item.duration * 1000)
    });
    this.active = null;
  }

  public advance() {
    const now = Date.now();
    this.close('advanced', now);

    const items = this.config.items.filter(x => x.enabled && this.eligible(x));
    if (!items.length) return;

    this.position = (this.position + 1) % items.length;
    this.startItem(items[this.position], now);
  }

  public tick() {
    const now = Date.now();
    if (!this.active || now >= this.nextAt) {
      this.advance();
    }
  }
}
