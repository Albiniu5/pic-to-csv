import React from 'react';
import { Mail, MessageSquare } from 'lucide-react';

export default function Contact() {
    return (
        <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-8 text-center">Contact Us</h1>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <p className="text-slate-600 mb-8 text-center text-lg">
                    Have questions, suggestions, or need support? We're here to help!
                </p>

                <div className="grid gap-8 md:grid-cols-2">
                    <div className="flex flex-col items-center p-6 bg-slate-50 rounded-lg">
                        <div className="p-4 bg-indigo-100 text-indigo-600 rounded-full mb-4">
                            <Mail size={32} />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Email Support</h3>
                        <p className="text-slate-500 text-center mb-4">
                            For general inquiries and technical support.
                        </p>
                        <a href="mailto:support@pictocsv.com" className="text-indigo-600 font-medium hover:underline">
                            support@pictocsv.com
                        </a>
                    </div>

                    <div className="flex flex-col items-center p-6 bg-slate-50 rounded-lg">
                        <div className="p-4 bg-indigo-100 text-indigo-600 rounded-full mb-4">
                            <MessageSquare size={32} />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Feedback</h3>
                        <p className="text-slate-500 text-center mb-4">
                            Tell us how we can improve the tool.
                        </p>
                        <a href="mailto:feedback@pictocsv.com" className="text-indigo-600 font-medium hover:underline">
                            feedback@pictocsv.com
                        </a>
                    </div>
                </div>

                <div className="mt-12 border-t border-slate-100 pt-8 text-center">
                    <p className="text-slate-500 text-sm">
                        We typically respond within 24-48 hours.
                    </p>
                </div>
            </div>
        </div>
    );
}
