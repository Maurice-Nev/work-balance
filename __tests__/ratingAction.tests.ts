import {
  createRatingAction,
  getRatingAction,
  updateRatingAction,
  deleteRatingAction,
  getAllRatingsAction,
  getRatingsForDepartmentAction,
} from "@/actions/ratingAction";
import { NewRating, UpdateRating } from "@/supabase/types/database.models";
import {
  createDepartmentAction,
  deleteDepartmentAction,
} from "@/actions/departmentAction";

describe("Rating Actions Integration Tests", () => {
  let testRatingId: string | null = null;
  let testDepartmentId: string | null = null;

  beforeAll(async () => {
    // Erstelle eine Test-Abteilung
    const department = await createDepartmentAction({
      name: "Test Department for Ratings",
    });

    testDepartmentId = department.id;
    expect(testDepartmentId).not.toBeNull();
  });

  const testRating: NewRating = {
    department_id: "", // Wird später gesetzt
    rating: 4,
    comment: "Initial rating for testing",
    created_at: new Date().toISOString(),
  };

  test("1️⃣ createRatingAction - Erstellt eine Bewertung", async () => {
    if (!testDepartmentId)
      throw new Error("testDepartmentId ist nicht definiert");

    testRating.department_id = testDepartmentId;

    const result = await createRatingAction(testRating);
    expect(result.success).toBe(true);

    // Holt die Bewertung aus der DB, um die ID zu bekommen
    const ratings = await getRatingsForDepartmentAction({
      department_id: testDepartmentId,
    });
    const createdRating = ratings.find((r) => r.comment === testRating.comment);

    expect(createdRating).toBeDefined();
    testRatingId = createdRating?.id || null;
    expect(testRatingId).not.toBeNull();
  });

  test("2️⃣ getRatingAction - Holt die erstellte Bewertung", async () => {
    if (!testRatingId) throw new Error("testRatingId ist nicht definiert");

    const rating = await getRatingAction({ rating_id: testRatingId });
    expect(rating).toBeDefined();
    expect(rating.comment).toBe(testRating.comment);
    expect(rating.rating).toBe(testRating.rating);
  });

  test("3️⃣ updateRatingAction - Aktualisiert die Bewertung", async () => {
    if (!testRatingId) throw new Error("testRatingId ist nicht definiert");

    const updates: UpdateRating = {
      rating: 5,
      comment: "Updated rating comment",
    };
    const result = await updateRatingAction(testRatingId, updates);
    expect(result.success).toBe(true);

    const updatedRating = await getRatingAction({ rating_id: testRatingId });
    expect(updatedRating.rating).toBe(5);
    expect(updatedRating.comment).toBe("Updated rating comment");
  });

  test("4️⃣ getRatingsForDepartmentAction - Holt alle Bewertungen für eine Abteilung", async () => {
    if (!testDepartmentId)
      throw new Error("testDepartmentId ist nicht definiert");

    const ratings = await getRatingsForDepartmentAction({
      department_id: testDepartmentId,
    });
    expect(ratings).toBeInstanceOf(Array);
    expect(ratings.length).toBeGreaterThan(0);
  });

  test("5️⃣ getAllRatingsAction - Holt alle Bewertungen", async () => {
    const ratings = await getAllRatingsAction();
    expect(ratings).toBeInstanceOf(Array);
    expect(ratings.length).toBeGreaterThan(0);
  });

  test("6️⃣ deleteRatingAction - Löscht die Bewertung", async () => {
    if (!testRatingId) throw new Error("testRatingId ist nicht definiert");

    const result = await deleteRatingAction(testRatingId);
    expect(result.success).toBe(true);
  });

  afterAll(async () => {
    // Lösche die Test-Abteilung
    if (testDepartmentId) {
      const deleteDepartmentResult = await deleteDepartmentAction(
        testDepartmentId
      );
      expect(deleteDepartmentResult.success).toBe(true);
    }
  });
});
