"use server";

import { createClient } from "~/utils/supabase/server";
import { revalidatePath } from "next/cache";
import type { UpdatePreferencesData, UpdateProfileData } from "~/types/";

export async function getUserPreferences() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Not authenticated");
  }

  const { data: preferences, error } = await supabase
    .from("user_preferences")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error) {
    throw new Error("Failed to fetch preferences");
  }

  return preferences;
}

export async function updateUserPreferences(data: UpdatePreferencesData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Not authenticated");
  }

  const { error } = await supabase
    .from("user_preferences")
    .update(data)
    .eq("user_id", user.id);

  if (error) {
    throw new Error("Failed to update preferences");
  }

  revalidatePath("/settings");
  return { success: true };
}
