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
      <div className="flex justify-end relative">
        <div className="rounded-lg px-4 py-2 bg-gray-200 dark:bg-gray-900 max-w-[85%]">
          <p className="whitespace-pre-line">{message}</p>
        </div>
        <div className="w-0 border-t-[6px] border-t-gray-200 border-l-transparent border-r-transparent border-l-[6px] border-r-[6px] -rotate-90 absolute -right-[8.5px] top-[50%] -translate-y-[50%]"></div>
      </div>
    );
  }
  return (
    <div className="flex items-start">
      <div className="flex items-center -mr-1 ">
        <div className="size-10 bg-gray-200 pt-1 rounded-b-full">
          <div className="size-10 bg-gray-100 rounded-tr-[26px] pt-10">
            <Avatar className="border border-gray-400 block -mt-9 -ml-0.5 size-8">
              <AvatarFallback>
                <p className="text-lg">{username[0].toUpperCase()}</p>
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
      <div className="rounded-lg px-4 py-2 bg-gray-200 dark:bg-gray-900 max-w-[85%]">
        <p className="text-sm font-semibold">{username}</p>
        <p className="whitespace-pre-line">{message}</p>
      </div>
      <div></div>
    </div>
  );
}
