import React, { useState, useEffect } from 'react';

interface NavigationGuideProps {
    onDismiss: () => void;
    showInitially?: boolean;
}

export default function NavigationGuide({ onDismiss, showInitially = true }: NavigationGuideProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [isVisible, setIsVisible] = useState(showInitially);
    const totalSteps = 4;

    useEffect(() => {
        // Auto-hide after inactivity
        const timer = setTimeout(() => {
            if (isVisible) {
                handleDismiss();
            }
        }, 30000); // 30 seconds

        return () => clearTimeout(timer);
    }, [isVisible]);

    const handleNext = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        } else {
            handleDismiss();
        }
    };

    const handleDismiss = () => {
        setIsVisible(false);
        onDismiss();
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="relative w-[90%] max-w-md bg-[#1E1E2A] rounded-xl overflow-hidden">
                {/* Close button */}
                <button
                    onClick={handleDismiss}
                    className="absolute top-3 right-3 p-1 text-white/70 hover:text-white z-20"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Content */}
                <div className="p-6 pt-10">
                    <h3 className="text-xl font-bold text-center text-white mb-6">
                        How to Navigate
                    </h3>

                    {/* Step 1 */}
                    {currentStep === 1 && (
                        <div className="space-y-4">
                            <div className="flex justify-center mb-4">
                                <div className="w-32 h-32 rounded-full bg-[#37E8FF]/10 flex items-center justify-center">
                                    <svg className="w-20 h-20 text-[#37E8FF] animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                            <h4 className="text-lg font-medium text-center text-white">Swipe Left</h4>
                            <p className="text-white/70 text-center">
                                Swipe left to explore new topics and discover different knowledge areas.
                            </p>
                        </div>
                    )}

                    {/* Step 2 */}
                    {currentStep === 2 && (
                        <div className="space-y-4">
                            <div className="flex justify-center mb-4">
                                <div className="w-32 h-32 rounded-full bg-[#FF3D8A]/10 flex items-center justify-center">
                                    <svg className="w-20 h-20 text-[#FF3D8A] animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </div>
                            </div>
                            <h4 className="text-lg font-medium text-center text-white">Swipe Right</h4>
                            <p className="text-white/70 text-center">
                                Swipe right to revisit previous topics or go back to content you&apos;ve seen before.
                            </p>
                        </div>
                    )}

                    {/* Step 3 */}
                    {currentStep === 3 && (
                        <div className="space-y-4">
                            <div className="flex justify-center mb-4">
                                <div className="w-32 h-32 rounded-full bg-[#A742FF]/10 flex items-center justify-center">
                                    <svg className="w-20 h-20 text-[#A742FF] animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                    </svg>
                                </div>
                            </div>
                            <h4 className="text-lg font-medium text-center text-white">Swipe Up</h4>
                            <p className="text-white/70 text-center">
                                Swipe up to continue the current series and move to the next episode in a sequence.
                            </p>
                        </div>
                    )}

                    {/* Step 4 */}
                    {currentStep === 4 && (
                        <div className="space-y-4">
                            <div className="flex justify-center mb-4">
                                <div className="w-32 h-32 rounded-full bg-[#33D69F]/10 flex items-center justify-center">
                                    <svg className="w-20 h-20 text-[#33D69F] animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                    </svg>
                                </div>
                            </div>
                            <h4 className="text-lg font-medium text-center text-white">Swipe Down</h4>
                            <p className="text-white/70 text-center">
                                Swipe down to revisit the previous episode in the current series or minimize expanded content.
                            </p>
                        </div>
                    )}

                    {/* Progress dots */}
                    <div className="flex justify-center space-x-2 mt-6 mb-4">
                        {Array.from({ length: totalSteps }).map((_, index) => (
                            <div
                                key={index}
                                className={`w-2 h-2 rounded-full transition-all ${currentStep === index + 1
                                    ? 'w-4 bg-white'
                                    : 'bg-white/30'
                                    }`}
                            ></div>
                        ))}
                    </div>

                    {/* Navigation buttons */}
                    <div className="flex justify-between items-center mt-8">
                        <button
                            onClick={handleDismiss}
                            className="px-4 py-2 text-white/70 hover:text-white"
                        >
                            Skip
                        </button>
                        <button
                            onClick={handleNext}
                            className="px-6 py-2 bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A] rounded-full text-white font-medium"
                        >
                            {currentStep < totalSteps ? 'Next' : 'Got it!'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}