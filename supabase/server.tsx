import { createServerClient } from "@supabase/ssr";
import {
  SupabaseClient,
  createClient as createSupabaseClient,
} from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { Database } from "./types/database.types";

// Singleton-Variablen für Supabase-Instanzen
let supabaseTestClient: SupabaseClient<Database> | null = null;
let supabaseServerClient: SupabaseClient<Database> | null = null;

export async function createClient(): Promise<SupabaseClient<Database>> {
  if (process.env.NODE_ENV === "test") {
    // Singleton für Tests
    if (!supabaseTestClient) {
      supabaseTestClient = createSupabaseClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
    }
    return supabaseTestClient;
  }

  // Singleton für Server-Umgebung
  if (!supabaseServerClient) {
    const cookieStore = await cookies();
    supabaseServerClient = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
}
