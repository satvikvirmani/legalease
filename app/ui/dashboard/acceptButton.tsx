'use client'

import { acceptRequest } from '@/app/lib/data';
import { Button } from '@/components/ui/button';

const AcceptButton = ({ action }: { action: any }) => {

  return (
    <>
      <Button onClick={() => action}>Acccept</Button>
    </>
  );
};

export default AcceptButton;
