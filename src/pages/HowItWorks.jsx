import React from 'react';
import { Upload, Edit3, Download, Zap, Shield, CheckCircle } from 'lucide-react';

export default function HowItWorks() {
    const steps = [
        {
            icon: <Upload size={40} />,
            title: "1. Upload Your File",
            description: "Take a screenshot or upload a PDF/Image of the table you want to convert."
        },
        {
            icon: <Zap size={40} />,
            title: "2. AI Magic",
            description: "Our advanced AI analyzes the image, identifies rows and columns, and extracts the text with high accuracy."
        },
        {
            icon: <Edit3 size={40} />,
            title: "3. Edit & Refine",
            description: "Review the extracted data. Rename headers, drag columns to reorder, or edit cells directly in the browser."
        },
        {
            icon: <Download size={40} />,
            title: "4. Download",
            description: "Export your clean data as an Excel spreadsheet, CSV file, or formatted PDF."
        }
    ];

    return (
        <div className="max-w-5xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-extrabold text-slate-900 mb-4">How It Works</h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                    Convert messy data into clean spreadsheets in 4 simple steps.
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20 relative">
                {/* Connector Line (Desktop) */}
                <div className="hidden lg:block absolute top-12 left-0 w-full h-0.5 bg-slate-200 -z-10" />

                {steps.map((step, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative pt-12 text-center group hover:-translate-y-1 transition-transform duration-300">
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-indigo-600 text-white p-4 rounded-full border-4 border-slate-50 group-hover:scale-110 transition-transform">
                            {step.icon}
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                        <p className="text-slate-600 leading-relaxed">
                            {step.description}
                        </p>
                    </div>
                ))}
            </div>

            <div className="bg-indigo-50 rounded-2xl p-8 md:p-12 text-center">
                <h2 className="text-3xl font-bold text-slate-900 mb-6">Why Choose PicToCSV?</h2>
                <div className="grid md:grid-cols-3 gap-8 text-left">
                    <Feature
                        icon={<Shield className="text-indigo-600" />}
                        title="Secure & Private"
                        text="Your files are processed and then immediately deleted. We prioritize your data privacy."
                    />
                    <Feature
                        icon={<CheckCircle className="text-indigo-600" />}
                        title="High Accuracy"
                        text="Powered by the latest vision AI models to handle complex layouts and merged cells."
                    />
                    <Feature
                        icon={<FileSpreadsheet className="text-indigo-600" />}
                        title="Excel Ready"
                        text="Get properly formatted Excel files with correct data types, not just raw text."
                    />
                </div>
            </div>
        </div>
    );
}

function Feature({ icon, title, text }) {
    return (
        <div className="flex gap-4">
            <div className="flex-shrink-0 mt-1">
                {icon}
            </div>
            <div>
                <h3 className="font-bold text-slate-900 mb-1">{title}</h3>
                <p className="text-slate-600 text-sm">{text}</p>
            </div>
        </div>
    )
}

function FileSpreadsheet(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
            <path d="M14 2v4a2 2 0 0 0 2 2h4" />
            <path d="M8 13h2" />
            <path d="M14 13h2" />
            <path d="M8 17h2" />
            <path d="M14 17h2" />
        </svg>
    )
}
