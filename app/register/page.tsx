'use client'

import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/outline";
import { Form, Input, Button, Select, SelectItem } from "@heroui/react";
import { addToast } from "@heroui/toast";
import Image from "next/image";

import Link from "next/link";

import { signup } from "@/app/register/register-action";

import { useState } from "react";

export default function Home() {
    const [isLoading, setIsLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);

    const onSubmit = async (e: { preventDefault: () => void; currentTarget: HTMLFormElement | undefined; }) => {
        e.preventDefault();
        setIsLoading(true);

        const data = new FormData(e.currentTarget);
        
        if(data.get('role') == "$.0") {
            data.set('role', 'client')
        } else if(data.get('role') == "$.1") {
            data.set('role', 'provider');
        } else {
            alert("Please select an appropriate account type");
            setIsLoading(false);
            return;
        }

        if(data.get('password') !== data.get('cnfpassword')) {
            alert("Passwords do not match");
            setIsLoading(false);
            return;
        }

        const result = await signup(data);

        if (result?.error) {
            addToast({
                title: "Notification",
                description: result?.error || "An unexpected error occurred",
                color: "danger",
                variant: "bordered",
                radius: "md"
            })
        } else if (result?.success) {
            window.location.href = result.redirectTo;
        }

        setIsLoading(false);
    };

    return (
        <main className='w-full p-6 h-screen grid grid-cols-1 lg:grid-cols-2 lg:gap-4'>
            <div className="col-span-2 lg:col-span-1 flex flex-col justify-between items-center">
                <div>
                    <h1 className="text-lg">LegalEase</h1>
                </div>
                <Form className="w-full" validationBehavior="native" onSubmit={onSubmit}>
                    <div className="mx-auto">
                        <h1 className="mb-2 text-center text-5xl font-light">Welcome to LegalEase</h1>
                        <h2 className="mb-16 text-center">Enter your credentials to get started</h2>
                    </div>
                    <div className="w-full max-w-xl flex flex-col items-center gap-8 mx-auto">
                        <div className="w-full grid grid-cols-2 grid-rows-2 gap-8">
                            <Input
                                isRequired
                                errorMessage={({ validationDetails, validationErrors }) => {
                                    if (validationDetails.typeMismatch) {
                                        return "Please enter a valid email address";
                                    }

                                    return validationErrors;
                                }}
                                label="Email"
                                name="email"
                                type="email"
                                variant="bordered"
                                radius="md"
                            />
                            <Select name="role" isRequired label="Account type"
                            variant="bordered" radius="md">
                                <SelectItem value={"client"}>Client</SelectItem>
                                <SelectItem value={"provider"}>Provider</SelectItem>
                            </Select>
                            <Input
                                isRequired
                                className="max-w-xs"
                                endContent={
                                    <button
                                        aria-label="toggle password visibility"
                                        className="focus:outline-none"
                                        type="button"
                                        onClick={toggleVisibility}
                                    >
                                        {isVisible ? (
                                            <EyeSlashIcon className="w-6 h-6 pointer-events-none" />
                                        ) : (
                                            <EyeIcon className="w-6 h-6 pointer-events-none" />
                                        )}
                                    </button>
                                }
                                validate={(value) => {
                                    if (value.length < 8) {
                                      return "Password must be at least 8 characters long";
                                    }
                                  }}
                                name="password"
                                label="Password"
                                type={isVisible ? "text" : "password"}
                                variant="bordered"
                                radius="md"
                            />
                            <Input
                                isRequired
                                className="max-w-xs"
                                endContent={
                                    <button
                                        aria-label="toggle cnfpassword visibility"
                                        className="focus:outline-none"
                                        type="button"
                                        onClick={toggleVisibility}
                                    >
                                        {isVisible ? (
                                            <EyeSlashIcon className="w-6 h-6 pointer-events-none" />
                                        ) : (
                                            <EyeIcon className="w-6 h-6 pointer-events-none" />
                                        )}
                                    </button>
                                }
                                validate={(value) => {
                                    if (value.length < 8) {
                                      return "Password must be at least 8 characters long";
                                    }
                                  }}
                                name="cnfpassword"
                                label="Confirm Password"
                                type={isVisible ? "text" : "password"}
                                variant="bordered"
                                radius="md"
                            />
                        </div>
                        <Button color="primary" type="submit" isLoading={isLoading} variant="shadow" className="w-full">
                            Submit
                        </Button>
                    </div>
                </Form>
                <p className="text-sm">
                    <span className="text-neutral-600">Already have an account?{" "}</span>
                    <Link className="underline" href="/login" passHref>
                        Log In
                    </Link>
                </p>
            </div>
            <div className="hidden lg:block overflow-hidden rounded-2xl">
                <Image
                    alt="Background Image"
                    src="/login.jpg"
                    className="w-full"
                    fill={true}
                />
            </div>
        </main>
    );
}