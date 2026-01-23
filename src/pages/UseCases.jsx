import React from 'react';
import { ChefHat, Calculator, Camera, MapPin, Receipt, GraduationCap, Layout } from 'lucide-react';

const cases = [
    {
        icon: ChefHat,
        title: "Digitize Handwritten Recipes",
        description: "Grandma's cursive is hard to read? Snap a pic of that stained recipe card. We'll grab the ingredients and steps so you can actually read them on your phone.",
        example: {
            input: "Photo of old recipe card",
            output: "Columns: Ingredient, Quantity, Steps"
        },
        color: "bg-orange-100 text-orange-600"
    },
    {
        icon: MapPin,
        title: "Travel Plans from Maps",
        description: "Don't type out every stop from a brochure. Just take a photo of the map or guide. We'll list out the hours, locations, and details so you can just go.",
        example: {
            input: "Photo of tourist guide",
            output: "Columns: Place, Hours, Entry Fee"
        },
        color: "bg-blue-100 text-blue-600"
    },
    {
        icon: Receipt,
        title: "Expense Tracking (No Typing)",
        description: "Stop manually typing receipts. Seriously. Upload a batch of them, and we'll pull out the dates, merchants, and totals for your expense report.",
        example: {
            input: "Photo of crumpled receipts",
            output: "Columns: Date, Store, Total, Category"
        },
        color: "bg-green-100 text-green-600"
    },
    {
        icon: GraduationCap,
        title: "Study Notes to Flashcards",
        description: "Turn your scribbled lecture notes into a clean study list. Great for making Anki cards or Quizlets without retyping everything.",
        example: {
            input: "Photo of notebook page",
            output: "Columns: Term, Definition, Notes"
        },
        color: "bg-purple-100 text-purple-600"
    },
    {
        icon: Calculator,
        title: "Inventory Counting",
        description: "Need to count stock? Snap a shelf photo. Our AI lists what's there so you don't have to stand there with a clipboard all day.",
        example: {
            input: "Photo of warehouse shelf",
            output: "Columns: Item Name, Count, SKU"
        },
        color: "bg-red-100 text-red-600"
    },
    {
        icon: Layout,
        title: "Website Data Scraping",
        description: "Website won't let you copy-paste a table? Screenshot it. We'll turn that image back into a spreadsheet you can actually use.",
        example: {
            input: "Screenshot of pricing page",
            output: "Columns: Plan, Price, Features"
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
