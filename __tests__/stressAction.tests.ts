import {
  createStressAction,
  getStressAction,
  updateStressAction,
  deleteStressAction,
  getStressForUserAction,
  getStressForDepartmentAction,
  getAllStressEntriesAction,
} from "@/actions/stressAction";
import { NewStress, UpdateStress } from "@/supabase/types/database.models";
import { createUserAction, deleteUserAction } from "@/actions/userAction";
import {
  createDepartmentAction,
  deleteDepartmentAction,
} from "@/actions/departmentAction";

describe("Stress Actions Integration Tests", () => {
  let testStressId: string | null = null;
  let testUserId: string | null = null;
  let testDepartmentId: string | null = null;

  beforeAll(async () => {
    // Erstelle einen Test-User
    const user = await createUserAction({
      email: "stress_test_user@example.com",
      name: "Stress Test",
      surname: "User",
      password: "test123",
      role_id: null,
    });

    testUserId = user.id;
    expect(testUserId).not.toBeNull();

    // Erstelle eine Test-Abteilung
    const department = await createDepartmentAction({
      name: "Test Department",
    });

    testDepartmentId = department.id;
    expect(testDepartmentId).not.toBeNull();
  });

  const testStress: NewStress = {
    user_id: "", // Wird später gesetzt
    department_id: "", // Wird später gesetzt
    stress: 5,
    created_at: new Date().toISOString(),
  };

  test("1️⃣ createStressAction - Erstellt einen Stress-Eintrag", async () => {
    if (!testUserId || !testDepartmentId)
      throw new Error("User oder Department nicht gesetzt");

    testStress.user_id = testUserId;
    testStress.department_id = testDepartmentId;

    const result = await createStressAction(testStress);
    expect(result).toBeDefined();
    expect(result.stress).toBe(testStress.stress);

    testStressId = result.id || null;
    expect(testStressId).not.toBeNull();
  });

  test("2️⃣ getStressAction - Holt den erstellten Stress-Eintrag", async () => {
    if (!testStressId) throw new Error("testStressId ist nicht definiert");

    const stress = await getStressAction({ stress_id: testStressId });
    expect(stress).toBeDefined();
    expect(stress.stress).toBe(testStress.stress);
  });

  test("3️⃣ updateStressAction - Aktualisiert den Stress-Eintrag", async () => {
    if (!testStressId) throw new Error("testStressId ist nicht definiert");

    const updates: UpdateStress = { stress: 8 };
    const result = await updateStressAction(testStressId, updates);
    expect(result.success).toBe(true);

    const updatedStress = await getStressAction({ stress_id: testStressId });
    expect(updatedStress.stress).toBe(8);
  });

  test("4️⃣ getStressForUserAction - Holt alle Stress-Einträge für einen User", async () => {
    if (!testUserId) throw new Error("testUserId ist nicht definiert");

    const stressEntries = await getStressForUserAction({ user_id: testUserId });
    expect(stressEntries).toBeInstanceOf(Array);
    expect(stressEntries.length).toBeGreaterThan(0);
  });

  test("5️⃣ getStressForDepartmentAction - Holt alle Stress-Einträge für eine Abteilung", async () => {
    if (!testDepartmentId)
      throw new Error("testDepartmentId ist nicht definiert");

    const stressEntries = await getStressForDepartmentAction({
      department_id: testDepartmentId,
    });
    expect(stressEntries).toBeInstanceOf(Array);
    expect(stressEntries.length).toBeGreaterThan(0);
  });

  test("6️⃣ getAllStressEntriesAction - Holt alle Stress-Einträge", async () => {
    const stressEntries = await getAllStressEntriesAction();
    expect(stressEntries).toBeInstanceOf(Array);
    expect(stressEntries.length).toBeGreaterThan(0);
  });

  test("7️⃣ deleteStressAction - Löscht den Stress-Eintrag", async () => {
    if (!testStressId) throw new Error("testStressId ist nicht definiert");

    const result = await deleteStressAction(testStressId);
    expect(result.success).toBe(true);
  });

  afterAll(async () => {
    // Lösche den Test-User
    if (testUserId) {
      const deleteUserResult = await deleteUserAction(testUserId);
      expect(deleteUserResult.success).toBe(true);
    }

    // Lösche die Test-Abteilung
    if (testDepartmentId) {
      const deleteDepartmentResult = await deleteDepartmentAction(
        testDepartmentId
      );
      expect(deleteDepartmentResult.success).toBe(true);
    }
  });
});
