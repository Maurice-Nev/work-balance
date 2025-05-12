"use server";

import { createClient } from "@/supabase/server";
import {
  NewSession,
  NewUser,
  Role,
  User,
} from "@/supabase/types/database.models";
import { v4 as uuidv4 } from "uuid";

import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { z } from "zod";

// Input validation schemas
const emailSchema = z.string().email("Invalid email format");
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character"
  );

const userSchema = z.object({
  email: emailSchema,
  password: z.string().min(4, "Password must be at least 4 characters"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
});

// Security constants
const SESSION_EXPIRY = 1000 * 60 * 60; // 1 hour

/**
 * Validates and sanitizes user input
 */
function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw {
        name: "validation",
        message: error.errors[0].message,
        statusCode: 400,
      };
    }
    throw error;
  }
}

// done

// get session by token
// register
// create session
// get userBy session token
// update session
// Login
// validateUserSession
// logout

export async function register({ newUser }: { newUser: NewUser }) {
  const supabase = await createClient();

  try {
    // Validate user input
    // const validatedUser = validateInput(userSchema, newUser);

    // Check if user already exists
    const existingUser = await getUserByEmail({ email: newUser.email! });
    if (existingUser) {
      throw {
        name: "auth",
        message: "User with this email already exists",
        statusCode: 409,
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

    const hashedPassword = await bcrypt.hash(newUser.password!, 12); // Increased salt rounds

    const userToCreate = {
      ...newUser,
      role_id: roleData.id,
      password: hashedPassword,
    };

    const { data: createUserData, error: createUserError } = await supabase
      .from("user")
      .insert(userToCreate)
      .select("*, role:role_id(*)")
      .single();

    if (createUserError) {
      throw createUserError;
    }

    const { error: sessionError } = await createSession({
      user_id: createUserData.id,
    });

    if (sessionError) {
      throw sessionError;
    }

    return { message: "Registration successful" };
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
}

export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const supabase = await createClient();

  try {
    // Validate input
    validateInput(emailSchema, email);
    // validateInput(passwordSchema, password);

    const userData = await getUserByEmail({ email });
    if (!userData?.password) {
      throw {
        name: "auth",
        message: "Invalid credentials",
        statusCode: 401,
      };
    }

    const rightPassword = await bcrypt.compare(password, userData.password);
    if (!rightPassword) {
      throw {
        name: "auth",
        message: "Invalid credentials",
        statusCode: 401,
      };
    }

    const sessionRes = await createSession({ user_id: userData.id });
    if (sessionRes.error) {
      throw {
        name: "auth",
        message: "Unable to create session",
        statusCode: 500,
      };
    }

    return { message: "Login successful" };
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

export async function logout() {
  const cookie = await cookies();
  try {
    const sessionToken = await cookie.get("sessionToken");
    if (!sessionToken?.value) {
      return { message: "Already logged out" };
    }

    // Invalidate session in database
    const supabase = await createClient();
    await supabase.from("session").delete().eq("token", sessionToken.value);

    // Clear cookie
    cookie.delete("sessionToken");

    return { message: "Logout successful" };
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
}

export async function getUserByEmail({
  email,
}: {
  email: string;
}): Promise<User | null> {
  const supabase = await createClient();

  try {
    const { data: User, error: UserError } = await supabase
      .from("user")
      .select("*, role:role_id(*)")
      .eq("email", email)
      .maybeSingle();
    if (UserError) {
      throw UserError;
    }

    return User;
  } catch (error) {
    throw error;
  }
}

export async function getUserByToken() {
  const supabase = await createClient();
  const cookie = await cookies();

  try {
    const sessionToken = cookie.get("sessionToken");

    if (!sessionToken) {
      throw {
        name: "auth",
        message: "no session token found",
        statusCode: 500,
      };
    }

    const { data: session, error: sessionError } = await supabase
      .from("session")
      .select()
      .eq("token", sessionToken.value)
      .maybeSingle();

    if (sessionError) {
      throw sessionError;
    }

    if (!session) {
      return null;
    }

    if (!session.user_id) {
      cookie.delete("sessionToken");
      return null;
    }

    const { data: User, error: UserError } = await supabase
      .from("user")
      .select("*, role:role_id(*)")
      .eq("id", session?.user_id as string)
      .single();

    if (UserError) {
      throw UserError;
    }

    return User;
  } catch (error) {
    throw error;
  }
}

export async function createSession({ user_id }: { user_id: string }) {
  const cookie = await cookies();
  const supabase = await createClient();

  const token: string = uuidv4();
  const expiration_date = new Date(Date.now() + SESSION_EXPIRY);

  const newSession: NewSession = {
    expiration_date: expiration_date.toISOString(),
    token: token,
    user_id: user_id,
  };

  const { error: createSessionError } = await supabase
    .from("session")
    .insert(newSession)
    .select()
    .single();

  if (createSessionError) {
    return { error: true };
  }

  // Set cookie
  cookie.set({
    name: "sessionToken",
    value: token,
    expires: expiration_date,
    path: "/",
  });

  return { error: false };
}

export async function updateSession() {
  const cookie = await cookies();
  const supabase = await createClient();

  const newExpirationDate = new Date(Date.now() + 1000 * 60 * 60).toISOString();
  const sessionToken = cookie.get("sessionToken");

  if (!sessionToken) {
    return { error: true };
  }
  const { error: updateSessionError } = await supabase
    .from("session")
    .update({ expiration_date: newExpirationDate })
    .eq("token", sessionToken.value)
    .select()
    .single();

  if (updateSessionError) {
    return { error: true };
  }

  const cookieOptions = {
    name: "sessionToken",
    value: sessionToken.value,
    expires: new Date(newExpirationDate),
    path: "/",
  };

  cookie.set(cookieOptions);

  return { error: false };
}

export async function validateUserSession() {
  const cookie = await cookies();

  try {
    const sessionToken = cookie.get("sessionToken");
    if (!sessionToken) {
      return { authorized: false };
    }
    const userData = await getUserByToken();

    if (!userData) {
      return { authorized: false };
    }

    const sessionUpdateRes = await updateSession();
    if (sessionUpdateRes.error) {
      return { authorized: false };
    }

    return { user: userData, authorized: true };
  } catch (error) {
    throw error;
  }
}
