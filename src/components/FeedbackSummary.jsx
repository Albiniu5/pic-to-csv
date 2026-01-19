import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

export default function FeedbackSummary() {
    const [summary, setSummary] = useState({ average: 0, count: 0 });

    useEffect(() => {
        const loadSummary = () => {
            try {
                const feedbacks = JSON.parse(localStorage.getItem('feedbackRatings') || '[]');
                if (feedbacks.length === 0) {
                    setSummary({ average: 0, count: 0 });
                    return;
                }

                const total = feedbacks.reduce((sum, f) => sum + f.rating, 0);
                const average = (total / feedbacks.length).toFixed(1);
                setSummary({ average: parseFloat(average), count: feedbacks.length });
            } catch (e) {
                console.error('Failed to load feedback summary:', e);
            }
        };

        loadSummary();
        // Reload every 2 seconds to show rating changes immediately
        const interval = setInterval(loadSummary, 2000);
        return () => clearInterval(interval);
    }, []);

    // if (summary.count === 0) return null; // Previous: Hidden if 0
    // New: Show real "0 reviews" state to match CompareDocsAI request

    const fullStars = Math.floor(summary.average);
    const hasHalfStar = summary.average % 1 >= 0.5;

    return (
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-4 mb-6 transition-all duration-300">
            <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Star
                                key={i}
                                size={20}
                                className={i <= fullStars ? 'text-amber-400 fill-amber-400' : i === fullStars + 1 && hasHalfStar ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}
                            />
                        ))}
                    </div>
                    <span className="text-lg font-bold text-brand-dark">{summary.count > 0 ? summary.average : 'No ratings'}</span>
                </div>
                <div className="text-sm text-brand-muted">
                    Based on <span className="font-semibold text-brand-dark">{summary.count}</span> {summary.count === 1 ? 'review' : 'reviews'}
                </div>
            </div>
        </div>
    );
}
