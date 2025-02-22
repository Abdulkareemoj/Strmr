import * as z from "zod"

export const videoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  public: z.boolean().default(true),
  file: z.any().refine((file) => file instanceof File, "Video file is required")
})

export type VideoFormValues = z.infer<typeof videoSchema>

export const shortSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  public: z.boolean().default(true),
  file: z.any().refine((file) => file instanceof File, "Video file is required")
})

export type ShortFormValues = z.infer<typeof shortSchema>