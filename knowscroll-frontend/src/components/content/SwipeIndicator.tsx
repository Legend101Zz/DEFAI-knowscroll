import React from 'react';
import { SwipeDirection, SwipeType } from '@/hooks/useSwipe';

interface SwipeIndicatorProps {
    direction: SwipeDirection;
    type: SwipeType;
    isActive: boolean;
}

export default function SwipeIndicator({ direction, type, isActive }: SwipeIndicatorProps) {
    if (!direction || !isActive) return null;

    // Color classes based on direction/type
    const getColorClasses = () => {
        if (type === 'topic') {
            return direction === 'left'
                ? 'from-[#37E8FF]/50 to-[#37E8FF]/20 text-[#37E8FF]'
                : 'from-[#FF3D8A]/50 to-[#FF3D8A]/20 text-[#FF3D8A]';
        } else {
            return direction === 'up'
                ? 'from-[#A742FF]/50 to-[#A742FF]/20 text-[#A742FF]'
                : 'from-[#33D69F]/50 to-[#33D69F]/20 text-[#33D69F]';
        }
    };

    // Get icon based on direction
    const getIcon = () => {
        switch (direction) {
            case 'left':
                return (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                );
            case 'right':
                return (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                );
            case 'up':
                return (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                );
            case 'down':
                return (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                );
            default:
                return null;
        }
    };

    // Position classes based on direction
    const getPositionClasses = () => {
        switch (direction) {
            case 'left':
                return 'right-10 top-1/2 -translate-y-1/2';
            case 'right':
                return 'left-10 top-1/2 -translate-y-1/2';
            case 'up':
                return 'bottom-10 left-1/2 -translate-x-1/2';
            case 'down':
                return 'top-10 left-1/2 -translate-x-1/2';
            default:
                return '';
        }
    };

    // Text based on direction/type
    const getText = () => {
        if (type === 'topic') {
            return direction === 'left' ? 'Next Topic' : 'Previous Topic';
        } else {
            return direction === 'up' ? 'Next Episode' : 'Previous Episode';
        }
    };

    return (
        <div className={`fixed ${getPositionClasses()} z-50 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
            <div className={`p-3 rounded-full bg-gradient-to-r ${getColorClasses()} backdrop-blur-sm animate-pulse`}>
                {getIcon()}
            </div>
            <div className="mt-2 text-xs text-center font-medium">
                {getText()}
            </div>
        </div>
    );
}