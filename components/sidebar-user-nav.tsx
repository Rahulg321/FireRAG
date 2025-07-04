"use client";

import { ChevronUp } from "lucide-react";
import Image from "next/image";
import type { User } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { toast } from "./toast";
import { LoaderIcon } from "./icons";
import { guestRegex } from "@/lib/constants";

export function SidebarUserNav({ user }: { user: User }) {
  const router = useRouter();
  const { data, status } = useSession();
  const { setTheme, resolvedTheme } = useTheme();

  const isGuest = guestRegex.test(data?.user?.email ?? "");

  return (
    <div className="">
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {status === "loading" ? (
                <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent bg-background data-[state=open]:text-sidebar-accent-foreground h-10 justify-between">
                  <div className="flex flex-row gap-2">
                    <div className="size-6 bg-zinc-500/30 rounded-full animate-pulse" />
                    <span className="bg-zinc-500/30 text-transparent rounded-md animate-pulse">
                      Loading auth status
                    </span>
                  </div>
                  <div className="animate-spin text-zinc-500">
                    <LoaderIcon />
                  </div>
                </SidebarMenuButton>
              ) : (
                <SidebarMenuButton
                  data-testid="user-nav-button"
                  className="data-[state=open]:bg-sidebar-accent bg-background data-[state=open]:text-sidebar-accent-foreground h-10"
                >
                  <Image
                    src={
                      data?.user?.image ??
                      `https://avatar.vercel.sh/${user.email}`
                    }
                    alt={user.email ?? "User Avatar"}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                  <span data-testid="user-email" className="truncate">
                    {isGuest ? "Guest" : user?.email}
                  </span>
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent
              data-testid="user-nav-menu"
              side="top"
              className="w-56 data-[state=open]:w-56"
            >
              <DropdownMenuItem
                data-testid="user-nav-item-theme"
                className="cursor-pointer"
                onSelect={() =>
                  setTheme(resolvedTheme === "dark" ? "light" : "dark")
                }
              >
                {`Toggle ${resolvedTheme === "light" ? "dark" : "light"} mode`}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                data-testid="user-nav-item-theme"
                className="cursor-pointer"
                onSelect={() => router.push(`/profile/${user.id}`)}
              >
                Profile
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => router.push("/dashboard")}
              >
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild data-testid="user-nav-item-auth">
                <button
                  type="button"
                  className="w-full cursor-pointer"
                  onClick={() => {
                    if (status === "loading") {
                      toast({
                        type: "error",
                        description:
                          "Checking authentication status, please try again!",
                      });

                      return;
                    }

                    if (isGuest) {
                      router.push("/login");
                    } else {
                      signOut({
                        redirectTo: "/",
                      });
                    }
                  }}
                >
                  {isGuest ? "Login to your account" : "Sign out"}
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </div>
  );
}
