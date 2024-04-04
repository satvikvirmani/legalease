import { inter } from '@/app/ui/fonts';
import Search from '@/app/ui/dashboard/search';
import Providers from '@/app/ui/dashboard/providers';

import { Suspense } from 'react';
import { ProvidersSkeleton } from '@/app/ui/skeletons';

const ConsumerDashboard = ({query}: {query: string}) => {
  return (
    <>
      <main>
        <h1 className={`${inter.className} mb-4 text-xl md:text-2xl`}>
          Dashboard
        </h1>
        <Search placeholder="Search" />
        <div className="my-4 grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
          <Suspense fallback={<ProvidersSkeleton />}>
            <Providers query={query} />
          </Suspense>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8"></div>
      </main>
    </>
  );
};

export default ConsumerDashboard;
