import {
  createUserAction,
  getUserAction,
  updateUserAction,
  deleteUserAction,
} from "@/actions/userAction";
import { NewUser, UpdateUser } from "@/supabase/types/database.models";

describe("User Actions Integration Tests", () => {
  let testUserId: string | null = null; // Speichert die ID des erstellten Users

  const testUser: NewUser = {
    email: "user_test_user@example.com",
    name: "Test User",
    surname: "Tester",
    password: "test123",
    role_id: null, // Falls keine Rolle gesetzt wird
  };

  test("1️⃣ createUserAction - Erstellt einen Benutzer", async () => {
    const result = await createUserAction(testUser);
    // expect(result.success).toBe(true);

    // 🔹 User aus der Datenbank holen, um die `id` zu speichern
    const user = await getUserAction({ user_id: result.id as string });
    expect(user).toBeDefined();
    expect(user?.email).toBe(testUser.email);

    testUserId = user?.id || null; // Speichere die `UUID` des Users
    expect(testUserId).not.toBeNull();
  });

  test("2️⃣ getUserAction - Holt den erstellten User", async () => {
    if (!testUserId) throw new Error("testUserId ist nicht definiert");

    const user = await getUserAction({ user_id: testUserId });
    expect(user).toBeDefined();
    expect(user.email).toBe(testUser.email);
    expect(user.name).toBe("Test User");
  });

  test("3️⃣ updateUserAction - Aktualisiert den Benutzer", async () => {
    if (!testUserId) throw new Error("testUserId ist nicht definiert");

    const updates: UpdateUser = { name: "Updated User" };
    const result = await updateUserAction(testUserId, updates);
    expect(result.success).toBe(true);

    const updatedUser = await getUserAction({ user_id: testUserId });
    expect(updatedUser.name).toBe("Updated User");
  });

  test("4️⃣ deleteUserAction - Löscht den Benutzer", async () => {
    if (!testUserId) throw new Error("testUserId ist nicht definiert");

    const result = await deleteUserAction(testUserId);
    expect(result.success).toBe(true);
  });
});
