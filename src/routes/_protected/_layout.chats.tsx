import { createFileRoute, useRouter } from "@tanstack/react-router";
import * as React from "react";
import RoomSection from "@/components/chats/room-list/room-section";
import { useRoomMessages } from "@/lib/hooks";
import type { KickMember, Message, SuccessDeleteRoom } from "@/lib/types";
import ChatSection from "@/components/chats/chat-section/chat-section";
import SendMessage from "@/components/chats/chat-section/send-message";
import { toast } from "sonner";
import { z } from "zod";
import RoomSetting from "@/components/chats/room-settings/room-setting";
import { useSettingMode } from "@/components/setting-mode-provider";
import { useSocket } from "@/components/socket-provider";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/components/auth-provider";

export const Route = createFileRoute("/_protected/_layout/chats")({
  component: ChatsPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      room: z.number().nullable().catch(null).parse(search.room),
    };
  },
});

function ChatsPage() {
  const { user } = useAuth();
  const search = Route.useSearch();
  const queryClient = useQueryClient();
  const router = useRouter();
  const messagesQuery = useRoomMessages(search.room);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const chatContainerRef = React.useRef<HTMLDivElement>(null);
  const { socket } = useSocket();
  const { settingMode, setSettingMode } = useSettingMode();

  React.useEffect(() => {
    if (messagesQuery.status === "success") {
      setMessages(messagesQuery.data);
    }
    if (messagesQuery.status === "error") {
      toast.error(`${messagesQuery.error.message}`);
    }
  }, [messagesQuery.status, messagesQuery.data, messagesQuery.error]);

  React.useEffect(() => {
    if (!socket) return;
    function onMemberKicked(data: KickMember) {
      if (data.memberId === user?.id) {
        if (search.room === data.roomId) {
          router.history.push("/chats?room=null");
        }
      }
      queryClient.invalidateQueries({ queryKey: ["room"] });
    }

    function onSuccessDeleteRoom(data: SuccessDeleteRoom) {
      if (data.deletedBy !== user?.id) {
        if (search.room === data.deletedRoom) {
          toast.error("This room has been deleted by the creator");
          router.history.push("/chats?room=null");
          if (settingMode) setSettingMode(false);
        }
      }
      queryClient.invalidateQueries({ queryKey: ["room"] });
    }

    socket.on("memberKicked", onMemberKicked);
    socket.on("successDeleteRoom", onSuccessDeleteRoom);

    return () => {
      socket.off("memberKicked", onMemberKicked);
    };
  }, [
    queryClient,
    socket,
    router.history,
    search.room,
    user?.id,
    setSettingMode,
    settingMode,
  ]);

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
            chatContainerRef={chatContainerRef}
          />
        </div>
      )}
    </div>
  );
}
