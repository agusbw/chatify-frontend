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
import type { JoinRoom } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { joinRoom } from "@/lib/actions";
import { toast } from "sonner";
import { useState } from "react";

export default function JoinRoom({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const form = useForm<JoinRoom>({
    resolver: zodResolver(joinRoomSchema),
    defaultValues: {
      code: "",
    },
  });
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (values: JoinRoom) => await joinRoom(values),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["rooms"],
      });
    },
  });

  async function onSubmit(values: JoinRoom) {
    const res = await mutation.mutateAsync(values);
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error);
      return;
    }
    toast("Entering the room, happy chatting!");
    form.reset();
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
          className={className}
          onClick={() => setOpen(true)}
        >
          Join Room
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
                disabled={form.formState.isSubmitting}
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
