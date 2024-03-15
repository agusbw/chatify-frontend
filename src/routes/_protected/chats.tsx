import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/components/auth-provider";
import ChatBubble from "@/components/chat-bubble";
import { fetcher } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, LogOut } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import SignOut from "@/components/sign-out";
import { Room } from "@/lib/types";
import CreateRoom from "@/components/create-room";
import JoinRoom from "@/components/join-room";
import { toast } from "sonner";

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
    queryFn: () => {
      return fetcher("/rooms", {
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
          <div className="sm:flex items-center gap-2 hidden">
            <Avatar className="size-12 border sm:block">
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
            <p className="text-muted-foreground text-sm line-clamp-2 max-w-xs">
              Fans Windah Chatroom
            </p>
          </div>
          <div className="">
            <SignOut
              variant="destructive"
              size="sm"
            >
              <LogOut className="size-4" />
            </SignOut>
          </div>
        </div>
      </div>
      <div className="flex-1 flex border-t h-[calc(100%-200px)]">
        <div className="w-[300px] border-r h-full hidden sm:block">
          <div className="flex flex-col h-full">
            <div className="flex items-stretch justify-center gap-2 px-4 mt-4">
              <JoinRoom className="flex-1" />
              <CreateRoom className="flex-1" />
            </div>
            <div className="w-full p-4 border-b">
              <div className="font-semibold">Chat rooms</div>
            </div>
            <div className="flex-1 overflow-y-auto max-h-full flex flex-col justify-between gap-4">
              <ul className="">
                {isRoomsLoading ? (
                  [1, 2, 3, 4].map((i) => (
                    <li
                      className="flex items-center gap-4 px-4 py-3 border-y"
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
                            className="flex items-center gap-4 border-y hover:bg-muted-foreground/10 transition-colors duration-300"
                            key={room.id}
                          >
                            <Link
                              className="flex items-center gap-4 w-full px-4 py-3 "
                              to="/chats"
                              search={{ room: room.id }}
                            >
                              <Avatar className="size-12 border">
                                <AvatarFallback>
                                  {room.name[0].toUpperCase() +
                                    room.name[1].toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="">
                                <p className="font-medium truncate">
                                  {room.name}
                                </p>
                                <p
                                  className="text-xs font-medium text-muted-foreground w-fit cursor-copy"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    navigator.clipboard.writeText(room.code);
                                    toast("Room code copied to clipboard");
                                  }}
                                >
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
        <Button className="h-10">
          <Send className="size-4 mr-2" />
          Send
        </Button>
      </div>
    </div>
  );
}
