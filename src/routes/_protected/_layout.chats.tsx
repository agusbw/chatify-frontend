import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import RoomSection from "@/components/chats/room-list/room-section";
import { useRoomMessages } from "@/lib/hooks";
import type { Message } from "@/lib/types";
import ChatSection from "@/components/chats/chat-section/chat-section";
import SendMessage from "@/components/chats/chat-section/send-message";
import { toast } from "sonner";
import { z } from "zod";
import RoomSetting from "@/components/chats/room-settings/room-setting";
import { useSettingMode } from "@/components/setting-mode-provider";

export const Route = createFileRoute("/_protected/_layout/chats")({
  component: ChatsPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      room: z.number().nullable().catch(null).parse(search.room),
    };
  },
});

function ChatsPage() {
  const search = Route.useSearch();
  const messagesQuery = useRoomMessages(search.room);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const chatContainerRef = React.useRef<HTMLDivElement>(null);
  const { settingMode } = useSettingMode();

  React.useEffect(() => {
    if (messagesQuery.status === "success") {
      setMessages(messagesQuery.data);
    }
    if (messagesQuery.status === "error") {
      toast.error(`${messagesQuery.error.message}`);
    }
  }, [messagesQuery.status, messagesQuery.data, messagesQuery.error]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight -
        chatContainerRef.current.clientHeight;
    }
  };

  React.useLayoutEffect(scrollToBottom, [messages]);

  return (
    <div className="flex-grow overflow-y-auto flex flex-row">
      <RoomSection />
      {settingMode ? (
        <div className="w-full overflow-auto">
          <RoomSetting />
        </div>
      ) : (
        <div className="flex flex-col w-full overflow-auto">
          <div
            ref={chatContainerRef}
            className="overflow-y-auto bg-gray-100 p-4 flex-1 dark:bg-gray-800"
          >
            <ChatSection
              isMessagesLoading={messagesQuery.isLoading}
              messages={messages}
              isMessagesError={messagesQuery.isError}
            />
          </div>
          <SendMessage
            messages={messages}
            handleMessagesChange={setMessages}
          />
        </div>
      )}
    </div>
  );
}
