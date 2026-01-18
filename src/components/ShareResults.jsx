import React, { useState } from 'react';
import { Share2, Copy, Mail, Twitter, Linkedin, Check } from 'lucide-react';
import { convertJsonToCsv } from '../utils/csvUtils';

export default function ShareResults({ data, tableName }) {
    const [copied, setCopied] = useState(false);
    const [shareSupported, setShareSupported] = useState(false);

    React.useEffect(() => {
        // Check if Web Share API is supported
        setShareSupported(!!navigator.share);
    }, []);

    const handleNativeShare = async () => {
        if (!navigator.share || !data) return;

        try {
            const csv = convertJsonToCsv(data);
            const blob = new Blob([csv], { type: 'text/csv' });
            const file = new File([blob], `${tableName || 'table'}.csv`, { type: 'text/csv' });

            await navigator.share({
                title: `Table: ${tableName || 'Extracted Data'}`,
                text: 'Check out this table I extracted!',
                files: [file]
            });
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Share failed:', error);
                // Fallback to copy
                handleCopy();
            }
        }
    };

    const handleCopy = async () => {
        if (!data) return;

        try {
            const csv = convertJsonToCsv(data);
            await navigator.clipboard.writeText(csv);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Copy failed:', error);
        }
    };

    const handleEmail = () => {
        if (!data) return;

        const csv = convertJsonToCsv(data);
        const subject = encodeURIComponent(`Table: ${tableName || 'Extracted Data'}`);
        const body = encodeURIComponent('Please find the extracted table data attached.');
        
        // Create data URL for CSV
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        
        // Note: Direct email with attachment isn't possible via mailto:
        // This would require server-side solution
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
    };

    const handleSocialShare = (platform) => {
        if (!data) return;

        const csv = convertJsonToCsv(data);
        const text = encodeURIComponent(`I just extracted a table using PicToCSV! Check it out: ${tableName || 'Extracted Data'}`);
        const url = encodeURIComponent(window.location.href);

        const shareUrls = {
            twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
        };

        if (shareUrls[platform]) {
            window.open(shareUrls[platform], '_blank', 'width=600,height=400');
        }
    };

    if (!data) return null;

    return (
        <div className="flex flex-wrap gap-2">
            {shareSupported && (
                <button
                    onClick={handleNativeShare}
                    className="flex items-center gap-2 bg-brand-blue hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors min-h-[44px] touch-manipulation"
                    aria-label="Share results"
                >
                    <Share2 size={18} />
                    <span>Share</span>
                </button>
            )}
            
            <button
                onClick={handleCopy}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors min-h-[44px] touch-manipulation ${
                    copied
                        ? 'bg-green-100 text-green-700'
                        : 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-700'
                }`}
                aria-label="Copy to clipboard"
            >
                {copied ? <Check size={18} /> : <Copy size={18} />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>

            <button
                onClick={handleEmail}
                className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors min-h-[44px] touch-manipulation"
                aria-label="Email results"
            >
                <Mail size={18} />
                <span className="hidden sm:inline">Email</span>
            </button>

            <button
                onClick={() => handleSocialShare('twitter')}
                className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors min-h-[44px] touch-manipulation"
                aria-label="Share on Twitter"
            >
                <Twitter size={18} />
                <span className="hidden sm:inline">Twitter</span>
            </button>

            <button
                onClick={() => handleSocialShare('linkedin')}
                className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors min-h-[44px] touch-manipulation"
                aria-label="Share on LinkedIn"
            >
                <Linkedin size={18} />
                <span className="hidden sm:inline">LinkedIn</span>
            </button>
        </div>
    );
}
