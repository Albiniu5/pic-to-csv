import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';

export default function EmailJSDebug() {
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

    const [status, setStatus] = useState('idle');
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        if (publicKey) emailjs.init(publicKey);
    }, [publicKey]);

    const addLog = (msg) => setLogs(prev => [...prev, `${new Date().toLocaleTimeString()} - ${msg}`]);

    const handleTestSend = async () => {
        setStatus('sending');
        addLog('Starting test send...');

        try {
            if (!publicKey || !serviceId || !templateId) {
                throw new Error('Missing configuration values');
            }

            addLog(`Service ID: ${serviceId}`);
            addLog(`Template ID: ${templateId}`);

            const res = await emailjs.send(serviceId, templateId, {
                user_name: 'Test User',
                user_email: 'test@example.com',
                message: 'This is a test message from the debug page.',
                rating: 5,
                subject: 'Debug Test',
                source: 'Debug Page',
                timestamp: new Date().toLocaleString()
            });

            addLog(`✅ SUCCESS! Status: ${res.status}, Text: ${res.text}`);
            setStatus('success');
        } catch (error) {
            console.error(error);
            addLog(`❌ FAILED: ${JSON.stringify(error)}`);
            if (error.text) addLog(`Error Text: ${error.text}`);
            setStatus('error');
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-8 mt-20">
            <h1 className="text-2xl font-bold mb-6">EmailJS Configuration Check</h1>

            <div className="space-y-4 bg-gray-100 p-6 rounded-lg mb-8">
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
                            <span className="text-red-600 font-semibold">❌ Missing variables. Check .env file.</span>
                        )}
                    </p>
                </div>
            </div>

            <div className="border-t pt-8">
                <h2 className="text-xl font-bold mb-4">Live Test</h2>
                <button
                    onClick={handleTestSend}
                    disabled={status === 'sending'}
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {status === 'sending' ? 'Sending...' : 'Send Test Email'}
                </button>

                <div className="mt-6 bg-slate-900 text-green-400 p-4 rounded font-mono text-sm h-64 overflow-y-auto">
                    {logs.length === 0 ? (
                        <span className="text-slate-500">Logs will appear here...</span>
                    ) : (
                        logs.map((log, i) => <div key={i}>{log}</div>)
                    )}
                </div>
            </div>
        </div>
    );
}
