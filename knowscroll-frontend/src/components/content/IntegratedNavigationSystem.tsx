import React, { useState, useEffect, useRef } from 'react';
import { useSwipe, SwipeDirection, SwipeType } from '@/hooks/useSwipe';
import SwipeIndicator from './SwipeIndicator';
import ContentPreviewPeek from './ContentPreviewPeek';
import NavigationGuide from './NavigationGuide';

// Types
interface NavigationSystemProps {
    children: React.ReactNode;
    onSwipeLeft: () => void;
    onSwipeRight: () => void;
    onSwipeUp: () => void;
    onSwipeDown: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getPreviewContent?: (direction: SwipeDirection, type: SwipeType) => any;
    showTutorial?: boolean;
    onTutorialDismiss?: () => void;
}

export default function IntegratedNavigationSystem({
    children,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    getPreviewContent,
    showTutorial = false,
    onTutorialDismiss = () => { }
}: NavigationSystemProps) {
    // State
    const [swipeProgress, setSwipeProgress] = useState(0);
    const [swipeIndicator, setSwipeIndicator] = useState<{ direction: SwipeDirection, type: SwipeType }>({ direction: null, type: null });
    const [showSwipeIndicator, setShowSwipeIndicator] = useState(false);
    const [previewContent, setPreviewContent] = useState<any>(null);
    const [isShowingPreview, setIsShowingPreview] = useState(false);
    const [showGestureHint, setShowGestureHint] = useState(true);
    const prevSwipeProgress = useRef(0);
    const swipeStartPosition = useRef({ x: 0, y: 0 });
    const inTransition = useRef(false);

    // First-time gesture hint
    useEffect(() => {
        if (showGestureHint) {
            const timer = setTimeout(() => {
                setShowGestureHint(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [showGestureHint]);

    // Function to calculate swipe progress
    const calculateSwipeProgress = (start: { x: number, y: number }, current: { x: number, y: number }) => {
        const dx = current.x - start.x;
        const dy = current.y - start.y;

        // Determine if it's a horizontal or vertical swipe
        const isHorizontal = Math.abs(dx) > Math.abs(dy);

        // Calculate progress based on direction
        if (isHorizontal) {
            return Math.min(Math.abs(dx) / 3, 100); // Divide by 3 to make 300px = 100%
        } else {
            return Math.min(Math.abs(dy) / 3, 100);
        }
    };

    // Determine swipe type
    const determineSwipeType = (dx: number, dy: number): SwipeType => {
        const isHorizontal = Math.abs(dx) > Math.abs(dy);
        return isHorizontal ? 'topic' : 'series';
    };

    // Determine swipe direction
    const determineSwipeDirection = (dx: number, dy: number): SwipeDirection => {
        const isHorizontal = Math.abs(dx) > Math.abs(dy);

        if (isHorizontal) {
            return dx > 0 ? 'right' : 'left';
        } else {
            return dy > 0 ? 'down' : 'up';
        }
    };

    // Swipe handlers
    const handleSwipeStart = (x: number, y: number) => {
        if (inTransition.current) return;
        swipeStartPosition.current = { x, y };
        setSwipeProgress(0);
        prevSwipeProgress.current = 0;
        setPreviewContent(null);
        setIsShowingPreview(false);
    };

    const handleSwipeMove = (x: number, y: number) => {
        if (inTransition.current) return;

        const dx = x - swipeStartPosition.current.x;
        const dy = y - swipeStartPosition.current.y;

        // Only update if there's significant movement
        if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;

        const progress = calculateSwipeProgress(swipeStartPosition.current, { x, y });
        setSwipeProgress(progress);

        // Determine swipe type and direction
        const type = determineSwipeType(dx, dy);
        const direction = determineSwipeDirection(dx, dy);

        // Show preview when progress is significant
        if (progress > 40 && progress > prevSwipeProgress.current && !isShowingPreview) {
            if (getPreviewContent) {
                const content = getPreviewContent(direction, type);
                if (content) {
                    setPreviewContent(content);
                    setIsShowingPreview(true);
                }
            }
        }

        // Update swipe indicator data
        setSwipeIndicator({ direction, type });

        // Show indicator when swipe is significant
        if (progress > 20 && !showSwipeIndicator) {
            setShowSwipeIndicator(true);
        }

        // Update previous progress
        prevSwipeProgress.current = progress;
    };

    const handleSwipeEnd = () => {
        if (inTransition.current) return;

        const direction = swipeIndicator.direction;
        const type = swipeIndicator.type;

        // Hide preview immediately
        setIsShowingPreview(false);

        // Execute swipe action if progress is sufficient
        if (swipeProgress > 60 && direction && type) {
            inTransition.current = true;

            // Execute corresponding action
            if (direction === 'left') {
                onSwipeLeft();
            } else if (direction === 'right') {
                onSwipeRight();
            } else if (direction === 'up') {
                onSwipeUp();
            } else if (direction === 'down') {
                onSwipeDown();
            }

            // Keep indicator visible briefly for feedback
            setTimeout(() => {
                setShowSwipeIndicator(false);
                inTransition.current = false;
            }, 500);
        } else {
            // Not enough progress, hide indicator
            setShowSwipeIndicator(false);
        }

        // Reset progress
        setSwipeProgress(0);
    };

    // Register with our custom useSwipe hook
    const { isSwiping, touchStart, touchEnd } = useSwipe({
        onSwipeStart: handleSwipeStart,
        onSwipeMove: handleSwipeMove,
        onSwipeEnd: handleSwipeEnd,
    });

    return (
        <div
            className="relative w-full h-full"
            style={{ touchAction: 'none' }} // Prevent browser handling of all panning and zooming gestures
        >
            {/* Main content */}
            <div className={`transition-transform duration-300 ${isSwiping ? 'scale-95' : 'scale-100'}`}>
                {children}
            </div>

            {/* Swipe indicator */}
            <SwipeIndicator
                direction={swipeIndicator.direction}
                type={swipeIndicator.type}
                isActive={showSwipeIndicator}
            />

            {/* Content preview peek */}
            {previewContent && (
                <ContentPreviewPeek
                    direction={swipeIndicator.direction}
                    type={swipeIndicator.type}
                    previewData={previewContent}
                    swipeProgress={swipeProgress}
                    onClose={() => setIsShowingPreview(false)}
                />
            )}

            {/* Interactive navigation guide/tutorial */}
            {showTutorial && (
                <NavigationGuide
                    onDismiss={onTutorialDismiss}
                    showInitially={true}
                />
            )}

            {/* Gesture hint for first-time users - subtle overlay that appears briefly */}
            {showGestureHint && (
                <div className="fixed inset-0 z-40 pointer-events-none flex items-center justify-center">
                    <div className="bg-black/50 backdrop-blur-sm p-4 rounded-xl max-w-xs text-center animate-fade-out">
                        <div className="flex justify-center mb-4 space-x-8">
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-1 animate-pulse">
                                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                                <span className="text-xs text-white/80">Swipe</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-1 animate-pulse animation-delay-150">
                                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                    </svg>
                                </div>
                                <span className="text-xs text-white/80">Swipe</span>
                            </div>
                        </div>
                        <p className="text-sm text-white/60">Swipe to navigate between content</p>
                    </div>
                </div>
            )}
        </div>
    );
}