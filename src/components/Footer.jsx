import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-slate-200 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-1">
                        <span className="font-bold text-xl text-slate-900 tracking-tight block mb-4">PicToCSV</span>
                        <p className="text-slate-500 text-sm">
                            Extract tabular data from images and PDFs instantly using advanced AI models. Secure, fast, and accurate.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-slate-900 mb-4">Product</h3>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li><Link to="/" className="hover:text-indigo-600 transition-colors">Converter</Link></li>
                            <li><Link to="/how-it-works" className="hover:text-indigo-600 transition-colors">How It Works</Link></li>
                            <li><Link to="/faq" className="hover:text-indigo-600 transition-colors">FAQ</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-slate-900 mb-4">Legal</h3>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li><Link to="/privacy" className="hover:text-indigo-600 transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/terms" className="hover:text-indigo-600 transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-slate-900 mb-4">Support</h3>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li><Link to="/contact" className="hover:text-indigo-600 transition-colors">Contact Us</Link></li>
                            <li><a href="mailto:support@pictocsv.com" className="hover:text-indigo-600 transition-colors">Email Support</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-100 mt-8 pt-8 text-center text-sm text-slate-500">
                    <p>&copy; {currentYear} PicToCSV. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
