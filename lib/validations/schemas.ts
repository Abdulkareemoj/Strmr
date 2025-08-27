import * as z from "zod";

export const videoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  public: z.boolean().default(true),
  file: z
    .any()
    .nullable()
    .refine(
      (file) => file === null || file instanceof File,
      "Video file must be a valid file or null",
    )
    .refine((file) => file !== null, "Video file is required"),
});

export type VideoFormValues = z.infer<typeof videoSchema>;

export const shortSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  public: z.boolean().default(true),
  file: z
    .any()
    .nullable()
    .refine(
      (file) => file === null || file instanceof File,
      "Video file must be a valid file or null",
    )
    .refine((file) => file !== null, "Video file is required"),
});

export type ShortFormValues = z.infer<typeof shortSchema>;

export const signUpSchema = z.object({
  firstName: z.string().min(2, "Full name must be at least 2 characters"),
  lastName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    ),
});

export type SignUpFormValues = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type SignInFormValues = z.infer<typeof signInSchema>;

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const forgotPasswordSchema = z.object({
  email: z.email("Please enter a valid email address"),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
