import { createRoomSchema, registerUserSchema, joinRoomSchema } from "./schema";
import * as z from "zod";

export type CreateRoom = z.infer<typeof createRoomSchema>;
export type RegisterUser = z.infer<typeof registerUserSchema>;
export type JoinRoom = z.infer<typeof joinRoomSchema>;

export type Room = {
  code: string;
  id: number;
  name: string;
  createdAt: Date;
  creatorId: number;
};
