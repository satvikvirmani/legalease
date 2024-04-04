import { fetchConsumerRequests } from '@/app/lib/data';
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
  const requests = await fetchConsumerRequests(session?.user?.id, 'accepted');

  return (
    <>
      <div className="flex w-full flex-col gap-y-8">
        {requests &&
          requests.map((request, i) => {
            return (
              <Card key={i}>
                <CardHeader>
                  <CardTitle>
                    <p>{request.providername}</p>
                  </CardTitle>
                  <CardDescription>
                    {request.date.toLocaleDateString('en-us')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{request.description}</p>
                </CardContent>
                <CardFooter>
                  <Badge>{request.status}</Badge>
                </CardFooter>
              </Card>
            );
          })}
      </div>
    </>
  );
}
