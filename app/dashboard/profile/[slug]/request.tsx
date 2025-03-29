"use client"

import { createClient } from "@/app/utils/supabase/client";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Form, Textarea } from "@heroui/react";
import { addToast } from "@heroui/toast";
import React from "react";

const RequestForm = ({ provider_id, client_id }: {provider_id: string, client_id: string}) => {

    const supabase = createClient();

    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleRequest = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const formData = new FormData(e.currentTarget);

            const { error } = await supabase.from("requests").insert([
                {
                    client_id: client_id,
                    provider_id: provider_id,
                    description: formData.get('request_description'),
                    status: "pending"
                },
            ])

            if (error) throw error

            addToast({
                title: "Notification",
                description: "Request submitted successfully",
                color: "success",
                variant: "bordered",
                radius: "md"
            })
        } catch (error) {
            console.error(error);
            addToast({
                title: "Notification",
                description: "Request submission failed",
                color: "danger",
                variant: "bordered",
                radius: "md"
            })
        }
    };

    return (
        <>
            <Button color="primary" variant="bordered" onPress={onOpen}>Raise Request</Button>
            <Modal isOpen={isOpen} size="2xl" onClose={onClose}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <Form
                                className="w-full"
                                validationBehavior="native"
                                onSubmit={handleRequest}
                            >
                                <ModalHeader className="w-full">Raise Request</ModalHeader>
                                <ModalBody className="w-full">
                                    <div className='w-full'>
                                        <Textarea
                                            isRequired
                                            className="w-full"
                                            label="Description"
                                            labelPlacement="outside"
                                            placeholder="Briefly describe your request"
                                            name="request_description"
                                            id="request_description"
                                        />
                                    </div>
                                </ModalBody>
                                <ModalFooter className="w-full">
                                    <Button color="danger" variant="light" onPress={onClose}>
                                        Close
                                    </Button>
                                    <Button color="primary" onPress={onClose} type="submit">
                                        Submit
                                    </Button>
                                </ModalFooter>
                            </Form>
                        </>
                    )}

                </ModalContent>
            </Modal>
        </>
        // <div className="p-6">
        //   <form onSubmit={handleRequest} className="mt-4">
        //     <input
        //       type="text"
        //       placeholder="Enter your request"
        //       name="request"
        //       value={request}
        //       onChange={(e) => setRequest(e.target.value)}
        //       className="border px-2 py-1 rounded"
        //       required
        //     />
        //     <button
        //       type="submit"
        //       className="ml-2 bg-blue-500 text-white px-4 py-1 rounded"
        //     >
        //       Submit
        //     </button>
        //   </form>
        // </div>
    );
};

export default RequestForm;