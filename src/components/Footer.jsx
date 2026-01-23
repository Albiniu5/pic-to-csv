import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-brand-border mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-1">
                        <span className="font-bold text-xl text-brand-dark tracking-tight block mb-4">PicToCSV</span>
                        <p className="text-brand-muted text-sm leading-relaxed">
                            Extract tabular data from images and PDFs instantly using advanced AI models. Secure, fast, and accurate.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-brand-dark mb-4">Product</h3>
                        <ul className="space-y-3 text-sm text-brand-muted">

                            <li><Link to="/how-it-works" className="hover:text-brand-blue transition-colors">How It Works</Link></li>
                            <li><Link to="/use-cases" className="hover:text-brand-blue transition-colors">Use Cases</Link></li>
                            <li><Link to="/faq" className="hover:text-brand-blue transition-colors">FAQ</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-brand-dark mb-4">Legal</h3>
                        <ul className="space-y-3 text-sm text-brand-muted">
                            <li><Link to="/privacy" className="hover:text-brand-blue transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/terms" className="hover:text-brand-blue transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-brand-dark mb-4">Support</h3>
                        <ul className="space-y-3 text-sm text-brand-muted">
                            <li><Link to="/contact" className="hover:text-brand-blue transition-colors">Contact Us</Link></li>
                            <li><a href="mailto:support@pictocsv.com" className="hover:text-brand-blue transition-colors">Email Support</a></li>
                        </ul>
                    </div>
                </div>

                {/* Related Tools Section - Enhanced Prominence */}
                <div className="border-t-2 border-brand-blue bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mt-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-brand-blue text-white p-2 rounded-lg">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-brand-dark mb-1">Related Tools</h3>
                            <p className="text-brand-muted text-sm">Explore our AI-powered document tools</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-blue-200 hover:shadow-md transition-shadow">
                        <a
                            href="https://comparedocsai.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-100 p-2 rounded-lg">
                                    <svg className="w-6 h-6 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="font-semibold text-brand-dark group-hover:text-brand-blue transition-colors">Compare Docs AI</div>
                                    <div className="text-xs text-brand-muted">AI-powered document comparison and analysis</div>
                                </div>
                            </div>
                            <svg className="w-5 h-5 text-brand-muted group-hover:text-brand-blue transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                    </div>
                </div>

                <div className="border-t border-brand-border mt-8 pt-8 text-center text-sm text-brand-muted">
                    <div className="flex flex-col md:flex-row justify-center items-center gap-4">
                        <p>&copy; {currentYear} PicToCSV. All rights reserved.</p>
                        <button
                            onClick={() => {
                                localStorage.removeItem('pictocsv_tutorial_completed');
                                window.location.reload();
                            }}
                            className="text-xs text-brand-muted hover:text-brand-blue underline"
                        >
                            Reset Tutorial
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
}
