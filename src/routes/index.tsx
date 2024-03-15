import {
  createFileRoute,
  redirect,
  Link,
  useRouter,
} from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAuth } from "@/components/auth-provider";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { loginSchema } from "@/lib/schema";

export const Route = createFileRoute("/")({
  component: LoginPage,
  validateSearch: (
    search: Record<string, unknown>
  ): {
    redirect?: string | null;
  } => {
    return {
      redirect: typeof search.redirect === "string" ? search.redirect : null,
    };
  },
  beforeLoad: async ({ search, context }) => {
    if (context.auth.token) {
      throw redirect({
        to: search.redirect ? search.redirect : "/chats",
        replace: true,
      });
    }
  },
});

function LoginPage() {
  const router = useRouter();
  const search = Route.useSearch();
  const auth = useAuth();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    if (auth.token) {
      router.history.push(search.redirect ? search.redirect : "/chats");
    }
  }, [auth.token, auth.user, router.history, search.redirect]);

  async function onSubmit(data: z.infer<typeof loginSchema>) {
    const { username, password } = data;
    try {
      await auth.login(username, password);
      toast.success(`Logged in as ${data.username}`);
    } catch (err) {
      if (err instanceof Error) {
        console.log(err);
        toast.error(err.message);
      }
    }
  }

  return (
    <div className="relative w-screen h-screen flex flex-col items-center justify-center sm:items-start sm:pl-72">
      <Button
        asChild
        variant={"secondary"}
        className="absolute top-0 right-0 m-5 sm:m-10"
      >
        <Link
          className=""
          to="/register"
        >
          Register
        </Link>
      </Button>
      <div className="text-center">
        <p className="text-4xl font-semibold">Welcome to Chatify</p>
        <p className="mb-3 text-lg text-muted-foreground">
          Sign in to start chatting with your friends
        </p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2 w-[350px] max-w-screen px-5 sm:px-0"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Username"
                    {...field}
                  />
                </FormControl>
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
                    placeholder="Password"
                    type="password"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit">Sign In</Button>
        </form>
      </Form>
    </div>
  );
}
