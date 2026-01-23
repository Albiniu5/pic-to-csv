import React, { useState, useEffect } from 'react';
import { Mail, MessageSquare, Send, CheckCircle, AlertCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState('idle'); // idle, sending, success, error
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        // Initialize EmailJS
        const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
        if (publicKey) {
            emailjs.init(publicKey);
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.message) {
            setErrorMessage('Please fill in all required fields.');
            return;
        }

        setStatus('sending');
        setErrorMessage('');

        const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
        const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

        if (!serviceId || !templateId) {
            setStatus('error');
            setErrorMessage('Email configuration is missing. Please check site settings.');
            return;
        }

        try {
            // Sending a comprehensive set of variables to handle various template configurations
            await emailjs.send(serviceId, templateId, {
                // Standard EmailJS fields
                from_name: formData.name,
                from_email: formData.email,
                reply_to: formData.email,
                to_name: 'Admin',

                // Custom fields (matching our internal convention)
                user_name: formData.name,
                user_email: formData.email,
                subject: formData.subject || 'New Contact Form Submission',
                message: formData.message,

                // Metadata
                source: 'Contact Page',
                timestamp: new Date().toLocaleString()
            });

            setStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            console.error('Email send failed:', error);
            setStatus('error');
            setErrorMessage('Failed to send message. Please try again later.');
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-8 text-center">Contact Us</h1>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-8">
                    <p className="text-slate-600 mb-8 text-center text-lg">
                        Have questions or suggestions? Send us a message directly.
                    </p>

                    {status === 'success' ? (
                        <div className="text-center py-12 bg-green-50 rounded-lg animate-in fade-in">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Message Sent!</h3>
                            <p className="text-slate-600 mb-6">Thank you for reaching out. We'll get back to you shortly.</p>
                            <button
                                onClick={() => setStatus('idle')}
                                className="text-brand-blue font-medium hover:underline"
                            >
                                Send another message
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                                        Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-colors"
                                        placeholder="Your name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-colors"
                                        placeholder="your@email.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-1">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-colors"
                                    placeholder="What is this regarding?"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">
                                    Message *
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows="5"
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-colors resize-none"
                                    placeholder="How can we help you?"
                                    required
                                />
                            </div>

                            {status === 'error' && (
                                <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-start gap-3">
                                    <AlertCircle size={20} className="shrink-0 mt-0.5" />
                                    <p>{errorMessage}</p>
                                </div>
                            )}

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={status === 'sending'}
                                    className="bg-brand-blue hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {status === 'sending' ? (
                                        <>Sending...</>
                                    ) : (
                                        <>Send Message <Send size={18} /></>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
