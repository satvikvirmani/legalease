"use client";

import { createClient } from "@/app/utils/supabase/client";
import { Card, CardBody, CardFooter, CardHeader, Chip } from "@heroui/react";

import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
} from "@heroui/react";

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

    const supabase = createClient();

    const fetchRequests = async () => {
        try {
            setLoading(true);
            setError(null);

            const { data: requestsData, error: fetchError } = await supabase
                .from("requests")
                .select("*")
                .eq("client_id", user.id)
                .eq("status", "pending");


            if (fetchError) throw fetchError;
            if (!requestsData || requestsData.length === 0) {
                setRequests([]);
                return;
            }

            const providerIds = requestsData.map((req) => req.provider_id);

            const { data: providerData, error: providerError } = await supabase
                .from("profiles")
                .select("user_id, first_name, last_name, rating")
                .in("user_id", providerIds);

            if (providerError) throw providerError;

            const requestsWithProviderDetails = requestsData.map((req) => {
                const provider = providerData.find((p) => p.user_id === req.provider_id);
                return {
                    ...req,
                    provider_name: provider ? `${provider.first_name} ${provider.last_name}` : "Unknown Provider",
                    rating: provider ? provider.rating : null,
                };
            });

            setRequests(requestsWithProviderDetails);
        } catch (fetchError: any) {
            console.error("Error fetching requests:", fetchError);
            setError("Unable to fetch pending requests. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchRequests();
        }
    }, [user]);


    if (loading) {
        return <div className="text-center py-6 text-gray-600">Loading pending requests...</div>;
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
        <div className="w-full mx-auto p-6">
            <h1 className="text-2xl mb-8 ml-6">Pending Requests</h1>
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
                                <Chip color="warning" variant="bordered">Pending</Chip>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">No pending requests found.</p>
            )}
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Request #{selectedRequest?.id}</ModalHeader>
                            <ModalBody>
                                <p>{selectedRequest?.description || "No description provided"}</p>
                                <p className="text-sm">Submitted to: {selectedRequest?.provider_name}</p>
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