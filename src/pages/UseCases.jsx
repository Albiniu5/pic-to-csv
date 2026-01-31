import React from 'react';
import { ChefHat, Calculator, Camera, MapPin, Receipt, GraduationCap, Layout, FileSpreadsheet, Building2, Search } from 'lucide-react';
import SEO from '../components/SEO';

const cases = [
    {
        icon: Receipt,
        title: "Convert Receipts to CSV",
        description: "Stop manually typing receipts for expense reports. Snap a photo of your receipt, and we'll extract the date, store name, total, and line items into a neat CSV file ready for Excel or your accounting software.",
        example: {
            input: "Photo of crumpled gas receipt",
            output: "Date, Vendor, Amount, Tax"
        },
        color: "bg-green-100 text-green-600"
    },
    {
        icon: FileSpreadsheet,
        title: "Invoice Data Extraction",
        description: "Automate your accounts payable. Upload PDF or image invoices to extract invoice numbers, dates, and line item details instantly. Perfect for small business owners and freelancers.",
        example: {
            input: "PDF Invoice from supplier",
            output: "Inv#, Date, Line Items, Total"
        },
        color: "bg-blue-100 text-blue-600"
    },
    {
        icon: Layout,
        title: "Table Images to Excel",
        description: "Found a data table in a PDF report or a textbook? Don't retype it. Take a screenshot and convert the table image directly to an Excel (XLSX) spreadsheet in seconds.",
        example: {
            input: "Screenshot of financial report",
            output: "Fully formatted Excel Sheet"
        },
        color: "bg-indigo-100 text-indigo-600"
    },
    {
        icon: Search,
        title: "Research & Data Entry",
        description: "Collecting data from physical archives, books, or old documents? Digitize your research material fast. Turn pages of data into searchable, sortable spreadsheets for analysis.",
        example: {
            input: "Photo of demographic stats page",
            output: "Structured Data Table"
        },
        color: "bg-purple-100 text-purple-600"
    },
    {
        icon: Building2,
        title: "Accounting Automation",
        description: "Simplify tax season. Batch convert bank statements, credit card statements, or financial records from PDF/Image to CSV to import them into QuickBooks, Xero, or clean them up in Excel.",
        example: {
            input: "Scanned bank statement",
            output: "Date, Description, Debit, Credit"
        },
        color: "bg-orange-100 text-orange-600"
    },
    {
        icon: Calculator,
        title: "Inventory Management",
        description: "doing a stock take? Just take photos of your inventory lists or shelf tags. We can digitize the handwritten or printed counts into a digital file for your inventory system.",
        example: {
            input: "Photo of inventory sheet",
            output: "Item SKU, Quantities, Location"
        },
        color: "bg-red-100 text-red-600"
    }
];

export default function UseCases() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <SEO
                title="Image to CSV Use Cases – Receipts, Invoices, & Data Entry | PicToCSV"
                description="Discover how to use PicToCSV for extracting data from receipts, invoices, research documents, and bank statements. automate your data entry tasks."
                canonical="/use-cases"
            />

            <div className="text-center mb-16 animate-in slide-in-from-top-4 duration-700">
                <h1 className="text-4xl md:text-5xl font-bold text-brand-dark mb-6">
                    Image to CSV <span className="text-brand-blue">Use Cases</span>
                </h1>
                <p className="text-xl text-brand-muted max-w-2xl mx-auto">
                    PicToCSV isn't just for spreadsheets. Discover how AI visual analysis can transform your daily administrative tasks.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {cases.map((item, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-lg hover:border-brand-blue transition-all duration-300 group animate-in fade-in slide-in-from-bottom-4"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <div className={`w-14 h-14 rounded-full ${item.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                            <item.icon size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-brand-dark mb-3">
                            {item.title}
                        </h3>
                        <p className="text-brand-muted mb-6 leading-relaxed">
                            {item.description}
                        </p>
                        <div className="bg-gray-50 rounded-lg p-4 text-sm border border-gray-100">
                            <div className="flex gap-2 mb-2">
                                <span className="font-semibold text-gray-500 w-16">Input:</span>
                                <span className="text-gray-700">{item.example.input}</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="font-semibold text-brand-blue w-16">Output:</span>
                                <span className="text-brand-dark">{item.example.output}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-16 text-center bg-brand-blue/5 rounded-2xl p-8 md:p-12">
                <h2 className="text-2xl font-bold text-brand-dark mb-4">Have a creative use case?</h2>
                <p className="text-brand-muted mb-8">
                    We'd love to hear how you're using PicToCSV to solve problems.
                </p>
                <a
                    href="/contact"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-blue hover:bg-blue-700 transition-colors"
                >
                    Share Your Story
                </a>
            </div>
        </div>
    );
}
