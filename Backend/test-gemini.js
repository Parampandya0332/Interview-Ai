
require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

async function testGemini() {
    const apiKey = process.env.GOOGLE_GENAI_API_KEY;

    if (!apiKey) {
        console.error("ERROR: GOOGLE_GENAI_API_KEY is missing.");
        return;
    }

    console.log("API key found.");
    console.log("Testing Gemini model...");

    const ai = new GoogleGenAI({ apiKey });

    try {
        const response = await ai.models.generateContent({
            model: process.env.GOOGLE_GENAI_MODEL || "gemini-2.5-flash",
            contents: "Reply with exactly: Gemini API working."
        });

        console.log("SUCCESS: Gemini API is working.");
        console.log("Response:", response.text);
    } catch (error) {
        console.error("GEMINI TEST FAILED");
        console.error("Message:", error.message);
        console.error("Status:", error.status);
        console.error("Code:", error.code);
        console.error("Details:", error.errorDetails);
    }
}

testGemini();
