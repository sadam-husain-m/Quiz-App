import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Audio API for tests
class MockAudio {
  src = '';
  volume = 1;
  loop = false;
  paused = true;
  currentTime = 0;

  constructor(src?: string) {
    if (src) this.src = src;
  }

  play() {
    this.paused = false;
    return Promise.resolve();
  }

  pause() {
    this.paused = true;
  }

  load() {}
}

global.Audio = MockAudio as any;

// Mock window.setInterval and clearInterval
vi.stubGlobal('setInterval', vi.fn((fn: Function, ms: number) => {
  return 1;
}));

vi.stubGlobal('clearInterval', vi.fn());

