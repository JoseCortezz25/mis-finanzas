import { openDB, type IDBPDatabase } from 'idb';

/**
 * IndexedDB database name and version
 */
const DB_NAME = 'misfinanzas_cache_v1';
const DB_VERSION = 1;

/**
 * Cached record interface
 * All records stored in IndexedDB include cache metadata
 */
export interface CachedRecord {
  _cached_at: number; // Timestamp when cached
  _pending_sync: boolean; // True if offline mutation pending
}

/**
 * Initialize IndexedDB cache database
 * Creates object stores for all Supabase tables
 */
export async function initCacheDB(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create budgets store
      if (!db.objectStoreNames.contains('budgets')) {
        const budgets = db.createObjectStore('budgets', { keyPath: 'id' });
        budgets.createIndex('user_id', 'user_id');
        budgets.createIndex('_pending_sync', '_pending_sync');
        budgets.createIndex('user_month_year', ['user_id', 'month', 'year'], {
          unique: false
        });
      }

      // Create categories store
      if (!db.objectStoreNames.contains('categories')) {
        const categories = db.createObjectStore('categories', {
          keyPath: 'id'
        });
        categories.createIndex('user_id', 'user_id');
        categories.createIndex('_pending_sync', '_pending_sync');
        categories.createIndex('is_custom', 'is_custom');
      }

      // Create transactions store
      if (!db.objectStoreNames.contains('transactions')) {
        const transactions = db.createObjectStore('transactions', {
          keyPath: 'id'
        });
        transactions.createIndex('user_id', 'user_id');
        transactions.createIndex('_pending_sync', '_pending_sync');
        transactions.createIndex('budget_id', 'budget_id');
        transactions.createIndex('category_id', 'category_id');
        transactions.createIndex('date', 'date');
        transactions.createIndex('type', 'type');
        transactions.createIndex('user_date', ['user_id', 'date']);
      }

      // Create goals store
      if (!db.objectStoreNames.contains('goals')) {
        const goals = db.createObjectStore('goals', { keyPath: 'id' });
        goals.createIndex('user_id', 'user_id');
        goals.createIndex('_pending_sync', '_pending_sync');
        goals.createIndex('status', 'status');
      }

      // Create category_allocations store
      if (!db.objectStoreNames.contains('category_allocations')) {
        const allocations = db.createObjectStore('category_allocations', {
          keyPath: 'id'
        });
        allocations.createIndex('budget_id', 'budget_id');
        allocations.createIndex('category_id', 'category_id');
        allocations.createIndex('_pending_sync', '_pending_sync');
      }
    }
  });
}

/**
 * Clear all data from IndexedDB cache
 * Useful for logout or data reset
 */
export async function clearCacheDB(): Promise<void> {
  const db = await initCacheDB();
  const stores = [
    'budgets',
    'categories',
    'transactions',
    'goals',
    'category_allocations'
  ];

  for (const storeName of stores) {
    const tx = db.transaction(storeName, 'readwrite');
    await tx.objectStore(storeName).clear();
    await tx.done;
  }
}
