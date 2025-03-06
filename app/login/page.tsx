"use client"

import { Form, Button } from "@heroui/react";
import { Link } from "lucide-react";
import { Input } from "@heroui/react";
import { useState } from "react";
import { EyeSlashFilledIcon, EyeFilledIcon } from "../register/page";
import { login } from "./login-action";
import { addToast } from "@heroui/toast";

export default function Home() {
    const [isLoading, setIsLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);

    const onSubmit = async (e: { preventDefault: () => void; currentTarget: HTMLFormElement | undefined }) => {
        e.preventDefault();
        setIsLoading(true);

        const data = new FormData(e.currentTarget);
        const result = await login(data);

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
        <main className="w-full p-6 h-screen grid grid-cols-1 lg:grid-cols-2 lg:gap-4">
            <div className="hidden lg:block overflow-hidden rounded-2xl">
                <img alt="Background Image" src="/login.jpg" className="w-full" />
            </div>
            <div className="col-span-2 lg:col-span-1 flex flex-col justify-between items-center">
                <div>
                    <h1 className="font-semibold text-lg">LegalEase</h1>
                </div>
                <Form className="w-full" validationBehavior="native" onSubmit={onSubmit}>
                    <div className="mx-auto">
                        <h1 className={`mb-2 text-center text-5xl font-light`}>Welcome Back</h1>
                        <h2 className="mb-16 text-center">Enter your email and password to access your account</h2>
                    </div>
                    <div className="w-full max-w-sm flex flex-col items-start gap-8 mx-auto">
                        <Input
                            isRequired
                            errorMessage={({ validationDetails, validationErrors }: { validationDetails: any, validationErrors: any }) =>
                                validationDetails.typeMismatch ? "Please enter a valid email address" : validationErrors
                            }
                            label="Email"
                            // labelPlacement="outside"
                            name="email"
                            // placeholder="Enter your email"
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
                                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                    ) : (
                                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                    )}
                                </button>
                            }
                            name="password"
                            label="Password"
                            // labelPlacement="outside"
                            validate={(value) => value.length >= 8 || "Password must be at least 8 characters long"}
                            // placeholder="Enter your password"
                            type={isVisible ? "text" : "password"}
                            variant="bordered"
                            radius="md"
                        />
                        <Button type="submit" isLoading={isLoading} variant="shadow" radius="md" size="md" className="w-full bg-gray-900 text-gray-100">
                            Submit
                        </Button>
                    </div>
                </Form>
                <p className="text-base text-gray-600">
                    Don't have an account?{" "}
                    <a className="text-base text-gray-800 underline" href="/register">
                        Sign Up
                    </a>
                </p>
            </div>
        </main>
    );
}