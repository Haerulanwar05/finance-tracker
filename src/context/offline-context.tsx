"use client";

import * as React from "react";
import {
  OfflineTransaction,
  OfflineTransactionInput,
  SyncResult,
  getOfflineQueue,
  addOfflineTransaction,
  removeOfflineTransaction,
  clearOfflineQueue,
  syncOfflineQueue,
  OFFLINE_EVENT_QUEUE_CHANGED,
  OFFLINE_EVENT_SYNC_COMPLETE,
} from "@/lib/offline-queue";
import { createTransaction } from "@/features/transactions/actions";
import { useRouter } from "next/navigation";

interface OfflineContextType {
  isOnline: boolean;
  offlineQueue: OfflineTransaction[];
  offlineCount: number;
  isSyncing: boolean;
  syncResult: SyncResult | null;
  syncNow: () => Promise<SyncResult>;
  addOfflineTx: (input: OfflineTransactionInput) => OfflineTransaction;
  removeOfflineTx: (id: string) => boolean;
  clearQueue: () => void;
  dismissSyncResult: () => void;
}

const OfflineContext = React.createContext<OfflineContextType | null>(null);

export function OfflineProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isOnline, setIsOnline] = React.useState<boolean>(true);
  const [offlineQueue, setOfflineQueue] = React.useState<OfflineTransaction[]>([]);
  const [isSyncing, setIsSyncing] = React.useState<boolean>(false);
  const [syncResult, setSyncResult] = React.useState<SyncResult | null>(null);

  // Load initial queue & set online status
  const refreshQueue = React.useCallback(() => {
    setOfflineQueue(getOfflineQueue());
  }, []);

  // Sync execution
  const syncNow = React.useCallback(async (): Promise<SyncResult> => {
    if (isSyncing) {
      return { total: 0, synced: 0, failed: 0, syncedIds: [], failedIds: [], errors: [] };
    }

    setIsSyncing(true);
    try {
      const res = await syncOfflineQueue(createTransaction);
      setSyncResult(res);
      refreshQueue();
      if (res.synced > 0) {
        router.refresh();
      }
      return res;
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing, refreshQueue, router]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    setIsOnline(navigator.onLine);
    refreshQueue();

    const handleOnline = () => {
      setIsOnline(true);
      // Auto-sync pending items when reconnected
      const currentQueue = getOfflineQueue();
      if (currentQueue.length > 0) {
        syncNow();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    const handleQueueChange = () => {
      refreshQueue();
    };

    const handleSyncComplete = (event: Event) => {
      const customEv = event as CustomEvent<SyncResult>;
      if (customEv.detail) {
        setSyncResult(customEv.detail);
      }
      refreshQueue();
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    window.addEventListener(OFFLINE_EVENT_QUEUE_CHANGED, handleQueueChange);
    window.addEventListener(OFFLINE_EVENT_SYNC_COMPLETE, handleSyncComplete);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener(OFFLINE_EVENT_QUEUE_CHANGED, handleQueueChange);
      window.removeEventListener(OFFLINE_EVENT_SYNC_COMPLETE, handleSyncComplete);
    };
  }, [refreshQueue, syncNow]);

  const addOfflineTx = React.useCallback((input: OfflineTransactionInput) => {
    const created = addOfflineTransaction(input);
    refreshQueue();
    return created;
  }, [refreshQueue]);

  const removeOfflineTx = React.useCallback((id: string) => {
    const success = removeOfflineTransaction(id);
    refreshQueue();
    return success;
  }, [refreshQueue]);

  const clearQueue = React.useCallback(() => {
    clearOfflineQueue();
    refreshQueue();
  }, [refreshQueue]);

  const dismissSyncResult = React.useCallback(() => {
    setSyncResult(null);
  }, []);

  const value = React.useMemo(
    () => ({
      isOnline,
      offlineQueue,
      offlineCount: offlineQueue.filter((item) => !item.synced).length,
      isSyncing,
      syncResult,
      syncNow,
      addOfflineTx,
      removeOfflineTx,
      clearQueue,
      dismissSyncResult,
    }),
    [
      isOnline,
      offlineQueue,
      isSyncing,
      syncResult,
      syncNow,
      addOfflineTx,
      removeOfflineTx,
      clearQueue,
      dismissSyncResult,
    ]
  );

  return (
    <OfflineContext.Provider value={value}>
      {children}
    </OfflineContext.Provider>
  );
}

export function useOffline() {
  const ctx = React.useContext(OfflineContext);
  if (!ctx) {
    throw new Error("useOffline must be used within an OfflineProvider");
  }
  return ctx;
}