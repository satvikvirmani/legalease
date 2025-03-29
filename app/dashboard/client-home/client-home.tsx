import { Button, Form, Input } from "@heroui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import ProfilesDisplay from "./profiles-display";
import { createClient } from "@/app/utils/supabase/client";

interface LegalProvider {
    provider_id: string;
    first_name: string;
    last_name: string;
    username: string;
    profile_picture: string;
    service_type: string;
    description: string;
    experience_years: number;
    similarity: number;
}

const ClientHome = () => {
    const [query, setQuery] = useState('')
    const [searchingProcedure, setSearchingProcedure] = useState(false)
    const [providers, setProviders] = useState<LegalProvider[] | null>(null)
    const [searchStatus, setSearchStatus] = useState<string | null>(null);


    const searchDocuments = async (searchText: string) => {
        const supabase = createClient();

        setSearchingProcedure(true)

        try {
            if (!searchText || searchText.trim() === '') {
                return {error: "Invalid query input for embedding generation"};
            }

            setSearchStatus("Generating embedding for the query...");

            const response = await fetch('/api/generateEmbedding', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: searchText }),
            });

            if (!response.ok) {
                console.error('Hugging Face API Error:', response.status, await response.text());
                return {error: "Hugging Face API responded with status ${response.status}"};
            }

            const output = await response.json();

            setSearchStatus("Searching for relevant providers...");
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s

            const { data: documents } = await supabase.rpc('match_providers', {
                query_embedding: output.embedding,
                match_threshold: -10,
                match_count: 10,
            })
            setSearchStatus("Retrieving matched providers...");
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s

            return { documents };
        } catch (error) {
            console.error('Error performing vector search:', error);
            return { error: (error instanceof Error ? error.message : 'Failed to perform search') };
        } finally {
            setSearchingProcedure(false)
        }
    }

    const handleSearch = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setSearchStatus("Starting search...");
        setProviders(null);

        try {
            const { documents, error } = await searchDocuments(query);
            setProviders(documents);

            if (error) {
                console.log(error);
                setSearchStatus("No providers found.");
            } else {
                setSearchStatus(null);
            }
        } catch (error) {
            console.error(error);
            setSearchStatus("An error occurred during search.");
        }
    };

    return (
        <div className="p-8 w-full flex flex-col gap-4">
            <Form onSubmit={handleSearch} className="flex flex-col gap-4 w-full">
                <Input
                    value={query}
                    onValueChange={(value) => setQuery(value)}
                    isRequired
                    isDisabled={searchingProcedure}
                    name="searchquery"
                    // placeholder="Write your issue to search for providers..."
                    variant="bordered"
                    radius="md"
                    size="lg"
                    startContent={
                        <MagnifyingGlassIcon className="size-5 opacity-75" stroke="currentColor" strokeWidth={2} />
                    }
                    className='w-full'
                    description="Desribe your issue to search for providers..."
                />
                <Button type="submit" isLoading={searchingProcedure} variant="shadow" className="w-full bg-gray-900 text-gray-100">
                    Submit
                </Button>
            </Form>

            {searchStatus && (
                <div className="text-green-600 text-sm text-center mt-4 flex items-center justify-center">
                    <span className="mr-1 w-2 h-2 bg-green-600 rounded-full animate-blink"></span>
                    {searchStatus}
                </div>
            )}

            {
                (searchingProcedure || providers) && <ProfilesDisplay data={providers} />
            }
        </div>
    );
}

export default ClientHome;