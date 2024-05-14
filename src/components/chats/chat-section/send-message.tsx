import { useState } from "react";
import { Textarea } from "../../ui/textarea";
import { Message } from "@/lib/types";
import { toast } from "sonner";
import { useRooms, useSocket } from "@/lib/hooks";
import { useAuth } from "../../auth-provider";
import * as React from "react";
import { Route } from "@/routes/_protected/_layout.chats";
import { v4 as uuidv4 } from "uuid";
import { sendMessageSchema } from "@/lib/schema";
import { Send } from "lucide-react";
import { Button } from "../../ui/button";

function SendMessage({
  handleMessagesChange,
  messages,
}: {
  handleMessagesChange: React.Dispatch<React.SetStateAction<Message[]>>;
  messages: Message[];
}) {
  const [message, setMessage] = useState("");
  const { user } = useAuth();
  const { socket } = useSocket();
  const search = Route.useSearch();
  const roomsQuery = useRooms();
  const selectedRoom = React.useMemo(() => {
    if (!search.room || !roomsQuery.data) {
      return null;
    }
    return roomsQuery.data.find((room) => room.id === search.room) || null;
  }, [search.room, roomsQuery]);

  React.useEffect(() => {
    if (!socket) return;
    function onSuccessSendMessage(v: Message) {
      messages.find((msg) => msg.id === v.id)
        ? null
        : handleMessagesChange((prev: Message[]) => [
            ...prev,
            {
              ...v,
              sentAt: new Date(v.sentAt),
            },
          ]);
    }
    function onErrorSendMessage({
      messageId,
      error,
    }: {
      messageId: string;
      error: string;
    }) {
      toast.error("Failed to send message: " + error);
      handleMessagesChange((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== messageId)
      );
    }

    socket.on("successSendMessage", onSuccessSendMessage);
    socket.on("errorSendMessage", onErrorSendMessage);

    return () => {
      socket.off("successSendMessage");
      socket.off("errorSendMessage");
    };
  }, [socket, handleMessagesChange, messages]);

  function handleSentMessage() {
    if (!user || !selectedRoom || !socket) return null;

    const payload: Message = {
      messageText: message.trim(),
      room: {
        id: selectedRoom.id,
        name: selectedRoom.name,
      },
      sender: {
        id: user.id || 0,
        username: user.username,
      },
      id: uuidv4(),
      sentAt: new Date(),
    };

    const result = sendMessageSchema.safeParse(payload);
    if (!result.success) {
      toast.error(`Failed to send message ${result.error} `);
      return;
    } else {
      const data = result.data;
      handleMessagesChange((prev) => [...prev, data]);
      socket.emit("sendMessage", data);
      setMessage("");
    }
  }

  return (
    <div className="border-t flex h-fit  gap-x-2 p-2">
      <Textarea
        className="max-h-[40px] resize-none"
        placeholder="Type a message..."
        onChange={(e) => setMessage(e.target.value.trimStart())}
        value={message}
      />
      <Button
        className="h-10"
        onClick={() => handleSentMessage()}
        disabled={!message || !selectedRoom}
      >
        <Send className="size-4 mr-2" />
        Send
      </Button>
    </div>
  );
}
export default SendMessage;
