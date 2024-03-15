import * as z from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, ""),
  password: z.string().min(1, ""),
});

export const createRoomSchema = z.object({
  name: z.string().min(1, "Chat room name is required."),
});

export const registerUserSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters."),
    username: z.string().min(2, "Username must be at least 2 characters."),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const joinRoomSchema = z.object({
  code: z.string().min(1, "Room code is required."),
});
