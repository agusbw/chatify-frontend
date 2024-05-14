import { useRoom } from "@/lib/hooks";
import { Route } from "@/routes/_protected/_layout.chats";
import { Loader2 } from "lucide-react";
import { AvatarFallback, Avatar } from "@/components/ui/avatar";
import RoomCodeRefresher from "./room-code-refresher";
import MemberItem from "./member-item";
import { getInitialName } from "@/lib/utils";
import { useAuth } from "@/components/auth-provider";
import DeleteRoom from "./delete-room";
import LeaveRoom from "./leave-room";

export default function Component() {
  const { room: roomId } = Route.useSearch();
  const { user } = useAuth();
  const { data: room, isLoading } = useRoom(roomId);

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2
          className="animate-spin"
          size={30}
        />
      </div>
    );

  return (
    <div className="mx-auto px-5 max-w-3xl space-y-6 py-12">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarFallback>{room && getInitialName(room.name)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-semibold">{room?.name}</h2>
            <div className="flex items-center space-x-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Code:
                <span className="font-mono"> {room?.code}</span>
              </p>
              <RoomCodeRefresher />
            </div>
          </div>
        </div>
        <div className="flex  gap-2 flex-row items-center md:space-x-2">
          <LeaveRoom roomId={roomId} />
          {user?.id === room?.creatorId && <DeleteRoom roomId={roomId} />}
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Room Members</h3>
        <div className="space-y-2">
          {room &&
            room.usersToRooms.map((userToRoom) => (
              <MemberItem
                key={userToRoom.user.id}
                data={{
                  member: {
                    username: userToRoom.user.username,
                    id: userToRoom.user.id,
                    joinedAt: userToRoom.joinedAt,
                  },
                  room: {
                    creatorId: userToRoom.room.creatorId,
                    id: userToRoom.room.id,
                  },
                }}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
