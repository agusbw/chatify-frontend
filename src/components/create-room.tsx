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
import type { CreateRoom } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addRoom } from "@/lib/actions";
import { toast } from "sonner";
import { useState } from "react";

export default function CreateRoom({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const form = useForm<CreateRoom>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      name: "",
    },
  });
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (values: CreateRoom) => await addRoom(values),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["rooms"],
      });
    },
  });

  async function onSubmit(values: CreateRoom) {
    const res = await mutation.mutateAsync(values);
    if (res.status === 400) {
      toast.error("Room name is already taken");
      return;
    }
    const data = await res.json();
    toast(
      <div>
        <p className="font-medium">Room created succesfully</p>
        <p>Code: {data.code}</p>
      </div>
    );
    setOpen(false);
    form.reset();
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
          variant="secondary"
          className={className}
          onClick={() => setOpen(true)}
        >
          Create Room
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
                disabled={form.formState.isSubmitting}
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
