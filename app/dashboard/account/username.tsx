"use client"

import { useCallback, useEffect, useState } from 'react'
import { createClient } from "@/app/utils/supabase/client";

import { Button, Card, CardBody, Form, Input, user } from "@heroui/react"
import { User } from '@supabase/supabase-js';
import { addToast } from '@heroui/toast';

const Username = ({ user }: { user: User | null }) => {
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);


  const getProfile = useCallback(async () => {
    try {
      setIsLoading(true);

      const { data: data, error: error } = await supabase
        .from("profiles")
        .select(`username`)
        .eq("user_id", user?.id)
        .single()

      if (error) {
        addToast({
          title: "Notification",
          description: (error as any)?.message || "An unexpected error occurred",
          color: "danger",
          variant: "bordered",
          radius: "md"
      })
      }

      if (data) {
        setUsername(data.username);
      }

    } catch (error) {
        console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    getProfile();
  }, [user, getProfile]);

  const onSubmit = async (e: { preventDefault: () => void; currentTarget: HTMLFormElement | undefined; }) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      setIsLoading(true);

      const formData = new FormData(e.currentTarget);

      const { data: data } = await supabase
        .from("profiles")
        .select(`username`)
        .eq("username", formData.get("username") as string)
        .maybeSingle()

      if (data) {
        setErrors({ username: "Sorry, this username is taken." });
      } else {

        const { error: error } = await supabase.from("profiles").upsert({
          user_id: user?.id as string,
          username: username,
        });

        if (error) throw error;

        addToast({
          title: "Notification",
          description:"Username updated successfully",
          color: "success",
          variant: "bordered",
          radius: "md"
      })
      }
    } catch (error) {
      console.log(error);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form
      className="w-full flex flex-col items-start gap-4"
      validationBehavior="native"
      validationErrors={errors}
      onSubmit={onSubmit}
    >
      <Input
        value={username ?? ''}
        isRequired
        isDisabled={isLoading}
        label="Username"
        // labelPlacement="outside"
        name="username"
        // placeholder="Enter your username"
        onValueChange={setUsername}
        description="Every account has a unique username."
        className='max-w-xs'
        variant='bordered'
        radius='md'
      />
      <Button color="primary" isLoading={isLoading} type="submit">
        Submit
      </Button>
    </Form>
  )
}

export default Username;