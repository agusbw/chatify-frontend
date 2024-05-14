import {
  createRoomSchema,
  registerUserSchema,
  joinRoomSchema,
  sendMessageSchema,
  roomSchema,
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

export interface SettingModeContextType {
  settingMode: boolean;
  setSettingMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface UserAuthData {
  id: number;
  username: string;
}

export type Room = z.infer<typeof roomSchema>;
export type Message = z.infer<typeof sendMessageSchema>;

export interface ServerToClientEvents {
  successSendMessage: (message: Message) => void;
  errorSendMessage: (error: { error: string; messageId: string }) => void;
}

export interface ClientToServerEvents {
  sendMessage: (message: Message) => void;
}
