import { Avatar, AvatarFallback } from "./ui/avatar";

export default function ChatBubble({
  username,
  message,
  position = "left",
}: {
  username: string;
  message: string;
  position?: "left" | "right";
}) {
  if (position === "right") {
    return (
      <div className="flex items-end gap-4 justify-end">
        <div className="rounded-lg p-4 bg-gray-200 dark:bg-gray-900">
          {message}
        </div>
        <div className="flex items-center gap-1">
          <Avatar className="border hidden sm:block">
            <AvatarFallback>{username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="text-sm font-semibold">{username}</div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-4">
      <div className="flex items-center gap-1">
        <Avatar className="border hidden sm:block">
          <AvatarFallback>{username[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="text-sm font-semibold">{username}</div>
      </div>
      <div className="rounded-lg p-4 bg-gray-200 dark:bg-gray-900">
        {message}
      </div>
    </div>
  );
}
