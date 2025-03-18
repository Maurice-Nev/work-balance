import {
  createRoleAction,
  getRoleAction,
  updateRoleAction,
  deleteRoleAction,
  getAllRolesAction,
} from "@/actions/roleAction";
import { NewRole, UpdateRole } from "@/supabase/types/database.models";

describe("Role Actions Integration Tests", () => {
  let testRoleId: string | null = null;

  const testRole: NewRole = {
    name: "Test Role",
    created_at: new Date().toISOString(),
  };

  test("1️⃣ createRoleAction - Erstellt eine Rolle", async () => {
    const result = await createRoleAction(testRole);
    expect(result).toBeDefined();
    expect(result.name).toBe(testRole.name);

    testRoleId = result.id;
    expect(testRoleId).not.toBeNull();
  });

  test("2️⃣ getRoleAction - Holt die erstellte Rolle", async () => {
    if (!testRoleId) throw new Error("testRoleId ist nicht definiert");

    const role = await getRoleAction({ role_id: testRoleId });
    expect(role).toBeDefined();
    expect(role.name).toBe(testRole.name);
  });

  test("3️⃣ updateRoleAction - Aktualisiert die Rolle", async () => {
    if (!testRoleId) throw new Error("testRoleId ist nicht definiert");

    const updates: UpdateRole = { name: "Updated Role Name" };
    const result = await updateRoleAction(testRoleId, updates);
    expect(result.success).toBe(true);

    const updatedRole = await getRoleAction({ role_id: testRoleId });
    expect(updatedRole.name).toBe("Updated Role Name");
  });

  test("4️⃣ getAllRolesAction - Holt alle Rollen in der Datenbank", async () => {
    const roles = await getAllRolesAction();
    expect(roles).toBeInstanceOf(Array);
    expect(roles.length).toBeGreaterThan(0);
  });

  test("5️⃣ deleteRoleAction - Löscht die Rolle", async () => {
    if (!testRoleId) throw new Error("testRoleId ist nicht definiert");

    const result = await deleteRoleAction(testRoleId);
    expect(result.success).toBe(true);
  });
});
