import React from 'react';

export default function FAQ() {
    const faqs = [
        {
            question: "How do I turn a picture into a CSV file?",
            answer: "Honestly, it's super easy. You don't need to manually type anything. Just grab your screenshot or photo, drop it into the upload box up top, and our AI does the heavy lifting. It reads the text, figures out the columns, and hands you back a clean CSV. Done and done."
        },
        {
            question: "How to extract data from an image?",
            answer: "The old way was typing it out by hand, which let's be real, nobody has time for. We use AI vision to look at your image just like a human would. It picks out the data—whether it's an invoice, a price list, or some random stats—and converts it into actual text you can edit."
        },
        {
            question: "Can you convert PNG to CSV?",
            answer: "Yup, absolutely. PNGs, JPGs, even PDFs—we handle 'em all. So if you've got a crisp screenshot or a grainy photo from your phone, throw it in. We'll crunch the data and spit out a CSV or Excel file for you in seconds."
        },
        {
            question: "How to create a CSV file with images?",
            answer: "If you're sitting on a pile of images with data locked inside, this is the cheat code. Instead of manual entry, you just upload the pic here. We unlock that data and organize it into rows and columns so you can open it right up in Excel or Google Sheets."
        },
        {
            question: "Is my data safe?",
            answer: "Yes, absolutely. We prioritize your privacy. Files uploaded to PicToCSV are processed in temporary memory and are permanently deleted immediately after the analysis is complete. We do not store, share, or use your documents to train our models."
        },
        {
            question: "Is this tool free?",
            answer: "Yes, PicToCSV is currently free to use for standard conversions. We optimize for efficiency to keep costs low and pass the value to you."
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
