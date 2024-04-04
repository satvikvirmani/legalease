'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { authenticateSignIn } from '@/app/lib/actions';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import { useState } from 'react';

export default function LoginForm() {
  const [errorMessage, dispatch] = useFormState(authenticateSignIn, undefined);
  const [userType, setUserType] = useState('consumer');

  const handleUserTypeChange = (event: string) => {
    setUserType(event);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const formData = new FormData(event.target); 
    formData.append('userType', userType);
    dispatch(formData);
  };

  return (
    <div className="grid min-h-screen w-full place-items-center">
      <form onSubmit={handleSubmit} className="space-y-3">
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Sign in to your Legalease account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <Select onValueChange={handleUserTypeChange}>
                <SelectTrigger className="">
                  <SelectValue placeholder="Type of user" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consumer">Consumer</SelectItem>
                  <SelectItem value="provider">Provider</SelectItem>
                </SelectContent>
              </Select>
              <Input type="email" placeholder="E-Mail" name="email" />
              <Input type="password" placeholder="Password" name="password" />
              {errorMessage !== undefined ? (
                <AlertDestructive msg={errorMessage} />
              ) : (
                ''
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-2">
            <LoginButton />
            <p className="text-sm text-muted-foreground">
              Don't have an account,
              <Link href={'/register'} className="text-black">
                Register Now
              </Link>
            </p>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

const AlertDestructive = ({ msg }: { msg: string }) => {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{msg}</AlertDescription>
    </Alert>
  );
};

const LoginButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button className="mt-4 w-full" aria-disabled={pending}>
      Log in
    </Button>
  );
};
