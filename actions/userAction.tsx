"use server";

import { createClient } from "@/supabase/server";
import { QueryData } from "@supabase/supabase-js";

export async function getUserAction() {
  const supabase = await createClient();

  try {
    const userDataQuery = supabase.from("user").select();
    const { data, error } = await userDataQuery;

    if (error) throw error;

    type UserData = QueryData<typeof userDataQuery>;
    const users: UserData = data;

    return users;
  } catch (error) {
    throw error;
  }
}
