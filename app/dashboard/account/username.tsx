"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/app/utils/supabase/client";

import { Button, Form, Input } from "@heroui/react";
import { User } from "@supabase/supabase-js";
import { addToast } from "@heroui/toast";

const Username = ({ user }: { user: User | null }) => {
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ username?: string }>({});
  const [username, setUsername] = useState<string | null>(null);

  const getProfile = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      const { data, error } = await supabase
          .from("profiles")
          .select("username")
          .eq("user_id", user.id)
          .single();

      if (error) {
        addToast({
          title: "Error",
          description: error.message || "An unexpected error occurred.",
          color: "danger",
          variant: "bordered",
          radius: "md",
        });
      } else if (data) {
        setUsername(data.username);
      }
    } catch (error) {
      console.error("An error occurred while fetching the profile:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    getProfile().then(() => {});
  }, [getProfile]);

  const onSubmit = async (e: { preventDefault: () => void; currentTarget: HTMLFormElement | undefined; }) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);

      const usernameInput = formData.get("username") as string;

      if (!usernameInput) {
        setErrors({ username: "Username is required." });
        setIsLoading(false);
        return;
      }

      // Check if username is already taken
      const { data: existingUser, error: checkError } = await supabase
          .from("profiles")
          .select("username")
          .eq("username", usernameInput)
          .maybeSingle();

      if (checkError) {
        addToast({
          title: "Error",
          description: checkError.message || "An unexpected error occurred.",
          color: "danger",
          variant: "bordered",
          radius: "md",
        });
      }

      if (existingUser) {
        setErrors({ username: "Sorry, this username is taken." });
        setIsLoading(false);
        return;
      }

      // Upsert new username
      const { error: upsertError } = await supabase.from("profiles").upsert({
        user_id: user?.id as string,
        username: usernameInput,
      });

      if (upsertError) {
        addToast({
          title: "Error",
          description: upsertError.message || "An unexpected error occurred.",
          color: "danger",
          variant: "bordered",
          radius: "md",
        });
      }

      // Update user metadata
      const profileComplete = user?.user_metadata?.profile_complete || {};

      const updatedProfileComplete = {
        ...profileComplete,
        username: true,
      };

      const { error: updateError } = await supabase.auth.updateUser({
        data: { profile_complete: updatedProfileComplete },
      });

      if (updateError) {
        addToast({
          title: "Error",
          description: updateError.message || "An unexpected error occurred.",
          color: "danger",
          variant: "bordered",
          radius: "md",
        });
      }

      addToast({
        title: "Success",
        description: "Username updated successfully!",
        color: "success",
        variant: "bordered",
        radius: "md",
      });

      // Clear errors on successful submission
      setErrors({});
      setUsername(usernameInput);
    } catch (error) {
      console.error("An error occurred while updating the username:", error);
      addToast({
        title: "Error",
        description: "Failed to update username. Please try again.",
        color: "danger",
        variant: "bordered",
        radius: "md",
      });
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
            value={username ?? ""}
            isRequired
            isDisabled={isLoading}
            label="Username"
            name="username"
            onValueChange={setUsername}
            description="Every account has a unique username."
            className="max-w-xs"
            variant="bordered"
            radius="md"
        />
        <Button color="primary" isLoading={isLoading} type="submit">
          Submit
        </Button>
      </Form>
  );
};

export default Username;