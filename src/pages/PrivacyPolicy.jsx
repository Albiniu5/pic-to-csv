import React from 'react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
    return (
        <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-8">Privacy Policy</h1>

            <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-slate-900 mb-4">1. Information We Collect</h2>
                    <p className="text-slate-600 mb-4">
                        We collect minimal information to provide our service. When you upload a file, it is processed temporarily to extract data and then deleted. We do not store your files permanently.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-slate-900 mb-4">2. How We Use Information</h2>
                    <p className="text-slate-600 mb-4">
                        We use the data solely to perform the image-to-Excel conversion service. We may use anonymous analytics to improve site performance.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-slate-900 mb-4">3. Data Security</h2>
                    <p className="text-slate-600 mb-4">
                        We implement standard security measures to protect your data during transmission and processing. However, no method of transmission over the Internet is 100% secure.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-slate-900 mb-4">4. Third-Party Services</h2>
                    <p className="text-slate-600 mb-4">
                        We may use third-party services like Google Analytics and Google AdSense. These services may use cookies to track your usage and serve relevant ads. Used of these services is subject to their respective privacy policies.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-slate-900 mb-4">5. Contact Us</h2>
                    <p className="text-slate-600">
                        If you have questions about this privacy policy, please <Link to="/contact" className="text-brand-blue hover:underline">contact us here</Link>.
                    </p>
                </section>
            </div>
        </div>
    );
}
