import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function AchievementBadge({ badge, onDismiss }) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Auto-dismiss after 5 seconds
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => onDismiss?.(), 300); // Wait for animation
        }, 5000);

        return () => clearTimeout(timer);
    }, [onDismiss]);

    if (!isVisible) return null;

    return (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top-4 fade-in duration-500">
            <div className="bg-white rounded-xl shadow-2xl border-2 border-yellow-400 p-4 sm:p-6 max-w-sm mx-4">
                <div className="flex items-start gap-4">
                    <div className="text-4xl sm:text-5xl">{badge.emoji}</div>
                    <div className="flex-1">
                        <h3 className="font-bold text-lg text-brand-dark mb-1">{badge.name}</h3>
                        <p className="text-sm text-brand-muted">{badge.description}</p>
                        <div className="mt-3 text-xs text-brand-blue font-medium">🎉 Achievement Unlocked!</div>
                    </div>
                    <button
                        onClick={() => {
                            setIsVisible(false);
                            setTimeout(() => onDismiss?.(), 300);
                        }}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Dismiss"
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
