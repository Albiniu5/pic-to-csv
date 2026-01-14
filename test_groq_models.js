import Groq from "groq-sdk";
import fs from 'fs';
import path from 'path';

// Parse .env
const envPath = path.resolve(process.cwd(), '.env');
const envConfig = fs.readFileSync(envPath, 'utf8');
const apiKeyMatch = envConfig.match(/VITE_GROQ_API_KEY=(.*)/);
const API_KEY = apiKeyMatch ? apiKeyMatch[1].trim() : null;

if (!API_KEY) {
    console.error("No API Key found");
    process.exit(1);
}

const groq = new Groq({ apiKey: API_KEY });

async function main() {
    const response = await groq.models.list();
    console.log(JSON.stringify(response, null, 2));
}

main().catch(console.error);
