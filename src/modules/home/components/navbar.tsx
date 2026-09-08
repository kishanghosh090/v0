import Link from "next/link";
import {
  SignInButton,
  SignUpButton,
  UserButton,
  SignOutButton,
  Show,
} from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { currentUser } from "@clerk/nextjs/server";

const Navbar = () => {
  return (
    <nav className="p-4 bg-transparent fixed top-0 left-0 right-0 z-50 transition-all duration-200 border-b border-transparent">
      <div className="max-w-5xl mx-auto w-full flex justify-between items-center">
        <Link href={"/"} className="flex items-center gap-2">
          <Logo className="h-12 w-auto shrink-0 text-foreground invert dark:invert-0" />
        </Link>
        {/* <Show when={"signed-in"}>
          <SignOutButton>
            <div className="flex gap-2">
              <Button variant={"outline"}>Sign Out</Button>
            </div>
          </SignOutButton>
        </Show> */}

        <Show when={"signed-out"}>
          <div className=" flex gap-2">
            <SignInButton>
              <Button variant={"outline"} size={"sm"}>
                Sign In
              </Button>
            </SignInButton>

            <SignUpButton>
              <Button size={"sm"}>Sign Up</Button>
            </SignUpButton>
          </div>
        </Show>
        <Show when={"signed-in"}>
          <UserButton />
        </Show>
      </div>
    </nav>
  );
};

export default Navbar;
