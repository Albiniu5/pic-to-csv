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
                            <li><Link to="/" className="hover:text-brand-blue transition-colors">Converter</Link></li>
                            <li><Link to="/how-it-works" className="hover:text-brand-blue transition-colors">How It Works</Link></li>
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

                <div className="border-t border-brand-border mt-12 pt-8 text-center text-sm text-brand-muted">
                    <p>&copy; {currentYear} PicToCSV. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
