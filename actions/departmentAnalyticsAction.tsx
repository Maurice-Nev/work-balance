"use server";
import { createClient } from "@/supabase/server";

export async function getAverageStressPerDepartment(
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

    // Chunking-Funktion zum Abrufen von Abteilungen
    async function fetchAllDepartments() {
      const departments = [];
      let from = 0;
      const chunkSize = 1000;

      while (true) {
        const { data, error } = await supabase
          .from("department")
          .select("id, name")
          .range(from, from + chunkSize - 1);

        if (error) throw error;
        if (data.length === 0) break;

        departments.push(...data);
        from += chunkSize;
      }
      return departments;
    }

    const departments = await fetchAllDepartments();

    const averageStressPerDepartment = await Promise.all(
      departments.map(async (department) => {
        // Chunking-Funktion zum Abrufen von Stresswerten
        async function fetchStressData() {
          const stressValues = [];
          let from = 0;
          const chunkSize = 1000;

          while (true) {
            const { data, error } = await supabase
              .from("stress")
              .select("stress")
              .eq("department_id", department.id)
              .gte("created_at", startDate.toISOString()) // Zeitraumfilter
              .range(from, from + chunkSize - 1);

            if (error) throw error;
            if (data.length === 0) break;

            stressValues.push(...data);
            from += chunkSize;
          }
          return stressValues;
        }

        const stressData = await fetchStressData();

        // Filtere nur gültige Stresswerte (keine Nullwerte)
        const validStressValues = stressData
          .filter((item) => item.stress !== null && item.stress !== undefined)
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

    // Chunking-Funktion zum Abrufen von Stresswerten
    async function fetchStressData() {
      const stressData = [];
      let from = 0;
      const chunkSize = 1000;

      while (true) {
        const { data, error } = await supabase
          .from("stress")
          .select("created_at, stress, department_id, department(name)")
          .gte("created_at", startDate.toISOString())
          .range(from, from + chunkSize - 1); // Chunkweise Abruf

        if (error) throw error;
        if (data.length === 0) break;

        stressData.push(...data);
        from += chunkSize;
      }
      return stressData;
    }

    const data = await fetchStressData();

    // Gruppierung der Daten nach Abteilungs-ID (String) und Datum
    const departmentMap: {
      [id: string]: { name: string; stressData: { [date: string]: number[] } };
    } = {};

    data?.forEach((item) => {
      const departmentId = item.department_id?.toString();
      const departmentName = item.department?.name ?? "Unknown";
      const date = item.created_at?.slice(0, 10); // Nur Datumsteil
      const stress = item.stress ?? null;

      if (stress === null || !departmentId) return;

      // Initialisiere die Abteilung, falls nicht vorhanden
      if (!departmentMap[departmentId]) {
        departmentMap[departmentId] = {
          name: departmentName,
          stressData: {},
        };
      }

      // Initialisiere das Datum innerhalb der Abteilung, falls nicht vorhanden
      if (!departmentMap[departmentId].stressData[date]) {
        departmentMap[departmentId].stressData[date] = [];
      }

      // Füge den Stresswert zum entsprechenden Datum hinzu
      departmentMap[departmentId].stressData[date].push(stress);
    });

    // Formatierung der Ergebnisse mit Durchschnittsberechnung pro Tag
    const formattedData = Object.keys(departmentMap).map((departmentId) => {
      const departmentName = departmentMap[departmentId].name;

      // Verarbeite die Stresswerte für jedes Datum in der Periode
      const stressValues = Object.keys(
        departmentMap[departmentId].stressData
      ).map((date) => {
        const dailyStressValues = departmentMap[departmentId].stressData[date];

        // Durchschnitt berechnen
        const avg_stress =
          dailyStressValues.reduce((sum, value) => sum + value, 0) /
          dailyStressValues.length;

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
        department_id: departmentId,
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

export async function getHighStressDepartments(
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

    // Funktion zum Abrufen von Daten in Chunks
    async function fetchAllDepartments() {
      const departments = [];
      let from = 0;
      const chunkSize = 1000;

      while (true) {
        const { data, error } = await supabase
          .from("department")
          .select("id, name")
          .range(from, from + chunkSize - 1);

        if (error) throw error;
        if (data.length === 0) break;

        departments.push(...data);
        from += chunkSize;
      }
      return departments;
    }

    const departments = await fetchAllDepartments();

    const highStressDepartments = await Promise.all(
      departments.map(async (department) => {
        // Funktion zum Abrufen von Stresswerten in Chunks
        async function fetchStressData() {
          const stressValues = [];
          let from = 0;

          while (true) {
            const { data, error } = await supabase
              .from("stress")
              .select("stress")
              .eq("department_id", department.id)
              .gte("created_at", startDate.toISOString())
              .range(from, from + 999); // 1000 pro Chunk

            if (error) throw error;
            if (data.length === 0) break;

            stressValues.push(...data);
            from += 1000;
          }
          return stressValues;
        }

        const stressData = await fetchStressData();

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

        // Negative Bewertungen abrufen (auch in Chunks)
        async function fetchNegativeReviews() {
          const negativeReviews = [];
          let from = 0;

          while (true) {
            const { data, error } = await supabase
              .from("rating")
              .select("id")
              .eq("department_id", department.id)
              .gte("created_at", startDate.toISOString())
              .lte("rating", 2)
              .range(from, from + 999);

            if (error) throw error;
            if (data.length === 0) break;

            negativeReviews.push(...data);
            from += 1000;
          }
          return negativeReviews;
        }

        const negativeReviews = await fetchNegativeReviews();

        // Filter: Nur Abteilungen mit hohem Stresswert oder vielen negativen Bewertungen
        if (averageStress >= 8 || (negativeReviews?.length ?? 0) > 15) {
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
