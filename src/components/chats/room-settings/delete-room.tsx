import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "@tanstack/react-router";
import { useSettingMode } from "@/components/setting-mode-provider";
import { type SuccessDeleteRoom, type SocketResponseError } from "@/lib/types";
import { useSocket } from "@/components/socket-provider";
import * as React from "react";
import { useAuth } from "@/components/auth-provider";

function DeleteRoom({ roomId }: { roomId: number | null }) {
  const { socket } = useSocket();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { setSettingMode } = useSettingMode();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!socket) return;

    function onSuccessDeleteRoom(data: SuccessDeleteRoom) {
      if (user?.id === data.deletedBy) {
        router.history.push("/chats?room=null");
        toast.success(`Delete room successfully!`);
        setLoading(false);
        setSettingMode(false);
      }
    }
    function onErrorDeleteRoom(data: SocketResponseError) {
      toast(data.error);
      setLoading(false);
    }

    socket.on("successDeleteRoom", onSuccessDeleteRoom);
    socket.on("errorDeleteRoom", onErrorDeleteRoom);

    return () => {
      socket.off("successDeleteRoom");
      socket.off("errorDeleteRoom");
    };
  }, [socket, queryClient, router.history, setSettingMode, user?.id]);

  async function handleDeleteRoom() {
    const doAction = confirm(`Delete the the room?`);
    if (!doAction) return;
    setLoading(true);
    socket?.emit("deleteRoom", {
      roomId: roomId as number,
    });
  }

  return (
    <Button
      className="flex items-center"
      size="sm"
      variant="destructive"
      disabled={loading}
      onClick={handleDeleteRoom}
    >
      Delete
    </Button>
  );
}
export default DeleteRoom;
