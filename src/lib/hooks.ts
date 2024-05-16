import { fetcher } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import * as React from "react";
import { roomDetailSchema, roomSchema, sendMessageSchema } from "./schema";
import { z } from "zod";
import { useAuth } from "@/components/auth-provider";

export function useRoom(roomId: number | null) {
  const { token } = useAuth();
  const query = useQuery({
    queryKey: ["room", roomId],
    queryFn: async () => {
      const res = await fetcher(`/rooms/${roomId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return roomDetailSchema.parse(res);
    },
  });

  return query;
}

export function useRooms() {
  const { token } = useAuth();
  const query = useQuery({
    queryKey: ["room", "rooms"],
    queryFn: async () => {
      const res = await fetcher("/rooms", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return z.array(roomSchema).parse(res);
    },
  });

  return query;
}

export function useRoomMessages(roomId: number | null) {
  const { token } = useAuth();
  const query = useQuery({
    queryKey: ["rooms", roomId],
    queryFn: async () => {
      const res = await fetcher(`/rooms/${roomId}/messages`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return z.array(sendMessageSchema).parse(res);
    },
    enabled: Boolean(roomId),
    retry: 1,
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
