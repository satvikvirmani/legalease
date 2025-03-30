"use client";

import { createClient } from "@/app/utils/supabase/client";
import { Card, CardBody, CardFooter, CardHeader, Chip } from "@heroui/react";
import Chat from "@/app/dashboard/approvedrequests/chat";

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
    provider_name?: string;
    client_id: string;
    rating?: number | null;
};

const ClientRequests = ({ user }: { user: User }) => {
    const [requests, setRequests] = useState<Request[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onOpenChange: onConfirmChange } = useDisclosure();

    const [requestCount, setRequestCount] = useState<number | null>(null);

    const supabase = createClient();

    const fetchRequestCount = useCallback(async () => {
        const { count, error } = await supabase
            .from("requests")
            .select("*", { count: "exact", head: true })
            .eq("client_id", user.id)
            .eq("status", "pending");

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
                client_id: `client${i + 1}`,
                rejection_reason: "Incomplete information",
            }))
        );
    }, [supabase, user.id, requestCount])

    const fetchRequests = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const { data: requestsData, error: fetchError } = await supabase
                .from("requests")
                .select("*")
                .eq("client_id", user.id)
                .eq("status", "approved");

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
                const providerIds = requestsData.map((req) => req.provider_id);

                const { data: providerData, error: providerError } = await supabase
                    .from("profiles")
                    .select("user_id, first_name, last_name, rating")
                    .in("user_id", providerIds);

                if (providerError) {
                    addToast({
                        title: "Notification",
                        description: providerError.message || "An unexpected error occurred",
                        color: "danger",
                        variant: "bordered",
                        radius: "md"
                    })
                } else if (providerData) {
                    const requestsWithProviderDetails = requestsData.map((req) => {
                        const provider = providerData.find((p) => p.user_id === req.provider_id);
                        return {
                            ...req,
                            provider_name: provider ? `${provider.first_name} ${provider.last_name}` : "Unknown Provider",
                            rating: provider ? provider.rating : null,
                        };
                    });

                    setRequests(requestsWithProviderDetails);
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
    }, [supabase, user.id]);

    useEffect(() => {
        if (user) {
            fetchRequests().then(() => {
            });
        }
    }, [user, fetchRequests, fetchRequestCount]);

    const handleCloseRequest = async () => {
        if (!selectedRequest) return;
    
        try {
            const { error } = await supabase
                .from("requests")
                .update({ status: "closed" })
                .eq("id", selectedRequest.id);
    
            if (error) {
                addToast({
                    title: "Notification",
                    description: error.message || "An unexpected error occurred",
                    color: "danger",
                    variant: "bordered",
                    radius: "md"
                })
                return;
            }
    
            setRequests((prevRequests) =>
                prevRequests.filter((req) => req.id !== selectedRequest.id)
            );
    
            setSelectedRequest(null);
            onOpenChange();
        } catch (error) {
            console.error("Unexpected error closing request:", error);
            addToast({
                title: "Notification",
                description: "Failed to close request. Please try again.",
                color: "danger",
                variant: "bordered",
                radius: "md"
            })
        }
    };

    if (loading) {
        return <div className="text-center py-6 text-gray-600">Loading approved requests...</div>;
    }

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
            <h1 className="text-2xl mb-8">Approved Requests</h1>
            {requests.length > 0 ? (
                <div className="space-y-4">
                    {requests.map((request) => (
                        <Card key={request.id} className="p-4 w-full" onPress={() => { setSelectedRequest(request); onOpen(); }} isPressable disableAnimation disableRipple>
                            <CardHeader>
                                <h1 className="text-xl">
                                    Request #{request.id}
                                </h1>
                            </CardHeader>
                            <CardBody>
                                <p>{request.description || "No description provided"}</p>
                                <p className="text-sm">Submitted to: {request.provider_name}</p>
                            </CardBody>
                            <CardFooter>
                                <Chip color="success" variant="bordered">Approved</Chip>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">No approved requests found.</p>
            )}
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Request #{selectedRequest?.id}</ModalHeader>
                            <ModalBody>
                                <p>{selectedRequest?.description || "No description provided"}</p>
                                <p className="text-sm">Submitted to: {selectedRequest?.provider_name}</p>
                                {selectedRequest && (
                                    <>
                                        <Chat requestId={selectedRequest.id} user={user} otherUserId={selectedRequest.provider_id === user.id ? selectedRequest.client_id : selectedRequest.provider_id} />
                                    </>
                                )}
                                <Button color="danger" variant="bordered" className="w-full" onPress={onConfirmOpen}>
                                    Close Request
                                </Button>
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

            {/* Confirmation Dialog */}
            <Modal isOpen={isConfirmOpen} onOpenChange={onConfirmChange}>
                <ModalContent>
                    {(onConfirmClose) => (
                        <>
                            <ModalHeader>Confirm Request Closure</ModalHeader>
                            <ModalBody>
                                <p>Are you sure you want to close this request?</p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" onPress={() => { handleCloseRequest(); onConfirmClose(); onOpenChange(); }}>
                                    Yes, Close It
                                </Button>
                                <Button color="default" variant="light" onPress={onConfirmClose}>
                                    Cancel
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