"use client"

import { useCallback, useEffect, useState } from 'react'
import { createClient } from "@/app/utils/supabase/client";

import { Button, Form, Input, Textarea } from "@heroui/react"
import { User } from '@supabase/supabase-js';
import { addToast } from '@heroui/toast';

interface AddressInterface {
    city: string;
    country: string;
    pin_code: string;
    state: string;
    street: string;
    user_id: string;
}

const AddressDetails = ({ user }: { user: User | null }) => {
    const supabase = createClient();

    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [address, setAddress] = useState<AddressInterface | null>(null);


    const getProfile = useCallback(async () => {
        if (!user) return;
        setIsLoading(true);

        try {
            const { data, error } = await supabase
                .from("addresses")
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
                setAddress(data);
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

            const streetInput = formData.get("street") as string;

            if (!streetInput) {
                setErrors({
                    street: "Street is required.",
                });
                setIsLoading(false);
                return;
            }

            const cityInput = formData.get("city") as string;

            if (!cityInput) {
                setErrors({
                    city: "City is required.",
                });
                setIsLoading(false);
            }

            const stateInput = formData.get("state") as string;

            if (!stateInput) {
                setErrors({
                    state: "State is required.",
                });
                setIsLoading(false);
            }

            const pincodeInput = formData.get("pincode") as string;

            if (!pincodeInput) {
                setErrors({
                    pincode: "Pincode is required.",
                });
                setIsLoading(false);
            }

            const countryInput = formData.get("country") as string;

            if (!countryInput) {
                setErrors({
                    country: "Country is required.",
                });
                setIsLoading(false);
            }

            const { error: upsertError } = await supabase.from("addresses").upsert({
                user_id: user?.id as string,
                street: streetInput,
                city: cityInput,
                state: stateInput,
                pin_code: pincodeInput,
                country: countryInput,
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
                address: true
            };

            const {error: updateError} = await supabase.auth.updateUser({
                data: {profile_complete: updatedProfileComplete},
            });

            if (updateError) {
                addToast({
                    title: "Notification",
                    description: updateError.message || "An unexpected error occurred",
                    color: "danger",
                    variant: "bordered",
                    radius: "md"
                })
            }

            addToast({
                title: "Notification",
                description:"Address details updated successfully",
                color: "success",
                variant: "bordered",
                radius: "md"
            })

            setErrors({});
            setAddress((prevDetails) => ({
                ...prevDetails!,
                street: streetInput,
                city: cityInput,
                state: stateInput,
                pin_code: pincodeInput,
                country: countryInput,
            }));
        } catch (error) {
            console.error("An error occurred while updating the address details:", error);
            addToast({
                title: "Error",
                description: "Failed to update address details. Please try again.",
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
                <Textarea
                    value={address?.street}
                    onValueChange={(value) => setAddress({ ...address!, street: value })}
                    isRequired
                    label="Street Address"
                    // labelPlacement="outside"
                    // placeholder="Enter your street address"
                    name='street'
                    className='w-full col-span-2'
                    variant='bordered'
                    radius='md'
                />
                <Input
                    value={address?.city}
                    onValueChange={(value) => setAddress({ ...address!, city: value })}
                    isRequired
                    isDisabled={isLoading}
                    label="City"
                    // labelPlacement="outside"
                    name="city"
                    // placeholder="City Details"
                    className='w-full'
                    variant='bordered'
                    radius='md'
                />
                <Input
                    value={address?.state}
                    onValueChange={(value) => setAddress({ ...address!, state: value })}
                    isRequired
                    isDisabled={isLoading}
                    label="State"
                    // labelPlacement="outside"
                    name="state"
                    // placeholder="State Details"
                    className='w-full'
                    variant='bordered'
                    radius='md'
                />
                <Input
                    value={address?.pin_code}
                    onValueChange={(value) => setAddress({ ...address!, pin_code: value })}
                    isRequired
                    isDisabled={isLoading}
                    label="Pin-Code"
                    // labelPlacement="outside"
                    name="pincode"
                    // placeholder="Enter your Pincode"
                    className='w-full'
                    variant='bordered'
                    radius='md'
                />
                <Input
                    value={"India"}
                    isRequired
                    isReadOnly
                    isDisabled={isLoading}
                    label="Country"
                    // labelPlacement="outside"
                    name="country"
                    // placeholder="Country Details"
                    className='w-full'
                    variant='bordered'
                    radius='md'
                />
            </div>
            <Button color="primary" isLoading={isLoading} type="submit">
                Submit
            </Button>
        </Form>
    );
}

export default AddressDetails;