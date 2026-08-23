import { describe, it, expect } from "vitest";
import { registerSchema, loginSchema } from "@/features/auth/schema";

describe("Auth Validation Schemas", () => {
  describe("registerSchema", () => {
    it("validates correct registration inputs", () => {
      const result = registerSchema.safeParse({
        name: "Budi Santoso",
        email: "budi@example.com",
        password: "securepassword123",
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid emails", () => {
      const result = registerSchema.safeParse({
        name: "Budi",
        email: "not-an-email",
        password: "password123",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.email).toBeDefined();
      }
    });

    it("rejects passwords shorter than 6 characters", () => {
      const result = registerSchema.safeParse({
        name: "Budi",
        email: "budi@example.com",
        password: "123",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.password).toBeDefined();
      }
    });
  });

  describe("loginSchema", () => {
    it("validates correct login inputs", () => {
      const result = loginSchema.safeParse({
        email: "user@example.com",
        password: "anypassword",
      });
      expect(result.success).toBe(true);
    });

    it("rejects empty passwords", () => {
      const result = loginSchema.safeParse({
        email: "user@example.com",
        password: "",
      });
      expect(result.success).toBe(false);
    });
  });
});
