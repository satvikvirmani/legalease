"use client"

import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/outline";

import { Form, Button, Input } from "@heroui/react";
import { addToast } from "@heroui/toast";

interface ValidationDetails {
    typeMismatch: boolean;
    // Add any other validation details that might be relevant
}

import Link from "next/link";

import { login } from "@/app/login/login-action";

import { useState } from "react";

export default function Home() {
    const [isLoading, setIsLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);

    const onSubmit = async (e: { preventDefault: () => void; currentTarget: HTMLFormElement | undefined }) => {
        e.preventDefault();
        setIsLoading(true);

        const data = new FormData(e.currentTarget);
        const result = await login(data);

        if (result.error) {
            addToast({
                title: "Notification",
                description: result.error || "An unexpected error occurred",
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
        <main className="w-full p-6 h-screen grid grid-cols-1 lg:grid-cols-2 lg:gap-4">
            <div className="hidden lg:block overflow-hidden rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="Background Image" src="/login.jpg" className="w-full" />
            </div>
            <div className="col-span-2 lg:col-span-1 flex flex-col justify-between items-center">
                <div>
                    <h1 className="text-lg">LegalEase</h1>
                </div>
                <Form className="w-full" validationBehavior="native" onSubmit={onSubmit}>
                    <div className="mx-auto">
                        <h1 className={`mb-2 text-center text-5xl`}>Welcome Back</h1>
                        <h2 className="mb-16 text-center">Enter your email and password to access your account</h2>
                    </div>
                    <div className="w-full max-w-sm flex flex-col items-start gap-8 mx-auto">
                        <Input
                            isRequired
                            errorMessage={({ validationDetails, validationErrors }: { validationDetails: ValidationDetails, validationErrors: string[] }) =>
                                validationDetails.typeMismatch ? "Please enter a valid email address" : validationErrors
                            }
                            label="Email"
                            name="email"
                            type="email"
                            variant="bordered"
                            radius="md"
                        />
                        <Input
                            isRequired
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
                            name="password"
                            label="Password"
                            validate={(value) => value.length >= 8 || "Password must be at least 8 characters long"}
                            type={isVisible ? "text" : "password"}
                            variant="bordered"
                            radius="md"
                        />
                        <Button color="primary" type="submit" isLoading={isLoading} variant="shadow" radius="md" size="md" className="w-full">
                            Submit
                        </Button>
                    </div>
                </Form>
                <p className="text-sm">
                    <span className="text-neutral-600">Don&apos;t have an account?{" "}</span>
                    <Link className="underline" href="/register" passHref>
                        Sign Up
                    </Link>
                </p>
            </div>
        </main>
    );
}