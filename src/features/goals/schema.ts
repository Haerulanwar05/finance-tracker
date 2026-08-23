import { z } from "zod";

export const GOAL_COLORS = [
  "#3B82F6", // Blue
  "#10B981", // Emerald
  "#8B5CF6", // Purple
  "#F59E0B", // Amber
  "#EC4899", // Pink
  "#06B6D4", // Cyan
  "#F97316", // Orange
  "#6366F1", // Indigo
  "#14B8A6", // Teal
  "#EF4444", // Red
] as const;

export const GOAL_ICONS = [
  { id: "shield", label: "Dana Darurat", icon: "Shield" },
  { id: "plane", label: "Liburan", icon: "Plane" },
  { id: "home", label: "Rumah / Properti", icon: "Home" },
  { id: "car", label: "Kendaraan", icon: "Car" },
  { id: "laptop", label: "Gadget", icon: "Laptop" },
  { id: "briefcase", label: "Bisnis & Modal", icon: "Briefcase" },
  { id: "graduation", label: "Pendidikan", icon: "GraduationCap" },
  { id: "heart", label: "Keluarga & Pernikahan", icon: "Heart" },
  { id: "piggy", label: "Tabungan Umum", icon: "PiggyBank" },
  { id: "gem", label: "Investasi & Emas", icon: "Gem" },
] as const;

export const createGoalSchema = z.object({
  name: z.string().trim().min(2, "Nama target minimal 2 karakter").max(60, "Nama target maksimal 60 karakter"),
  targetAmount: z.number().positive("Target nominal harus lebih dari 0"),
  linkedAccountId: z.string().optional().nullable(),
  deadline: z.string().optional().nullable(), // YYYY-MM-DD
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Format warna hex tidak valid").default("#3B82F6"),
  icon: z.string().default("piggy"),
});

export const updateGoalSchema = z.object({
  id: z.string().min(1, "ID goal wajib disertakan"),
  name: z.string().trim().min(2, "Nama target minimal 2 karakter").max(60, "Nama target maksimal 60 karakter"),
  targetAmount: z.number().positive("Target nominal harus lebih dari 0"),
  linkedAccountId: z.string().optional().nullable(),
  deadline: z.string().optional().nullable(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Format warna hex tidak valid").default("#3B82F6"),
  icon: z.string().default("piggy"),
  status: z.enum(["ACTIVE", "ACHIEVED", "PAUSED"]).default("ACTIVE"),
});

export const allocateFundsSchema = z.object({
  vaultId: z.string().min(1, "ID target tabungan wajib disertakan"),
  sourceAccountId: z.string().min(1, "Pilih rekening sumber dana"),
  amount: z.number().positive("Nominal alokasi harus lebih dari 0"),
  note: z.string().max(100, "Catatan maksimal 100 karakter").optional(),
});

export const withdrawFundsSchema = z.object({
  vaultId: z.string().min(1, "ID target tabungan wajib disertakan"),
  targetAccountId: z.string().min(1, "Pilih rekening tujuan penarikan"),
  amount: z.number().positive("Nominal penarikan harus lebih dari 0"),
  note: z.string().max(100, "Catatan maksimal 100 karakter").optional(),
});

export type CreateGoalInput = z.infer<typeof createGoalSchema>;
export type UpdateGoalInput = z.infer<typeof updateGoalSchema>;
export type AllocateFundsInput = z.infer<typeof allocateFundsSchema>;
export type WithdrawFundsInput = z.infer<typeof withdrawFundsSchema>;
