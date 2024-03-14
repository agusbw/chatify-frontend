import { Button } from "./ui/button";
import { useRouter } from "@tanstack/react-router";
import { useAuth } from "./auth-provider";

const SignOut = ({
  className,
  children,
  variant,
  size,
  ...props
}: {
  className?: string;
  children?: React.ReactNode;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const { logout } = useAuth();
  const router = useRouter();

  return (
    <Button
      onClick={() => {
        logout();
        router.history.push("/");
      }}
      className={className}
      variant={variant}
      size={size}
      {...props}
    >
      {children}
    </Button>
  );
};

export default SignOut;
