"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/app/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { Card, Divider, Chip, Input, Button } from "@heroui/react";

type Message = {
    id: string;
    sender_id: string;
    receiver_id: string;
    message: string;
    created_at: string;
};

const Chat = ({
    requestId,
    user,
    otherUserId,
}: {
    requestId: string;
    user: User;
    otherUserId: string;
}) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);

    const supabase = createClient();

    const fetchMessages = async () => {
        try {
            setLoading(true);

            const { data, error } = await supabase
                .from("messages")
                .select("*")
                .eq("request_id", requestId)
                .order("created_at", { ascending: true });

            if (error) throw error;

            setMessages(data || []);
        } catch (error) {
            console.error("Error fetching messages:", error);
        } finally {
            setLoading(false);
        }
    };

    const subscribeToMessages = () => {
        return supabase
            .channel(`chat-${requestId}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "messages",
                    filter: `request_id=eq.${requestId}`,
                },
                (payload) => {
                    setMessages((prev) => [...prev, payload.new as Message]);
                }
            )
            .subscribe();
    };

    const sendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            const { error } = await supabase.from("messages").insert([
                {
                    request_id: requestId,
                    sender_id: user.id,
                    receiver_id: otherUserId,
                    message: newMessage,
                },
            ]);

            if (error) throw error;

            setNewMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    useEffect(() => {
        fetchMessages();

        const subscription = subscribeToMessages();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, [requestId]);

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <Card className="w-full p-6">
            <h2 className="text-lg mb-4">Chat</h2>
            <Divider className="mb-2" />
            <div className="overflow-y-auto max-h-60 mb-4 p-2">
                {loading ? (
                    <p>Loading messages...</p>
                ) : messages.length > 0 ? (
                    messages.reduce((acc: any[], message, index) => {
                        const messageDate = formatDate(message.created_at);
                        const prevMessageDate = index > 0 ? formatDate(messages[index - 1].created_at) : null;

                        if (messageDate !== prevMessageDate) {
                            acc.push(
                                <div key={`date-${message.id}`} className="text-center text-gray-500 my-2 text-xs">
                                    {messageDate}
                                </div>
                            );
                        }

                        acc.push(
                            <div
                                key={message.id}
                                className={`mb-2 ${message.sender_id === user.id ? "text-right" : "text-left"}`}
                            >
                                <Chip color={message.sender_id === user.id ? "primary" : "default" } radius="sm">{message.message}</Chip>
                                <p className="text-[10px] text-gray-500">
                                    {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        );

                        return acc;
                    }, [])
                ) : (
                    <p>No messages yet.</p>
                )}
            </div>

            <div className="flex gap-2">
                <Input
                    type="text"
                    className=""
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <Button
                    className=""
                    onPress={sendMessage}
                    radius="sm"
                    color="primary"
                >
                    Send
                </Button>
            </div>
        </Card>
    );
};

export default Chat;