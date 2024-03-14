import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/components/auth-provider";
import ChatBubble from "@/components/chat-bubble";
import { fetcher } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import SignOut from "@/components/sign-out";
import { Room } from "@/lib/types";

export const Route = createFileRoute("/_protected/chats")({
  component: ChatsPage,
  validateSearch: (
    search: Record<string, unknown>
  ): {
    room?: number | null;
  } => {
    return {
      room: typeof search.room === "number" ? search.room : null,
    };
  },
});

function ChatsPage() {
  const { user, token } = useAuth();

  const { data: rooms, isLoading: isRoomsLoading } = useQuery<Room[]>({
    queryKey: ["rooms"],
    queryFn: async () => {
      return await fetcher("/rooms", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
  });

  return (
    <div className="flex flex-col h-screen max-h-screen border-t">
      <div className="flex items-center p-4 border-b w-full">
        <div className="flex items-center gap-4 w-full justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="size-12 border">
              <AvatarFallback>{user?.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="mr-5">
              <div className="font-semibold">{user?.username}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 flex gap-x-1 items-center">
                <div className="rounded-full size-2 bg-green-500"></div>
                Online
              </div>
            </div>
          </div>
          <div className="font-semibold text-center">
            <p className="text-xl">
              Welcome to <span className="underline">Chatify</span>
            </p>
            <p className="text-muted-foreground text-sm">
              Fans Windah Chatroom
            </p>
          </div>
          <SignOut
            variant="destructive"
            size="sm"
          >
            Sign Out
          </SignOut>
        </div>
      </div>
      <div className="flex-1 flex border-t h-[calc(100%-200px)]">
        <div className="w-[300px] border-r h-full">
          <div className="flex flex-col h-full">
            <div className="w-full p-4 border-b">
              <div className="font-semibold">Messages</div>
            </div>
            <div className="flex-1 overflow-y-auto max-h-full flex flex-col justify-between gap-4">
              <ul className="p-4">
                {isRoomsLoading ? (
                  [1, 3, 4].map((i) => (
                    <li
                      className="flex items-center gap-4 py-4"
                      key={i}
                    >
                      <div className="flex items-center gap-4">
                        <Skeleton className="size-12 border rounded-full" />
                        <div className="">
                          <Skeleton className="w-28 h-4" />
                          <Skeleton className="w-16 h-2 mt-2" />
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <>
                    {rooms &&
                      rooms.map((room) => {
                        return (
                          <li
                            className="flex items-center gap-4 py-4"
                            key={room.id}
                          >
                            <Link
                              className="flex items-center gap-4"
                              to="/chats"
                              search={{ room: room.id }}
                            >
                              <Avatar className="size-12 border">
                                <AvatarFallback>FW</AvatarFallback>
                              </Avatar>
                              <div className="">
                                <p className="font-medium truncate">
                                  {room.name}
                                </p>
                                <p className="text-xs font-medium text-muted-foreground">
                                  {room.code}
                                </p>
                              </div>
                            </Link>
                          </li>
                        );
                      })}
                  </>
                )}
              </ul>
              <div className="flex items-stretch justify-center gap-2 px-4 mb-4">
                <Button className="flex-1">Join Room</Button>
                <Button
                  className="flex-1"
                  variant={"secondary"}
                >
                  Create Room
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto bg-gray-100 p-4 dark:bg-gray-800">
              <div className="grid gap-4">
                <ChatBubble
                  message="Apa kabar kamu?"
                  position="right"
                  username="agus_bw"
                />
                <ChatBubble
                  message="Baik, kamu gimana?"
                  username="rara"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t flex items-center gap-x-2 p-2">
        <Textarea
          className="min-h-[40px] resize-none flex-1"
          placeholder="Type a message..."
        />
        <Button className="h-10">Send</Button>
      </div>
    </div>
  );
}
