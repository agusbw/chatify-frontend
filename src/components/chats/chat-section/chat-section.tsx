import { useAuth } from "../../auth-provider";
import { Route } from "@/routes/_protected/_layout.chats";
import ChatBubble from "./chat-bubble";
import { Loader2 } from "lucide-react";
import { Message } from "@/lib/types";
import { Navigate } from "@tanstack/react-router";

function ChatSection({
  messages,
  isMessagesLoading,
  isMessagesError,
}: {
  messages: Message[];
  isMessagesLoading: boolean;
  isMessagesError: boolean;
}) {
  const { user } = useAuth();
  const search = Route.useSearch();

  if (!search.room)
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground text-xl">
          Select a chat room to start chatting
        </p>
      </div>
    );

  if (isMessagesLoading)
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2
          className="animate-spin"
          size={30}
        />
      </div>
    );

  if (isMessagesError)
    return (
      <Navigate
        to="/chats"
        search={{
          room: null,
        }}
        replace
      />
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
    <div className="grid gap-4">
      {messages.map((message, i) => {
        return (
          <ChatBubble
            key={i}
            message={message.messageText}
            sentAt={message.sentAt}
            username={message.sender.username}
            position={message.sender.id === user?.id ? "right" : "left"}
          />
        );
      })}
    </div>
  );
}

export default ChatSection;
