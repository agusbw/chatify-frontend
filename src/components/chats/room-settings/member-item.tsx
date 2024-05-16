import { XIcon } from "lucide-react";
import { AvatarFallback, Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getInitialName } from "@/lib/utils";
import * as React from "react";
import { useAuth } from "@/components/auth-provider";
import { toast } from "sonner";
import { useSocket } from "@/components/socket-provider";
import { useQueryClient } from "@tanstack/react-query";
import { useSettingMode } from "@/components/setting-mode-provider";
import { type KickMember } from "@/lib/types";
import { useRouter } from "@tanstack/react-router";
import { Route } from "@/routes/_protected/_layout.chats";

type MemberItemProps = {
  data: {
    room: {
      creatorId: number;
      id: number;
    };
    member: {
      id: number;
      username: string;
      joinedAt: Date;
    };
  };
};

function MemberItem({ data }: MemberItemProps) {
  const { room, member } = data;
  const { user } = useAuth();
  const { socket } = useSocket();
  const search = Route.useSearch();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const queryClient = useQueryClient();
  const { setSettingMode } = useSettingMode();

  React.useEffect(() => {
    if (!socket) return;

    function onMemberKicked(data: KickMember) {
      console.log("Received memberKicked event:", data.memberId, user?.id);
      if (data.memberId !== user?.id) {
        toast.success("Yashhh you kicked him/her in the ass 🦶🏻");
      }
      queryClient.invalidateQueries({ queryKey: ["room"] });
      setLoading(false);
    }

    function onErrorKickMember(data: { error: string }) {
      toast.error("Failed to kick member: " + data.error);
      setLoading(false);
    }

    socket.on("memberKicked", onMemberKicked);
    socket.on("errorKickMember", onErrorKickMember);

    return () => {
      socket.off("memberKicked", onMemberKicked);
      socket.off("errorKickMember", onErrorKickMember);
    };
  }, [
    socket,
    queryClient,
    router.history,
    setSettingMode,
    search.room,
    user?.id,
  ]);

  async function handleKickMember() {
    const doAction = confirm(`Kick ${member.username} from the room?`);
    if (!doAction) return;

    socket?.emit("kickMember", {
      roomId: room.id,
      memberId: member.id,
    });
    setLoading(true);
  }

  return (
    <div className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-100 p-4 dark:border-gray-800 dark:bg-gray-800">
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarFallback>{getInitialName(member.username)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">{member.username}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Joined:{" "}
            {member.joinedAt.toLocaleDateString("id-ID", {
              year: "2-digit",
              day: "2-digit",
              month: "2-digit",
            })}
          </p>
        </div>
      </div>
      {member.id !== user?.id && room.creatorId === user?.id && (
        <Button
          className="flex items-center"
          size="icon"
          variant="ghost"
          disabled={loading}
          onClick={handleKickMember}
        >
          <XIcon className="h-4 w-4 hover:text-destructive transition-colors" />
          <span className="sr-only">Kick Member</span>
        </Button>
      )}
    </div>
  );
}
export default MemberItem;
