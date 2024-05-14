import * as z from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, ""),
  password: z.string().min(1, ""),
});

export const sendMessageSchema = z.object({
  messageText: z.string().trim().min(1),
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

export const roomSchema = z.object({
  id: z.number(),
  code: z.string(),
  name: z.string(),
  createdAt: z.coerce.date(),
  creatorId: z.number(),
});

export const roomDetailSchema = z.object({
  id: z.number(),
  createdAt: z.coerce.date(),
  name: z.string(),
  code: z.string(),
  creatorId: z.number(),
  usersToRooms: z.array(
    z.object({
      joinedAt: z.coerce.date(),
      user: z.object({
        id: z.number(),
        username: z.string(),
      }),
      room: z.object({
        creatorId: z.number(),
        id: z.number(),
        name: z.string(),
      }),
    })
  ),
});

export const createRoomSchema = z.object({
  name: z.string().trim().min(1, "Chat room name is required."),
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
