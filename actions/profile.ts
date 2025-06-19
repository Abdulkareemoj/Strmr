"use server";

import { createClient } from "~/utils/supabase/server";
import { revalidatePath } from "next/cache";
import type { UpdateProfileData } from "~/types/";

export async function getProfile() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Not authenticated");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error) {
    throw new Error("Failed to fetch profile");
  }

  return profile;
}

export async function updateProfile(data: UpdateProfileData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Not authenticated");
  }

  const { error } = await supabase
    .from("profiles")
    .update(data)
    .eq("user_id", user.id);

  if (error) {
    throw new Error("Failed to update profile");
  }

  revalidatePath("/settings");
  return { success: true };
}

export async function updateUserAccount(data: {
  name?: string;
  email?: string;
}) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Not authenticated");
  }

  // Update auth.users metadata if needed
  if (data.name) {
    const { error: updateError } = await supabase.auth.updateUser({
      data: { name: data.name },
    });

    if (updateError) {
      throw new Error("Failed to update user metadata");
    }
  }

  // Update users table
  const { error } = await supabase.from("users").update(data).eq("id", user.id);

  if (error) {
    throw new Error("Failed to update user account");
  }

  revalidatePath("/settings");
  return { success: true };
}
