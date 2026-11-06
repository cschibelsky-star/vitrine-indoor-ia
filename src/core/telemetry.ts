import type { PlaylistItem, TelemetryLogEntry } from '../types';

export const M11_VERSION = 'M1.1 / V4.4';
export const M11_SESSION_KEY = 'vitrine_indoor_m11_session';
export const M11_ACTIVE_KEY = 'vitrine_indoor_m11_active';

class TelemetryService {
  private sessionId: string;
  private records: TelemetryLogEntry[] = [];

  constructor() {
    this.sessionId = this.initSession();
    this.loadRecords();
  }

  private initSession(): string {
    let sid = '';
    try {
      sid = localStorage.getItem(M11_SESSION_KEY) || '';
    } catch (_) {}
    if (!sid) {
      sid = 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
      try {
        localStorage.setItem(M11_SESSION_KEY, sid);
      } catch (_) {}
    }
    return sid;
  }

  private loadRecords() {
    try {
      const raw = localStorage.getItem(M11_ACTIVE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (Array.isArray(data.records)) {
          this.records = data.records;
        }
      }
    } catch (_) {}
  }

  private saveRecords() {
    try {
      const payload = {
        version: M11_VERSION,
        sessionId: this.sessionId,
        updatedAt: new Date().toISOString(),
        records: this.records.slice(-10000) // preserva ate 10k eventos recentes
      };
      localStorage.setItem(M11_ACTIVE_KEY, JSON.stringify(payload));
    } catch (_) {}
  }

  public log(action: string, item: Partial<PlaylistItem> | null = null, extra: Record<string, unknown> = {}) {
    const entry: TelemetryLogEntry = {
      action,
      sessionId: this.sessionId,
      version: M11_VERSION,
      at: new Date().toISOString(),
      itemId: item?.id,
      type: item?.type,
      visible: !document.hidden,
      ...extra
    };

    this.records.push(entry);
    this.saveRecords();
  }

  public getRecords(): TelemetryLogEntry[] {
    return [...this.records];
  }

  public getSessionId(): string {
    return this.sessionId;
  }

  public exportJson(): Blob {
    const payload = {
      version: M11_VERSION,
      sessionId: this.sessionId,
      exportedAt: new Date().toISOString(),
      records: this.records
    };
    return new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  }

  public clear() {
    this.records = [];
    try {
      localStorage.removeItem(M11_ACTIVE_KEY);
    } catch (_) {}
  }
}

export const telemetry = new TelemetryService();
