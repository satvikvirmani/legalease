"use client"

import { User } from "@supabase/supabase-js";
import { usePathname } from "next/navigation";
import { HomeIcon, CheckBadgeIcon, InboxIcon, ArchiveBoxXMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { Button, Link } from "@heroui/react";

const SideMenu = ({ user }: { user: User | null }) => {
    const pathname = usePathname();

    const menuItems = [
        { label: "Approved Requests", href: "/dashboard/approvedrequests", icon: CheckBadgeIcon },
        { label: "Pending Requests", href: "/dashboard/pendingrequests", icon: InboxIcon },
        { label: "Rejected Requests", href: "/dashboard/rejectedrequests", icon: ArchiveBoxXMarkIcon }
    ];

    return (
        <div className="flex h-screen w-16 flex-col justify-between border-e bg-white">
            <div>
                <Link href="/dashboard/account">
                    <div className="inline-flex size-16 items-center justify-center">
                        <span className={clsx("grid size-10 place-content-center rounded-lg text-xs text-gray-600 bg-gray-100", pathname == "/dashboard/account" && "ring-2 ring-offset-2")}>
                            {user?.email?.[0]?.toUpperCase() || ''}
                        </span>
                    </div>
                </Link>

                <div className="border-t border-gray-100">
                    <div className="px-2">
                        <div className="py-4">
                            <Button
                                isIconOnly
                                as={Link}
                                href="/dashboard"
                                variant="light"
                                color={pathname == "/dashboard" ? "primary" : "default"}
                            >
                                <HomeIcon className="size-5 opacity-75" stroke="currentColor" strokeWidth="2" />
                            </Button>
                        </div>

                        <ul className="space-y-1 border-t border-gray-100 pt-4">
                            {
                                menuItems.map((item, index) => (
                                    <li key={index}>
                                        <Button
                                            isIconOnly
                                            as={Link}
                                            href={item.href}
                                            variant="light"
                                            color={pathname == item.href ? "primary" : "default"}
                                        >
                                            <item.icon className="size-5 opacity-75" stroke="currentColor" strokeWidth="2" />
                                        </Button>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                </div>
            </div>

            <div className="sticky inset-x-0 bottom-0 border-t border-gray-100 bg-white p-2">
                <form action="/auth/signout" method="post">
                    <Button
                        isIconOnly
                        type="submit"
                        variant="light"
                        color="default"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="size-5 opacity-75"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                        </svg>
                        <span
                            className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible"
                        >
                            Logout
                        </span>
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default SideMenu;