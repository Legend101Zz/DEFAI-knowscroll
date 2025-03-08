import React, { useState, useEffect } from 'react';

interface NavigationGuideProps {
    onDismiss: () => void;
    showInitially?: boolean;
}

export default function NavigationGuide({
    onDismiss,
    showInitially = true
}: NavigationGuideProps) {
    const [isVisible, setIsVisible] = useState(showInitially);
    const [currentStep, setCurrentStep] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    // Auto-dismiss after a certain time
    useEffect(() => {
        if (showInitially) {
            const timer = setTimeout(() => {
                dismissGuide();
            }, 12000); // 12 seconds

            return () => clearTimeout(timer);
        }
    }, [showInitially]);

    // Handle navigation steps
    const nextStep = () => {
        if (currentStep < 3) {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentStep(prev => prev + 1);
                setIsAnimating(false);
            }, 300);
        } else {
            dismissGuide();
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentStep(prev => prev - 1);
                setIsAnimating(false);
            }, 300);
        }
    };

    const dismissGuide = () => {
        setIsAnimating(true);
        setTimeout(() => {
            setIsVisible(false);
            onDismiss();
        }, 300);
    };

    if (!isVisible) return null;

    // Animation classes based on state
    const containerClasses = `
    fixed inset-0 z-50 flex items-center justify-center
    bg-black/70 backdrop-blur-sm
    transition-opacity duration-300
    ${isAnimating ? 'opacity-0' : 'opacity-100'}
  `;

    const cardClasses = `
    bg-[#1A1A24]/90 backdrop-blur-md 
    p-6 rounded-xl max-w-sm
    transition-all duration-300 transform
    ${isAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}
  `;

    // Guide content for each step
    const guideSteps = [
        // Step 0: Welcome
        {
            title: "Welcome to KnowScroll",
            content: (
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A] flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                    </div>
                    <p className="text-white/80 mb-4">
                        Learn how to navigate through content with our intuitive swipe controls
                    </p>
                </div>
            )
        },
        // Step 1: Left/Right Swipe
        {
            title: "Topic Navigation",
            content: (
                <div>
                    <div className="flex justify-center mb-6">
                        <div className="flex items-center space-x-8">
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 rounded-full bg-[#e74c3c]/30 flex items-center justify-center mb-2 animate-pulse-slow">
                                    <svg className="w-8 h-8 text-[#e74c3c]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </div>
                                <span className="text-sm">Next Topic</span>
                            </div>

                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 rounded-full bg-[#e74c3c]/30 flex items-center justify-center mb-2 animate-pulse-slow animation-delay-300">
                                    <svg className="w-8 h-8 text-[#e74c3c]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                                <span className="text-sm">Previous Topic</span>
                            </div>
                        </div>
                    </div>

                    <div className="text-white/80 text-center">
                        <p className="mb-2"><span className="text-[#e74c3c] font-bold">Swipe left or right</span> to explore different topics</p>
                        <p className="text-sm">Move between subjects like History, Science, and Technology</p>
                    </div>
                </div>
            )
        },
        // Step 2: Up/Down Swipe
        {
            title: "Series Navigation",
            content: (
                <div>
                    <div className="flex justify-center mb-6">
                        <div className="flex items-center space-x-8">
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 rounded-full bg-[#3498db]/30 flex items-center justify-center mb-2 animate-pulse-slow">
                                    <svg className="w-8 h-8 text-[#3498db]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                    </svg>
                                </div>
                                <span className="text-sm">Next Episode</span>
                            </div>

                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 rounded-full bg-[#3498db]/30 flex items-center justify-center mb-2 animate-pulse-slow animation-delay-300">
                                    <svg className="w-8 h-8 text-[#3498db]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                                <span className="text-sm">Previous Episode</span>
                            </div>
                        </div>
                    </div>

                    <div className="text-white/80 text-center">
                        <p className="mb-2"><span className="text-[#3498db] font-bold">Swipe up or down</span> to navigate within a series</p>
                        <p className="text-sm">Continue learning with sequential episodes on the same topic</p>
                    </div>
                </div>
            )
        },
        // Step 3: Touch Gestures
        {
            title: "Additional Controls",
            content: (
                <div className="text-center">
                    <div className="flex justify-center mb-6 space-x-8">
                        <div className="flex flex-col items-center">
                            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mb-2">
                                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <span className="text-sm">Tap to Play/Pause</span>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mb-2">
                                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <span className="text-sm">Info Overlay</span>
                        </div>
                    </div>

                    <p className="text-white/80">
                        Use interactive buttons on the right side for more actions like liking, saving, or changing playback speed
                    </p>
                </div>
            )
        }
    ];

    const activeStep = guideSteps[currentStep];

    return (
        <div className={containerClasses}>
            <div className={cardClasses}>
                {/* Header with progress indicators */}
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-white">{activeStep.title}</h3>
                    <button
                        onClick={dismissGuide}
                        className="text-white/70 hover:text-white p-1"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="min-h-[180px]">
                    {activeStep.content}
                </div>

                {/* Navigation dots */}
                <div className="flex justify-center mt-2 mb-4">
                    {guideSteps.map((_, index) => (
                        <div
                            key={index}
                            className={`
                w-2 h-2 mx-1 rounded-full 
                ${currentStep === index
                                    ? 'bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A]'
                                    : 'bg-white/30'}
              `}
                        />
                    ))}
                </div>

                {/* Navigation buttons */}
                <div className="flex justify-between items-center">
                    <button
                        onClick={prevStep}
                        className={`px-4 py-2 rounded-lg transition 
              ${currentStep === 0
                                ? 'text-white/30 cursor-not-allowed'
                                : 'text-white/70 hover:text-white hover:bg-white/10'}`}
                        disabled={currentStep === 0}
                    >
                        Back
                    </button>

                    <button
                        onClick={nextStep}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A] text-white font-medium transition transform hover:scale-105 active:scale-95"
                    >
                        {currentStep < 3 ? 'Next' : 'Got it!'}
                    </button>
                </div>
            </div>
        </div>
    );
}