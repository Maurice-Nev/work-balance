import {
  createDepartmentAction,
  getDepartmentAction,
  updateDepartmentAction,
  deleteDepartmentAction,
  getAllDepartmentsAction,
} from "@/actions/departmentAction";
import {
  NewDepartment,
  UpdateDepartment,
} from "@/supabase/types/database.models";

describe("Department Actions Integration Tests", () => {
  let testDepartmentId: string | null = null;

  const testDepartment: NewDepartment = {
    name: "Test Department",
    created_at: new Date().toISOString(),
  };

  test("1️⃣ createDepartmentAction - Erstellt eine Abteilung", async () => {
    const result = await createDepartmentAction(testDepartment);
    expect(result).toBeDefined();
    expect(result.name).toBe(testDepartment.name);

    testDepartmentId = result.id;
    expect(testDepartmentId).not.toBeNull();
  });

  test("2️⃣ getDepartmentAction - Holt die erstellte Abteilung", async () => {
    if (!testDepartmentId)
      throw new Error("testDepartmentId ist nicht definiert");

    const department = await getDepartmentAction({
      department_id: testDepartmentId,
    });
    expect(department).toBeDefined();
    expect(department.name).toBe(testDepartment.name);
  });

  test("3️⃣ updateDepartmentAction - Aktualisiert die Abteilung", async () => {
    if (!testDepartmentId)
      throw new Error("testDepartmentId ist nicht definiert");

    const updates: UpdateDepartment = { name: "Updated Department Name" };
    const result = await updateDepartmentAction(testDepartmentId, updates);
    expect(result.success).toBe(true);

    const updatedDepartment = await getDepartmentAction({
      department_id: testDepartmentId,
    });
    expect(updatedDepartment.name).toBe("Updated Department Name");
  });

  test("4️⃣ getAllDepartmentsAction - Holt alle Abteilungen in der Datenbank", async () => {
    const departments = await getAllDepartmentsAction();
    expect(departments).toBeInstanceOf(Array);
    expect(departments.length).toBeGreaterThan(0);
  });

  test("5️⃣ deleteDepartmentAction - Löscht die Abteilung", async () => {
    if (!testDepartmentId)
      throw new Error("testDepartmentId ist nicht definiert");

    const result = await deleteDepartmentAction(testDepartmentId);
    expect(result.success).toBe(true);
  });
});
