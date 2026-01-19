import React from 'react';

export default function EmailJSDebug() {
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

    return (
        <div className="max-w-2xl mx-auto p-8 mt-20">
            <h1 className="text-2xl font-bold mb-6">EmailJS Configuration Check</h1>

            <div className="space-y-4 bg-gray-100 p-6 rounded-lg">
                <div>
                    <strong>Public Key:</strong>
                    <code className="ml-2 bg-white px-2 py-1 rounded">
                        {publicKey || '❌ NOT FOUND'}
                    </code>
                </div>

                <div>
                    <strong>Service ID:</strong>
                    <code className="ml-2 bg-white px-2 py-1 rounded">
                        {serviceId || '❌ NOT FOUND'}
                    </code>
                </div>

                <div>
                    <strong>Template ID:</strong>
                    <code className="ml-2 bg-white px-2 py-1 rounded">
                        {templateId || '❌ NOT FOUND'}
                    </code>
                </div>

                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
                    <p className="text-sm">
                        {publicKey && serviceId && templateId ? (
                            <span className="text-green-600 font-semibold">✅ All environment variables are loaded!</span>
                        ) : (
                            <span className="text-red-600 font-semibold">❌ Missing environment variables - emails won't work</span>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
}
