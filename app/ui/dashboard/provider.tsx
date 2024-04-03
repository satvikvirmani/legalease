import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Provider } from '@/app/lib/definitions';

import Link from 'next/link';

export default function Provider(data: Provider) {
  return (
    <Link href={`/dashboard/profile/${data.id}`}>
      <Card>
        <CardHeader>
          <CardTitle>{data.name}</CardTitle>
          <CardDescription>{data.title}</CardDescription>
        </CardHeader>
        <CardContent>
          {data.description}
        </CardContent>
        <CardFooter>
          {data.email}, {data.phone}
        </CardFooter>
      </Card>
    </Link>
  );
}
