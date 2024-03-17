import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { registerUserSchema } from "@/lib/schema";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-provider";
import * as React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RegisterUser } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
  beforeLoad: async ({ context }) => {
    if (context.auth.token) {
      throw redirect({
        to: "/chats",
        replace: true,
      });
    }
  },
});

function RegisterPage() {
  const auth = useAuth();
  const router = useRouter();
  const form = useForm<RegisterUser>({
    resolver: zodResolver(registerUserSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  React.useEffect(() => {
    if (auth.token) {
      router.history.push("/chats");
    }
  }, [auth.token, auth.user, router.history]);

  async function onSubmit(values: RegisterUser) {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/register`, {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.status === 400) {
      toast.error("Username already exists");
      return;
    }

    if (!res.ok) {
      toast.error("An error occurred, please try again later");
      return;
    }

    toast.success("Account created successfully");
    await auth.login(values.username, values.password);
    form.reset();
  }

  return (
    <div className="p-2 h-screen max-h-screen px-5 w-screen flex items-center justify-center relative">
      <div className="w-[300px] max-w-full">
        <p className="text-2xl font-bold">Create an Account</p>
        <p className="mb-3 text-muted-foreground">
          Register to get your access!
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Username"
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Password"
                      autoComplete="off"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Confirm Password"
                      autoComplete="off"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="w-full"
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              Register
            </Button>
          </form>
        </Form>
        <Button
          asChild
          variant={"secondary"}
          className="absolute top-0 right-0 m-5 sm:m-10"
        >
          <Link to="/">Sign in</Link>
        </Button>
      </div>
    </div>
  );
}
