import { Button } from "./ui/button";
import { Link } from "@tanstack/react-router";

export default function ErrorComponent() {
  return (
    <div className="h-full w-full justify-center items-center">
      <h2 className="text-3xl font-bold text-center">Something Went Wrong</h2>
      <Button
        asChild
        className="w-fit"
      >
        <Link href="/">Reset</Link>
      </Button>
    </div>
  );
}
