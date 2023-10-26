"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import { ModeToggle } from "./ui/mode-toggle";
import { UserButton } from "@clerk/nextjs";

const NavBar = () => {
  return (
    <NavigationMenu className="container m-0 flex h-14 min-w-full items-center justify-between border-b">
      <NavigationMenuList className="gap-4">
        <NavigationMenuItem>
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Finance
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/transactions" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Transactions
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/portfolio" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Portfolio
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuList className="m-4">
        <NavigationMenuItem>
          <ModeToggle />
        </NavigationMenuItem>
        <NavigationMenuItem>
          <UserButton />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default NavBar;
