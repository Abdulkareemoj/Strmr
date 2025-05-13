/* eslint-disable @typescript-eslint/no-unused-vars */
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "~/utils/supabase/component";
import { db } from "~/server/db";
import { env } from "~/env";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST for creating users
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const supabase = createClient();

    // Verify the request is authenticated if needed
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // For user creation, we might allow unauthenticated requests
    // but we should validate the data carefully

    const { id, firstName, lastName, email, username } = req.body;

    if (!id || !email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Create the profile in Prisma
    const profile = await db.profile.create({
      data: {
        id,
        firstName,
        lastName,
        email,
        username,
        // Other fields can be set to default values or null
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return res.status(201).json(profile);
  } catch (error) {
    console.error("Error creating profile:", error);

    // Handle specific errors
    if (error instanceof Error) {
      if (error.message.includes("Unique constraint failed")) {
        return res
          .status(409)
          .json({ error: "User with this email already exists" });
      }
    }

    return res.status(500).json({
      error: "Failed to create user profile",
      details: env.NODE_ENV === "development" ? error : undefined,
    });
  }
}
