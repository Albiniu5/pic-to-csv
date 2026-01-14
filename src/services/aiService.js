import OpenAI from 'openai';
import { jsonrepair } from 'jsonrepair';

const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

// Initialize OpenAI Client (configured for OpenRouter)
const openai = API_KEY ? new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: API_KEY,
    dangerouslyAllowBrowser: true, // Required for client-side usage
    defaultHeaders: {
        "HTTP-Referer": "https://localhost:5173", // Optional: For OpenRouter rankings
        "X-Title": "Pic-to-CSV App",
    }
}) : null;

const SYSTEM_PROMPT = `
You are an enterprise data-migration assistant specialized in EXACT table extraction.

Your PRIMARY GOAL: Extract tables EXACTLY as they appear in the original document.
- Preserve the EXACT row-column orientation
- Keep ALL row headers, column headers, and data cells in their ORIGINAL positions
- Do NOT transpose, reformat, or reorganize the table structure
- If a table has row headers in the leftmost column, keep them there
- If a table has column headers in the top row, keep them there
- Preserve hierarchical structures (nested headers, merged cells as repeated values)

Rules:
1. Identify ALL separate tables in the image.
2. Do NOT merge visually distinct tables.
3. Return a JSON object with a single root key "tables" containing an array of table objects.
4. Each table object must have:
   - "name": A descriptive name based on headers or content.
   - "data": An array of row objects representing EXACTLY what you see.
     - First object in "data" array = column headers (use the EXACT text from the top row)
     - Subsequent objects = data rows, with keys matching the column headers

CRITICAL: If the original table looks like this:
| Category           | 2008 | 2009 | 2010 |
| Non-current assets | 222  | 445  | 345  |
| Property          | 423  | 654  | 567  |

Your JSON MUST be:
{
  "tables": [{
    "name": "Financial Data",
    "data": [
      { "Category": "Non-current assets", "2008": "222", "2009": "445", "2010": "345" },
      { "Category": "Property", "2008": "423", "2009": "654", "2010": "567" }
    ]
  }]
}

DO NOT transpose or alter the structure.
DO NOT invent or modify values.
IMPORTANT: Return ONLY valid JSON. No markdown.
`;

/**
 * Converts a File object to a Base64 string.
 */
async function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/**
 * Extracts structured data from an image using OpenRouter.
 */
export const extractData = async (file) => {
    if (!openai) {
        throw new Error("API Key is missing. Please add VITE_OPENROUTER_API_KEY to your .env file.");
    }

    try {
        const base64Image = await fileToBase64(file);

        const completion = await openai.chat.completions.create({
            model: "google/gemini-2.0-flash-001", // Or "meta-llama/llama-3.2-11b-vision-instruct"
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: SYSTEM_PROMPT + "\n\nExtract all tabular data from this image."
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: base64Image
                            }
                        }
                    ]
                }
            ],
            // Ensure JSON mode
            response_format: { type: "json_object" },
            max_tokens: 16000, // Explicitly request more tokens to avoid cut-off
        });

        const text = completion.choices[0]?.message?.content;

        // Clean up markdown
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        let parsed;
        try {
            parsed = JSON.parse(cleanedText);
        } catch (e) {
            console.warn("JSON Parse Failed. Attempting robust repair with jsonrepair...", e.message);
            try {
                const repaired = jsonrepair(cleanedText);
                parsed = JSON.parse(repaired);
            } catch (e2) {
                console.error("jsonrepair failed:", e2);
                throw e; // Throw original if repair fails
            }
        }

        // Normalize output to always be an array of tables
        if (parsed.tables && Array.isArray(parsed.tables)) {
            return parsed.tables;
        } else if (Array.isArray(parsed)) {
            // Handle legacy/flat response
            return [{ name: "Extracted Table", data: parsed }];
        } else {
            // Fallback for single object
            return [{ name: "Extracted Table", data: [parsed] }];
        }

    } catch (error) {
        console.error("Error calling OpenRouter API:", error);

        // Fallback for Quota/Rate Limits
        if (error.status === 429 || error.message.includes("429")) {
            console.warn("Quota exceeded (OpenRouter). Returning mock data.");
            return [
                {
                    name: "Primary Expenses (DEMO)",
                    data: [
                        { Date: '2024-01-15', Description: 'Office Supplies', Category: 'Operations', Amount: 45.20 },
                        { Date: '2024-01-16', Description: 'Client Lunch', Category: 'Sales', Amount: 120.50 }
                    ]
                },
                {
                    name: "Tax Summary (DEMO)",
                    data: [
                        { Type: 'VAT', Rate: '20%', Amount: '33.14' },
                        { Type: 'Service Tax', Rate: '5%', Amount: '8.28' }
                    ]
                }
            ];
        }

        throw new Error("Failed to extract data: " + error.message);
    }
};
