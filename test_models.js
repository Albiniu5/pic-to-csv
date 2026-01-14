import fs from 'fs';
import path from 'path';

// Parse .env
const envPath = path.resolve(process.cwd(), '.env');
const envConfig = fs.readFileSync(envPath, 'utf8');
const apiKeyMatch = envConfig.match(/VITE_GOOGLE_API_KEY=(.*)/);
const API_KEY = apiKeyMatch ? apiKeyMatch[1].trim() : null;

if (!API_KEY) {
    console.error("No API Key found");
    process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

console.log("Fetching models from:", url.replace(API_KEY, 'HIDDEN_KEY'));

fetch(url)
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            console.error("API Error:", data.error);
        } else {
            console.log("Available Models:");
            const names = data.models?.map(m => m.name) || [];
            console.log(names.join('\n'));
        }
    })
    .catch(err => console.error("Fetch Error:", err));
