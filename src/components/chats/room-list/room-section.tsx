import { useResponsive, useRooms } from "@/lib/hooks";
import * as React from "react";
import { Route } from "@/routes/_protected/_layout.chats";
import { Button } from "../../ui/button";
import {
  ChevronLeft,
  ChevronRight,
  TicketCheck,
  SquarePlus,
  MessageCirclePlus,
  Settings,
} from "lucide-react";
import { cn, getInitialName } from "@/lib/utils";
import JoinRoom from "./join-room";
import CreateRoom from "./create-room";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { useSettingMode } from "@/components/setting-mode-provider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type Room = {
  id: number;
  code: string;
  name: string;
  createdAt: Date;
  creatorId: number;
};

function RoomSection() {
  const rooms = useRooms();
  const isMobile = useResponsive();
  const [isSidebarMobile, setIsSidebarMobile] = React.useState(isMobile);

  const width = isSidebarMobile
    ? "w-[70px] max-w-[70px]"
    : "w-[400px]  max-w-[300px]";

  return (
    <div className={cn(`border-r relative transition-all duration-300`, width)}>
      <Button
        className="absolute right-[-44px] top-1 rounded-full z-50"
        size={"sm"}
        variant={"outline"}
        onClick={() => {
          setIsSidebarMobile(!isSidebarMobile);
        }}
      >
        {isSidebarMobile ? (
          <ChevronRight size={14} />
        ) : (
          <ChevronLeft size={14} />
        )}
      </Button>

      <div className="flex flex-col max-h-full">
        <div
          className={cn(
            "flex gap-2 px-4 mt-4",
            isSidebarMobile
              ? "flex-col items-center justify-center mb-3"
              : "flex-row items-stretch justify-center"
          )}
        >
          <JoinRoom className="flex-1">
            {isSidebarMobile ? (
              <TicketCheck className="size-5" />
            ) : (
              <p>Join Room</p>
            )}
          </JoinRoom>
          <CreateRoom className="flex-1">
            {isSidebarMobile ? (
              <SquarePlus className="size-5" />
            ) : (
              <p>Create Room</p>
            )}
          </CreateRoom>
        </div>

        {!isSidebarMobile && (
          <div className="font-semibold w-full border-b p-4 truncate">
            Chat rooms
          </div>
        )}
        <div className="overflow-y-auto  flex-1 flex flex-col justify-between">
          {rooms.data &&
            rooms.data.map((room) => {
              return isSidebarMobile ? (
                <MobileRoomItem
                  room={room}
                  key={room.id}
                />
              ) : (
                <RoomItem
                  room={room}
                  key={room.id}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
}

function MobileRoomItem({ room }: { room: Room }) {
  const { settingMode, setSettingMode } = useSettingMode();
  const search = Route.useSearch();
  return (
    <Link
      className={cn(
        "flex items-center justify-center w-full px-4 py-3 border-b hover:bg-muted-foreground/10",
        search.room === room.id ? "bg-muted-foreground/10" : ""
      )}
      to="/chats"
      search={{
        room: room.id,
      }}
      onClick={() => {
        if (settingMode) {
          setSettingMode(false);
        }
      }}
    >
      <Avatar>
        <AvatarFallback className="border rounded-full p-4 flex items-center justify-center">
          {getInitialName(room.name)}
        </AvatarFallback>
      </Avatar>
    </Link>
  );
}

function RoomItem({ room }: { room: Room }) {
  const search = Route.useSearch();
  const { setSettingMode } = useSettingMode();

  return (
    <div
      className={cn(
        "flex items-center w-full px-4 py-3 border-b hover:bg-muted-foreground/10",
        search.room === room.id ? "bg-muted-foreground/10" : ""
      )}
    >
      <Avatar>
        <AvatarFallback className="border  rounded-full p-4 flex items-center justify-center">
          {getInitialName(room.name)}
        </AvatarFallback>
      </Avatar>
      <div className="ml-4 flex justify-between w-full gap-x-4">
        <div className="max-w-full">
          <p className="font-medium text-sm truncate max-w-[140px]">
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
        <div className="flex gap-x-2 justify-end items-center flex-1">
          <Link
            to="/chats"
            search={{ room: room.id }}
            onClick={() => setSettingMode(false)}
          >
            <MessageCirclePlus
              size={20}
              className="text-muted-foreground hover:text-primary"
            />
          </Link>
          <Link
            to="/chats"
            search={{ room: room.id }}
            onClick={() => setSettingMode(true)}
          >
            <Settings
              size={20}
              className="text-muted-foreground hover:text-primary"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RoomSection;
