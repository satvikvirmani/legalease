'use client';

import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

import Link from 'next/link';

const consumerLinks = [
  { name: 'Home', href: '/dashboard' },
  {
    name: 'Pending Requests',
    href: '/dashboard/pending',
  },
  {
    name: 'Accepted Requests',
    href: '/dashboard/accepted',
  },
];

const providerLinks = [
  { name: 'Home', href: '/dashboard' },
  {
    name: 'Pending Requests',
    href: '/dashboard/provider/pending',
  },
];

export default function NavLinks({ typeofuser }: { typeofuser: string }) {
  const pathName = usePathname();

  return (
    <>
      {typeofuser == 'consumer' ? (
        <div className="flex flex-col items-stretch gap-2">
          {consumerLinks.map((link, i) => {
            return (
              <Link href={link.href} key={i}>
                <Button
                  key={link.name}
                  variant={pathName === link.href ? 'default' : 'secondary'}
                  className="w-full"
                >
                  {link.name}
                </Button>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-stretch gap-2">
          {providerLinks.map((link, i) => {
            return (
              <Link href={link.href} key={i}>
                <Button
                  key={link.name}
                  variant={pathName === link.href ? 'default' : 'secondary'}
                  className="w-full"
                >
                  {link.name}
                </Button>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
