import { fetchProviders } from "@/app/lib/data";
import Provider from "./provider";

export default async function Providers({
    query,
  }: {
    query: string;
  }) {
    const providers = await fetchProviders(query);

    return (
        providers.map(provider => {
            return <Provider {...provider}/>
        })
    )
}