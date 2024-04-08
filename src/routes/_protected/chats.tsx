import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { useAuth } from "@/components/auth-provider";
import ChatBubble from "@/components/chat-bubble";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Send,
  LogOut,
  Loader2,
  TicketCheck,
  SquarePlus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import SignOut from "@/components/sign-out";
import {
  Room,
  Message,
  UserAuthData,
  IncommingMessage,
  ChatPageSearch,
} from "@/lib/types";
import CreateRoom from "@/components/create-room";
import JoinRoom from "@/components/join-room";
import { toast } from "sonner";
import {
  useRooms,
  useRoomMessages,
  useResponsive,
  useSocket,
} from "@/lib/hooks";

export const Route = createFileRoute("/_protected/chats")({
  component: ChatsPage,
  validateSearch: (search: Record<string, unknown>): ChatPageSearch => {
    return {
      room: Number(search.room),
    };
  },
});

function ChatsPage() {
  const { user, token } = useAuth();
  const [message, setMessage] = React.useState("");
  const [isConnected, setIsConnected] = React.useState(false);
  const chatContainerRef = React.useRef<HTMLDivElement>(null);
  const search = Route.useSearch();
  const [messages, setMessages] = React.useState<Message[]>([]);
  const roomsQuery = useRooms(token);
  const socket = useSocket(token);
  const {
    data: roomMessages,
    isLoading: isMessagesLoading,
    status: roomMessagesQueryStatus,
  } = useRoomMessages(token, search.room);

  const getSelectedRoom = React.useCallback((): Room | null => {
    if (!search.room || !roomsQuery.data) {
      return null;
    }
    return roomsQuery.data.find((room) => room.id === search.room) || null;
  }, [search.room, roomsQuery]);

  React.useEffect(() => {
    if (roomMessagesQueryStatus === "success") {
      setMessages(roomMessages || []);
    }
  }, [roomMessagesQueryStatus, roomMessages]);

  React.useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight + 300;
    }
  }, [messages]);

  React.useEffect(() => {
    if (!socket) return;

    function onConnect() {
      setIsConnected(true);
    }
    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    socket.on("messageNotSent", ({ messageId, error }) => {
      toast.error("Failed to send message: " + error);
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== messageId)
      );
    });

    return () => {
      socket.disconnect();
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("messageNotSent");
    };
  }, [socket]);

  React.useEffect(() => {
    if (!socket) return;
    function onIncomingMessage(v: IncommingMessage) {
      messages.find((msg) => msg.id === v.id)
        ? null
        : setMessages((prev: Message[]) => [...prev, v]);
    }
    socket.on("incomingMessage", onIncomingMessage);
    return () => {
      socket.off("incomingMessage");
    };
  }, [messages, socket]);

  function handleSentMessage() {
    if (!socket) return null;
    if (!user || !search.room) return null;
    const newMessage = {
      id: messages[messages.length - 1]?.id + 1 || 1,
      messageText: message,
      roomId: search.room,
      room: {
        name: getSelectedRoom()?.name || "",
      },
      sender: {
        username: user.username,
      },
      senderId: user.id || 0,
      sentAt: new Date(),
    };

    setMessages((prev: Message[]) => [...prev, newMessage]);

    socket.emit("messageSent", newMessage);

    setMessage("");
  }

  if (!user || !token) return null;

  return (
    <div className="flex flex-col h-[100svh] max-h-[100svh] border-t max-w-screen overflow-hidden">
      <div className="flex items-center p-4 border-b w-full justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="size-12 border hidden sm:block">
            <AvatarFallback>{user?.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="mr-5">
            <div className="font-semibold text-xs">{user?.username}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 flex gap-x-1 items-center">
              <div
                className={cn(
                  "rounded-full size-2",
                  isConnected ? "bg-green-500" : "bg-red-500"
                )}
              ></div>
              <div>
                {isConnected ? (
                  <p>Connect</p>
                ) : (
                  <p>
                    Offline <br /> Reload or check your connection
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="font-semibold text-center text-muted-foreground max-w-xs">
          {getSelectedRoom()?.name ? (
            <p className="text-xs line-clamp-2">
              <span className="text-lg">Chatify</span>
              <br />
              {getSelectedRoom()?.name}
            </p>
          ) : (
            <p className="text-sm">Chatify!</p>
          )}
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
      <div className="flex-1 flex border-t h-[calc(100%-200px)]">
        <RoomSection roomsQuery={roomsQuery} />
        <div className="flex-1 flex flex-col">
          <div
            ref={chatContainerRef}
            className="flex-1  overflow-y-auto bg-gray-100 p-4 dark:bg-gray-800"
          >
            {isMessagesLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="size-8 animate-spin" />
              </div>
            ) : (
              <ChatSection
                room={getSelectedRoom()}
                messages={messages || []}
                user={user}
              />
            )}
          </div>
          <div className="border-t flex items-center gap-x-2 p-2">
            <Textarea
              className="min-h-[40px] resize-none flex-1"
              placeholder="Type a message..."
              onChange={(e) => setMessage(e.target.value)}
              value={message}
            />
            <Button
              className="h-10"
              disabled={
                isMessagesLoading || message.trim() === "" || !search.room
              }
              onClick={() => handleSentMessage()}
            >
              <Send className="size-4 mr-2" />
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatSection({
  room,
  messages,
  user,
}: {
  room: Room | null;
  messages: Message[];
  user: UserAuthData;
}) {
  if (!room)
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground text-xl">
          Select a chat room to start chatting
        </p>
      </div>
    );

  if (messages.length === 0)
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground text-xl">
          No messages in this room yet
        </p>
      </div>
    );

  return (
    <div className="grid gap-4 ">
      {messages.map((message, i) => {
        return (
          <ChatBubble
            key={i}
            message={message.messageText}
            username={message.sender.username}
            position={message.senderId === user.id ? "right" : "left"}
          />
        );
      })}
    </div>
  );
}

function RoomSection({
  roomsQuery,
}: {
  roomsQuery: ReturnType<typeof useRooms>;
}) {
  const responsive = useResponsive();
  const [isMobile, setIsMobile] = React.useState(responsive);
  const search = Route.useSearch();

  const width = isMobile ? "w-[70px]" : "w-[300px]";

  return (
    <div
      className={`border-r h-full block relative transition-all duration-300 ${width}`}
    >
      <Button
        className="absolute right-[-44px] top-1 rounded-full z-50"
        size={"sm"}
        variant={"outline"}
        onClick={() => {
          setIsMobile(!isMobile);
        }}
      >
        {isMobile ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </Button>

      <div className="flex flex-col h-full">
        <div
          className={cn(
            "flex gap-2 px-4 mt-4",
            isMobile
              ? "flex-col items-center justify-center mb-3"
              : "flex-row items-stretch justify-center"
          )}
        >
          <JoinRoom className="flex-1">
            {isMobile ? <TicketCheck className="size-5" /> : <p>Join Room</p>}
          </JoinRoom>
          <CreateRoom className="flex-1">
            {isMobile ? <SquarePlus className="size-5" /> : <p>Create Room</p>}
          </CreateRoom>
        </div>
        {!isMobile && (
          <div className="font-semibold w-full border-b p-4 truncate">
            Chat rooms
          </div>
        )}

        <div className="flex-1 overflow-y-auto max-h-full flex flex-col justify-between gap-4">
          <ul>
            {roomsQuery.data &&
              roomsQuery.data.map((room) => {
                return (
                  <li
                    className={cn(
                      "flex items-center gap-y-4 border-y hover:bg-muted-foreground/10 transition-colors duration-300",
                      search.room === room.id && "bg-muted-foreground/10"
                    )}
                    key={room.id}
                  >
                    <Link
                      className={cn(
                        "flex items-center w-full px-4 py-3",
                        isMobile ? "justify-center" : ""
                      )}
                      to="/chats"
                      search={{ room: room.id }}
                    >
                      <Avatar
                        className={cn(
                          "border",
                          isMobile ? "size-10" : "size-12"
                        )}
                      >
                        <AvatarFallback>
                          <p className="text-sm">
                            {room.name[0].toUpperCase() +
                              room.name[1].toUpperCase()}
                          </p>
                        </AvatarFallback>
                      </Avatar>
                      {!isMobile && (
                        <div className="ml-4">
                          <p className="font-medium truncate">{room.name}</p>
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
                      )}
                    </Link>
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
    </div>
  );
}
