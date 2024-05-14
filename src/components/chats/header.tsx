import SignOut from "@/components/sign-out";
import { LogOut } from "lucide-react";
import { useAuth } from "../auth-provider";
import { Route } from "@/routes/_protected/_layout.chats";
import * as React from "react";
import { useRooms, useSocket } from "@/lib/hooks";
import { cn, getInitialName } from "@/lib/utils";

function Header() {
  const { user } = useAuth();
  const search = Route.useSearch();
  const roomsQuery = useRooms();
  const { isConnected } = useSocket();

  const selectedRoom = React.useMemo(() => {
    if (!search.room || !roomsQuery.data) {
      return null;
    }
    return roomsQuery.data.find((room) => room.id === search.room) || null;
  }, [search.room, roomsQuery]);

  return (
    <div className="flex items-center p-4 border-b w-full justify-between">
      <div className="flex items-center gap-2">
        <div className="size-12 border hidden  rounded-full p-4 sm:flex items-center justify-center">
          {user && getInitialName(user.username)}
        </div>
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
              <p>
                {isConnected ? (
                  "Connect"
                ) : (
                  <>
                    Offline <br /> Reload or check your connection{" "}
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="font-semibold text-center text-muted-foreground max-w-xs">
        {selectedRoom?.name ? (
          <p className="text-xs line-clamp-2">
            <span className="text-lg">Chatify</span>
            <br />
            {selectedRoom?.name}
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
  );
}
export default Header;
