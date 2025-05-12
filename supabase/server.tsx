import { createServerClient } from "@supabase/ssr";
import {
  SupabaseClient,
  createClient as createSupabaseClient,
} from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { Database } from "./types/database.types";

// Environment variables validation
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    "Missing Supabase environment variables. Please check your .env file."
  );
}

// Singleton instances
let supabaseTestClient: SupabaseClient<Database> | null = null;
let supabaseServerClient: SupabaseClient<Database> | null = null;

/**
 * Creates or returns a Supabase client instance based on the environment.
 * Implements a singleton pattern to prevent multiple client instances.
 *
 * @throws {Error} If required environment variables are missing
 * @returns {Promise<SupabaseClient<Database>>} A Supabase client instance
 */
export async function createClient(): Promise<SupabaseClient<Database>> {
  try {
    if (process.env.NODE_ENV === "test") {
      // Return test client singleton
      if (!supabaseTestClient) {
        supabaseTestClient = createSupabaseClient<Database>(
          SUPABASE_URL as string,
          SUPABASE_ANON_KEY as string,
          {
            auth: {
              persistSession: false, // Disable session persistence for tests
            },
          }
        );
      }
      return supabaseTestClient;
    }

    // Return server client singleton
    if (!supabaseServerClient) {
      const cookieStore = await cookies();

      supabaseServerClient = createServerClient<Database>(
        SUPABASE_URL as string,
        SUPABASE_ANON_KEY as string,
        {
          cookies: {
            getAll() {
              return cookieStore.getAll();
            },
            setAll(cookiesToSet) {
              try {
                cookiesToSet.forEach(({ name, value, options }) =>
                  cookieStore.set(name, value, options)
                );
              } catch {
                // Falls `setAll` in einem Server Component aufgerufen wurde, kann das ignoriert werden.
              }
            },
          },
        }
      );
    }
    return supabaseServerClient;
  } catch (error) {
    console.error("Failed to create Supabase client:", error);
    throw new Error("Failed to initialize Supabase client");
  }
}
