"use server";

import { createClient } from "@/supabase/server";
import {
  Rating,
  NewRating,
  UpdateRating,
} from "../supabase/types/database.models";
import { Period } from "@/hooks/useDepartmentAnalytics";

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
    const { data, error } = await supabase
      .from("rating")
      .select(
        `
        *,
        department (
          name
        )
      `
      )
      .order("created_at", { ascending: false });

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
  period,
}: {
  department_id: string;
  period?: Period;
}) {
  const supabase = await createClient();

  try {
    // Zeitraum dynamisch bestimmen
    let interval: number;
    switch (period) {
      case "week":
        interval = 7;
        break;
      case "month":
        interval = 30;
        break;
      case "8_weeks":
        interval = 56;
        break;
      default:
        throw new Error("Invalid period");
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - interval);

    // Chunking-Funktion zum Abrufen von Bewertungen
    async function fetchRatings() {
      const ratings = [];
      let from = 0;
      const chunkSize = 1000;

      while (true) {
        const { data, error } = await supabase
          .from("rating")
          .select("*")
          .eq("department_id", department_id)
          .gte("created_at", startDate.toISOString()) // Zeitraumfilter
          .range(from, from + chunkSize - 1); // Chunkweise Abruf

        if (error) throw error;
        if (data.length === 0) break;

        ratings.push(...data);
        from += chunkSize;
      }
      return ratings;
    }

    const data = await fetchRatings();

    return data as Rating[];
  } catch (error) {
    console.error("Error fetching ratings for department:", error);
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
