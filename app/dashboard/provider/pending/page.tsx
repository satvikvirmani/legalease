import { acceptRequest, fetchPendingProviderRequests } from '@/app/lib/data';
import AcceptButton from '@/app/ui/dashboard/acceptButton';
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
  const requests = await fetchPendingProviderRequests(session?.user?.id, 'pending');

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
          <AcceptButton action={acceptRequest(request.id)} />
        </CardFooter>
      </Card>
    );
  });
}
