import { cache } from "react";
import { createClient } from "~/utils/supabase/client";

// Function to get the Supabase session
export async function getSupabaseSession() {
  const supabase = createClient();
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

// Function to get the authenticated user
export async function getAuthUser() {
  const supabase = createClient();
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

// Function to get a user from the users table
export async function getUser() {
  const supabase = createClient();
  try {
    const { data } = await supabase.from("users").select("*").single();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}
