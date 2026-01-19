import React, { useState } from 'react';
import { Star, Send, X } from 'lucide-react';

export default function ContactModal({ isOpen, onClose }) {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [sending, setSending] = useState(false);
    const [success, setSuccess] = useState(false);
    const [rated, setRated] = useState(false);

    const handleRating = (star) => {
        setRating(star);
        setRated(true);

        // Instant save to localStorage
        const feedbacks = JSON.parse(localStorage.getItem('feedbackRatings') || '[]');
        feedbacks.push({
            rating: star,
            timestamp: new Date().toISOString(),
            msg: "Star rating only"
        });
        localStorage.setItem('feedbackRatings', JSON.stringify(feedbacks));

        // Log for debug
        console.log(`User rated: ${star} stars (Auto-saved)`);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!message.trim() && !rating) {
            return; // Don't submit empty
        }

        setSending(true);

        try {
            console.log('--- NEW MESSAGE ---');
            console.log('Email:', email || 'Not provided');
            console.log('Message:', message);
            console.log('Rating:', rating);

            // Save full feedback if message provided
            if (message.trim()) {
                const feedbacks = JSON.parse(localStorage.getItem('feedbackRatings') || '[]');
                // If we already saved the rating, update the last entry or just add new one
                // Simple approach: Add new entry with message
                feedbacks.push({
                    rating,
                    timestamp: new Date().toISOString(),
                    msg: message,
                    email: email || 'Anonymous'
                });
                localStorage.setItem('feedbackRatings', JSON.stringify(feedbacks));
            }

            await new Promise(resolve => setTimeout(resolve, 800));

            setSuccess(true);
            setTimeout(() => {
                onClose();
                setSuccess(false);
                setMessage('');
                setEmail('');
                setRating(0);
                setRated(false);
            }, 2000);
        } catch (error) {
            console.error(error);
        } finally {
            setSending(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm animate-in fade-in" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>

                {!success ? (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Get in touch</h3>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Frictionless Rating */}
                        <div className="mb-8 text-center bg-gray-50 rounded-xl p-4 border border-gray-100">
                            <p className="text-sm font-medium text-gray-600 mb-3">Rate your experience</p>
                            <div className="flex justify-center gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => handleRating(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        className="transition-transform hover:scale-110 focus:outline-none"
                                    >
                                        <Star
                                            size={32}
                                            className={`transition-colors ${star <= (hoverRating || rating)
                                                    ? 'fill-amber-400 text-amber-400'
                                                    : 'text-gray-300'
                                                }`}
                                        />
                                    </button>
                                ))}
                            </div>
                            {rated && (
                                <p className="text-xs text-green-600 font-medium mt-2 animate-in fade-in slide-in-from-bottom-1">
                                    Thanks for rating!
                                </p>
                            )}
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">
                                    Message <span className="text-gray-400 font-normal">(Optional)</span>
                                </label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Tell us what you think..."
                                    rows="3"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue resize-none text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">
                                    Email <span className="text-gray-400 font-normal">(Optional)</span>
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter email only if you want a reply"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
                                />
                            </div>

                            <div className="flex justify-end pt-2">
                                <button
                                    type="submit"
                                    disabled={sending || (!message.trim() && !rating)}
                                    className="bg-brand-blue text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 flex items-center gap-2 disabled:opacity-50 disabled:shadow-none"
                                >
                                    {sending ? 'Sending...' : (
                                        <>Send Feedback <Send size={16} /></>
                                    )}
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in">
                            <Send size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
                        <p className="text-gray-500">Your feedback helps us improve.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
