import React, { useState, useEffect } from 'react';
import { Loader2, Clock } from 'lucide-react';

export default function ProgressIndicator({ steps = [] }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [bonusMessageIndex, setBonusMessageIndex] = useState(0);

    const bonusMessages = [
        "Still working...",
        "Processing complex data...",
        "AI analyzing thoroughly...",
        "Almost there, hang tight...",
        "Extracting detailed information..."
    ];

    // Timer for progressing through steps
    useEffect(() => {
        if (steps.length === 0) return;

        const interval = setInterval(() => {
            setCurrentStep((prev) => {
                if (prev < steps.length - 1) {
                    return prev + 1;
                }
                return prev;
            });
        }, 1500); // Change step every 1.5 seconds

        return () => clearInterval(interval);
    }, [steps.length]);

    // Elapsed time counter (starts immediately)
    useEffect(() => {
        const timer = setInterval(() => {
            setElapsedTime(prev => prev + 1);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Rotate bonus messages when stuck on last step
    useEffect(() => {
        if (currentStep !== steps.length - 1) return;

        const messageRotator = setInterval(() => {
            setBonusMessageIndex(prev => (prev + 1) % bonusMessages.length);
        }, 3000); // Change message every 3 seconds

        return () => clearInterval(messageRotator);
    }, [currentStep, steps.length]);

    if (steps.length === 0) {
        return (
            <div className="flex flex-col items-center gap-4 py-8">
                <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
                <p className="text-brand-muted">Processing your file...</p>
            </div>
        );
    }

    const isOnLastStep = currentStep === steps.length - 1;

    return (
        <div className="flex flex-col items-center gap-6 py-8 animate-in fade-in duration-500">
            <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />

            {/* Elapsed Time Badge */}
            <div className="flex items-center gap-2 text-sm text-brand-muted bg-blue-50 px-3 py-1.5 rounded-full">
                <Clock size={14} className="text-brand-blue" />
                <span className="font-medium">{elapsedTime}s elapsed</span>
            </div>

            <div className="w-full max-w-md space-y-3">
                {steps.map((step, index) => (
                    <div key={index} className="flex items-center gap-3">
                        <div
                            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${index <= currentStep
                                ? 'bg-brand-blue text-white scale-110'
                                : 'bg-gray-200 text-gray-400'
                                }`}
                        >
                            {index < currentStep ? '✓' : index === currentStep ? <Loader2 className="w-4 h-4 animate-spin" /> : index + 1}
                        </div>
                        <div className="flex-1">
                            <div className={`font-medium transition-colors duration-500 ${index <= currentStep ? 'text-brand-dark' : 'text-gray-400'
                                }`}>
                                {step}
                            </div>
                            {index === currentStep && (
                                <>
                                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                                        <div className="bg-brand-blue h-1.5 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                                    </div>
                                    {/* Show rotating bonus messages on last step */}
                                    {isOnLastStep && (
                                        <p className="text-xs text-brand-blue mt-2 animate-in fade-in duration-300 italic">
                                            {bonusMessages[bonusMessageIndex]}
                                        </p>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
