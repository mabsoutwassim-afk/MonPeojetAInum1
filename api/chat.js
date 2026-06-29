// api/chat.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { prompt } = req.body;

    try {
        const response = await fetch("https://api-inference.huggingface.co/models/microsoft/phi-2", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.wassim_HFToken}`,
                "Content-Type": "application/json"
            },
            // Phi models perform better with a clear instructional prompt
            body: JSON.stringify({ 
                inputs: `Instruct: ${prompt}\nOutput:`,
                parameters: { max_new_tokens: 250 } 
            }) 
        });

        const data = await response.json();

        // Handle cases where the model is loading or returns an error
        if (data.error) {
            return res.status(503).json({ reply: `Model status: ${data.error}` });
        }

        // Phi-2 typically returns an array with a 'generated_text' property
        // We clean the output to remove the input prompt if necessary
        const fullText = Array.isArray(data) ? data[0].generated_text : data.generated_text;
        const reply = fullText.split('Output:')[1] || fullText;

        res.status(200).json({ reply: reply.trim() });
    } catch (error) {
        res.status(500).json({ reply: "Failed to connect to the AI service." });
    }
}


