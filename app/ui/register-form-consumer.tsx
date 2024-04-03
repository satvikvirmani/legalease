'use client'

import { useFormStatus } from 'react-dom';
import { authenticateConsumerSignUp } from '@/app/lib/actions';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';

export default function ConsumerRegisterForm() {
  return (
    <>
      <form action={authenticateConsumerSignUp} className="space-y-3">
        <Card>
          <CardHeader>
            <CardTitle>Consumer Registration</CardTitle>
            <CardDescription>Register as a consumer now</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex flex-col gap-2'>
              <Input type="name" placeholder="Name" name="name" />
              <Input type="email" placeholder="E-Mail" name="email" />
              <Input type="password" placeholder="Password" name="password" />
            </div>
          </CardContent>
          <CardFooter className='flex flex-col gap-2 items-start'>
            <RegisterButton />
            <p className="text-sm text-muted-foreground">
              Already have an account,{' '}
              <Link href={'/login'} className="text-black">
                Login Now
              </Link>
            </p>
          </CardFooter>
        </Card>
      </form>
    </>
  );
}

const RegisterButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button className="mt-4 w-full" aria-disabled={pending}>
      Register
    </Button>
  );
};
