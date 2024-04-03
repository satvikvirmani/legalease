import { fetchPendingConsumerRequests } from '@/app/lib/data';
import { auth } from '@/auth';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default async function Page() {
  const session = await auth();
  const requests = await fetchPendingConsumerRequests(session?.user?.id);

  console.log(requests)

  return requests.map((request) => {
    return (
      <Card>
        <CardHeader>
          <CardTitle><p>{request.providername}</p></CardTitle>
          <CardDescription>{request.date.toLocaleDateString('en-us')}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>{request.description}</p>
        </CardContent>
        <CardFooter>
          {request.status}
        </CardFooter>
      </Card>
    );
  });
}
