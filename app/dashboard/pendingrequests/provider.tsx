"use client";

import { createClient } from "@/app/utils/supabase/client";
import { Card, CardHeader, CardBody, CardFooter, Chip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, Form } from "@heroui/react";
import { addToast } from "@heroui/toast";
import { User } from "@supabase/supabase-js";
import React, { useEffect, useState } from "react";

type Request = {
  id: string;
  description?: string;
  approved: boolean;
  provider_id: string;
  client_name: string;
  client_id: string;
};

const ProviderRequests = ({ user }: { user: User }) => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { isOpen: isOpenRejection, onOpen: onOpenRejection, onOpenChange: onOpenChangeRejection } = useDisclosure();

  const supabase = createClient();

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: requestsData, error: fetchError } = await supabase
          .from("requests")
          .select("*")
          .eq("provider_id", user.id)
          .eq("status", "pending");

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
  };

  useEffect(() => {
    if (user) {
      fetchRequests().then(() => {
      });
    }
  }, [user]);

  const handleAction = async (
    e: React.FormEvent<HTMLFormElement>,
    requestId: string | undefined,
    action: "accept" | "reject",
    onClose: () => void
  ) => {
    e.preventDefault();
    try {
      if (!requestId) return;

      const formData = new FormData(e.currentTarget);
      const rejectionReason = formData.get("reason") as string | null;
  
      const updateData =
        action === "accept"
          ? { status: "approved" }
          : { status: "rejected", rejection_reason: rejectionReason || "Provider rejected request" };
  
      const { error } = await supabase
        .from("requests")
        .update(updateData)
        .eq("id", requestId);
  
      if (error) {
        addToast({
          title: "Notification",
          description: error.message || "An unexpected error occurred",
          color: "danger",
          variant: "bordered",
          radius: "md"
        })
      }
  
      setRequests((prev) => prev.filter((request) => request.id !== requestId));
      setSelectedRequest(null);
  
      addToast({
        title: "Notification",
        description: `Request ${action}ed successfully`,
        color: "success",
        variant: "bordered",
        radius: "md",
      });
  
      onClose();
    } catch (error) {
      console.error("An error occurred while updating request status:", error);
      addToast({
        title: "Notification",
        description: `Failed to ${action} request. Please try again`,
        color: "danger",
        variant: "bordered",
        radius: "md",
      });
    }
  };

  if (loading) {
    return <div className="text-center py-6">Loading pending requests...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-6">
        <p className="text-red-500">{error}</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={fetchRequests}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h1 className="text-2xl mb-8">Pending Requests</h1>
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
                <p className="text-sm">Submitted by: {request.client_name}</p>
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
                <p className="text-sm">Submitted by: {selectedRequest?.client_name}</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onOpenRejection}>
                  Reject
                </Button>
                <Form onSubmit={(e) => handleAction(e, selectedRequest?.id, "accept", onClose)}>
                  <Button color="primary" type="submit">
                    Accept
                  </Button>
                </Form>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal isOpen={isOpenRejection} onOpenChange={onOpenChangeRejection}>
        <ModalContent className="">
          {(onCloseRejection) => (
            <Form onSubmit={(e) => handleAction(e, selectedRequest?.id, "reject", () => { onCloseRejection(); onOpenChange(); })} className="w-full">
              <ModalHeader className="flex flex-col gap-1 w-full">Request Rejection Reason</ModalHeader>
              <ModalBody className="w-full">
                <Input
                  isRequired
                  label="Reason for rejection"
                  name="reason"
                  className='w-full'
                  variant='bordered'
                  radius='md'
                />
              </ModalBody>
              <ModalFooter className="w-full">
                <Button color="danger" variant="light" onPress={onCloseRejection}>
                  Close
                </Button>
                <Button color="primary" onPress={onCloseRejection} type="submit">
                  Submit
                </Button>
              </ModalFooter>
            </Form>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ProviderRequests;