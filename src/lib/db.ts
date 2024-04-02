import { PrismaClient } from "@prisma/client";

/**
 * It says "there might be a global variable called prisma, and it could be either a PrismaClient instance or undefined."
 * This make Prisma avaliable Globally
 */
declare global {
  var prisma: PrismaClient | undefined;
}

//This checks if a prisma variable already exists on the global object (globalThis).
// If it does, it uses that existing instance
// otherwise, it creates a new PrismaClient instance.
export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
import { createClient } from "@supabase/supabase-js";
