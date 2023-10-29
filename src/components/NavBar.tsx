"use client";

import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import { Logo } from "./Logo";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ModeToggle } from "./ui/mode-toggle";
import { usePathname } from "next/navigation";

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const pathname = usePathname();

  const menuItems = ["Home", "Balance", "Transactions", "Investments"];

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} isBordered={true}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Logo />
          <Link href="/" className="font-bold">
            Finance
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden gap-4 sm:flex" justify="center">
        <NavbarItem isActive={pathname === "/balance" ? true : false}>
          <Link href="/balance">Balance</Link>
        </NavbarItem>
        <NavbarItem isActive={pathname === "/transactions" ? true : false}>
          <Link href="/transactions">Transactions</Link>
        </NavbarItem>
        <NavbarItem isActive={pathname === "/investments" ? true : false}>
          <Link href="/investments">Investments</Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <ModeToggle />
        <SignedOut>
          <NavbarItem>
            <Button
              as={Link}
              color="primary"
              href="/sign-in"
              variant="flat"
              className="text-base"
            >
              Login
            </Button>
          </NavbarItem>
        </SignedOut>
        <SignedIn>
          <UserButton
            appearance={
              {
                //   elements: {
                //     card: "bg-background",
                //     userPreviewMainIdentifier: "text-foreground",
                //     userPreviewSecondaryIdentifier: "text-muted-foreground",
                //     userButtonPopoverActionButtonText: "text-foreground",
                //     userButtonPopoverActionButtonIcon: "text-foreground",
                //   },
              }
            }
          />
        </SignedIn>
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full"
              href={index === 0 ? "/" : item.toLowerCase()}
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
