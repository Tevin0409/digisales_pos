"use client";

import Link from "next/link";
import { Ellipsis, Headset, LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "~/components/ui/tooltip";
import { getMenuList } from "~/lib/menu-list";
import { CollapseMenuButton } from "./collapse-menu-button";
import { useAuthStore } from "~/store/auth-store";
import { deleteMetadata } from "~/utils/indexeddb";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

interface MenuProps {
  isOpen: boolean | undefined;
}

export default function Menu({ isOpen }: MenuProps) {
  const roles = localStorage.getItem("roles");
  const isBranchManager = roles ? roles?.includes("mBranchManager") : false;
  const isAdmin = roles ? roles?.includes("lOn Map") : false;
  const [bManager, setBManager] = useState<boolean>(isBranchManager);
  const [admin, setAdmin] = useState<boolean>(isAdmin);
  const pathname = usePathname();
  const { clear_auth_session } = useAuthStore();
  const router = useRouter();
  useEffect(() => {
    if (roles?.includes("mBranchManager")) {
      setBManager(true);
    } else {
      setBManager(false);
    }
  }, [roles]);
  useEffect(() => {
    if (roles?.includes("lOn Map")) {
      setAdmin(true);
    } else {
      setAdmin(false);
    }
  }, [roles]);
  const menuList = getMenuList(pathname, bManager, admin);

  return (
    <ScrollArea className="[&>div>div[style]]:!block">
      <nav className="mt-8 h-full w-full">
        <ul className="flex min-h-[calc(100vh-48px-36px-16px-32px)] flex-col items-start space-y-1 px-2 lg:min-h-[calc(100vh-32px-40px-32px)]">
          {menuList.map(({ groupLabel, menus }, index) => (
            <li className={cn("w-full", groupLabel ? "pt-5" : "")} key={index}>
              {(isOpen && groupLabel) ?? isOpen === undefined ? (
                <p className="max-w-[248px] truncate px-4 pb-2 text-sm font-medium text-muted-foreground">
                  {groupLabel}
                </p>
              ) : !isOpen && isOpen !== undefined && groupLabel ? (
                <TooltipProvider>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger className="w-full">
                      <div className="flex w-full items-center justify-center">
                        <Ellipsis className="h-5 w-5" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{groupLabel}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <p className="pb-2"></p>
              )}
              {menus.map(
                ({ href, label, icon: Icon, active, submenus }, index) =>
                  submenus.length === 0 ? (
                    <div className="w-full" key={index}>
                      <TooltipProvider disableHoverableContent>
                        <Tooltip delayDuration={100}>
                          <TooltipTrigger asChild>
                            <Button
                              variant={active ? "secondary" : "ghost"}
                              className="mb-1 h-10 w-full justify-start"
                              asChild
                            >
                              <Link href={href}>
                                <span
                                  className={cn(isOpen === false ? "" : "mr-4")}
                                >
                                  <Icon size={18} />
                                </span>
                                <p
                                  className={cn(
                                    "max-w-[200px] truncate",
                                    isOpen === false
                                      ? "-translate-x-96 opacity-0"
                                      : "translate-x-0 opacity-100",
                                  )}
                                >
                                  {label}
                                </p>
                              </Link>
                            </Button>
                          </TooltipTrigger>
                          {isOpen === false && (
                            <TooltipContent side="right">
                              {label}
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  ) : (
                    <div className="w-full" key={index}>
                      <CollapseMenuButton
                        icon={Icon}
                        label={label}
                        active={active}
                        submenus={submenus}
                        isOpen={isOpen}
                      />
                    </div>
                  ),
              )}
            </li>
          ))}

          <li className="flex w-full grow items-end">
            <TooltipProvider disableHoverableContent>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <Button
                    onClick={async () => {
                      await deleteMetadata();
                      clear_auth_session();
                      router.push("/sign-in");
                    }}
                    variant="outline"
                    className="mt-5 h-10 w-full justify-center"
                  >
                    <span className={cn(isOpen === false ? "" : "mr-4")}>
                      <LogOut size={18} />
                    </span>
                    <p
                      className={cn(
                        "whitespace-nowrap",
                        isOpen === false ? "hidden opacity-0" : "opacity-100",
                      )}
                    >
                      Sign out
                    </p>
                  </Button>
                </TooltipTrigger>
                {isOpen === false && (
                  <TooltipContent side="right">Sign out</TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </li>
          {/* <li className="flex w-full  items-end">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className=" h-10 w-full justify-center"
                  variant="secondary"
                >
                  <span className={cn(isOpen === false ? "" : "mr-4")}>
                    <Headset size={18} />
                  </span>
                  Contact Support
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Contact Support</DialogTitle>
                  <DialogDescription>
                  </DialogDescription>
                </DialogHeader>
                <div className="flex  flex-col items-center space-x-2 space-y-1">
                  <div className="grid w-full flex-1 gap-2">
                    <Label htmlFor="customer-name">Name</Label>
                    <Input id="customer-name" type="text" />
                  </div>
                  <div className="grid w-full flex-1 gap-2">
                    <Label htmlFor="customer-tel">Phone</Label>
                    <Input type="tel" id="customer-tel" />
                  </div>
                  <div className="grid w-full flex-1 gap-2">
                    <Label htmlFor="customer-email">Email</Label>
                    <Input type="email" id="customer-email" />
                  </div>

                  <div className="grid w-full flex-1 gap-2">
                    <Label htmlFor="customer-subject">Subject</Label>
                    <Input type="text" id="customer-subject" />
                  </div>
                  <div className="grid w-full flex-1 gap-2">
                    <Label htmlFor="customer-issue">Description</Label>
                    <Textarea
                      placeholder="Type your message here."
                      id="customer-issue"
                    />
                    <p className="text-xs text-muted-foreground">
                      Your message will be copied to the support team.
                    </p>
                  </div>
                </div>
                <DialogFooter className="flex w-full flex-row justify-center">
                  <DialogClose asChild>
                    <Button variant="secondary">Close</Button>
                  </DialogClose>
                  <Button>Send message</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </li> */}
        </ul>
      </nav>
    </ScrollArea>
  );
}
