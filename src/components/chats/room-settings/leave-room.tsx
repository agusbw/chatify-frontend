import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-provider";
import { useQueryClient } from "@tanstack/react-query";
import * as React from "react";
import { toast } from "sonner";
import { useRouter } from "@tanstack/react-router";
import { useSettingMode } from "@/components/setting-mode-provider";
import { useSocket } from "@/components/socket-provider";
import { type SocketResponseError } from "@/lib/types";

function LeaveRoom({ roomId }: { roomId: number | null }) {
  const { socket } = useSocket();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { setSettingMode } = useSettingMode();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!socket) return;

    function onSuccessLeaveRoom() {
      router.history.push("/chats?room=null");
      toast.success(`Leave room successfully!`);
      setLoading(false);
      setSettingMode(false);
    }

    function onErrorLeaveRoom(data: SocketResponseError) {
      setLoading(false);
      toast(data.error);
    }

    socket.on("successLeaveRoom", onSuccessLeaveRoom);
    socket.on("errorLeaveRoom", onErrorLeaveRoom);

    return () => {
      socket.off("successLeaveRoom");
      socket.off("errorLeaveRoom");
    };
  }, [socket, queryClient, router.history, setSettingMode, user?.id]);

  async function handleLeaveRoom() {
    const doAction = confirm(`Leave the the room?`);
    if (!doAction) return;
    setLoading(true);
    socket?.emit("leaveRoom", {
      roomId: roomId as number,
    });
  }

  return (
    <Button
      className="flex items-center"
      size="sm"
      variant="outline"
      disabled={loading}
      onClick={handleLeaveRoom}
    >
      Leave
    </Button>
  );
}
export default LeaveRoom;
