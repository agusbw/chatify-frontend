import * as React from "react";
import type {
  ServerToClientEvents,
  ClientToServerEvents,
  SocketContextType,
} from "@/lib/types";
import { Socket, io } from "socket.io-client";
import { useAuth } from "./auth-provider";

const SocketContext = React.createContext<SocketContextType | undefined>(
  undefined
);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { token, user } = useAuth();
  const [isConnected, setIsConnected] = React.useState(false);
  const [socket, setSocket] = React.useState<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null);

  React.useEffect(() => {
    if (!token) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      setIsConnected(false);
      return;
    }
    console.log("connecting");
    const s = io(import.meta.env.VITE_SOCKET_URL as string, {
      autoConnect: false,
      query: {
        userId: user?.id,
      },
    });

    s.on("connect", () => {
      setIsConnected(true);
      console.log("connected");
    });

    s.on("disconnect", () => {
      setIsConnected(false);
      console.log("disconnected");
    });

    s.connect();
    setSocket(s);

    return () => {
      if (s) {
        s.disconnect();
        s.off("connect");
        s.off("disconnect");
        s.removeAllListeners();
      }
    };
  }, [token, user?.id]);

  const contextValue = {
    socket,
    isConnected,
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => {
  const context = React.useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within an SocketProvider");
  }
  return context;
};
