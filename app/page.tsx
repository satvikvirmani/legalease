import { Button } from "@heroui/react";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <header className="px-8 py-4 flex justify-between items-center p-4">
        <div>
          <h1 className="text-2xl font-bold">
            LegalEase
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <a href="/login">
            <Button variant="bordered" color="primary"> Log In </Button>
          </a>
          <a href="/register">
            <Button variant="ghost" color="primary"> Sign Up </Button>
          </a>
        </div>
      </header>
    </main>
  )
}