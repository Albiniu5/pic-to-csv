import React from 'react';

export default function FAQ() {
    const faqs = [
        {
            question: "How do I turn a picture into a CSV file?",
            answer: "Use the uploader at the top of this page. You drop a file in, wait for the processing, and get a download link. We strictly handle the \"image-to-file\" part—so you get an actual .csv you can open, not just text on a screen."
        },
        {
            question: "How to convert image data into Excel online?",
            answer: "Since PicToCSV runs in the browser, it works on any device. We parse the visual grid in your image and export it as an .xlsx file. It keeps the columns separated so you don't have to fiddle with \"Text to Columns\" in Excel later."
        },
        {
            question: "How to create a CSV file with images?",
            answer: "Normally you'd have to type it out. The alternative is OCR software. We built this tool because standard OCR often messes up table alignment. Uploading your image here forces the model to look for a grid structure first, ensuring your CSV actually looks like a table."
        },
        {
            question: "How to generate a CSV file online?",
            answer: "If you have raw data like a PDF or screenshot, you use a converter like ours. If you just need a blank CSV to type into, use Google Sheets. We are specifically for when your data is trapped in a non-editable format."
        },
        {
            question: "Can AI convert an image to Excel?",
            answer: "Yes. In fact, it's the only reliable way to do it for complex documents. Older tools matched characters (A, B, C) but ignored layout. AI looks at the \"whitespace\" and lines to figure out where one cell ends and the next begins."
        },
        {
            question: "How to extract data from an image?",
            answer: "You have two options: manual entry or automated extraction. For automation, you need a tool that supports \"Table Recognition\" (like ours), not just \"Text Recognition.\" This distinction matters because it preserves the relationship between the header and the row data."
        },
        {
            question: "Can Excel extract data from a picture?",
            answer: "Sort of. The Excel mobile app has a camera feature for this. It works okay for simple lists but often struggles with big, multi-column financial statements. We handle those heavier, messier files better."
        },
        {
            question: "Can I automate image to Excel conversion?",
            answer: "Our current web interface is manual (one file at a time). For bulk automation (like processing 500 invoices a day), you would need API access. We are prototyping an API for developers—ping us via the contact form if you want to test it."
        },
        {
            question: "Can Chatgpt extract data from images?",
            answer: "It interprets the image fine, but it gives you a Markdown table in the chat window. You can't download that. You have to copy-paste it into Excel and often fix the formatting. We skip the chat and just give you the file."
        },
        {
            question: "Can Google convert an image to text?",
            answer: "Google Drive (via Docs) will OCR an image if you upload it, but it flattens everything into a text blob. It rarely keeps the table structure intact. Use Google for paragraphs/articles, use us for spreadsheets."
        },
        {
            question: "Which AI can extract text from an image?",
            answer: "We rely on Gemini Pro Vision because it's currently leading the pack on \"document reasoning\"—understanding the layout. GPT-4o is also strong. We use the model that minimizes hallucination (guessing data that isn't there)."
        },
        {
            question: "Which image to text converter is best?",
            answer: "For \"tables,\" we believe we are providing the cleanest output because we force the AI to respect the grid. For \"prose\" (like scanning a book page), dedicated mobile scanner apps like Adobe Scan or CamScanner are probably your best bet."
        },
        {
            question: "How to convert a chart into data?",
            answer: "Charts are tricky. Our specific focus is \"tables,\" but our AI often successfully reads bar charts and outputs the underlying numbers. Just check the output carefully, as estimating values from a line graph is an approximation, not a precise extraction."
        },
        {
            question: "Is there a free way to convert images to text?",
            answer: "There are plenty of paid enterprise tools (like Nanonets or Rossum) that cost a lot. We offer this free for standard web users because our costs scale differently. Usually, \"free\" means \"bad quality,\" but we're using the same enterprise-grade models on the backend."
        },
        {
            question: "Can ChatGPT convert a picture to text?",
            answer: "Yes, but as mentioned, it treats the output as chat text. If you goal is \"I need this in my database,\" ChatGPT adds an extra manual step (copy-pasting). We are built for the file-in, file-out workflow."
        }
    ];

    return (
        <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-8 text-center">Frequently Asked Questions</h1>

            <div className="space-y-6">
                {faqs.map((faq, index) => (
                    <div key={index} className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">{faq.question}</h3>
                        <p className="text-slate-600">{faq.answer}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
