import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Skeleton } from '@/components/ui/skeleton';
import { JSX } from 'react';

const providers: JSX.Element[] = [];
for (let i = 0; i < 8; i++) {
  providers.push(<Card>
    <CardHeader>
      <CardTitle>
        <Skeleton className="h-[20px] w-[100px] rounded-full" />
      </CardTitle>
      <CardDescription>
        <Skeleton className="h-[20px] w-[100px] rounded-full" />
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Skeleton className="h-[20px] w-[100px] rounded-full" />
    </CardContent>
    <CardFooter>
      <p>Card Footer</p>
    </CardFooter>
  </Card>);
}

const ProvidersSkeleton = () => {
  return (
    <>
    {providers}
    </>
  );
};

export { ProvidersSkeleton };
