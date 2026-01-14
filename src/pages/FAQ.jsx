import React from 'react';

export default function FAQ() {
    const faqs = [
        {
            question: "Is PicToCSV free to use?",
            answer: "Yes, our core file conversion features are free to use. We may offer premium features in the future for high-volume users."
        },
        {
            question: "What file formats do you support?",
            answer: "We support major image formats (JPG, PNG, WebP) and PDF documents. The output can be downloaded as CSV, Excel (XLSX), or formatted PDF."
        },
        {
            question: "Is my data secure?",
            answer: "Absolutely. Files are processed temporarily by our secure AI engine and are deleted immediately after conversion. We do not store your documents."
        },
        {
            question: "Can I convert handwritten text?",
            answer: "Our AI is optimized for printed text and tables. Handwriting recognition may vary in accuracy depending on legibility."
        },
        {
            question: "How accurate is the conversion?",
            answer: "We use state-of-the-art vision models (like Gemini Pro Vision) which provide very high accuracy. However, we always recommend reviewing the output in our editor before exporting."
        },
        {
            question: "Can I export to Google Sheets?",
            answer: "Currently, you can download an Excel (.xlsx) or CSV file and upload it directly to Google Sheets."
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
