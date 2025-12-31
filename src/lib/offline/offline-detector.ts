'use client';

import { syncManager } from './sync-manager';

/**
 * Offline Detector
 * Detects network status changes and triggers sync when connection is restored
 */
export class OfflineDetector {
  private isOnline: boolean = true;
  private listeners: Set<(online: boolean) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      this.isOnline = navigator.onLine;
      this.setupListeners();
    }
  }

  /**
   * Setup event listeners for online/offline events
   */
  private setupListeners(): void {
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
  }

  /**
   * Handle online event
   */
  private handleOnline = async (): Promise<void> => {
    console.log('Connection restored');
    this.isOnline = true;
    this.notifyListeners(true);

    // Trigger sync when connection is restored
    try {
      await syncManager.syncAll();
    } catch (error) {
      console.error('Error during auto-sync:', error);
    }
  };

  /**
   * Handle offline event
   */
  private handleOffline = (): void => {
    console.log('Connection lost');
    this.isOnline = false;
    this.notifyListeners(false);
  };

  /**
   * Notify all registered listeners about connection status change
   */
  private notifyListeners(online: boolean): void {
    this.listeners.forEach(listener => listener(online));
  }

  /**
   * Subscribe to connection status changes
   * @param callback - Function to call when connection status changes
   * @returns Unsubscribe function
   */
  subscribe(callback: (online: boolean) => void): () => void {
    this.listeners.add(callback);

    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * Get current connection status
   */
  get online(): boolean {
    return this.isOnline;
  }

  /**
   * Get current connection status (offline)
   */
  get offline(): boolean {
    return !this.isOnline;
  }

  /**
   * Cleanup event listeners
   */
  destroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('online', this.handleOnline);
      window.removeEventListener('offline', this.handleOffline);
    }
    this.listeners.clear();
  }
}

/**
 * Singleton instance of OfflineDetector
 */
export const offlineDetector = new OfflineDetector();
