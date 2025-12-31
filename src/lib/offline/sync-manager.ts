import { cacheService } from './cache-service';
import { createBrowserClient } from '@/lib/supabase/client';

type CachedRecord = {
  id: string;
  _cached_at?: number;
  _pending_sync?: boolean;
  [key: string]: unknown;
};

/**
 * Sync Manager
 * Handles syncing offline mutations back to Supabase when connection is restored
 */
export class SyncManager {
  private supabase = createBrowserClient();
  private isSyncing = false;

  /**
   * Sync all pending operations for a specific table
   * @param table - Table name to sync
   * @returns Number of successfully synced records
   */
  async syncTable(table: string): Promise<number> {
    if (this.isSyncing) {
      console.log(`Sync already in progress for ${table}`);
      return 0;
    }

    this.isSyncing = true;
    let syncedCount = 0;

    try {
      const pendingOps = await cacheService.getPendingOps<CachedRecord>(table);

      for (const record of pendingOps) {
        try {
          // Remove cache metadata before syncing
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { _cached_at, _pending_sync, ...cleanRecord } = record;

          // Upsert to Supabase (insert or update)
          // Using type assertion since table name is dynamic
          const { error } = await this.supabase
            .from(table as never)
            .upsert(cleanRecord as never);

          if (error) {
            console.error(
              `Failed to sync record ${record.id} in ${table}:`,
              error
            );
            continue;
          }

          // Remove pending flag on success
          await cacheService.removePendingFlag(table, record.id);
          syncedCount++;
        } catch (error) {
          console.error(`Error syncing record ${record.id}:`, error);
        }
      }

      console.log(`Synced ${syncedCount} records for ${table}`);
      return syncedCount;
    } catch (error) {
      console.error(`Error during sync for ${table}:`, error);
      return syncedCount;
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Sync all pending operations across all tables
   * @returns Total number of synced records
   */
  async syncAll(): Promise<number> {
    const tables = [
      'budgets',
      'categories',
      'transactions',
      'goals',
      'category_allocations'
    ];

    let totalSynced = 0;

    for (const table of tables) {
      const synced = await this.syncTable(table);
      totalSynced += synced;
    }

    console.log(`Total synced records: ${totalSynced}`);
    return totalSynced;
  }

  /**
   * Check if sync is currently in progress
   */
  get syncing(): boolean {
    return this.isSyncing;
  }
}

/**
 * Singleton instance of SyncManager
 */
export const syncManager = new SyncManager();
