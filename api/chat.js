// This code runs on the server, hidden from users
export default async function handler(req, res) {
    const { prompt } = req.body;
    
    const response = await fetch("https://api-inference.huggingface.co/models/deepseek-ai/DeepSeek-V3", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.wassim_dev_appHFToken}`, // The token is stored in Vercel Environment Variables
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ inputs: prompt })
    });

    const data = await response.json();
    res.status(200).json({ reply: data[0].generated_text });
}
