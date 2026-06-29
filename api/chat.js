// api/chat.js
export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    const { prompt } = req.body;

    try {
        const response = await fetch("https://api-inference.huggingface.co/models/microsoft/phi-2", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.wassim_HFToken}`,
                "Content-Type": "application/json"
            },
            // Llama models prefer 'inputs' as a string for basic inference
            body: JSON.stringify({ inputs: prompt }) 
        });

        const data = await response.json();
        
        // Safety check: Llama often returns an object with 'generated_text' 
        // inside an array, but sometimes it returns an object directly.
        const reply = Array.isArray(data) ? data[0].generated_text : data.generated_text;

        res.status(200).json({ reply: reply });
    } catch (error) {
        res.status(500).json({ reply: "Error connecting to the AI model." });
    }
}


