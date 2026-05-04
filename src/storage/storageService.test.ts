import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StorageService } from './storageService';
import type { ProgressData } from './storageService';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    localStorage.clear();
    service = new StorageService();
  });

  describe('loadProgress', () => {
    it('returns initial progress when no data exists', () => {
      const progress = service.loadProgress();
      expect(progress.byType).toEqual({});
      expect(progress.lastUpdated).toBeDefined();
    });

    it('loads valid saved progress data', () => {
      const data: ProgressData = {
        byType: {
          rotation: { totalQuestions: 10, correctAnswers: 7 },
        },
        lastUpdated: '2024-01-15T10:30:00.000Z',
      };
      localStorage.setItem('exam-app-progress', JSON.stringify(data));

      const progress = service.loadProgress();
      expect(progress.byType.rotation.totalQuestions).toBe(10);
      expect(progress.byType.rotation.correctAnswers).toBe(7);
      expect(progress.lastUpdated).toBe('2024-01-15T10:30:00.000Z');
    });

    it('returns initial progress when data is corrupted JSON', () => {
      localStorage.setItem('exam-app-progress', 'not-valid-json{{{');

      const progress = service.loadProgress();
      expect(progress.byType).toEqual({});
    });

    it('returns initial progress when data has invalid structure', () => {
      localStorage.setItem('exam-app-progress', JSON.stringify({ foo: 'bar' }));

      const progress = service.loadProgress();
      expect(progress.byType).toEqual({});
    });

    it('returns initial progress when byType entry has negative values', () => {
      const data = {
        byType: {
          rotation: { totalQuestions: -1, correctAnswers: 0 },
        },
        lastUpdated: '2024-01-15T10:30:00.000Z',
      };
      localStorage.setItem('exam-app-progress', JSON.stringify(data));

      const progress = service.loadProgress();
      expect(progress.byType).toEqual({});
    });

    it('returns initial progress when correctAnswers > totalQuestions', () => {
      const data = {
        byType: {
          rotation: { totalQuestions: 5, correctAnswers: 10 },
        },
        lastUpdated: '2024-01-15T10:30:00.000Z',
      };
      localStorage.setItem('exam-app-progress', JSON.stringify(data));

      const progress = service.loadProgress();
      expect(progress.byType).toEqual({});
    });
  });

  describe('saveProgress', () => {
    it('saves progress data and returns true', () => {
      const data: ProgressData = {
        byType: {
          rotation: { totalQuestions: 5, correctAnswers: 3 },
        },
        lastUpdated: new Date().toISOString(),
      };

      const result = service.saveProgress(data);
      expect(result).toBe(true);

      const stored = localStorage.getItem('exam-app-progress');
      expect(stored).not.toBeNull();
      expect(JSON.parse(stored!)).toEqual(data);
    });

    it('returns false when localStorage throws', () => {
      const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new DOMException('QuotaExceededError');
      });

      const data: ProgressData = {
        byType: {},
        lastUpdated: new Date().toISOString(),
      };

      const result = service.saveProgress(data);
      expect(result).toBe(false);

      spy.mockRestore();
    });
  });

  describe('recordAnswer', () => {
    it('records a correct answer for a new type', () => {
      service.recordAnswer('rotation', true);

      const progress = service.loadProgress();
      expect(progress.byType.rotation.totalQuestions).toBe(1);
      expect(progress.byType.rotation.correctAnswers).toBe(1);
    });

    it('records an incorrect answer for a new type', () => {
      service.recordAnswer('rotation', false);

      const progress = service.loadProgress();
      expect(progress.byType.rotation.totalQuestions).toBe(1);
      expect(progress.byType.rotation.correctAnswers).toBe(0);
    });

    it('accumulates answers for the same type', () => {
      service.recordAnswer('rotation', true);
      service.recordAnswer('rotation', false);
      service.recordAnswer('rotation', true);

      const progress = service.loadProgress();
      expect(progress.byType.rotation.totalQuestions).toBe(3);
      expect(progress.byType.rotation.correctAnswers).toBe(2);
    });

    it('records answers for multiple types independently', () => {
      service.recordAnswer('rotation', true);
      service.recordAnswer('counting', false);

      const progress = service.loadProgress();
      expect(progress.byType.rotation.totalQuestions).toBe(1);
      expect(progress.byType.rotation.correctAnswers).toBe(1);
      expect(progress.byType.counting.totalQuestions).toBe(1);
      expect(progress.byType.counting.correctAnswers).toBe(0);
    });

    it('records startedAt only on the first answer', () => {
      service.recordAnswer('rotation', true);
      const first = service.loadProgress();
      expect(first.startedAt).toBeDefined();
      const firstStartedAt = first.startedAt;

      // Second answer should not overwrite startedAt
      service.recordAnswer('rotation', false);
      const second = service.loadProgress();
      expect(second.startedAt).toBe(firstStartedAt);
    });

    it('updates dailyRecords for the current day', () => {
      service.recordAnswer('rotation', true);
      const progress1 = service.loadProgress();
      expect(progress1.dailyRecords).toBeDefined();
      expect(progress1.dailyRecords!.length).toBe(1);

      const today = new Date().toISOString().slice(0, 10);
      expect(progress1.dailyRecords![0].date).toBe(today);
      expect(progress1.dailyRecords![0].totalQuestions).toBe(1);
      expect(progress1.dailyRecords![0].correctAnswers).toBe(1);

      // Second answer on the same day should accumulate
      service.recordAnswer('rotation', false);
      const progress2 = service.loadProgress();
      expect(progress2.dailyRecords!.length).toBe(1);
      expect(progress2.dailyRecords![0].totalQuestions).toBe(2);
      expect(progress2.dailyRecords![0].correctAnswers).toBe(1);
    });
  });

  describe('getTotalProgress', () => {
    it('returns zeros for empty progress', () => {
      const data: ProgressData = {
        byType: {},
        lastUpdated: new Date().toISOString(),
      };

      const total = service.getTotalProgress(data);
      expect(total.totalQuestions).toBe(0);
      expect(total.correctAnswers).toBe(0);
    });

    it('sums across all types', () => {
      const data: ProgressData = {
        byType: {
          rotation: { totalQuestions: 10, correctAnswers: 7 },
          counting: { totalQuestions: 5, correctAnswers: 4 },
        },
        lastUpdated: new Date().toISOString(),
      };

      const total = service.getTotalProgress(data);
      expect(total.totalQuestions).toBe(15);
      expect(total.correctAnswers).toBe(11);
    });
  });

  describe('resetProgress', () => {
    it('clears stored progress data', () => {
      service.recordAnswer('rotation', true);
      service.resetProgress();

      const progress = service.loadProgress();
      expect(progress.byType).toEqual({});
    });

    it('returns true on success', () => {
      expect(service.resetProgress()).toBe(true);
    });

    it('clears startedAt and dailyRecords after reset', () => {
      service.recordAnswer('rotation', true);
      const before = service.loadProgress();
      expect(before.startedAt).toBeDefined();
      expect(before.dailyRecords).toBeDefined();

      service.resetProgress();
      const after = service.loadProgress();
      expect(after.startedAt).toBeUndefined();
      expect(after.dailyRecords).toBeUndefined();
    });
  });

  describe('error handling - localStorage unavailable', () => {
    it('loadProgress returns initial state when localStorage.getItem throws', () => {
      const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('localStorage not available');
      });

      const progress = service.loadProgress();
      expect(progress.byType).toEqual({});

      spy.mockRestore();
    });

    it('recordAnswer returns false when localStorage is fully unavailable', () => {
      const getSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('localStorage not available');
      });
      const setSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('localStorage not available');
      });

      const result = service.recordAnswer('rotation', true);
      expect(result).toBe(false);

      getSpy.mockRestore();
      setSpy.mockRestore();
    });

    it('resetProgress returns false when localStorage.removeItem throws', () => {
      const spy = vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
        throw new Error('localStorage not available');
      });

      const result = service.resetProgress();
      expect(result).toBe(false);

      spy.mockRestore();
    });
  });
});
