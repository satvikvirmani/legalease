import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/sidenav/nav-links';
import Image from 'next/image';
import logo from '@/public/logo.jpeg'

import { Button } from '@/components/ui/button';
import { performSignOut } from '@/app/lib/actions';

export default function SideNav({ typeofuser }: { typeofuser: string }) {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link className="mb-2 h-20 bg-blue-600 md:h-40" href="/">
        <Image
          className='w-full'
          src={logo}
          alt="Logo"
        />
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks typeofuser={typeofuser} />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <form action={performSignOut}>
          <Button variant={'outline'} className="w-full">
            Sign Out
          </Button>
        </form>
      </div>
    </div>
  );
}
