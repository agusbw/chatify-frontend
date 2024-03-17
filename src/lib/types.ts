import { createRoomSchema, registerUserSchema, joinRoomSchema } from "./schema";
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

export type Message = {
  id: number;
  messageText: string;
  sentAt: Date;
  roomId: number;
  senderId: number;
  sender: {
    username: string;
  };
  room: {
    name: string;
  };
};

export type IncommingMessage = {
  id: number;
  messageText: string;
  roomId: number;
  room: {
    name: string;
  };
  sender: {
    username: string;
  };
  senderId: number;
  sentAt: Date;
  connectionId?: string;
};

export interface ServerToClientEvents {
  incomingMessage: (message: IncommingMessage) => void;
  messageNotSent: (error: { error: string; messageId: number }) => void;
}

export interface ClientToServerEvents {
  messageSent: (message: IncommingMessage) => void;
}
