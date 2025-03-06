import { HfInference } from '@huggingface/inference'

const hf = new HfInference(process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY)

export async function POST(request: Request) {
    try {
        const { query: description } = await request.json(); // Expect `query` key here
        if (!description || typeof description !== 'string') {
          throw new Error('Invalid input for embedding generation');
        }
    
        const response = await hf.featureExtraction({
            model: "sentence-transformers/all-MiniLM-L6-v2",
            inputs: description,
          });

        return new Response(JSON.stringify({ embedding: response }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(
            JSON.stringify({ error: `Failed to generate embedding: ${error}` }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}