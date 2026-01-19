import React from 'react';
import { ChefHat, Calculator, Camera, MapPin, Receipt, GraduationCap, Layout } from 'lucide-react';

const cases = [
    {
        icon: ChefHat,
        title: "Digitize Handwritten Recipes",
        description: "Snap a photo of grandma's old recipe cards. PicToCSV extracts the ingredients and instructions into a clean table.",
        example: {
            input: "Photo of stained recipe card",
            output: "Columns: Ingredient, Quantity, Unit, Step"
        },
        color: "bg-orange-100 text-orange-600"
    },
    {
        icon: MapPin,
        title: "Travel Itinerary from Landmarks",
        description: "Upload photos of landmarks or tourist maps. Get a structured list of locations, opening hours, and descriptions.",
        example: {
            input: "Photo of a tourist brochure map",
            output: "Columns: Location, Type, Opening Hours, Fee"
        },
        color: "bg-blue-100 text-blue-600"
    },
    {
        icon: Receipt,
        title: "Expense Tracking from Receipts",
        description: "Don't type out receipts manually. Upload a batch of crumpled reciepts and get a unified expense list.",
        example: {
            input: "Photo of multiple receipts on a table",
            output: "Columns: Date, Merchant, Item, Price, Category"
        },
        color: "bg-green-100 text-green-600"
    },
    {
        icon: GraduationCap,
        title: "Study Notes to Flashcards",
        description: "Convert your handwritten lecture notes or textbook diagrams into structured Q&A pairs for Anki or Quizlet.",
        example: {
            input: "Photo of biology notes",
            output: "Columns: Concept, Definition, Key Details"
        },
        color: "bg-purple-100 text-purple-600"
    },
    {
        icon: Calculator,
        title: "Inventory Management",
        description: "Take a picture of your pantry or warehouse shelf. AI counts the items and lists them for you.",
        example: {
            input: "Photo of a stocked shelf",
            output: "Columns: Item Name, Estimated Count, Brand"
        },
        color: "bg-red-100 text-red-600"
    },
    {
        icon: Layout,
        title: "Web Scraping from Screenshots",
        description: "Screenshot a product list or pricing table from a website that blocks copying. Get the clean data instantly.",
        example: {
            input: "Screenshot of competitor pricing",
            output: "Columns: Product, Price, Features"
        },
        color: "bg-indigo-100 text-indigo-600"
    }
];

export default function UseCases() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-16 animate-in slide-in-from-top-4 duration-700">
                <h1 className="text-4xl md:text-5xl font-bold text-brand-dark mb-6">
                    Creative <span className="text-brand-blue">Use Cases</span>
                </h1>
                <p className="text-xl text-brand-muted max-w-2xl mx-auto">
                    PicToCSV isn't just for spreadsheets. Discover how AI visual analysis can transform your daily tasks.
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
