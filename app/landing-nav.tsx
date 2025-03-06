import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem } from "@heroui/react";
import { Link } from "@heroui/react";
import { Button } from "@heroui/react";

const LandingNavigation = () => {
  return (
    <Navbar>
      <NavbarBrand>
        <p className="font-bold text-3xl">LegalEase</p>
      </NavbarBrand>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Link href="/login">Login</Link>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color="primary" href="/register" variant="flat">
            Sign Up
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default LandingNavigation;
