import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-provider";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { leaveRoom } from "@/lib/actions";
import { toast } from "sonner";
import { useRouter } from "@tanstack/react-router";
import { useSettingMode } from "@/components/setting-mode-provider";

function LeaveRoom({ roomId }: { roomId: number | null }) {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const { setSettingMode } = useSettingMode();
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: async () => await leaveRoom(token, roomId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["room"],
      });
    },
  });

  async function handleLeaveRoom() {
    const doAction = confirm(`Leave the the room?`);
    if (!doAction) return;
    const res = await mutation.mutateAsync();
    const msg = await res.json();
    if (!res.ok) {
      toast.error(msg.error);
      return;
    }
    setSettingMode(false);
    router.history.push("/chats?room=null");
    toast(`Leave room successfully!`);
  }

  return (
    <Button
      className="flex items-center"
      size="sm"
      variant="outline"
      disabled={mutation.isPending}
      onClick={handleLeaveRoom}
    >
      Leave
    </Button>
  );
}
export default LeaveRoom;
