import { XIcon } from "lucide-react";
import { AvatarFallback, Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getInitialName } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { kickMember } from "@/lib/actions";
import { useAuth } from "@/components/auth-provider";
import { toast } from "sonner";

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
  const { token, user } = useAuth();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async () => await kickMember(token, room.id, member.id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["room"],
      });
    },
  });

  async function handleKickMember() {
    const doAction = confirm(`Kick ${member.username} from the room?`);
    if (!doAction) return;
    const res = await mutation.mutateAsync();
    const msg = await res.json();
    if (!res.ok) {
      toast.error(msg.error);
      return;
    }
    toast(`${member.username} kicked 🦶🏻!`);
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
          disabled={mutation.isPending}
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
