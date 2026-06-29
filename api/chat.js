// This code runs on the server, hidden from users
export default async function handler(req, res) {
    const { prompt } = req.body;
    
    const response = await fetch("https://api-inference.huggingface.co/models/meta-llama/Llama-3.1-8B-Instruct", {
    method: "POST",
    headers: {
        "Authorization": `Bearer ${process.env.wassim_HFToken}`,
        "Content-Type": "application/json"
    },
    // Most chat models expect the 'inputs' or 'messages' format
    body: JSON.stringify({ inputs: prompt }) 
});

    const data = await response.json();
    res.status(200).json({ reply: data[0].generated_text });
}



