import {
  createRoomSchema,
  registerUserSchema,
  joinRoomSchema,
  sendMessage,
} from "./schema";
import * as z from "zod";

export type CreateRoom = z.infer<typeof createRoomSchema>;
export type RegisterUser = z.infer<typeof registerUserSchema>;
export type JoinRoom = z.infer<typeof joinRoomSchema>;

export interface AuthContextType {
  token: string | null;
  user: UserAuthData | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export type ChatPageSearch = {
  room?: number;
};

export interface UserAuthData {
  id: number;
  username: string;
}

export type Room = {
  code: string;
  id: number;
  name: string;
  createdAt: Date;
  creatorId: number;
};

export type Message = z.infer<typeof sendMessage>;

export interface ServerToClientEvents {
  successSendMessage: (message: Message) => void;
  errorSendMessage: (error: { error: string; messageId: string }) => void;
}

export interface ClientToServerEvents {
  sendMessage: (message: Message) => void;
}
