import Link from "next/link";
import { Button } from "@heroui/react";

export default function Home() {
  return (
    <main>
      <header className="px-8 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">LegalEase</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" passHref>
            <Button variant="light" color="primary" radius="md"> Log In </Button>
          </Link>
          <Link href="/register" passHref>
            <Button variant="light" color="primary" radius="md"> Sign Up </Button>
          </Link>
        </div>
      </header>
    </main>
  );
}