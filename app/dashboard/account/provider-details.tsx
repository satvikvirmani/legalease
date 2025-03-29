"use client"

import { useCallback, useEffect, useState } from 'react';
import { createClient } from "@/app/utils/supabase/client";

import { Button, Form, Input, Textarea, Checkbox } from "@heroui/react";
import { User } from '@supabase/supabase-js';
import { addToast } from '@heroui/toast';

interface Availability {
    day: string;
    time: string;
}

interface SocialLink {
    platform: string;
    url: string;
}

interface ProviderInterface {
    user_id: string;
    service_type: string;
    license_number: string;
    experience_years: number;
    specialization: string;
    certifications: string;
    description: string;
    description_embedding: number[];
    availability: Availability[];
    social_links: SocialLink[];
}

const ProviderDetails = ({ user }: { user: User | null }) => {
    const supabase = createClient();

    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [providerDetails, setProviderDetails] = useState<ProviderInterface | null>(null);

    const [availability, setAvailability] = useState<Availability[]>([]);
    const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
        { platform: "LinkedIn", url: "" },
    ]);

    const getProfile = useCallback(async () => {
        if (!user) return;
        setIsLoading(true);

        try {
            const { data, error } = await supabase
                .from("providers")
                .select(`*`)
                .eq("user_id", user?.id)
                .single();

            if (error) {
                addToast({
                    title: "Notification",
                    description: error.message || "An unexpected error occurred",
                    color: "danger",
                    variant: "bordered",
                    radius: "md"
                })
            } else if (data) {
                setProviderDetails(data);
                setAvailability(data.availability || []);
                setSocialLinks(data.social_links || []);
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

            const embedding = await getEmbedding(formData.get("description") as string);

            const serviceTypeInput = formData.get("service_type") as string;
            if (!serviceTypeInput) {
                setErrors({ service_type: "Service type is required." });
                setIsLoading(false);
                return;
            }

            const specializationInput = formData.get("specialization") as string;
            if (!specializationInput) {
                setErrors({ specialization: "Specialization is required." });
                setIsLoading(false);
                return;
            }

            const experienceYearsInput = parseFloat(formData.get("experience_years") as string);
            if (!experienceYearsInput) {
                setErrors({ experience_years: "Experience years are required." });
                setIsLoading(false);
                return;
            }

            const certificationsInput = formData.get("certifications") as string;
            if (!certificationsInput) {
                setErrors({ certifications: "Certifications are required." });
                setIsLoading(false);
                return;
            }

            const licenseNumberInput = formData.get("license_number") as string;
            if (!licenseNumberInput) {
                setErrors({ license_number: "License number is required." });
                setIsLoading(false);
                return;
            }

            const descriptionInput = formData.get("description") as string;
            if (!descriptionInput) {
                setErrors({ description: "Description is required." });
                setIsLoading(false);
                return;
            }

            const { error: upsertError } = await supabase.from("providers").upsert({
                user_id: user?.id as string,
                service_type: serviceTypeInput,
                specialization: specializationInput,
                experience_years: experienceYearsInput,
                certifications: certificationsInput,
                license_number: licenseNumberInput,
                description: descriptionInput,
                description_embedding: embedding,
                availability: availability,
                social_links: socialLinks,
            });

            if (upsertError) {
                addToast({
                    title: "Notification",
                    description: upsertError.message || "An unexpected error occurred",
                    color: "danger",
                    variant: "bordered",
                    radius: "md"
                });
            }

            const profileComplete = user?.user_metadata?.profile_complete || {};

            const updatedProfileComplete = {
                ...profileComplete,
                provider: true
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
                description:"Provider details updated successfully",
                color: "success",
                variant: "bordered",
                radius: "md"
            })

            setErrors({});
            setProviderDetails((prevDetails) => ({
                ...prevDetails!,
                service_type: serviceTypeInput,
                specialization: specializationInput,
                experience_years: experienceYearsInput,
                certifications: certificationsInput,
                license_number: licenseNumberInput,
                description: descriptionInput
            }));
        } catch (error) {
            console.error("An error occurred while updating the provider details:", error);
            addToast({
                title: "Error",
                description: "Failed to update provider details. Please try again.",
                color: "danger",
                variant: "bordered",
                radius: "md",
            });
        } finally {
            setIsLoading(false);
        }
    };

    async function getEmbedding(description: string) {
        if (!description || description.trim() === '') {
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
                    onValueChange={(value) => setProviderDetails({ ...providerDetails!, service_type: value })}
                    isRequired
                    isDisabled={isLoading}
                    label="Service Type"
                    name="service_type"
                    className='w-full'
                    variant='bordered'
                    radius='md'
                />
                <Input
                    value={providerDetails?.specialization || ''}
                    onValueChange={(value) => setProviderDetails({ ...providerDetails!, specialization: value })}
                    isRequired
                    isDisabled={isLoading}
                    label="Specialization"
                    name="specialization"
                    className='w-full'
                    variant='bordered'
                    radius='md'
                />
                <Input
                    value={(providerDetails?.experience_years || '').toString()}
                    type='number'
                    onValueChange={(value) => setProviderDetails({ ...providerDetails!, experience_years: parseFloat(value) })}
                    isRequired
                    isDisabled={isLoading}
                    label="Experience"
                    name="experience_years"
                    className='w-full'
                    variant='bordered'
                    radius='md'
                />
                <Input
                    value={providerDetails?.certifications || ''}
                    onValueChange={(value) => setProviderDetails({ ...providerDetails!, certifications: value })}
                    isRequired
                    isDisabled={isLoading}
                    label="Certifications"
                    name="certifications"
                    className='w-full'
                    variant='bordered'
                    radius='md'
                />
                <Input
                    value={providerDetails?.license_number || ''}
                    onValueChange={(value) => setProviderDetails({ ...providerDetails!, license_number: value })}
                    isRequired
                    isDisabled={isLoading}
                    label="License Number"
                    name="license_number"
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
                    onValueChange={(value) => setProviderDetails({ ...providerDetails!, description: value })}
                    isRequired
                    label="Description Address"
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