import React from 'react';
import { Loader2 } from 'lucide-react';

export default function UploadProgress({ progress, fileName }) {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-3 mb-2">
                <Loader2 className="w-5 h-5 animate-spin text-brand-blue" />
                <div className="flex-1">
                    <p className="text-sm font-medium text-brand-dark">
                        {fileName ? `Uploading ${fileName}...` : 'Uploading file...'}
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                            className="bg-brand-blue h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <p className="text-xs text-brand-muted mt-1">{progress}%</p>
                </div>
            </div>
        </div>
    );
}
