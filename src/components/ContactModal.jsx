import React, { useState, useEffect } from 'react';
import { Star, Send, X, AlertCircle } from 'lucide-react';
import { getUserId, hasUserRated, getUserRating, updateUserRating } from '../utils/userIdentity';

export default function ContactModal({ isOpen, onClose }) {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [sending, setSending] = useState(false);
    const [success, setSuccess] = useState(false);
    const [rated, setRated] = useState(false);
    const [alreadyRated, setAlreadyRated] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    // Check if user has already rated EVERY TIME modal opens
    useEffect(() => {
        if (isOpen) {
            // Always check fresh from localStorage
            const hasRated = hasUserRated();
            setAlreadyRated(hasRated);

            if (hasRated) {
                const existingRating = getUserRating();
                setRating(existingRating);
                setIsUpdating(true);
            } else {
                setIsUpdating(false);
                setRating(0);
            }
        }
    }, [isOpen]);

    const handleRating = (star) => {
        setRating(star);
        setRated(true);

        // Use the update function which handles both new and existing ratings
        const wasUpdate = updateUserRating(star);

        // Log for debug
        console.log(`User ${wasUpdate ? 'updated' : 'submitted'} rating: ${star} stars (User ID: ${getUserId()})`);

        // Mark as updating since they've now rated
        setIsUpdating(true);
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
            console.log('User ID:', getUserId());

            // Save full feedback if message provided
            if (message.trim() || email.trim()) {
                updateUserRating(rating, message, email);
            }

            await new Promise(resolve => setTimeout(resolve, 800));

            setSuccess(true);
            setTimeout(() => {
                onClose();
                setSuccess(false);
                setMessage('');
                setEmail('');
                // DON'T reset rating or isUpdating - let useEffect handle it on next open
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

                        {/* Info banner for users who already rated */}
                        {isUpdating && (
                            <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
                                <AlertCircle size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
                                <div className="text-sm text-blue-800">
                                    <p className="font-medium">You've already rated this app!</p>
                                    <p className="text-xs mt-1">You can update your rating or add a message below.</p>
                                </div>
                            </div>
                        )}

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
