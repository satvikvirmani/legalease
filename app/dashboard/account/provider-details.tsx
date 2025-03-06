"use client"

import { useCallback, useEffect, useState } from 'react';
import { createClient } from "@/app/utils/supabase/client";
import { Button, Form, Input, Textarea, Checkbox } from "@heroui/react";
import { User } from '@supabase/supabase-js';
import { addToast } from '@heroui/toast';

const ProviderDetails = ({ user }: { user: User | null }) => {
    const supabase = createClient();

    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [providerDetails, setProviderDetails] = useState<any | null>(null);
    const [availability, setAvailability] = useState<any[]>([]);
    const [socialLinks, setSocialLinks] = useState<{ platform: string; url: string }[]>([
        { platform: "LinkedIn", url: "" },
    ]);

    const getProfile = useCallback(async () => {
        try {
            setIsLoading(true);

            const { data: provider_data, error: addressError } = await supabase
                .from("providers")
                .select(`*`)
                .eq("user_id", user?.id)
                .single();

            if (addressError) {
                addToast({
                    title: "Notification",
                    description: (addressError as any)?.message || "An unexpected error occurred",
                    color: "danger",
                    variant: "bordered",
                    radius: "md"
                })
            }

            if (provider_data) {
                setProviderDetails(provider_data);
                setAvailability(provider_data.availability || []);
                setSocialLinks(provider_data.social_links || []);
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
            const formData = new FormData(e.currentTarget);

            const embedding = await getEmbedding(formData.get("description") as string);

            const { error } = await supabase.from("providers").upsert({
                user_id: user?.id as string,
                service_type: formData.get("service_type") as string,
                specialization: formData.get("specialization") as string,
                experience_years: formData.get("experience_years") as string,
                certifications: formData.get("certifications") as string,
                license_number: formData.get("license_number") as string,
                description: formData.get("description") as string,
                description_embedding: embedding,
                availability: availability,
                social_links: socialLinks,
            });

            if (error) throw error;

            addToast({
                title: "Notification",
                description:"Provider details updated successfully",
                color: "success",
                variant: "bordered",
                radius: "md"
            })
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    async function getEmbedding(description: string) {
        if (!description || typeof description !== 'string' || description.trim() === '') {
            throw new Error('Invalid query input for embedding generation');
        }

        const response = await fetch('/api/generateEmbedding', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: description }), // Corrected key
        });

        if (!response.ok) {
            console.error('Hugging Face API Error:', response.status, await response.text());
            throw new Error(`Hugging Face API responded with status ${response.status}`);
        }

        const output = await response.json();
        return output.embedding;
    }

    const updateAvailability = (day: string, time: string) => {
        const updatedAvailability = [...availability];
        const index = updatedAvailability.findIndex((a) => a.day === day);

        if (index !== -1) {
            updatedAvailability[index].time = time;
        } else {
            updatedAvailability.push({ day, time });
        }

        setAvailability(updatedAvailability);
    };

    return (
        <Form
            className="w-full flex flex-col items-start gap-4"
            validationBehavior="native"
            validationErrors={errors}
            onSubmit={onSubmit}
        >
            <div className='w-full grid grid-cols-2 gap-8 gap-y-8'>
                <Input
                    value={providerDetails?.service_type || ''}
                    onValueChange={(value) => setProviderDetails({ ...providerDetails, service_type: value })}
                    isRequired
                    isDisabled={isLoading}
                    label="Service Type"
                    // labelPlacement="outside"
                    name="service_type"
                    // placeholder="Service Type Details"
                    className='w-full'
                    variant='bordered'
                    radius='md'
                />
                <Input
                    value={providerDetails?.specialization || ''}
                    onValueChange={(value) => setProviderDetails({ ...providerDetails, specialization: value })}
                    isRequired
                    isDisabled={isLoading}
                    label="Specialization"
                    // labelPlacement="outside"
                    name="specialization"
                    // placeholder="Specialization Details"
                    className='w-full'
                    variant='bordered'
                    radius='md'
                />
                <Input
                    value={providerDetails?.experience_years || ''}
                    type='number'
                    onValueChange={(value) => setProviderDetails({ ...providerDetails, experience_years: value })}
                    isRequired
                    isDisabled={isLoading}
                    label="Experience"
                    // labelPlacement="outside"
                    name="experience_years"
                    // placeholder="Enter your years of experience"
                    className='w-full'
                    variant='bordered'
                    radius='md'
                />
                <Input
                    value={providerDetails?.certifications || ''}
                    onValueChange={(value) => setProviderDetails({ ...providerDetails, certifications: value })}
                    isRequired
                    isDisabled={isLoading}
                    label="Certifications"
                    // labelPlacement="outside"
                    name="certifications"
                    // placeholder="Certifications Details"
                    className='w-full'
                    variant='bordered'
                    radius='md'
                />
                <Input
                    value={providerDetails?.license_number || ''}
                    onValueChange={(value) => setProviderDetails({ ...providerDetails, license_number: value })}
                    isRequired
                    isDisabled={isLoading}
                    label="License Number"
                    // labelPlacement="outside"
                    name="license_number"
                    // placeholder="License Number Details"
                    className='w-full'
                    variant='bordered'
                    radius='md'
                />
                <div className='w-full flex flex-col gap-2 col-span-2'>
                    <h4>Availability</h4>
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                        <div key={day} className="flex items-center gap-4 mb-2">
                            <Checkbox
                                size='sm'
                                isSelected={availability.some((a) => a.day === day)}
                                onChange={(e) => {
                                    const isChecked = e.target.checked;
                                    if (isChecked) {
                                        setAvailability((prev) => [...prev, { day, time: "" }]);
                                    } else {
                                        setAvailability((prev) => prev.filter((a) => a.day !== day));
                                    }
                                }}
                            >
                                {day}
                            </Checkbox>
                            <Input
                                size='sm'
                                // placeholder="Time (e.g., 9am - 5pm)"
                                value={availability.find((a) => a.day === day)?.time || ""}
                                onValueChange={(value) => updateAvailability(day, value)}
                                isDisabled={!availability.some((a) => a.day === day)}
                                className="w-full"
                                variant='bordered'
                                radius='md'
                            />
                        </div>
                    ))}
                </div>
                <div className="w-full col-span-2">
                    <h4>Social Links</h4>
                    {socialLinks.map((link, index) => (
                        <div key={index} className="flex items-center gap-4 mt-4">
                            <Input
                                // placeholder="Platform (e.g., LinkedIn, Twitter)"
                                value={link.platform}
                                onChange={(e) =>
                                    setSocialLinks((prev) =>
                                        prev.map((l, i) =>
                                            i === index ? { ...l, platform: e.target.value } : l
                                        )
                                    )
                                }
                                className="w-1/3"
                                variant='bordered'
                                radius='md'
                            />
                            <Input
                                // placeholder="URL (e.g., https://linkedin.com/in/username)"
                                value={link.url}
                                onChange={(e) =>
                                    setSocialLinks((prev) =>
                                        prev.map((l, i) =>
                                            i === index ? { ...l, url: e.target.value } : l
                                        )
                                    )
                                }
                                className="w-2/3"
                                variant='bordered'
                                radius='md'
                            />
                            <Button
                                color="danger"
                                size="sm"
                                onPress={() =>
                                    setSocialLinks((prev) => prev.filter((_, i) => i !== index))
                                }
                            >
                                Remove
                            </Button>
                        </div>
                    ))}
                    <Button
                        className='mt-4'
                        onPress={() =>
                            setSocialLinks((prev) => [...prev, { platform: "", url: "" }])
                        }
                        size="sm"
                        color="secondary"
                    >
                        Add Social Link
                    </Button>
                </div>
                <Textarea
                    value={providerDetails?.description || ''}
                    onValueChange={(value) => setProviderDetails({ ...providerDetails, description: value })}
                    isRequired
                    label="Description Address"
                    // labelPlacement="outside"
                    // placeholder="Enter your Description address"
                    name='description'
                    className='w-full col-span-2'
                    description="Describe your services in atleast 100 words. This is most important your profile visibility and outreach depends on this."
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

export default ProviderDetails;