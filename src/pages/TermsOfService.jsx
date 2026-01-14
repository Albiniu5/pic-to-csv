import React from 'react';

export default function TermsOfService() {
    return (
        <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-8">Terms of Service</h1>

            <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-slate-900 mb-4">1. Acceptance of Terms</h2>
                    <p className="text-slate-600 mb-4">
                        By accessing and using PicToCSV, you agree to be bound by these Terms of Service.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-slate-900 mb-4">2. Description of Service</h2>
                    <p className="text-slate-600 mb-4">
                        PicToCSV provides AI-powered data extraction tools to convert images and documents into structured formats like CSV and Excel.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-slate-900 mb-4">3. User Conduct</h2>
                    <p className="text-slate-600 mb-4">
                        You agree not to misuse the service or help anyone else do so. You are responsible for the content you upload. Do not upload sensitive, illegal, or malicious files.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-slate-900 mb-4">4. Disclaimer of Warranties</h2>
                    <p className="text-slate-600 mb-4">
                        The service is provided "as is". We make no warranties regarding the accuracy or reliability of the extracted data. Always verify specific results.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-slate-900 mb-4">5. Limitation of Liability</h2>
                    <p className="text-slate-600 mb-4">
                        We shall not be liable for any indirect, incidental, or consequential damages resulting from your use of the service.
                    </p>
                </section>
            </div>
        </div>
    );
}
