export class AbortSignal {
  aborted: boolean;
  onabort: (() => void) | null;

  constructor() {
    this.aborted = false;
    this.onabort = null;
  }

  addEventListener(event: string, callback: () => void): void {
    if (event === 'abort') {
      this.onabort = callback;
    }
  }

  removeEventListener(event: string, callback: () => void): void {
    if (event === 'abort' && this.onabort === callback) {
      this.onabort = null;
    }
  }
}

export class AbortController {
  signal: AbortSignal;

  constructor() {
    this.signal = new AbortSignal();
  }

  abort(): void {
    this.signal.aborted = true;
    if (this.signal.onabort) {
      this.signal.onabort();
    }
  }
}

if (typeof globalThis.AbortController === 'undefined') {
  globalThis.AbortController = AbortController as any;
}
