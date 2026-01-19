import React, { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft, Check } from 'lucide-react';

const TUTORIAL_STEPS = [
    {
        id: 1,
        title: 'Welcome to PicToCSV!',
        description: 'Convert images and PDFs into Excel spreadsheets in seconds using AI.',
        position: 'center',
        highlight: null
    },
    {
        id: 2,
        title: 'Upload Your File',
        description: 'Click the upload area, browse files, or use the camera button on mobile to capture documents directly.',
        position: 'bottom',
        highlight: 'upload-area'
    },
    {
        id: 3,
        title: 'Convert to Excel',
        description: 'Click "Convert to Excel" and our AI will extract all tables from your document automatically.',
        position: 'bottom',
        highlight: 'convert-button'
    },
    {
        id: 4,
        title: 'Edit & Download',
        description: 'Review the extracted data, edit cells if needed, then download as CSV, Excel, or PDF.',
        position: 'top',
        highlight: 'results-section'
    },
    {
        id: 5,
        title: 'You\'re All Set!',
        description: 'Start converting your documents. Tip: Use the camera button on mobile for quick document capture!',
        position: 'center',
        highlight: null
    }
];

const STORAGE_KEY = 'pictocsv_tutorial_completed';

export default function OnboardingTutorial({ onComplete }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if tutorial was already completed
        const completed = localStorage.getItem(STORAGE_KEY);
        if (!completed) {
            // Show tutorial after a short delay
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleNext = () => {
        if (currentStep < TUTORIAL_STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleComplete();
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSkip = () => {
        handleComplete();
    };

    const handleComplete = () => {
        localStorage.setItem(STORAGE_KEY, 'true');
        setIsVisible(false);
        if (onComplete) {
            onComplete();
        }
    };

    if (!isVisible) return null;

    const step = TUTORIAL_STEPS[currentStep];
    const isFirst = currentStep === 0;
    const isLast = currentStep === TUTORIAL_STEPS.length - 1;
    const progress = ((currentStep + 1) / TUTORIAL_STEPS.length) * 100;

    return (
        <>
            {/* Overlay */}
            <div className="fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-300" />

            {/* Tutorial Card */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in duration-300 pointer-events-auto relative">
                    {/* Progress Bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100 rounded-t-xl">
                        <div
                            className="h-full bg-brand-blue transition-all duration-300 rounded-t-xl"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    {/* Header */}
                    <div className="flex items-start justify-between mb-4 mt-2">
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-brand-dark mb-1">
                                {step.title}
                            </h3>
                            <p className="text-sm text-brand-muted">
                                Step {currentStep + 1} of {TUTORIAL_STEPS.length}
                            </p>
                        </div>
                        <button
                            onClick={handleSkip}
                            className="text-brand-muted hover:text-brand-dark transition-colors p-1 ml-4"
                            aria-label="Skip tutorial"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="mb-6">
                        <p className="text-base text-brand-muted leading-relaxed">
                            {step.description}
                        </p>
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-between gap-3">
                        <button
                            onClick={handlePrevious}
                            disabled={isFirst}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors min-h-[44px] touch-manipulation ${isFirst
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-700'
                                }`}
                        >
                            <ArrowLeft size={18} />
                            <span className="hidden sm:inline">Previous</span>
                        </button>

                        <div className="flex gap-1.5">
                            {TUTORIAL_STEPS.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`w-2 h-2 rounded-full transition-colors ${idx === currentStep ? 'bg-brand-blue' :
                                            idx < currentStep ? 'bg-green-500' : 'bg-gray-300'
                                        }`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={handleNext}
                            className="flex items-center gap-2 bg-brand-blue hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors min-h-[44px] touch-manipulation"
                        >
                            {isLast ? (
                                <>
                                    <Check size={18} />
                                    <span className="hidden sm:inline">Get Started</span>
                                    <span className="sm:hidden">Done</span>
                                </>
                            ) : (
                                <>
                                    <span className="hidden sm:inline">Next</span>
                                    <span className="sm:hidden">Next</span>
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </div>

                    {/* Skip Link */}
                    {!isLast && (
                        <div className="mt-4 text-center">
                            <button
                                onClick={handleSkip}
                                className="text-xs text-brand-muted hover:text-brand-blue transition-colors"
                            >
                                Skip tutorial
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
