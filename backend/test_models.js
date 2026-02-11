require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
        // trying to access the model directly might fail, but let's try to list standard ones if possible.
        // The SDK doesn't have a direct 'listModels' method on the client instance in some versions, 
        // but the error message suggested "Call ListModels to see the list".
        // Actually, for the Node SDK, we might just need to try a known working alias.

        // Let's try to just run a generation with a different variant to see if it works, 
        // or use a specific fallback.
        console.log("Testing model: gemini-1.5-flash");
        const result = await model.generateContent("Hello");
        console.log("Success with gemini-1.5-flash");
    } catch (error) {
        console.error("Error with gemini-1.5-flash:", error.message);
    }

    try {
        const model2 = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });
        console.log("Testing model: gemini-1.5-flash-001");
        const result2 = await model2.generateContent("Hello");
        console.log("Success with gemini-1.5-flash-001");
    } catch (error) {
        console.error("Error with gemini-1.5-flash-001:", error.message);
    }

    try {
        const model3 = genAI.getGenerativeModel({ model: "gemini-pro" });
        console.log("Testing model: gemini-pro");
        const result3 = await model3.generateContent("Hello");
        console.log("Success with gemini-pro");
    } catch (error) {
        console.error("Error with gemini-pro:", error.message);
    }
}

listModels();
