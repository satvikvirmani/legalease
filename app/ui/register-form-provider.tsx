'use client';

import { useFormStatus } from 'react-dom';
import { authenticateProviderSignUp } from '@/app/lib/actions';

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
import { Textarea } from '@/components/ui/textarea';

export default function ProviderRegisterForm() {
  return (
    <>
      <form action={authenticateProviderSignUp} className="space-y-3">
        <Card>
          <CardHeader>
            <CardTitle>Provider Registration</CardTitle>
            <CardDescription>Register as a provider now</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <Input type="text" placeholder="Name" name="name" />
              <Input type="email" placeholder="E-Mail" name="email" />
              <Input type="password" placeholder="Password" name="password" />
              <Input type="tel" placeholder="Phone Number" name="phone" />
              <Input type="text" placeholder="Title" name="title" />
              <Input type="number" placeholder="Age" name="age" />
              <Textarea
                name="interestedDomains"
                id="interestedDomains"
                cols={30}
                rows={4}
                placeholder='Interested Domains'
              />
              <Input type="text" placeholder="Expertise" name="expertise" />
              <Textarea
                name="description"
                id="description"
                cols={30}
                rows={10}
                placeholder='Description'
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-2">
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
