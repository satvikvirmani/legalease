"use client"

import { useCallback, useEffect, useState } from 'react'
import { createClient } from "@/app/utils/supabase/client";

import { Button, Card, CardBody, Form, Input, Textarea } from "@heroui/react"
import { User } from '@supabase/supabase-js';
import { addToast } from '@heroui/toast';

const AddressDetails = ({ user }: { user: User | null }) => {
    const supabase = createClient();

    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [address, setAddress] = useState<any | null>(null);


    const getProfile = useCallback(async () => {
        try {
            setIsLoading(true);

            const { data: data, error: error } = await supabase
                .from("addresses")
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
                setAddress(data);
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

            const { error: error } = await supabase.from("addresses").upsert({
                user_id: user?.id as string,
                street: formData.get("street") as string,
                city: formData.get("city") as string,
                state: formData.get("state") as string,
                pin_code: formData.get("pincode") as string,
                country: formData.get("country") as string,
            });

            if (error) throw error;

            addToast({
                title: "Notification",
                description:"Address details updated successfully",
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
            <div className='w-full grid grid-cols-2 gap-8'>
                <Textarea
                    value={address?.street}
                    onValueChange={(value) => setAddress({ ...address, street: value })}
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
                    onValueChange={(value) => setAddress({ ...address, city: value })}
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
                    onValueChange={(value) => setAddress({ ...address, state: value })}
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
                    onValueChange={(value) => setAddress({ ...address, pin_code: value })}
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