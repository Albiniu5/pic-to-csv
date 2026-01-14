import Groq from "groq-sdk";
import fs from 'fs';
import path from 'path';

// Parse .env
const envPath = path.resolve(process.cwd(), '.env');
const envConfig = fs.readFileSync(envPath, 'utf8');
const apiKeyMatch = envConfig.match(/VITE_GROQ_API_KEY=(.*)/);
const API_KEY = apiKeyMatch ? apiKeyMatch[1].trim() : null;

// 1x1 Red Pixel JPEG key
const sampleImage = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=";

const groq = new Groq({ apiKey: API_KEY });

async function main() {
    console.log("Testing llama-4-scout with 1x1 pixel...");

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: "What color is this?" },
                        { type: "image_url", image_url: { url: sampleImage } }
                    ]
                }
            ],
            model: "llama-3.2-11b-vision-preview",
        });
        console.log("Response:", completion.choices[0].message.content);
    } catch (e) {
        console.error("FULL URL FAILED:", e.message);
    }
}

main();
