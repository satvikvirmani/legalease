import { auth } from '@/auth';
import ConsumerDashboard from '../ui/dashboard/consumerDashboard';
import ProviderDashboard from '../ui/dashboard/providerDashboard';
 

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string
  };
}) {

  const session = await auth();

  console.log("in page", session);

  const query = searchParams?.query || '';
  
  return (
    <>
    {
      session.user.typeofuser == 'consumer'? <ConsumerDashboard query={query} />
 :
    <ProviderDashboard />
    }
    </>
  );
}