import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  addOfflineTransaction,
  getOfflineQueue,
  removeOfflineTransaction,
  clearOfflineQueue,
  getOfflineQueueCount,
  syncOfflineQueue,
} from "@/lib/offline-queue";

describe("Offline Queue & Sync Engine", () => {
  beforeEach(() => {
    clearOfflineQueue();
    vi.restoreAllMocks();
  });

  it("should initialize with an empty queue", () => {
    const queue = getOfflineQueue();
    expect(queue).toEqual([]);
    expect(getOfflineQueueCount()).toBe(0);
  });

  it("should add a transaction to the offline queue with generated metadata", () => {
    const newTx = addOfflineTransaction({
      type: "EXPENSE",
      amount: 75000,
      date: new Date().toISOString(),
      description: "Makan Siang Nasi Padang (Offline)",
      accountId: "acc_wallet_1",
      categoryId: "cat_food_1",
    });

    expect(newTx.id).toBeDefined();
    expect(newTx.id.startsWith("offline_")).toBe(true);
    expect(newTx.synced).toBe(false);
    expect(newTx.syncAttempts).toBe(0);
    expect(newTx.amount).toBe(75000);

    const queue = getOfflineQueue();
    expect(queue.length).toBe(1);
    expect(queue[0].description).toBe("Makan Siang Nasi Padang (Offline)");
    expect(getOfflineQueueCount()).toBe(1);
  });

  it("should remove a specific transaction by id", () => {
    const tx1 = addOfflineTransaction({
      type: "EXPENSE",
      amount: 25000,
      date: new Date().toISOString(),
      description: "Kopi",
      accountId: "acc_1",
    });

    const tx2 = addOfflineTransaction({
      type: "INCOME",
      amount: 500000,
      date: new Date().toISOString(),
      description: "Bonus Project",
      accountId: "acc_1",
    });

    expect(getOfflineQueue().length).toBe(2);

    const removed = removeOfflineTransaction(tx1.id);
    expect(removed).toBe(true);

    const remaining = getOfflineQueue();
    expect(remaining.length).toBe(1);
    expect(remaining[0].id).toBe(tx2.id);
  });

  it("should clear the entire queue", () => {
    addOfflineTransaction({
      type: "EXPENSE",
      amount: 10000,
      date: new Date().toISOString(),
      description: "Parkir",
      accountId: "acc_1",
    });
    addOfflineTransaction({
      type: "EXPENSE",
      amount: 15000,
      date: new Date().toISOString(),
      description: "Bensin",
      accountId: "acc_1",
    });

    expect(getOfflineQueueCount()).toBe(2);
    clearOfflineQueue();
    expect(getOfflineQueueCount()).toBe(0);
    expect(getOfflineQueue()).toEqual([]);
  });

  it("should sync pending transactions successfully and clean queue", async () => {
    addOfflineTransaction({
      type: "EXPENSE",
      amount: 120000,
      date: new Date().toISOString(),
      description: "Belanja Supermarket",
      accountId: "acc_1",
    });

    const mockCreateAction = vi.fn().mockResolvedValue({
      success: true,
      message: "Transaksi berhasil dicatat",
    });

    const result = await syncOfflineQueue(mockCreateAction);

    expect(result.total).toBe(1);
    expect(result.synced).toBe(1);
    expect(result.failed).toBe(0);
    expect(mockCreateAction).toHaveBeenCalledTimes(1);

    // Synced item should be cleared from queue
    expect(getOfflineQueue().length).toBe(0);
  });

  it("should retain items and track failure metadata when sync fails", async () => {
    const item = addOfflineTransaction({
      type: "TRANSFER",
      amount: 300000,
      date: new Date().toISOString(),
      description: "Transfer BCA ke Mandiri",
      accountId: "acc_bca",
      targetAccountId: "acc_mandiri",
    });

    const mockCreateAction = vi.fn().mockResolvedValue({
      success: false,
      message: "Saldo tidak mencukupi di akun sumber",
    });

    const result = await syncOfflineQueue(mockCreateAction);

    expect(result.total).toBe(1);
    expect(result.synced).toBe(0);
    expect(result.failed).toBe(1);
    expect(result.errors.length).toBe(1);

    // Item must still exist in queue with error message
    const queue = getOfflineQueue();
    expect(queue.length).toBe(1);
    expect(queue[0].id).toBe(item.id);
    expect(queue[0].syncAttempts).toBe(1);
    expect(queue[0].lastError).toBe("Saldo tidak mencukupi di akun sumber");
  });
});