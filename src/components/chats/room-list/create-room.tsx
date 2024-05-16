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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createRoomSchema } from "@/lib/schema";
import type {
  CreateRoom,
  SocketResponseError,
  SuccessCreateRoom,
} from "@/lib/types";
import { useQueryClient } from "@tanstack/react-query";
import * as React from "react";
import { toast } from "sonner";
import { useState } from "react";
import { useSocket } from "@/components/socket-provider";
import { useRouter } from "@tanstack/react-router";
import { useSettingMode } from "@/components/setting-mode-provider";

export default function CreateRoom({
  className,
  size,
  children,
  variant = "secondary",
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
  const form = useForm<CreateRoom>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      name: "",
    },
  });
  const queryClient = useQueryClient();

  React.useEffect(() => {
    if (!socket) return;

    function onSuccessCreateRoom(data: SuccessCreateRoom) {
      setLoading(false);
      console.log("room created");
      toast.success(`Create room successfully!`);
      router.history.push(`/chats?room=${data.roomId}`);
      queryClient.invalidateQueries({
        queryKey: ["room"],
      });
      form.reset();
      setSettingMode(false);
    }

    function onErrorCreateRoom(data: SocketResponseError) {
      setLoading(false);
      toast(data.error);
    }

    socket.on("successCreateRoom", onSuccessCreateRoom);
    socket.on("errorCreateRoom", onErrorCreateRoom);

    return () => {
      socket.off("successCreateRoom");
      socket.off("errorCreateRoom");
    };
  }, [socket, queryClient, router.history, setSettingMode, form]);

  async function onSubmit(values: CreateRoom) {
    if (!socket) return;
    setLoading(true);
    socket.emit("createRoom", {
      name: values.name,
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
          variant={variant}
          size={size}
          className={className}
          onClick={() => setOpen(true)}
        >
          {children || "Create Room"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Create Room</DialogTitle>
              <DialogDescription>
                Create a new chat room and invite others to join.
              </DialogDescription>
            </DialogHeader>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-4 items-center gap-x-4 gap-y-2 my-4">
                    <FormLabel>Room Name</FormLabel>
                    <FormControl className="col-span-3">
                      <Input
                        placeholder="Enter a room name"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <div></div>
                    <FormMessage className="col-span-3" />
                  </div>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="submit"
                disabled={loading}
              >
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
