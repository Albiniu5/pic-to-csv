import React, { useState } from 'react';

export default function ContactModal({ isOpen, onClose }) {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!message.trim()) {
            alert('Please enter a message.');
            return;
        }

        setSending(true);

        try {
            // Use EmailJS or similar service for client-side email
            // For now, log to console (similar to CompareDocsAI initial implementation)
            console.log('--- NEW CONTACT MESSAGE ---');
            console.log('From:', email || 'Anonymous');
            console.log('Message:', message);
            console.log('Destination: gafdj1523@gmail.com (server-side)');
            console.log('---------------------------');

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            setSuccess(true);
            setTimeout(() => {
                onClose();
                setSuccess(false);
                setEmail('');
                setMessage('');
            }, 2500);
        } catch (error) {
            console.error('Contact error:', error);
            alert('Failed to send message. Please try again.');
        } finally {
            setSending(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm animate-in fade-in"
            onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4 animate-in zoom-in"
                onClick={(e) => e.stopPropagation()}>
                {!success ? (
                    <>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-brand-dark">Contact Support</h3>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                                aria-label="Close"
                            >
                                ×
                            </button>
                        </div>

                        <p className="text-brand-muted mb-4">
                            Found an issue or have a suggestion? Send us a message directly.
                        </p>

                        <form onSubmit={handleSubmit}>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Your Email (Optional)"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                            />

                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="How can we help you?"
                                rows="4"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4 resize-vertical focus:outline-none focus:ring-2 focus:ring-brand-blue"
                                required
                            />

                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={sending}
                                    className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                                >
                                    {sending ? 'Sending...' : 'Send Message'}
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">✓</span>
                        </div>
                        <h3 className="text-xl font-bold text-brand-dark mb-2">Message Sent!</h3>
                        <p className="text-brand-muted">We'll get back to you shortly.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
