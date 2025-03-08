import React from 'react';
import Image from 'next/image';
import { SwipeDirection, SwipeType } from '@/hooks/useSwipe';

interface ContentPreviewPeekProps {
    direction: SwipeDirection;
    type: SwipeType;
    previewData: {
        title: string;
        image: string;
        description: string;
        category: string;
    } | null;
    swipeProgress: number;
    onClose: () => void;
}

export default function ContentPreviewPeek({
    direction,
    type,
    previewData,
    swipeProgress,
    onClose
}: ContentPreviewPeekProps) {
    if (!previewData || !direction || !type) return null;

    // Calculate position and animation based on direction
    const getPositionClasses = () => {
        const baseClasses = "fixed z-40 rounded-xl overflow-hidden w-72 h-96 shadow-lg transition-all duration-200";

        // Determine position based on swipe direction
        switch (direction) {
            case 'left':
                return `${baseClasses} right-4 top-1/2 -translate-y-1/2 translate-x-${100 - Math.min(60, swipeProgress)}%`;
            case 'right':
                return `${baseClasses} left-4 top-1/2 -translate-y-1/2 -translate-x-${100 - Math.min(60, swipeProgress)}%`;
            case 'up':
                return `${baseClasses} bottom-4 left-1/2 -translate-x-1/2 translate-y-${100 - Math.min(60, swipeProgress)}%`;
            case 'down':
                return `${baseClasses} top-4 left-1/2 -translate-x-1/2 -translate-y-${100 - Math.min(60, swipeProgress)}%`;
            default:
                return `${baseClasses} hidden`;
        }
    };

    // Get direction indicator text
    const getDirectionText = () => {
        if (type === 'topic') {
            return direction === 'left' ? 'Next Topic' : 'Previous Topic';
        } else {
            return direction === 'up' ? 'Next Episode' : 'Previous Episode';
        }
    };

    return (
        <div className={getPositionClasses()}>
            {/* Close button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                }}
                className="absolute top-2 right-2 z-50 bg-black/50 rounded-full p-1"
            >
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            {/* Preview indicator */}
            <div className="absolute top-3 left-3 z-20 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full text-xs text-white/90 flex items-center">
                <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>{getDirectionText()}</span>
            </div>

            {/* Image */}
            <div className="relative h-full w-full">
                <Image
                    src={previewData.image}
                    alt={previewData.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="brightness-75"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none"></div>
            </div>

            {/* Content info */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="text-xs text-[#37E8FF] mb-1 uppercase tracking-wide">
                    {previewData.category}
                </div>
                <h3 className="font-bold text-xl text-white leading-tight mb-1">
                    {previewData.title}
                </h3>
                <p className="text-sm text-white/80 line-clamp-2">
                    {previewData.description}
                </p>

                {/* Swipe indicator */}
                <div className="mt-4 flex justify-center">
                    <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A] rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(100, swipeProgress * 1.7)}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
}