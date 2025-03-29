"use client"

import {useCallback, useEffect, useState} from 'react'
import {createClient} from "@/app/utils/supabase/client";

import {Button, Form, Input} from "@heroui/react"
import {User} from '@supabase/supabase-js';
import {addToast} from '@heroui/toast';

interface ProfileDetails {
    created_at: string; // ISO timestamp or a string representation of a date
    email: string; // Email address as a string
    first_name: string; // User's first name
    hourly_rate: number | null; // Hourly rate, nullable
    last_name: string; // User's last name
    profile_picture: string; // URL to the profile picture
    rating: number | null; // Rating score, nullable
    user_id: string; // UUID for the user
    username: string; // Username as a string
}

const BasicDetails = ({user}: { user: User | null }) => {
    const supabase = createClient();

    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [details, setDetails] = useState<ProfileDetails | null>(null);

    const getProfile = useCallback(async () => {
        if (!user) return;
        setIsLoading(true);

        try {
            const {data, error} = await supabase
                .from("profiles")
                .select(`*`)
                .eq("user_id", user?.id)
                .single()

            if (error) {
                addToast({
                    title: "Notification",
                    description: error.message || "An unexpected error occurred",
                    color: "danger",
                    variant: "bordered",
                    radius: "md"
                })
            } else if (data) {
                setDetails(data);
            }

        } catch (error) {
            console.error("An error occurred while fetching the profile:", error);
        } finally {
            setIsLoading(false);
        }
    }, [user, supabase]);

    useEffect(() => {
        getProfile().then(() => {
        });
    }, [user, getProfile]);

    const onSubmit = async (e: { preventDefault: () => void; currentTarget: HTMLFormElement | undefined; }) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formData = new FormData(e.currentTarget);

            const fileInput = formData.get("profile_picture");
            let imageURL: string = "";

            if (fileInput && fileInput instanceof File) {
                const fileExt = fileInput.name.split(".").pop();
                const uid = user?.id || 'default-uid';
                const filePath = `${uid}-${Math.random()}.${fileExt}`;

                const reader = new FileReader();

                reader.readAsDataURL(fileInput);

                const {error: uploadError} = await supabase.storage
                    .from("avatars")
                    .upload(filePath, fileInput);

                const {data: imageObject} = supabase.storage
                    .from('avatars')
                    .getPublicUrl(`${filePath}`)

                imageURL = imageObject.publicUrl;

                if (uploadError) {
                    addToast({
                        title: "Error",
                        description: uploadError.message || "An unexpected error occurred.",
                        color: "danger",
                        variant: "bordered",
                        radius: "md",
                    });
                }
            }

            const firstnameInput = formData.get("firstname") as string;
            const lastnameInput = formData.get("lastname") as string;

            if (!firstnameInput) {
                setErrors({
                    firstname: "First name is required.",
                });
                setIsLoading(false);
                return;
            }

            if (!lastnameInput) {
                setErrors({
                    lastname: "Last name is required.",
                });
                setIsLoading(false);
            }

            const {error: upsertError} = await supabase.from("profiles").upsert({
                user_id: user?.id as string,
                email: details?.email as string,
                first_name: firstnameInput,
                last_name: lastnameInput,
                profile_picture: imageURL,
            });

            if (upsertError) {
                addToast({
                    title: "Notification",
                    description: upsertError.message || "An unexpected error occurred",
                    color: "danger",
                    variant: "bordered",
                    radius: "md"
                })
            }
            const profileComplete = user?.user_metadata?.profile_complete || {};

            const updatedProfileComplete = {
                ...profileComplete,
                basic: true, // Set username to true
            };

            const {error: updateError} = await supabase.auth.updateUser({
                data: {profile_complete: updatedProfileComplete, avatar_url: imageURL},
            })

            if (updateError) {
                addToast({
                    title: "Notification",
                    description: updateError.message || "An unexpected error occurred",
                    color: "danger",
                    variant: "bordered",
                    radius: "md"
                })
            }
            const refreshUser = async () => {
                const { error: sessionRefreshError } = await supabase.auth.refreshSession();
                if (sessionRefreshError) {
                    addToast({
                        title: "Notification",
                        description: sessionRefreshError.message || "An unexpected error occurred",
                        color: "danger",
                        variant: "bordered",
                        radius: "md"
                    })
                }
            };

            refreshUser().then(() => {
            })

            addToast({
                title: "Notification",
                description: "Basic details updated successfully",
                color: "success",
                variant: "bordered",
                radius: "md"
            })

            setErrors({});
            setDetails((prevDetails) => ({
                ...prevDetails!,
                first_name: firstnameInput,
                last_name: lastnameInput,
                profile_picture: imageURL
            }));
        } catch (error) {
            console.error("An error occurred while updating the basic details:", error);
            addToast({
                title: "Error",
                description: "Failed to update basic details. Please try again.",
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
            <div className='w-full grid grid-cols-2 gap-8'>
                <div className='w-full col-span-2'>
                    {
                        details?.profile_picture &&
                        <div className='w-full flex flex-col items-center gap-4'>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={details?.profile_picture} alt="" className='max-w-xs'/>
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
                    onValueChange={(value) => setDetails({...details!, first_name: value})}
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
                    onValueChange={(value) => setDetails({...details!, last_name: value})}
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