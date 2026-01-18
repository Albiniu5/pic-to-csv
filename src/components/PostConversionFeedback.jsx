import React, { useState, useEffect } from 'react';
import { Star, X, Check } from 'lucide-react';

export default function PostConversionFeedback({ onClose }) {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [showThanks, setShowThanks] = useState(false);
    const [lastFeedbackTime, setLastFeedbackTime] = useState(() => {
        try {
            return localStorage.getItem('lastFeedbackTime');
        } catch {
            return null;
        }
    });

    useEffect(() => {
        // Check if we should show feedback (not shown in last 24 hours)
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;
        
        if (lastFeedbackTime && (now - parseInt(lastFeedbackTime)) < oneDay) {
            if (onClose) onClose();
            return;
        }
    }, [lastFeedbackTime, onClose]);

    const handleRating = (value) => {
        setRating(value);
        
        // Save to localStorage
        try {
            localStorage.setItem('lastFeedbackTime', Date.now().toString());
            // Save the rating
            const feedbacks = JSON.parse(localStorage.getItem('feedbackRatings') || '[]');
            feedbacks.push({ rating: value, timestamp: Date.now() });
            localStorage.setItem('feedbackRatings', JSON.stringify(feedbacks));
        } catch (e) {
            console.error('Failed to save feedback:', e);
        }

        // Show thank you message
        setTimeout(() => {
            setShowThanks(true);
            setTimeout(() => {
                if (onClose) onClose();
            }, 2000);
        }, 500);
    };

    if (showThanks) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
                <div className="bg-white rounded-xl p-8 max-w-sm w-full text-center animate-in zoom-in duration-300">
                    <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <Check className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-brand-dark mb-2">Thank you!</h3>
                    <p className="text-brand-muted">Your feedback helps us improve.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-xl p-6 max-w-sm w-full animate-in slide-in-from-bottom-2 duration-300">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-brand-dark">How was your experience?</h3>
                    <button
                        onClick={onClose}
                        className="text-brand-muted hover:text-brand-dark transition-colors p-1"
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>
                </div>
                
                <p className="text-sm text-brand-muted mb-6">
                    Help us improve by rating your conversion experience.
                </p>

                <div className="flex justify-center gap-2 mb-6">
                    {[1, 2, 3, 4, 5].map((value) => (
                        <button
                            key={value}
                            onClick={() => handleRating(value)}
                            onMouseEnter={() => setHoveredRating(value)}
                            onMouseLeave={() => setHoveredRating(0)}
                            className={`p-2 transition-all transform active:scale-90 ${
                                value <= (hoveredRating || rating)
                                    ? 'text-amber-400 scale-110'
                                    : 'text-gray-300'
                            }`}
                            aria-label={`Rate ${value} stars`}
                        >
                            <Star
                                size={32}
                                fill={value <= (hoveredRating || rating) ? 'currentColor' : 'none'}
                            />
                        </button>
                    ))}
                </div>

                {rating > 0 && (
                    <p className="text-xs text-brand-muted text-center">
                        {rating >= 4 
                            ? "Great! We're glad you had a good experience." 
                            : "Thanks for your feedback. We're always working to improve."}
                    </p>
                )}
            </div>
        </div>
    );
}
