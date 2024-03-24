import { fetcher } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Room, Message } from "./types";
import { io } from "socket.io-client";
import { Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "./types";
import * as React from "react";

export function useSocket(token: string | null) {
  const [socket, setSocket] = React.useState<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null);

  React.useEffect(() => {
    if (token) {
      const s = io(import.meta.env.VITE_SOCKET_URL as string, {
        autoConnect: false,
        extraHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      s.connect();
      setSocket(s);
    }
  }, [token]);

  return socket;
}

export function useRooms(token: string | null) {
  const query = useQuery<Room[]>({
    queryKey: ["rooms"],
    queryFn: () => {
      return fetcher("/rooms", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
  });

  return query;
}

export function useRoomMessages(
  token: string | null,
  roomId: number | undefined
) {
  const query = useQuery<Message[]>({
    queryKey: ["rooms", roomId],
    queryFn: () => {
      return fetcher(`/rooms/${roomId}/messages`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    enabled: Boolean(roomId),
  });

  return query;
}

export function useResponsive() {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isMobile;
}
