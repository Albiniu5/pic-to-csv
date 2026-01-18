import React from 'react';
import { Loader2 } from 'lucide-react';

export default function ProgressAnimation({ progress = null, message = "Processing..." }) {
    return (
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="relative">
                {progress !== null ? (
                    // Progress bar with percentage
                    <div className="relative w-64 h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-brand-blue to-blue-600 transition-all duration-300 ease-out rounded-full"
                            style={{ width: `${progress}%` }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs font-semibold text-gray-700">{Math.round(progress)}%</span>
                        </div>
                    </div>
                ) : (
                    // Spinning loader
                    <Loader2 className="w-12 h-12 text-brand-blue animate-spin" />
                )}
            </div>
            <p className="text-brand-muted text-sm font-medium animate-pulse">{message}</p>
        </div>
    );
}
