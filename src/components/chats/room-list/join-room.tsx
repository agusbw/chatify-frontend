import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { joinRoomSchema } from "@/lib/schema";
import {
  type JoinRoom as JoinRoomType,
  type SocketResponseError,
} from "@/lib/types";
import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import { useSocket } from "@/components/socket-provider";
import { useRouter } from "@tanstack/react-router";
import { useSettingMode } from "@/components/setting-mode-provider";

export default function JoinRoom({
  className,
  size,
  children,
  variant,
}: {
  className?: string;
  children?: React.ReactNode;
  size?: "sm" | "lg" | "icon" | undefined;
  variant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined;
}) {
  const [open, setOpen] = useState(false);
  const { socket } = useSocket();
  const router = useRouter();
  const { setSettingMode } = useSettingMode();
  const [loading, setLoading] = React.useState(false);
  const form = useForm<JoinRoomType>({
    resolver: zodResolver(joinRoomSchema),
    defaultValues: {
      code: "",
    },
  });

  const queryClient = useQueryClient();

  React.useEffect(() => {
    if (!socket) return;

    function onSuccessJoinRoom() {
      setLoading(false);
      toast.success(`Join room successfully!`);
      queryClient.invalidateQueries({
        queryKey: ["room"],
      });
      form.reset();
    }

    function onErrorJoinRoom(data: SocketResponseError) {
      setLoading(false);
      toast(data.error);
    }

    socket.on("successJoinRoom", onSuccessJoinRoom);
    socket.on("errorJoinRoom", onErrorJoinRoom);

    return () => {
      socket.off("successJoinRoom");
      socket.off("errorJoinRoom");
    };
  }, [socket, queryClient, router.history, setSettingMode, form]);

  async function onSubmit(values: JoinRoomType) {
    if (!socket) return;
    setLoading(true);
    socket.emit("joinRoom", {
      code: values.code,
    });
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          form.reset();
          setOpen(open);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          size={size}
          variant={variant}
          className={className}
          onClick={() => setOpen(true)}
        >
          {children || "Join Room"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Join Room</DialogTitle>
              <DialogDescription>
                Enter a room code to join the chat room
              </DialogDescription>
            </DialogHeader>

            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem className="my-4">
                  <FormControl>
                    <Input
                      placeholder="Enter a room code"
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="submit"
                disabled={loading}
              >
                Join
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
