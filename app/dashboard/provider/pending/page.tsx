import { acceptRequest, fetchProviderRequests } from '@/app/lib/data';
import AcceptButton from '@/app/ui/dashboard/acceptButton';
import { auth } from '@/auth';
import { Badge } from '@/components/ui/badge';

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
  const requests = await fetchProviderRequests(session?.user?.id, 'pending');

  return (
    <>
          <div className="flex w-full flex-col gap-y-8">
        {requests &&
          requests.map((request, i) => {
            return (
              <Card key={i}>
                <CardHeader>
                  <CardTitle>
                    <p>{request.consumername}</p>
                  </CardTitle>
                  <CardDescription>
                    {request.date.toLocaleDateString('en-us')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{request.description}</p>
                </CardContent>
                <CardFooter>
                <AcceptButton action={acceptRequest(request.id)} />
                  <Badge>Pending</Badge>
                </CardFooter>
              </Card>
            );
          })}
      </div>
    </>
  );
}
