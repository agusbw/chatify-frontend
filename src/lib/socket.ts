import { io } from "socket.io-client";
import { Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "./types";

// "undefined" means the URL will be computed from the `window.location` object
const URL = import.meta.env.VITE_SOCKET_URL as string;

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  URL,
  {
    autoConnect: true,
  }
);
