import { fetchProviderRequests } from '@/app/lib/data';
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

export default async function ProviderDashboard() {
  const session = await auth();
  const requests = await fetchProviderRequests(session?.user?.id, 'accepted');

  return (
    <>
      {
        requests &&
        requests.map((request, i) => {
          return (
            <Card key={i}>
              <CardHeader>
                <CardTitle><p>{request.consumername}</p></CardTitle>
                <CardDescription>{request.date.toLocaleDateString('en-us')}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{request.description}</p>
              </CardContent>
              <CardFooter>
                <Badge>{request.status}</Badge>
              </CardFooter>
            </Card>
          )
        })
      }
    </>
  )
}
