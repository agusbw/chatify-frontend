import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-provider";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { deleteRoom } from "@/lib/actions";
import { toast } from "sonner";
import { useRouter } from "@tanstack/react-router";
import { useSettingMode } from "@/components/setting-mode-provider";

function DeleteRoom({ roomId }: { roomId: number | null }) {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const { setSettingMode } = useSettingMode();
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: async () => await deleteRoom(token, roomId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["room"],
      });
    },
  });

  async function handleDeleteRoom() {
    const doAction = confirm(`Delete the the room?`);
    if (!doAction) return;
    const res = await mutation.mutateAsync();
    const msg = await res.json();
    if (!res.ok) {
      toast.error(msg.error);
      return;
    }
    setSettingMode(false);
    router.history.push("/chats?room=null");
    toast(`Delete room successfully!`);
  }
  return (
    <Button
      className="flex items-center"
      size="sm"
      variant="destructive"
      disabled={mutation.isPending}
      onClick={handleDeleteRoom}
    >
      Delete
    </Button>
  );
}
export default DeleteRoom;
