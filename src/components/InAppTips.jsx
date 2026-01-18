import React, { useState, useEffect } from 'react';
import { Lightbulb, X } from 'lucide-react';

const TIPS = [
    {
        id: 1,
        title: "Did you know?",
        message: "You can drag and drop files directly onto the upload area for faster conversion!"
    },
    {
        id: 2,
        title: "Pro Tip",
        message: "Use your phone's camera to capture tables directly - our AI works great with photos!"
    },
    {
        id: 3,
        title: "Quick Tip",
        message: "Multiple tables in one image? No problem - we extract all of them automatically!"
    },
    {
        id: 4,
        title: "Helpful Hint",
        message: "After extraction, you can edit cells directly in the table before downloading!"
    },
    {
        id: 5,
        title: "Did you know?",
        message: "You can select multiple tables and download them all in one Excel workbook!"
    }
];

export default function InAppTips({ variant = 'banner', onDismiss }) {
    const [currentTip, setCurrentTip] = useState(null);
    const [isVisible, setIsVisible] = useState(true);
    const [dismissedTips, setDismissedTips] = useState(() => {
        // Load dismissed tips from localStorage
        try {
            const saved = localStorage.getItem('dismissedTips');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        // Show a tip if none visible and user hasn't dismissed too many
        if (!currentTip && dismissedTips.length < TIPS.length) {
            const availableTips = TIPS.filter(tip => !dismissedTips.includes(tip.id));
            if (availableTips.length > 0) {
                const randomTip = availableTips[Math.floor(Math.random() * availableTips.length)];
                setCurrentTip(randomTip);
                
                // Auto-dismiss after 8 seconds if banner variant
                if (variant === 'banner') {
                    const timer = setTimeout(() => {
                        handleDismiss();
                    }, 8000);
                    return () => clearTimeout(timer);
                }
            }
        }
    }, [currentTip, dismissedTips, variant]);

    const handleDismiss = () => {
        if (currentTip) {
            const newDismissed = [...dismissedTips, currentTip.id];
            setDismissedTips(newDismissed);
            localStorage.setItem('dismissedTips', JSON.stringify(newDismissed));
        }
        setIsVisible(false);
        if (onDismiss) {
            onDismiss();
        }
        // Show next tip after a delay (only for card variant)
        if (variant === 'card') {
            setTimeout(() => {
                setCurrentTip(null);
                setIsVisible(true);
            }, 5000);
        }
    };

    if (!currentTip || !isVisible) return null;

    if (variant === 'banner') {
        return (
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-4 rounded-r-lg animate-in slide-in-from-top-2 duration-500">
                <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-amber-900 mb-1">{currentTip.title}</h4>
                        <p className="text-sm text-amber-800">{currentTip.message}</p>
                    </div>
                    <button
                        onClick={handleDismiss}
                        className="text-amber-600 hover:text-amber-800 flex-shrink-0 p-1 transition-colors"
                        aria-label="Dismiss tip"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>
        );
    }

    // Card variant
    return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5 mb-6 animate-in fade-in slide-in-from-bottom-2 duration-500 shadow-sm">
            <div className="flex items-start gap-3">
                <div className="bg-brand-blue text-white rounded-full p-2 flex-shrink-0">
                    <Lightbulb size={20} />
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="text-base font-semibold text-brand-dark mb-2">{currentTip.title}</h4>
                    <p className="text-sm text-brand-muted leading-relaxed">{currentTip.message}</p>
                </div>
                <button
                    onClick={handleDismiss}
                    className="text-brand-muted hover:text-brand-dark flex-shrink-0 p-1 transition-colors"
                    aria-label="Dismiss tip"
                >
                    <X size={18} />
                </button>
            </div>
        </div>
    );
}
