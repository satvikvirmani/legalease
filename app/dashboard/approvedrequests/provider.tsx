"use client";

import { createClient } from "@/app/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import {useCallback, useEffect, useState} from "react";
import Chat from "./chat";
import { Card, CardHeader, CardBody, CardFooter, Chip, useDisclosure, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import {addToast} from "@heroui/toast";


type Request = {
  id: string;
  description?: string;
  provider_id: string;
  client_id: string;
  provider_name: string;
  client_name: string;
};

const ProviderRequests = ({ user }: { user: User }) => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const supabase = createClient();

  const [requestCount, setRequestCount] = useState<number | null>(null);

  const fetchRequestCount = useCallback(async () => {
    const { count, error } = await supabase
        .from("requests")
        .select("*", { count: "exact", head: true })
        .eq("provider_id", user.id)
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
          provider_id: user.id,
          provider_name: "John Doe",
          client_id: `client${i + 1}`,
          client_name: "John Doe",
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
          .eq("provider_id", user.id)
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
  }, [supabase, user.id]);

  useEffect(() => {
    if (user) {
      fetchRequests().then(() => {
      });
    }
  }, [user, fetchRequests, fetchRequestCount]);

  if (loading) {
    return <div className="text-center py-6">Loading approved requests...</div>;
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
                <p className="text-sm">Submitted by: {request.client_name}</p>
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
                <p className="text-sm">Submitted by: {selectedRequest?.client_name}</p>
                {selectedRequest && (
                  <>
                    <Chat requestId={selectedRequest.id} user={user} otherUserId={selectedRequest.provider_id === user.id ? selectedRequest.client_id : selectedRequest.provider_id} />
                  </>
                )}
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

export default ProviderRequests;