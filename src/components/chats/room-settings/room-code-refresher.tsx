import { RefreshCw } from "lucide-react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { refreshCode } from "@/lib/actions";
import { useAuth } from "@/components/auth-provider";
import { Route } from "@/routes/_protected/_layout.chats";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

function RoomCodeRefresher() {
  const { token } = useAuth();
  const { room: roomId } = Route.useSearch();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async () => await refreshCode(token, roomId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["room"],
      });
    },
  });
  async function handleRefreshCode() {
    const res = await mutation.mutateAsync();
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error);
      return;
    }
    toast("Room code has been changed");
  }
  return (
    <button
      onClick={handleRefreshCode}
      disabled={mutation.isPending}
    >
      <RefreshCw
        size={12}
        className={cn(
          "text-muted-foreground hover:text-primary mb-0.5",
          mutation.isPending ? "animate-spin" : ""
        )}
      />
    </button>
  );
}
export default RoomCodeRefresher;
