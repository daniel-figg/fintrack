"use client";

// import Link from "next/link";
// import {
//   NavigationMenu,
//   NavigationMenuItem,
//   NavigationMenuLink,
//   NavigationMenuList,
//   navigationMenuTriggerStyle,
// } from "./ui/navigation-menu";
// import { ModeToggle } from "./ui/mode-toggle";
// import { UserButton } from "@clerk/nextjs";

// const NavBar = () => {
//   return (
//     <NavigationMenu className="container m-0 flex h-14 min-w-full items-center justify-between border-b">
//       <NavigationMenuList className="m-4 gap-4">
//         <NavigationMenuItem>
//           <Link href="/" legacyBehavior passHref>
//             <NavigationMenuLink className={navigationMenuTriggerStyle()}>
//               <h1 className="text-lg font-bold">Finance</h1>
//             </NavigationMenuLink>
//           </Link>
//         </NavigationMenuItem>
//         <NavigationMenuItem>
//           <Link href="/transactions" legacyBehavior passHref>
//             <NavigationMenuLink className={navigationMenuTriggerStyle()}>
//               <h1 className="text-muted-foreground">Transactions</h1>
//             </NavigationMenuLink>
//           </Link>
//         </NavigationMenuItem>
//         <NavigationMenuItem>
//           <Link href="/portfolio" legacyBehavior passHref>
//             <NavigationMenuLink className={navigationMenuTriggerStyle()}>
//               <h1 className="text-muted-foreground">Portfolio</h1>
//             </NavigationMenuLink>
//           </Link>
//         </NavigationMenuItem>
//       </NavigationMenuList>
//       <NavigationMenuList className="m-4 gap-4">
//         <NavigationMenuItem>
//           <ModeToggle />
//         </NavigationMenuItem>
//         <NavigationMenuItem>
//           <UserButton />
//         </NavigationMenuItem>
//       </NavigationMenuList>
//     </NavigationMenu>
//   );
// };

// export default NavBar;

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

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const menuItems = ["Home", "Portfolio", "Transactions", "Accounts"];

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} className="border-b">
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

      <NavbarContent className="hidden gap-4 sm:flex " justify="center">
        <NavbarItem>
          <Link href="/portfolio">Portfolio</Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/transactions">Transactions</Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/accounts">Accounts</Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <SignedOut>
          <NavbarItem>
            <Button as={Link} color="primary" href="/login" variant="flat">
              Login
            </Button>
          </NavbarItem>
        </SignedOut>
        <SignedIn>
          <UserButton />
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
