'use client'

import { Button } from '@/components/ui/button';

const AcceptButton = ({ action }: { action: any }) => {

  return (
    <>
      <Button onClick={() => action}>Acccept</Button>
    </>
  );
};

export default AcceptButton;
