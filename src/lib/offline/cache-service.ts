import { initCacheDB } from './database';

/**
 * Cache Service
 * Handles caching and retrieval of data from IndexedDB
 */
export class CacheService {
  /**
   * Cache a single record in IndexedDB
   * @param table - Table name
   * @param record - Record to cache
   */
  async cacheRecord<T>(table: string, record: T): Promise<void> {
    const db = await initCacheDB();
    const tx = db.transaction(table, 'readwrite');
    const store = tx.objectStore(table);

    const cached = {
      ...record,
      _cached_at: Date.now(),
      _pending_sync: false
    };

    await store.put(cached);
    await tx.done;
  }

  /**
   * Cache multiple records in IndexedDB
   * @param table - Table name
   * @param records - Records to cache
   */
  async cacheRecords<T>(table: string, records: T[]): Promise<void> {
    const db = await initCacheDB();
    const tx = db.transaction(table, 'readwrite');
    const store = tx.objectStore(table);

    for (const record of records) {
      const cached = {
        ...record,
        _cached_at: Date.now(),
        _pending_sync: false
      };
      await store.put(cached);
    }

    await tx.done;
  }

  /**
   * Read all records from cache for a user
   * @param table - Table name
   * @param userId - User ID
   * @returns Array of cached records
   */
  async readFromCache<T>(table: string, userId: string): Promise<T[]> {
    const db = await initCacheDB();
    const tx = db.transaction(table, 'readonly');
    const store = tx.objectStore(table);
    const index = store.index('user_id');

    const records = await index.getAll(userId);

    // Filter out pending sync records (they haven't been confirmed by server)
    type CachedRecord = T & { _pending_sync?: boolean };
    return records.filter((r: CachedRecord) => !r._pending_sync) as T[];
  }

  /**
   * Read a single record from cache
   * @param table - Table name
   * @param id - Record ID
   * @returns Cached record or null
   */
  async readRecordFromCache<T>(table: string, id: string): Promise<T | null> {
    const db = await initCacheDB();
    const tx = db.transaction(table, 'readonly');
    const store = tx.objectStore(table);

    const record = await store.get(id);

    return record ? (record as T) : null;
  }

  /**
   * Write a pending operation to cache (offline mutation)
   * @param table - Table name
   * @param record - Record to write
   */
  async writePending<T>(table: string, record: T): Promise<void> {
    const db = await initCacheDB();
    const tx = db.transaction(table, 'readwrite');
    const store = tx.objectStore(table);

    const pending = {
      ...record,
      _cached_at: Date.now(),
      _pending_sync: true
    };

    await store.put(pending);
    await tx.done;
  }

  /**
   * Get all pending operations from cache
   * @param table - Table name
   * @returns Array of pending records
   */
  async getPendingOps<T>(table: string): Promise<T[]> {
    const db = await initCacheDB();
    const tx = db.transaction(table, 'readonly');
    const store = tx.objectStore(table);
    const index = store.index('_pending_sync');

    const records = await index.getAll(true as unknown as IDBKeyRange);

    return records as unknown as T[];
  }

  /**
   * Remove pending sync flag from a record
   * @param table - Table name
   * @param id - Record ID
   */
  async removePendingFlag(table: string, id: string): Promise<void> {
    const db = await initCacheDB();
    const tx = db.transaction(table, 'readwrite');
    const store = tx.objectStore(table);

    const record = await store.get(id);
    if (record) {
      record._pending_sync = false;
      await store.put(record);
    }

    await tx.done;
  }

  /**
   * Delete a record from cache
   * @param table - Table name
   * @param id - Record ID
   */
  async deleteFromCache(table: string, id: string): Promise<void> {
    const db = await initCacheDB();
    const tx = db.transaction(table, 'readwrite');
    const store = tx.objectStore(table);

    await store.delete(id);
    await tx.done;
  }

  /**
   * Clear all cache for a specific table
   * @param table - Table name
   */
  async clearTableCache(table: string): Promise<void> {
    const db = await initCacheDB();
    const tx = db.transaction(table, 'readwrite');
    const store = tx.objectStore(table);

    await store.clear();
    await tx.done;
  }
}

/**
 * Singleton instance of CacheService
 */
export const cacheService = new CacheService();
