import {FeatureExtractionOutput, HfInference} from '@huggingface/inference';

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function POST(request: Request): Promise<Response> {
    try {
        if (!process.env.HUGGINGFACE_API_KEY) {
            return new Response(JSON.stringify({ error: 'Missing API Key' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const body = await request.json();
        const description = body?.query;

        if (!description || typeof description !== 'string' || description.trim().length === 0) {
            return new Response(JSON.stringify({ error: 'Invalid or empty input provided' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const response: FeatureExtractionOutput = await hf.featureExtraction({
            model: 'sentence-transformers/all-MiniLM-L6-v2',
            inputs: description.trim(),
        });

        return new Response(
            JSON.stringify({ embedding: response }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    } catch (error) {
        console.error('Error generating embedding:', error);

        return new Response(
            JSON.stringify({ error: 'Failed to generate embedding', details: error instanceof Error ? error.message : String(error) }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}