"use server";

import { createClient } from "@/supabase/server";
import {
  Rating,
  NewRating,
  UpdateRating,
} from "../supabase/types/database.models";

export async function getRatingAction({ rating_id }: { rating_id: string }) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("rating")
      .select("*")
      .eq("id", rating_id)
      .single();

    if (error) throw error;

    return data as Rating;
  } catch (error) {
    throw error;
  }
}

export async function getAllRatingsAction() {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase.from("rating").select(`
        *,
        department (
          name
        )
      `);

    if (error) throw error;
    return data as (Rating & {
      department: { name: string | null };
    })[];
  } catch (error) {
    throw error;
  }
}

export async function getRatingsForDepartmentAction({
  department_id,
}: {
  department_id: string;
}) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("rating")
      .select("*")
      .eq("department_id", department_id);

    if (error) throw error;

    return data as Rating[];
  } catch (error) {
    throw error;
  }
}

export async function createRatingAction(newRating: NewRating) {
  const supabase = await createClient();

  try {
    const { error } = await supabase.from("rating").insert(newRating);
    if (error) throw error;
    return { success: true };
  } catch (error) {
    throw error;
  }
}

export async function updateRatingAction(
  rating_id: string,
  updates: UpdateRating
) {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from("rating")
      .update(updates)
      .eq("id", rating_id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    throw error;
  }
}

export async function deleteRatingAction(rating_id: string) {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from("rating")
      .delete()
      .eq("id", rating_id);
    if (error) throw error;
    return { success: true };
  } catch (error) {
    throw error;
  }
}
