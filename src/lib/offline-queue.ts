/**
 * Offline Queue & Auto-Sync Engine for Progressive Web App (PWA)
 * Enables zero-connection transaction logging and seamless background sync.
 */

export interface OfflineTransaction {
  id: string;
  type: "INCOME" | "EXPENSE" | "TRANSFER";
  amount: number;
  date: string;
  description: string;
  accountId: string;
  targetAccountId?: string | null;
  categoryId?: string | null;
  accountName?: string;
  categoryName?: string;
  categoryIcon?: string | null;
  categoryColor?: string | null;
  createdAt: string;
  synced: boolean;
  syncAttempts: number;
  lastError?: string | null;
}

export type OfflineTransactionInput = Omit<
  OfflineTransaction,
  "id" | "createdAt" | "synced" | "syncAttempts" | "lastError"
> & {
  id?: string;
};

export interface SyncResult {
  total: number;
  synced: number;
  failed: number;
  syncedIds: string[];
  failedIds: string[];
  errors: string[];
}

const OFFLINE_QUEUE_KEY = "financetracker_offline_tx_queue";
export const OFFLINE_EVENT_QUEUE_CHANGED = "financetracker:offline-queue-changed";
export const OFFLINE_EVENT_SYNC_COMPLETE = "financetracker:offline-sync-complete";

// In-memory fallback for SSR/Testing environments
let inMemoryQueue: OfflineTransaction[] = [];

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function notifyQueueChange() {
  if (isBrowser()) {
    window.dispatchEvent(new CustomEvent(OFFLINE_EVENT_QUEUE_CHANGED));
  }
}

/**
 * Get all queued offline transactions
 */
export function getOfflineQueue(): OfflineTransaction[] {
  if (!isBrowser()) {
    return inMemoryQueue;
  }

  try {
    const raw = localStorage.getItem(OFFLINE_QUEUE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Failed to read offline queue from localStorage", err);
    return [];
  }
}

/**
 * Save the entire queue
 */
function saveOfflineQueue(queue: OfflineTransaction[]) {
  if (!isBrowser()) {
    inMemoryQueue = queue;
    return;
  }

  try {
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
    notifyQueueChange();
  } catch (err) {
    console.error("Failed to save offline queue to localStorage", err);
  }
}

/**
 * Add a new transaction to the offline queue
 */
export function addOfflineTransaction(
  input: OfflineTransactionInput
): OfflineTransaction {
  const queue = getOfflineQueue();
  const newTx: OfflineTransaction = {
    ...input,
    id: input.id || `offline_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
    synced: false,
    syncAttempts: 0,
  };

  const updatedQueue = [newTx, ...queue];
  saveOfflineQueue(updatedQueue);
  return newTx;
}

/**
 * Remove a specific transaction by ID from the queue
 */
export function removeOfflineTransaction(id: string): boolean {
  const queue = getOfflineQueue();
  const initialLength = queue.length;
  const filtered = queue.filter((item) => item.id !== id);

  if (filtered.length !== initialLength) {
    saveOfflineQueue(filtered);
    return true;
  }
  return false;
}

/**
 * Clear all items from the offline queue
 */
export function clearOfflineQueue() {
  if (!isBrowser()) {
    inMemoryQueue = [];
    return;
  }
  localStorage.removeItem(OFFLINE_QUEUE_KEY);
  notifyQueueChange();
}

/**
 * Get count of pending offline transactions
 */
export function getOfflineQueueCount(): number {
  return getOfflineQueue().filter((item) => !item.synced).length;
}

/**
 * Sync all pending offline transactions with the remote server action
 */
export async function syncOfflineQueue(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createTransactionFn: (tx: any) => Promise<{ success: boolean; message?: string }>
): Promise<SyncResult> {
  const queue = getOfflineQueue();
  const pending = queue.filter((item) => !item.synced);

  const result: SyncResult = {
    total: pending.length,
    synced: 0,
    failed: 0,
    syncedIds: [],
    failedIds: [],
    errors: [],
  };

  if (pending.length === 0) {
    return result;
  }

  const updatedQueue = [...queue];

  for (const item of pending) {
    try {
      const response = await createTransactionFn({
        type: item.type,
        amount: item.amount,
        date: item.date,
        description: item.description,
        accountId: item.accountId,
        targetAccountId: item.targetAccountId || undefined,
        categoryId: item.categoryId || undefined,
      });

      const idx = updatedQueue.findIndex((q) => q.id === item.id);
      if (response && response.success) {
        result.synced += 1;
        result.syncedIds.push(item.id);
        if (idx !== -1) {
          // Remove synced item from queue to keep storage clean
          updatedQueue.splice(idx, 1);
        }
      } else {
        result.failed += 1;
        result.failedIds.push(item.id);
        const errMsg = response?.message || "Gagal sinkronisasi ke server.";
        result.errors.push(`${item.description}: ${errMsg}`);
        if (idx !== -1) {
          updatedQueue[idx] = {
            ...updatedQueue[idx],
            syncAttempts: (updatedQueue[idx].syncAttempts || 0) + 1,
            lastError: errMsg,
          };
        }
      }
    } catch (err: unknown) {
      result.failed += 1;
      result.failedIds.push(item.id);
      const errMsg = err instanceof Error ? err.message : "Kesalahan koneksi jaringan.";
      result.errors.push(`${item.description}: ${errMsg}`);

      const idx = updatedQueue.findIndex((q) => q.id === item.id);
      if (idx !== -1) {
        updatedQueue[idx] = {
          ...updatedQueue[idx],
          syncAttempts: (updatedQueue[idx].syncAttempts || 0) + 1,
          lastError: errMsg,
        };
      }
    }
  }

  saveOfflineQueue(updatedQueue);

  if (isBrowser()) {
    window.dispatchEvent(
      new CustomEvent(OFFLINE_EVENT_SYNC_COMPLETE, { detail: result })
    );
  }

  return result;
}