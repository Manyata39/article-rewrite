import axios from "axios";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export const rewriteSentence = async (sentence) => {
    try {
        console.log("Sending to Groq:", sentence);
        console.log("API Key:", GROQ_API_KEY?.slice(0, 10) + "...");

        const response = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                model: "llama3-8b-8192", // ✅ updated model
                messages: [
                    {
                        role: "system",
                        content: `Rewrite this sentence to improve clarity and tone. Respond with only the rewritten sentence, no explanation:\n"${sentence}"`,
                    },
                    {
                        role: "user",
                        content: `Rewrite this sentence:\n\n${sentence}`,
                    },
                ],
                temperature: 0.7,
            },
            {
                headers: {
                    Authorization: `Bearer ${GROQ_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return response.data.choices[0].message.content.trim();
    } catch (error) {
        console.error("Groq error", error.response?.data || error.message);
        return "Error rewriting.";
    }
};

