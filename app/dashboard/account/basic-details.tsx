"use client"

import { useCallback, useEffect, useState } from 'react'
import { createClient } from "@/app/utils/supabase/client";

import { Button, Form, Input, Textarea } from "@heroui/react"
import { User } from '@supabase/supabase-js';
import { addToast } from '@heroui/toast';

const BasicDetails = ({ user }: { user: User | null }) => {
    const supabase = createClient();

    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [details, setDetails] = useState<any | null>(null);

    const getProfile = useCallback(async () => {
        try {
            setIsLoading(true);

            const { data: data, error: error } = await supabase
                .from("profiles")
                .select(`*`)
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
                setDetails(data);
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

            console.log("Form Data: ",);

            const file = formData.get("profile_picture");
            let imageURL = "";

            if (file && file instanceof File) {
                const fileExt = file.name.split(".").pop();
                const uid = user?.id || 'default-uid';
                const filePath = `${uid}-${Math.random()}.${fileExt}`;

                const reader = new FileReader();
                reader.onload = (e) => {
                    setDetails({ ...details, profile_picture: file });
                };
                reader.readAsDataURL(file);

                const { error: uploadError } = await supabase.storage
                    .from("avatars")
                    .upload(filePath, file);

                const { data: image } = await supabase.storage
                    .from('avatars')
                    .getPublicUrl(`${filePath}`)

                imageURL = image.publicUrl;

                if (uploadError) console.log("Error: uploading profile picture");
            }

            const { error: error } = await supabase.from("profiles").upsert({
                user_id: user?.id as string,
                email: details?.email as string,
                first_name: formData.get("firstname") as string,
                last_name: formData.get("lastname") as string,
                profile_picture: imageURL,
            });


            const { data, error: updateError } = await supabase.auth.updateUser({
                data: { avatar_url: imageURL }
            })

            console.log("AT BASIC", data)
            

            if (error) throw error;

            addToast({
                title: "Notification",
                description:"Basic details updated successfully",
                color: "success",
                variant: "bordered",
                radius: "md"
            })
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
            <h1 className="mb-8 text-2xl">Basic Details</h1>
            <div className='w-full grid grid-cols-2 gap-8'>
                <div className='w-full col-span-2'>
                    {
                        details?.profile_picture &&
                        <div className='w-full flex flex-col items-center gap-4'>
                            <img src={details?.profile_picture} alt="" className='max-w-xs' />
                            <Input
                                type='file'
                                isDisabled={isLoading}
                                // label="Profile Picture"
                                // labelPlacement="outside"
                                name="profile_picture"
                                // placeholder="Profile Picture Details"
                                className='max-w-xs'
                                variant='bordered'
                                radius='md'
                            />
                        </div>
                    }
                </div>
                <Input
                    value={details?.email}
                    isReadOnly
                    isDisabled={isLoading}
                    label="Email"
                    // labelPlacement="outside"
                    name="city"
                    // placeholder="City Details"
                    className='w-full'
                    variant='bordered'
                    radius='md'
                />
                <Input
                    value={details?.first_name}
                    onValueChange={(value) => setDetails({ ...details, first_name: value })}
                    isRequired
                    isDisabled={isLoading}
                    label="First Name"
                    // labelPlacement="outside"
                    name="firstname"
                    // placeholder="firstname Details"
                    className='w-full'
                    variant='bordered'
                    radius='md'
                />
                <Input
                    value={details?.last_name}
                    onValueChange={(value) => setDetails({ ...details, last_name: value })}
                    isRequired
                    isDisabled={isLoading}
                    label="Last Name"
                    // labelPlacement="outside"
                    name="lastname"
                    // placeholder="lastname Details"
                    className='w-full'
                    variant='bordered'
                    radius='md'
                />
            </div>
            <Button color="primary" isLoading={isLoading} type="submit" radius='md'>
                Submit
            </Button>
        </Form>
    );
}

export default BasicDetails;