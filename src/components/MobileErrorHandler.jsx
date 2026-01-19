import React from 'react';
import { AlertCircle, RefreshCw, Image as ImageIcon, FileText, Camera } from 'lucide-react';

const ERROR_MESSAGES = {
    // File-related errors
    'file-too-large': {
        icon: FileText,
        title: 'File Too Large',
        message: 'The file you uploaded exceeds the 10MB limit. Please try a smaller file or compress the image.',
        action: 'Try a different file',
        suggestions: ['Reduce image resolution', 'Convert to JPEG format', 'Split large PDFs into smaller sections']
    },
    'invalid-file-type': {
        icon: FileText,
        title: 'Invalid File Type',
        message: 'We support JPG, PNG images and PDF documents. Please upload a supported file type.',
        action: 'Upload a different file',
        suggestions: ['Use JPG or PNG for images', 'Convert documents to PDF format']
    },
    'no-file-selected': {
        icon: FileText,
        title: 'No File Selected',
        message: 'Please select or capture a file to convert.',
        action: 'Select a file',
        suggestions: ['Tap "Browse Files" or use the camera button', 'Drag and drop a file from your device']
    },
    // Image quality errors
    'blur-detected': {
        icon: Camera,
        title: 'Image May Be Blurry',
        message: 'The image appears to be blurry or low quality. This may affect extraction accuracy.',
        action: 'Retake photo',
        suggestions: ['Ensure good lighting', 'Hold camera steady', 'Get closer to the document', 'Clean your camera lens']
    },
    'low-resolution': {
        icon: ImageIcon,
        title: 'Low Resolution Image',
        message: 'The image resolution is too low. Please use a higher quality image for better results.',
        action: 'Use higher quality image',
        suggestions: ['Increase camera resolution settings', 'Use a scanner for documents', 'Ensure good focus']
    },
    // API/Processing errors
    'api-error': {
        icon: AlertCircle,
        title: 'Processing Error',
        message: 'We encountered an issue processing your file. This might be temporary.',
        action: 'Try again',
        suggestions: ['Check your internet connection', 'Try again in a few moments', 'If the problem persists, try a different file']
    },
    'quota-exceeded': {
        icon: AlertCircle,
        title: 'Service Temporarily Unavailable',
        message: 'We\'re experiencing high demand right now. Please try again in a few minutes.',
        action: 'Retry later',
        suggestions: ['Wait a few minutes and try again', 'Try during off-peak hours']
    },
    'network-error': {
        icon: AlertCircle,
        title: 'Connection Problem',
        message: 'Unable to connect to our servers. Please check your internet connection.',
        action: 'Check connection',
        suggestions: ['Verify WiFi or mobile data is enabled', 'Try a different network', 'Check if you\'re offline']
    },
    // No data / Extraction failed
    'no-data-found': {
        icon: FileText,
        title: 'Extraction Failed',
        message: 'I\'m sorry, this data cannot be extracted. No tables or structured data were found.',
        action: 'Try another file',
        suggestions: [
            'Ensure the image contains a clear table or list',
            'Check that the text is legible and well-lit',
            'Verify the file contains CSV-worthy data (structured information)',
            'Try cropping the image to focus on the table'
        ]
    },
    // Default error
    'default': {
        icon: AlertCircle,
        title: 'Something Went Wrong',
        message: 'We couldn\'t process your file. Please try again or use a different file.',
        action: 'Try again',
        suggestions: ['Try a different file', 'Ensure file is supported format', 'Check your connection']
    }
};

export default function MobileErrorHandler({ error, onRetry, onDismiss }) {
    const getErrorConfig = (errorMessage) => {
        if (!errorMessage) return ERROR_MESSAGES.default;

        const lowerError = errorMessage.toLowerCase();

        // Check for specific error patterns
        if (lowerError.includes('too large') || lowerError.includes('file size')) {
            return ERROR_MESSAGES['file-too-large'];
        }
        if (lowerError.includes('invalid') || lowerError.includes('not supported') || lowerError.includes('file type')) {
            return ERROR_MESSAGES['invalid-file-type'];
        }
        if (lowerError.includes('blur') || lowerError.includes('unclear')) {
            return ERROR_MESSAGES['blur-detected'];
        }
        if (lowerError.includes('resolution') || lowerError.includes('low quality')) {
            return ERROR_MESSAGES['low-resolution'];
        }
        if (lowerError.includes('quota') || lowerError.includes('limit') || lowerError.includes('429')) {
            return ERROR_MESSAGES['quota-exceeded'];
        }
        if (lowerError.includes('network') || lowerError.includes('connection') || lowerError.includes('fetch')) {
            return ERROR_MESSAGES['network-error'];
        }
        if (lowerError.includes('api') || lowerError.includes('server') || lowerError.includes('500')) {
            return ERROR_MESSAGES['api-error'];
        }
        if (lowerError.includes('cannot be extracted') || lowerError.includes('no tables') || lowerError.includes('csv worthy')) {
            return ERROR_MESSAGES['no-data-found'];
        }

        return ERROR_MESSAGES.default;
    };

    if (!error) return null;

    const config = getErrorConfig(error);
    const Icon = config.icon;

    return (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 md:p-6 rounded-r-lg animate-in slide-in-from-top-2 mb-6">
            <div className="flex items-start gap-3 md:gap-4">
                <div className="flex-shrink-0">
                    <div className="bg-red-100 rounded-full p-2">
                        <Icon className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
                    </div>
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="text-base md:text-lg font-semibold text-red-900 mb-2">
                        {config.title}
                    </h3>
                    <p className="text-sm md:text-base text-red-800 mb-4 leading-relaxed">
                        {config.message}
                    </p>

                    {/* Suggestions */}
                    {config.suggestions && config.suggestions.length > 0 && (
                        <div className="mb-4">
                            <p className="text-xs md:text-sm font-medium text-red-900 mb-2">Try this:</p>
                            <ul className="space-y-1.5 text-xs md:text-sm text-red-700">
                                {config.suggestions.map((suggestion, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                        <span className="text-red-500 mt-1">•</span>
                                        <span>{suggestion}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 mt-4">
                        {onRetry && (
                            <button
                                onClick={onRetry}
                                className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors min-h-[44px] touch-manipulation"
                            >
                                <RefreshCw size={18} />
                                {config.action}
                            </button>
                        )}
                        {onDismiss && (
                            <button
                                onClick={onDismiss}
                                className="flex items-center justify-center gap-2 bg-white border border-red-200 hover:bg-red-50 text-red-700 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors min-h-[44px] touch-manipulation"
                            >
                                Dismiss
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
