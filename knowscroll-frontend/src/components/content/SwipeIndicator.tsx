import React, { useEffect, useState } from 'react';
import { SwipeDirection, SwipeType } from '@/hooks/useSwipe';

interface SwipeIndicatorProps {
    direction: SwipeDirection;
    type: SwipeType;
    isActive: boolean;
}

export default function SwipeIndicator({
    direction,
    type,
    isActive
}: SwipeIndicatorProps) {
    const [showing, setShowing] = useState(false);
    const [previewContent, setPreviewContent] = useState<{
        title: string;
        subtitle: string;
    } | null>(null);

    // Simulate content preview based on swipe direction and type
    useEffect(() => {
        if (direction && type) {
            // This would be replaced with actual content in a real implementation
            const mockPreviews = {
                series: {
                    up: { title: 'Next Episode', subtitle: 'Continue your learning' },
                    down: { title: 'Previous Episode', subtitle: 'Go back in series' }
                },
                topic: {
                    left: { title: 'Next Topic', subtitle: 'Space Exploration' },
                    right: { title: 'Previous Topic', subtitle: 'History Channel' }
                }
            };

            // Set preview content based on swipe direction and type
            if (type === 'series' && (direction === 'up' || direction === 'down')) {
                setPreviewContent(mockPreviews.series[direction]);
            } else if (type === 'topic' && (direction === 'left' || direction === 'right')) {
                setPreviewContent(mockPreviews.topic[direction]);
            }
        }
    }, [direction, type]);

    useEffect(() => {
        if (isActive && direction) {
            setShowing(true);
            const timer = setTimeout(() => {
                setShowing(false);
            }, 1500);

            return () => clearTimeout(timer);
        }
    }, [direction, isActive]);

    if (!showing) return null;

    // Get color theme based on swipe type
    const getColorTheme = () => {
        switch (type) {
            case 'series':
                return {
                    bg: 'from-[#3498db]/20 to-[#3498db]/40',
                    border: 'border-[#3498db]',
                    text: 'text-[#3498db]',
                    icon: 'text-[#3498db]',
                    accent: 'bg-[#3498db]'
                };
            case 'topic':
                return {
                    bg: 'from-[#e74c3c]/20 to-[#e74c3c]/40',
                    border: 'border-[#e74c3c]',
                    text: 'text-[#e74c3c]',
                    icon: 'text-[#e74c3c]',
                    accent: 'bg-[#e74c3c]'
                };
            default:
                return {
                    bg: 'from-gray-800/50 to-gray-900/50',
                    border: 'border-gray-700',
                    text: 'text-white',
                    icon: 'text-white',
                    accent: 'bg-white'
                };
        }
    };

    const theme = getColorTheme();

    const getDirectionStyles = () => {
        const baseClasses = "fixed pointer-events-none z-50 flex items-center justify-center transition-all duration-500";

        switch (direction) {
            case 'up':
                return `${baseClasses} inset-x-0 top-0 h-32 animate-slide-down`;
            case 'down':
                return `${baseClasses} inset-x-0 bottom-0 h-32 animate-slide-up`;
            case 'left':
                return `${baseClasses} inset-y-0 left-0 w-32 animate-slide-right`;
            case 'right':
                return `${baseClasses} inset-y-0 right-0 w-32 animate-slide-left`;
            default:
                return 'hidden';
        }
    };

    const getIconForDirection = () => {
        switch (direction) {
            case 'up':
                return (
                    <svg className={`w-8 h-8 ${theme.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
                    </svg>
                );
            case 'down':
                return (
                    <svg className={`w-8 h-8 ${theme.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                );
            case 'left':
                return (
                    <svg className={`w-8 h-8 ${theme.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                );
            case 'right':
                return (
                    <svg className={`w-8 h-8 ${theme.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                );
            default:
                return null;
        }
    };

    // Overlay for full-screen feedback
    const renderFullscreenOverlay = () => (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 pointer-events-none"></div>
    );

    // Edge indicator that shows at the edge of the screen towards swipe direction
    const renderEdgeIndicator = () => (
        <div className={getDirectionStyles()}>
            <div className={`
        bg-gradient-${theme.bg} backdrop-blur-md p-4 
        border ${theme.border} rounded-xl
        flex items-center space-x-3
        shadow-lg shadow-black/20
      `}>
                <div className={`
          ${theme.accent} w-10 h-10 rounded-full 
          flex items-center justify-center
          shadow-inner
        `}>
                    {getIconForDirection()}
                </div>

                {previewContent && (
                    <div className="text-white">
                        <p className={`font-bold ${theme.text}`}>{previewContent.title}</p>
                        <p className="text-xs text-white/70">{previewContent.subtitle}</p>
                    </div>
                )}
            </div>
        </div>
    );

    // Center indicator that shows more prominently in the center of the screen
    const renderCenterIndicator = () => (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
            <div className={`
        bg-black/50 backdrop-blur-md p-6 
        border ${theme.border} rounded-full
        flex flex-col items-center justify-center
        shadow-xl transform transition-all
        animate-pulse-subtle
      `}>
                <div className="mb-2">{getIconForDirection()}</div>
                <div className={`text-sm font-bold ${theme.text}`}>
                    {type === 'series'
                        ? (direction === 'up' ? 'Next Episode' : 'Previous Episode')
                        : (direction === 'left' ? 'Next Topic' : 'Previous Topic')
                    }
                </div>
            </div>
        </div>
    );

    return (
        <>
            {renderFullscreenOverlay()}
            {renderEdgeIndicator()}
            {renderCenterIndicator()}
        </>
    );
}