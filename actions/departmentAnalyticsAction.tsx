"use server";
import { createClient } from "@/supabase/server";

export async function getAverageStressPerDepartment() {
  const supabase = await createClient();

  try {
    // Abrufen aller Abteilungen
    const { data: departments, error: departmentError } = await supabase
      .from("department")
      .select("id, name");

    if (departmentError) throw departmentError;

    const averageStressPerDepartment = await Promise.all(
      departments.map(async (department) => {
        const { data: stressData, error: stressError } = await supabase
          .from("stress")
          .select("stress")
          .eq("department_id", department.id);

        if (stressError) throw stressError;

        // Filtere nur gültige Stresswerte (keine Nullwerte)
        const validStressValues = stressData
          .filter((item) => item.stress !== null)
          .map((item) => item.stress as number);

        if (validStressValues.length === 0) {
          return {
            department_name: department.name,
            average_stress: 0,
          };
        }

        // Durchschnitt berechnen
        const averageStress =
          validStressValues.reduce((sum, value) => sum + value, 0) /
          validStressValues.length;

        return {
          department_name: department.name,
          average_stress: parseFloat(averageStress.toFixed(2)), // auf 2 Nachkommastellen runden
        };
      })
    );

    return averageStressPerDepartment;
  } catch (error) {
    console.error("Error fetching average stress per department:", error);
    throw error;
  }
}

export async function getStressChangesOverTime(
  period: "week" | "month" | "8_weeks"
) {
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
    // Abrufen aller Stresswerte innerhalb des Zeitraums
    const { data, error } = await supabase
      .from("stress")
      .select("created_at, stress, department_id, department(name)")
      .gte("created_at", startDate.toISOString());

    if (error) throw error;

    // Gruppierung der Daten nach Abteilung und Datum
    const departmentMap: {
      [key: string]: { [date: string]: number[] };
    } = {};

    data?.forEach((item) => {
      const departmentName = item.department?.name ?? "Unknown";
      const period = item.created_at?.slice(0, 10); // Nur Datumsteil
      const stress = item.stress ?? 0;

      // Initialisiere die Abteilung, falls nicht vorhanden
      if (!departmentMap[departmentName]) {
        departmentMap[departmentName] = {};
      }

      // Initialisiere das Datum innerhalb der Abteilung, falls nicht vorhanden
      if (!departmentMap[departmentName][period]) {
        departmentMap[departmentName][period] = [];
      }

      // Füge den Stresswert zum entsprechenden Datum hinzu
      departmentMap[departmentName][period].push(stress);
    });
    // console.log(departmentMap);

    // Formatierung der Ergebnisse mit Durchschnittsberechnung pro Tag
    const formattedData = Object.keys(departmentMap).map((departmentName) => {
      // Erzeuge eine Liste aller Tage im Zeitraum, um fehlende Tage aufzufüllen
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - interval);
      const today = new Date();

      const dateList: string[] = [];
      const currentDate = new Date(startDate);

      while (currentDate <= today) {
        dateList.push(currentDate.toISOString().slice(0, 10));
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Verarbeite die Stresswerte für jedes Datum in der Periode
      const stressValues = dateList.map((date) => {
        const dailyStressValues = departmentMap[departmentName][date] || [];

        // Durchschnitt berechnen, auch wenn keine Werte vorliegen
        const avg_stress =
          dailyStressValues.length > 0
            ? dailyStressValues.reduce((sum, value) => sum + value, 0) /
              dailyStressValues.length
            : 0;

        return {
          period: date,
          avg_stress: parseFloat(avg_stress.toFixed(2)), // Auf 2 Nachkommastellen runden
        };
      });

      // Sortiere die Stresswerte nach Datum (sicherstellen, dass die Reihenfolge korrekt ist)
      stressValues.sort(
        (a, b) => new Date(a.period).getTime() - new Date(b.period).getTime()
      );

      return {
        department_name: departmentName,
        stress_values: stressValues,
      };
    });

    return formattedData;
  } catch (error) {
    console.error("Error fetching stress changes over time:", error);
    throw error;
  }
}

export async function getHighStressDepartments() {
  const supabase = await createClient();

  try {
    // Abrufen aller Abteilungen
    const { data: departments, error: departmentError } = await supabase
      .from("department")
      .select("id, name");

    if (departmentError) throw departmentError;

    const highStressDepartments = await Promise.all(
      departments.map(async (department) => {
        // Durchschnittlicher Stresswert abrufen
        const { data: stressData, error: stressError } = await supabase
          .from("stress")
          .select("stress")
          .eq("department_id", department.id);

        if (stressError) throw stressError;

        // Filtere nur gültige Stresswerte (keine Nullwerte)
        const validStressValues = stressData
          .filter((item) => item.stress !== null)
          .map((item) => item.stress as number);

        if (validStressValues.length === 0) {
          return null;
        }

        const averageStress =
          validStressValues.reduce((sum, value) => sum + value, 0) /
          validStressValues.length;

        // Negative Bewertungen abrufen
        const { data: negativeReviews, error: reviewError } = await supabase
          .from("rating")
          .select("id")
          .eq("department_id", department.id)
          .lte("rating", 2);

        if (reviewError) throw reviewError;

        if (averageStress >= 8 || (negativeReviews?.length ?? 0) > 5) {
          return {
            department_name: department.name,
            avg_stress: parseFloat(averageStress.toFixed(2)),
            negative_reviews: negativeReviews.length || 0,
          };
        }

        return null;
      })
    );

    // Nur die relevanten Abteilungen zurückgeben
    return highStressDepartments.filter((dept) => dept !== null);
  } catch (error) {
    console.error("Error fetching high stress departments:", error);
    throw error;
  }
}
