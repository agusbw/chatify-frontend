import * as z from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, ""),
  password: z.string().min(1, ""),
});

export const sendMessage = z.object({
  messageText: z.string().min(1),
  room: z.object({
    id: z.number(),
    name: z.string(),
  }),
  sender: z.object({
    id: z.number(),
    username: z.string(),
  }),
  id: z.string(),
  sentAt: z.coerce.date(),
});

export const createRoomSchema = z.object({
  name: z.string().min(1, "Chat room name is required."),
});

export const registerUserSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters."),
    username: z
      .string()
      .min(2, "Username must be at least 2 characters.")
      .refine((v) => {
        return /^[a-z0-9_]+$/.test(v);
      }, "Username can only contain lowercase letters, numbers, and underscores."),
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
