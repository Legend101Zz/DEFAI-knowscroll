import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { SwipeDirection, SwipeType } from '@/hooks/useSwipe';

interface ContentPreviewProps {
    direction: SwipeDirection;
    type: SwipeType;
    previewData: {
        title: string;
        image: string;
        description: string;
        category?: string;
    } | null;
    swipeProgress: number; // 0-100 value indicating swipe progress
    onClose: () => void;
}

export default function ContentPreviewPeek({
    direction,
    type,
    previewData,
    swipeProgress,
    onClose
}: ContentPreviewProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (swipeProgress > 30) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [swipeProgress]);

    // Handle escape key to close
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    if (!isVisible || !previewData) return null;

    // Get position and animation based on swipe direction
    const getPositionStyles = () => {
        const baseTransform = `scale(${0.8 + (swipeProgress / 500)})`;
        const baseOpacity = Math.min(swipeProgress / 60, 1);

        switch (direction) {
            case 'up':
                return {
                    className: 'fixed top-0 inset-x-0 pt-16 pb-32 px-4 z-40 flex justify-center',
                    style: {
                        transform: `translateY(${Math.max(100 - swipeProgress, 0)}%) ${baseTransform}`,
                        opacity: baseOpacity
                    }
                };
            case 'down':
                return {
                    className: 'fixed bottom-0 inset-x-0 pb-16 pt-32 px-4 z-40 flex justify-center',
                    style: {
                        transform: `translateY(-${Math.max(100 - swipeProgress, 0)}%) ${baseTransform}`,
                        opacity: baseOpacity
                    }
                };
            case 'left':
                return {
                    className: 'fixed left-0 inset-y-0 pl-8 pr-32 z-40 flex items-center',
                    style: {
                        transform: `translateX(${Math.max(100 - swipeProgress, 0)}%) ${baseTransform}`,
                        opacity: baseOpacity
                    }
                };
            case 'right':
                return {
                    className: 'fixed right-0 inset-y-0 pr-8 pl-32 z-40 flex items-center',
                    style: {
                        transform: `translateX(-${Math.max(100 - swipeProgress, 0)}%) ${baseTransform}`,
                        opacity: baseOpacity
                    }
                };
            default:
                return {
                    className: 'hidden',
                    style: {}
                };
        }
    };

    const positionStyles = getPositionStyles();
    const isHorizontal = direction === 'left' || direction === 'right';
    const gradientColors = type === 'series' ? 'from-[#3498db]/20 to-[#3498db]/50' : 'from-[#e74c3c]/20 to-[#e74c3c]/50';
    const accentColor = type === 'series' ? 'border-[#3498db] text-[#3498db]' : 'border-[#e74c3c] text-[#e74c3c]';

    return (
        <>
            {/* Background overlay */}
            <div
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 pointer-events-none"
                style={{ opacity: Math.min(swipeProgress / 100, 0.5) }}
            />

            {/* Preview card */}
            <div
                className={positionStyles.className}
                style={positionStyles.style}
            >
                <div className={`
          bg-gradient-to-b ${gradientColors} backdrop-blur-md
          rounded-2xl overflow-hidden shadow-2xl border border-white/10
          max-w-xs ${isHorizontal ? 'w-64 h-80' : 'w-80 max-h-96'}
          relative pointer-events-none
        `}>
                    {/* Preview image */}
                    <div className="w-full h-40 relative">
                        <Image
                            src={previewData.image}
                            alt={previewData.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            style={{ objectFit: 'cover' }}
                            className="brightness-75"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                        {previewData.category && (
                            <div className={`text-xs font-bold uppercase mb-1 ${accentColor}`}>
                                {previewData.category}
                            </div>
                        )}
                        <h3 className="text-lg font-bold text-white mb-2">{previewData.title}</h3>
                        <p className="text-sm text-white/70 line-clamp-3">{previewData.description}</p>
                    </div>

                    {/* Direction indicator */}
                    <div className={`absolute ${getDirectionIndicatorPosition(direction)} p-2`}>
                        <div className={`w-10 h-10 rounded-full bg-black/40 border ${accentColor} flex items-center justify-center`}>
                            {getDirectionIcon(direction, accentColor)}
                        </div>
                    </div>

                    {/* Swipe hint - indicates user should continue swiping */}
                    <div className="absolute bottom-2 right-2">
                        <div className="text-xs text-white/70 px-2 py-1 bg-black/30 rounded-full">
                            {swipeProgress < 70 ? 'Continue swiping' : 'Release to view'}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

// Helper function to get indicator position based on direction
function getDirectionIndicatorPosition(direction: SwipeDirection): string {
    switch (direction) {
        case 'up': return 'bottom-4 left-1/2 transform -translate-x-1/2';
        case 'down': return 'top-4 left-1/2 transform -translate-x-1/2';
        case 'left': return 'right-4 top-1/2 transform -translate-y-1/2';
        case 'right': return 'left-4 top-1/2 transform -translate-y-1/2';
        default: return '';
    }
}

// Helper function to get directional icon
function getDirectionIcon(direction: SwipeDirection, colorClass: string): React.ReactNode {
    switch (direction) {
        case 'up':
            return (
                <svg className={`w-6 h-6 ${colorClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
            );
        case 'down':
            return (
                <svg className={`w-6 h-6 ${colorClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            );
        case 'left':
            return (
                <svg className={`w-6 h-6 ${colorClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            );
        case 'right':
            return (
                <svg className={`w-6 h-6 ${colorClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            );
        default:
            return null;
    }
}