import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function ProgressIndicator({ steps = [] }) {
    const [currentStep, setCurrentStep] = useState(0);

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

    if (steps.length === 0) {
        return (
            <div className="flex flex-col items-center gap-4 py-8">
                <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
                <p className="text-brand-muted">Processing your file...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center gap-6 py-8 animate-in fade-in duration-500">
            <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
            <div className="w-full max-w-md space-y-3">
                {steps.map((step, index) => (
                    <div key={index} className="flex items-center gap-3">
                        <div
                            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                                index <= currentStep
                                    ? 'bg-brand-blue text-white scale-110'
                                    : 'bg-gray-200 text-gray-400'
                            }`}
                        >
                            {index < currentStep ? '✓' : index === currentStep ? <Loader2 className="w-4 h-4 animate-spin" /> : index + 1}
                        </div>
                        <div className="flex-1">
                            <div className={`font-medium transition-colors duration-500 ${
                                index <= currentStep ? 'text-brand-dark' : 'text-gray-400'
                            }`}>
                                {step}
                            </div>
                            {index === currentStep && (
                                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                                    <div className="bg-brand-blue h-1.5 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
