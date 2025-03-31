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

    const { error: sessionError } = await createSession({
      user_id: createUserData.id,
    });

    if (sessionError) {
      throw sessionError;
    }
    return { message: "You are now registered" };
  } catch (error) {
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
  try {
    if (!email || !password) {
      throw {
        name: "auth",
        message: "missing user information",
        statusCode: 500,
      };
    }
    const userData = await getUserByEmail({ email: email });
    if (!userData?.password) {
      throw {
        name: "auth",
        message: "no User found",
        statusCode: 500,
      };
    }

    const rightPassword = await bcrypt.compare(password, userData.password);
    if (!rightPassword) {
      throw {
        name: "auth",
        message: "Wrong Email or Password",
        statusCode: 500,
      };
    }

    const sessionRes = await createSession({ user_id: userData.id });
    if (sessionRes.error) {
      throw {
        name: "auth",
        message: "Unable to create Session",
        statusCode: 500,
      };
    }
    return { message: "You are now logged in" };
  } catch (error) {
    throw error;
  }
}

export async function logout() {
  const cookie = await cookies();
  try {
    const sessionToken = await cookie.get("sessionToken");
    if (!sessionToken?.value) {
      throw {
        name: "auth",
        message: "no Session token found that means you are already logged out",
        statusCode: 500,
      };
    }

    cookie.delete("sessionToken");

    return { message: "You have been logged out" };
  } catch (error) {
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
      .single();
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
      .single();

    if (sessionError) {
      throw sessionError;
    }

    if (!session.user_id) {
      cookie.delete("sessionToken");
      return null;
      throw {
        name: "auth",
        message: "User does not exist",
        statusCode: 500,
      };
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
  const expiration_date = new Date(Date.now() + 1000 * 60 * 60);

  const newSession: NewSession = {
    expiration_date: expiration_date.toISOString(),
    token: token,
    user_id: user_id,
  };

  const cookieOptions = {
    name: "sessionToken",
    value: token,
    expires: expiration_date,
    path: "/",
  };

  const { error: createSessionError } = await supabase
    .from("session")
    .insert(newSession)
    .select()
    .single();

  if (createSessionError) {
    return { error: true };
  }

  cookie.set(cookieOptions);
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
    const sessionToken = await cookie.get("sessionToken");
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
