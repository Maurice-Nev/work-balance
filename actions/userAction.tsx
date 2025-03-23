"use server";

import { createClient } from "@/supabase/server";
import {
  User,
  Role,
  UpdateUser,
  NewUser,
} from "../supabase/types/database.models";
import bcrypt from "bcryptjs";

export async function getAllUsersAction() {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("user")
      .select("*, role:role_id(*)")
      .order("created_at", { ascending: false });

    if (error) throw error;

    const userWithRole = data;

    return userWithRole;
  } catch (error) {
    throw error;
  }
}

export async function getUserAction({ user_id }: { user_id: string }) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("user")
      .select("*, role:role_id(*)")
      .eq("id", user_id)
      .single();

    if (error) throw error;

    const userWithRole = data as User & { role: Role | null };

    return userWithRole;
  } catch (error) {
    throw error;
  }
}

export async function createUserAction(newUser: NewUser) {
  const supabase = await createClient();

  try {
    if (!newUser.password) {
      throw {
        name: "auth",
        message: "no password got submitted",
        statusCode: 500,
      };
    }

    const { data: roleData, error: roleError } = await supabase
      .from("role")
      .select()
      .eq("name", "User")
      .single();

    if (roleError) {
      throw roleError;
    }

    const hashedPassword = await bcrypt.hash(newUser.password, 10);

    newUser = {
      ...newUser,
      role_id: roleData.id,
      password: hashedPassword,
    };

    const { data: createUserData, error: createUserError } = await supabase
      .from("user")
      .insert(newUser)
      .select("*, role:role_id(*)")
      .single();

    if (createUserError) {
      throw createUserError;
    }
    return createUserData;
  } catch (error) {
    throw error;
  }
}

export async function updateUserAction(user_id: string, updates: UpdateUser) {
  const supabase = await createClient();

  if (!updates.password) {
    throw {
      name: "auth",
      message: "no Password found",
      statusCode: 500,
    };
  }

  const hashedPassword = await bcrypt.hash(updates.password, 10);

  updates = {
    ...updates,
    password: hashedPassword,
  };

  try {
    const { error } = await supabase
      .from("user")
      .update(updates)
      .eq("id", user_id);
    if (error) throw error;
    return { success: true };
  } catch (error) {
    throw error;
  }
}

export async function deleteUserAction(user_id: string) {
  const supabase = await createClient();

  try {
    const { error } = await supabase.from("user").delete().eq("id", user_id);
    if (error) throw error;
    return { success: true };
  } catch (error) {
    throw error;
  }
}
