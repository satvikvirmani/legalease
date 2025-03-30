"use client";

import { createClient } from "@/app/utils/supabase/client";
import { Card, CardBody, CardFooter, CardHeader, Chip, Skeleton } from "@heroui/react";

import { User } from "@supabase/supabase-js";
import {useCallback, useEffect, useState} from "react";

import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
} from "@heroui/react";
import {addToast} from "@heroui/toast";

type Request = {
    id: string;
    description?: string;
    status: string;
    provider_id: string;
    client_name: string;
    client_id: string;
};

const ClientRequests = ({ user }: { user: User }) => {
    const [requests, setRequests] = useState<Request[]>([]);
    const [requestCount, setRequestCount] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const supabase = createClient();

    const fetchRequestCount = useCallback(async () => {
        const { count, error } = await supabase
            .from("requests")
            .select("*", { count: "exact", head: true })
            .eq("provider_id", user.id)
            .eq("status", "closed");

        if (error) {
            addToast({
                title: "Notification",
                description: error.message || "An unexpected error occurred",
                color: "danger",
                variant: "bordered",
                radius: "md"
            })
            setError("Unable to fetch request count.");
            return;
        }
        setRequestCount(count || 0);

        setRequests(
            Array(requestCount).fill(null).map((_, i) => ({
                id: (i + 1).toString(),
                description: `Sample request ${i + 1}`,
                status: "rejected",
                provider_id: user.id,
                client_name: "John Doe",
                client_id: `client${i + 1}`
            }))
        );
    }, [supabase, user.id, requestCount]);

    const fetchRequests = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const { data: requestsData, error: fetchError } = await supabase
                .from("requests")
                .select("*")
                .eq("provider_id", user.id)
                .eq("status", "closed");

            if (fetchError) {
                addToast({
                    title: "Notification",
                    description: fetchError.message || "An unexpected error occurred",
                    color: "danger",
                    variant: "bordered",
                    radius: "md"
                })
            } else if (!requestsData || requestsData.length === 0) {
                setRequests([]);
                return;
            } else if(requestsData && requestsData.length > 0) {
                const clientIds = requestsData.map((req) => req.client_id);

                const { data: clientData, error: clientError } = await supabase
                    .from("profiles")
                    .select("user_id, first_name, last_name")
                    .in("user_id", clientIds);

                if (clientError) {
                    addToast({
                        title: "Notification",
                        description: clientError.message || "An unexpected error occurred",
                        color: "danger",
                        variant: "bordered",
                        radius: "md"
                    })
                } else if(clientData) {
                    const requestsWithClientDetails = requestsData.map((req) => {
                        const provider = clientData.find((p) => p.user_id === req.client_id);
                        return {
                            ...req,
                            client_name: provider ? `${provider.first_name} ${provider.last_name}` : "Unknown Client",
                        };
                    });

                    setRequests(requestsWithClientDetails);
                }
            }
        } catch (error) {
            console.error("An error occurred while fetching the profile:", error);
            addToast({
                title: "Error",
                description: "Failed to fetch requests. Please try again.",
                color: "danger",
                variant: "bordered",
                radius: "md",
            });
        } finally {
            setLoading(false);
        }
    }, [user.id, supabase])

    useEffect(() => {
        if (user) {
            fetchRequestCount().then(fetchRequests);
        }
    }, [user, fetchRequests, fetchRequestCount]);

    if (error) {
        return (
            <div className="text-center py-6">
                <p className="text-red-500">{error}</p>
                <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded" onClick={fetchRequests}>
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="w-full">
            <Skeleton className="rounded-lg mb-8" isLoaded={!loading}>
                <h1 className="text-2xl">
                    Closed Requests
                </h1>
            </Skeleton>
            {requests.length > 0 ? (
                <div className="space-y-4">
                    {requests.map((request) => (
                        <Card key={request.id} className="p-4 w-full" onPress={() => { setSelectedRequest(request); onOpen(); }} isPressable disableAnimation disableRipple>
                            <CardHeader>
                                <Skeleton className="rounded-lg" isLoaded={!loading}>
                                    <h1 className="text-xl">
                                        Request #{request.id}
                                    </h1>
                                </Skeleton>
                            </CardHeader>
                            <CardBody>
                                <Skeleton className="rounded-lg" isLoaded={!loading}>
                                    <p>{request.description || "No description provided"}</p>
                                </Skeleton>
                                <Skeleton className="rounded-lg" isLoaded={!loading}>
                                    <p className="text-sm">Submitted by: {request.client_name}</p>
                                </Skeleton>
                            </CardBody>
                            <CardFooter>
                                <Skeleton className="rounded-lg" isLoaded={!loading}>
                                    <Chip color="danger" variant="bordered">Closed</Chip>
                                </Skeleton>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <>
                    {
                        !loading && <p className="text-gray-500">No closed requests found.</p>
                    }
                </>
            )}
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Request #{selectedRequest?.id}</ModalHeader>
                            <ModalBody>

                                <p>{selectedRequest?.description || "No description provided"}</p>
                                <p className="text-sm">Submitted by: {selectedRequest?.client_name}</p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

        </div>
    );
};

export default ClientRequests;