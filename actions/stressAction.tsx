"use server";

import { createClient } from "@/supabase/server";
import {
  Stress,
  NewStress,
  UpdateStress,
} from "../supabase/types/database.models";
import { getUserByToken } from "./authAction";

export async function getStressAction({ stress_id }: { stress_id: string }) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("stress")
      .select("*")
      .eq("id", stress_id)
      .single();

    if (error) throw error;

    return data as Stress;
  } catch (error) {
    throw error;
  }
}

export async function getAllStressEntriesAction() {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase.from("stress").select("*");
    if (error) throw error;
    return data as Stress[];
  } catch (error) {
    throw error;
  }
}

export async function getStressForUserAction({ user_id }: { user_id: string }) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("stress")
      .select("*")
      .eq("user_id", user_id);

    if (error) throw error;

    return data as Stress[];
  } catch (error) {
    throw error;
  }
}

export async function getTodayStressForUserAction() {
  const supabase = await createClient();

  try {
    const user = await getUserByToken();

    if (!user) {
      throw {
        name: "stress",
        message: "User not loggeed in",
        statusCode: 500,
      };
    }
    // Heutiges Datum berechnen
    const today = new Date().toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("stress")
      .select()
      .eq("user_id", user.id)
      .gte("created_at", `${today}T00:00:00.000Z`) // Start des Tages
      .lt("created_at", `${today}T23:59:59.999Z`) // Ende des Tages
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Fehler beim Laden des neuesten Eintrags:", error.message);
    } else if (!data) {
      console.log("Kein Eintrag für heute gefunden.");
    } else {
      console.log("Neuester Eintrag von heute:", data);
    }

    if (error) throw error;

    return data;
  } catch (error) {
    throw error;
  }
}

getTodayStressForUserAction;

export async function getStressForDepartmentAction({
  department_id,
}: {
  department_id: string;
}) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("stress")
      .select("*")
      .eq("department_id", department_id);

    if (error) throw error;

    return data as Stress[];
  } catch (error) {
    throw error;
  }
}

export async function createStressAction({
  newStress,
}: {
  newStress: NewStress;
}) {
  const supabase = await createClient();
  const user = await getUserByToken();

  newStress = {
    ...newStress,
    user_id: user?.id,
  } as NewStress;

  try {
    const { data, error } = await supabase
      .from("stress")
      .insert(newStress)
      .select()
      .single();
    if (error) throw error;
    return data as Stress;
  } catch (error) {
    throw error;
  }
}

export async function updateStressAction(
  stress_id: string,
  updates: UpdateStress
) {
  const supabase = await createClient();

  updates = {
    ...updates,
  } as NewStress;

  try {
    const { error } = await supabase
      .from("stress")
      .update(updates)
      .eq("id", stress_id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    throw error;
  }
}

export async function deleteStressAction(stress_id: string) {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from("stress")
      .delete()
      .eq("id", stress_id);
    if (error) throw error;
    return { success: true };
  } catch (error) {
    throw error;
  }
}
