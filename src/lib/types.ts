import {
  createRoomSchema,
  registerUserSchema,
  joinRoomSchema,
  sendMessageSchema,
  roomSchema,
  kickMemberSchema,
} from "./schema";
import * as z from "zod";
import { Socket } from "socket.io-client";

export type CreateRoom = z.infer<typeof createRoomSchema>;
export type RegisterUser = z.infer<typeof registerUserSchema>;
export type JoinRoom = z.infer<typeof joinRoomSchema>;
export type SocketResponseError = { error: string };
export type SuccessDeleteRoom = { deletedBy: number; deletedRoom: number };
export type SuccessCreateRoom = { roomId: number };

export interface ServerToClientEvents {
  successSendMessage: (message: Message) => void;
  errorSendMessage: (
    data: SocketResponseError & {
      messageId: string;
    }
  ) => void;
  memberKicked: (data: KickMember) => void;
  errorKickMember: (data: SocketResponseError) => void;
  successCreateRoom: (data: SuccessCreateRoom) => void;
  errorCreateRoom: (data: SocketResponseError) => void;
  successJoinRoom: () => void;
  errorJoinRoom: (data: SocketResponseError) => void;
  successDeleteRoom: (data: SuccessDeleteRoom) => void;
  errorDeleteRoom: (data: SocketResponseError) => void;
  successLeaveRoom: () => void;
  errorLeaveRoom: (data: SocketResponseError) => void;
}

export interface ClientToServerEvents {
  sendMessage: (message: Message) => void;
  kickMember: (req: KickMember) => void;
  joinRoom: (req: { code: string }) => void;
  leaveRoom: (req: { roomId: number }) => void;
  deleteRoom: (req: { roomId: number }) => void;
  createRoom: (req: { name: string }) => void;
}

export interface AuthContextType {
  token: string | null;
  user: UserAuthData | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export interface SocketContextType {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
  isConnected: boolean;
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
export type KickMember = z.infer<typeof kickMemberSchema>;
