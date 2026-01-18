import React, { useState, useEffect } from 'react';
import { Upload, Camera, X } from 'lucide-react';

export default function FloatingActionButton({ onFileSelect, onCameraClick }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            
            // Hide FAB when scrolling down, show when scrolling up or near top
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
            
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleFileClick = () => {
        setIsOpen(false);
        if (onFileSelect) {
            document.getElementById('fileInput').click();
        }
    };

    const handleCameraClick = () => {
        setIsOpen(false);
        if (onCameraClick) {
            document.getElementById('cameraInput').click();
        }
    };

    return (
        <>
            {/* Hidden file inputs */}
            <input
                type="file"
                id="fileInput"
                className="hidden"
                accept="image/*,.pdf,.txt"
                onChange={(e) => onFileSelect && onFileSelect(e)}
            />
            <input
                type="file"
                id="cameraInput"
                className="hidden"
                accept="image/*"
                capture="environment"
                onChange={(e) => onCameraClick && onCameraClick(e)}
            />

            {/* FAB Container - Only visible on mobile/tablet */}
            <div className={`fixed bottom-6 right-6 z-50 md:hidden transition-all duration-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
            }`}>
                {/* Menu Options */}
                {isOpen && (
                    <div className="absolute bottom-20 right-0 mb-2 flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2">
                        <button
                            onClick={handleFileClick}
                            className="bg-white text-brand-dark shadow-lg rounded-full p-4 w-14 h-14 flex items-center justify-center hover:bg-gray-50 transition-all active:scale-95"
                            aria-label="Upload file"
                        >
                            <Upload size={24} />
                        </button>
                        <button
                            onClick={handleCameraClick}
                            className="bg-white text-brand-dark shadow-lg rounded-full p-4 w-14 h-14 flex items-center justify-center hover:bg-gray-50 transition-all active:scale-95"
                            aria-label="Take photo"
                        >
                            <Camera size={24} />
                        </button>
                    </div>
                )}

                {/* Main FAB Button */}
                <button
                    onClick={handleToggle}
                    className="bg-brand-blue hover:bg-blue-700 text-white rounded-full p-5 w-16 h-16 flex items-center justify-center shadow-xl hover:shadow-2xl transition-all active:scale-95"
                    aria-label={isOpen ? 'Close menu' : 'Open upload menu'}
                    style={{ minWidth: '64px', minHeight: '64px' }} // 64px for better touch target
                >
                    {isOpen ? (
                        <X size={28} className="animate-in rotate-in duration-200" />
                    ) : (
                        <Upload size={28} className="animate-in fade-in duration-200" />
                    )}
                </button>
            </div>
        </>
    );
}
