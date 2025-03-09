"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Logo component
const Logo = () => (
    <div className="flex items-center">
        <Image
            src="/images/knowscroll3.png"
            alt="KnowScroll Logo"
            width={40}
            height={40}
            className="mr-2"
        />
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A]">
            KnowScroll
        </span>
    </div>
);

// Animated gradient background
const AnimatedBackground = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth) - 0.5,
                y: (e.clientY / window.innerHeight) - 0.5
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[#121218]"></div>

            {/* Animated gradient blobs that react to mouse movement */}
            <div
                className="absolute transition-transform duration-700 ease-out top-0 left-1/4 w-full h-1/2 bg-[#37E8FF]/5 rounded-full filter blur-[150px]"
                style={{
                    transform: `translate(${mousePosition.x * -20}px, ${mousePosition.y * -20}px)`
                }}
            ></div>
            <div
                className="absolute transition-transform duration-700 ease-out bottom-0 right-1/4 w-full h-1/2 bg-[#FF3D8A]/5 rounded-full filter blur-[150px]"
                style={{
                    transform: `translate(${mousePosition.x * 30}px, ${mousePosition.y * 30}px)`
                }}
            ></div>
            <div
                className="absolute transition-transform duration-700 ease-out top-1/4 right-1/4 w-2/3 h-1/3 bg-[#A742FF]/5 rounded-full filter blur-[120px]"
                style={{
                    transform: `translate(${mousePosition.x * 15}px, ${mousePosition.y * 15}px)`
                }}
            ></div>

            {/* Grid lines */}
            <div className="absolute inset-0 opacity-10">
                <div className="h-px w-full bg-gradient-to-r from-transparent via-[#37E8FF] to-transparent absolute" style={{ top: '20%' }}></div>
                <div className="h-px w-full bg-gradient-to-r from-transparent via-[#FF3D8A] to-transparent absolute" style={{ top: '40%' }}></div>
                <div className="h-px w-full bg-gradient-to-r from-transparent via-[#A742FF] to-transparent absolute" style={{ top: '60%' }}></div>
                <div className="h-px w-full bg-gradient-to-r from-transparent via-[#37E8FF] to-transparent absolute" style={{ top: '80%' }}></div>

                <div className="w-px h-full bg-gradient-to-b from-transparent via-[#37E8FF] to-transparent absolute" style={{ left: '20%' }}></div>
                <div className="w-px h-full bg-gradient-to-b from-transparent via-[#FF3D8A] to-transparent absolute" style={{ left: '40%' }}></div>
                <div className="w-px h-full bg-gradient-to-b from-transparent via-[#A742FF] to-transparent absolute" style={{ left: '60%' }}></div>
                <div className="w-px h-full bg-gradient-to-b from-transparent via-[#37E8FF] to-transparent absolute" style={{ left: '80%' }}></div>
            </div>
        </div>
    );
};

// Section divider with animated gradient
const SectionDivider = () => (
    <div className="relative h-24 my-16">
        <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#1A1A24] border border-white/10 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#37E8FF]/20 via-[#FF3D8A]/20 to-[#A742FF]/20 animate-pulse-slow flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A]"></div>
            </div>
        </div>
    </div>
);

// Interactive scroll animation component
const ScrollAnimation = ({ title, description, children }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            {
                threshold: 0.2,
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);

    return (
        <div
            ref={ref}
            className={`transform transition-all duration-1000 ${isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
                }`}
        >
            {title && <h3 className="text-2xl md:text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A]">{title}</h3>}
            {description && <p className="text-white/70 mb-8 text-lg">{description}</p>}
            {children}
        </div>
    );
};

// Animated phone mockup component 
const PhoneMockup = ({ children, className = "" }) => (
    <div className={`relative w-[280px] h-[560px] bg-[#0A0A10] rounded-[32px] border-4 border-[#1A1A24] overflow-hidden shadow-lg mx-auto ${className}`}>
        {/* Phone notch */}
        <div className="absolute top-0 left-0 right-0 h-8 bg-[#1A1A24] rounded-t-[28px] flex items-center justify-center">
            <div className="w-16 h-4 bg-[#0A0A10] rounded-full"></div>
        </div>

        {/* Phone content area */}
        <div className="absolute top-8 bottom-0 left-0 right-0 overflow-hidden">
            {children}
        </div>
    </div>
);

// Digital brain animation (for AI section)
const DigitalBrainAnimation = () => {
    return (
        <div className="relative w-full h-64 md:h-80">
            <div className="absolute inset-0 bg-[#1A1A24]/50 rounded-lg border border-white/10 overflow-hidden">
                {/* Neural network nodes */}
                {Array.from({ length: 40 }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-[#37E8FF]/60"
                        style={{
                            width: `${Math.random() * 6 + 2}px`,
                            height: `${Math.random() * 6 + 2}px`,
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animation: `pulse ${Math.random() * 4 + 2}s infinite alternate`,
                            animationDelay: `${Math.random() * 2}s`,
                        }}
                    ></div>
                ))}

                {/* Neural connections */}
                {Array.from({ length: 30 }).map((_, i) => (
                    <div
                        key={`line-${i}`}
                        className="absolute bg-gradient-to-r from-[#37E8FF]/20 to-[#FF3D8A]/20"
                        style={{
                            height: '1px',
                            width: `${Math.random() * 100 + 50}px`,
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            transform: `rotate(${Math.random() * 360}deg)`,
                            opacity: Math.random() * 0.5 + 0.1,
                            animation: `pulse ${Math.random() * 4 + 2}s infinite alternate`,
                            animationDelay: `${Math.random() * 2}s`,
                        }}
                    ></div>
                ))}

                {/* Central brain glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-r from-[#37E8FF]/10 via-[#FF3D8A]/10 to-[#A742FF]/10 rounded-full filter blur-xl animate-pulse-slow"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-r from-[#37E8FF]/20 via-[#FF3D8A]/20 to-[#A742FF]/20 rounded-full filter blur-lg animate-pulse-slow"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <svg className="w-16 h-16 animate-float-slow" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M50 95C74.8528 95 95 74.8528 95 50C95 25.1472 74.8528 5 50 5C25.1472 5 5 25.1472 5 50C5 74.8528 25.1472 95 50 95Z" stroke="url(#brain_gradient)" strokeWidth="1.5" strokeDasharray="5 3" />
                        <path d="M30 70C40 85 60 85 70 70" stroke="url(#brain_gradient)" strokeWidth="1.5" />
                        <path d="M40 45C45 40 55 40 60 45" stroke="url(#brain_gradient)" strokeWidth="1.5" />
                        <path d="M40 30H60" stroke="url(#brain_gradient)" strokeWidth="1.5" />
                        <circle cx="35" cy="55" r="5" stroke="url(#brain_gradient)" strokeWidth="1.5" />
                        <circle cx="65" cy="55" r="5" stroke="url(#brain_gradient)" strokeWidth="1.5" />
                        <defs>
                            <linearGradient id="brain_gradient" x1="5" y1="50" x2="95" y2="50" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#37E8FF" />
                                <stop offset="1" stopColor="#FF3D8A" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>

                {/* Data streams */}
                <div className="absolute bottom-0 left-0 w-full h-8 flex overflow-hidden">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div
                            key={`stream-${i}`}
                            className="h-full flex whitespace-nowrap animate-stream-left"
                            style={{
                                animationDuration: `${15 + i * 5}s`,
                                animationDelay: `${i * 2}s`
                            }}
                        >
                            {Array.from({ length: 20 }).map((_, j) => (
                                <div key={`code-${j}`} className="inline-block mx-2 text-[8px] text-[#37E8FF]/70">
                                    {Math.random().toString(36).substring(2, 10)}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Token economics animation
const TokenEconomicsAnimation = () => (
    <div className="relative w-full h-64 md:h-80 rounded-lg border border-white/10 bg-[#1A1A24]/50 overflow-hidden p-8">
        <div className="absolute inset-0 overflow-hidden">
            {/* Token circles */}
            {Array.from({ length: 20 }).map((_, i) => (
                <div
                    key={i}
                    className="absolute rounded-full animate-float-token"
                    style={{
                        width: `${Math.random() * 30 + 10}px`,
                        height: `${Math.random() * 30 + 10}px`,
                        background: `linear-gradient(135deg, ${i % 3 === 0 ? '#37E8FF' : i % 3 === 1 ? '#FF3D8A' : '#A742FF'
                            }30, transparent)`,
                        border: `1px solid ${i % 3 === 0 ? '#37E8FF' : i % 3 === 1 ? '#FF3D8A' : '#A742FF'
                            }50`,
                        left: `${Math.random() * 80 + 10}%`,
                        top: `${Math.random() * 80 + 10}%`,
                        animationDuration: `${Math.random() * 10 + 10}s`,
                        animationDelay: `${Math.random() * 5}s`,
                    }}
                >
                    <div className="w-full h-full flex items-center justify-center text-white/50 text-[8px]">S</div>
                </div>
            ))}

            {/* Connection lines */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-40 h-40">
                    <svg className="w-full h-full animate-rotate-slow" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="50" cy="50" r="40" stroke="url(#token_gradient)" strokeWidth="0.5" strokeDasharray="1 2" />
                        <circle cx="50" cy="50" r="30" stroke="url(#token_gradient)" strokeWidth="0.5" strokeDasharray="1 2" />
                        <circle cx="50" cy="50" r="20" stroke="url(#token_gradient)" strokeWidth="0.5" strokeDasharray="1 2" />
                        <defs>
                            <linearGradient id="token_gradient" x1="10" y1="50" x2="90" y2="50" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#37E8FF" />
                                <stop offset="1" stopColor="#FF3D8A" />
                            </linearGradient>
                        </defs>
                    </svg>

                    {/* Central token */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-[#1A1A24] border border-white/20 flex items-center justify-center animate-pulse-slow">
                        <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A]">S</div>
                    </div>

                    {/* Orbital tokens */}
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={`orbital-${i}`}
                            className="absolute w-8 h-8 rounded-full bg-[#1A1A24] border border-white/10 flex items-center justify-center animate-orbit"
                            style={{
                                animationDuration: `${10 + i * 5}s`,
                                animationDelay: `${i * 1.5}s`,
                            }}
                        >
                            <div className="text-sm font-bold text-white/70">S</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        <div className="absolute bottom-4 left-0 right-0 text-center text-white/70 text-sm font-bold">
            Token Economics
        </div>
    </div>
);

// Channel governance animation
const GovernanceAnimation = () => (
    <div className="relative w-full h-64 md:h-80 rounded-lg border border-white/10 bg-[#1A1A24]/50 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-64 h-64">
                {/* Central governance token */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-[#1A1A24] border border-white/10 flex items-center justify-center z-10">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#37E8FF]/10 to-[#FF3D8A]/10 animate-pulse-slow"></div>
                    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="url(#gov_gradient)" strokeWidth="1.5" />
                        <path d="M7 12.5L10 15.5L17 8.5" stroke="url(#gov_gradient)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <defs>
                            <linearGradient id="gov_gradient" x1="2" y1="12" x2="22" y2="12" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#37E8FF" />
                                <stop offset="1" stopColor="#FF3D8A" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>

                {/* Connected stakeholders */}
                {Array.from({ length: 6 }).map((_, i) => {
                    const angle = (Math.PI * 2 * i) / 6;
                    const x = Math.cos(angle) * 90;
                    const y = Math.sin(angle) * 90;

                    return (
                        <div key={i}>
                            {/* Connector line */}
                            <div
                                className="absolute top-1/2 left-1/2 h-px bg-gradient-to-r from-[#1A1A24] via-white/30 to-[#1A1A24] transform -translate-y-1/2"
                                style={{
                                    width: '90px',
                                    transformOrigin: '0 0',
                                    transform: `rotate(${angle}rad) translateX(12px)`,
                                }}
                            ></div>

                            {/* Stakeholder icon */}
                            <div
                                className="absolute w-10 h-10 rounded-full bg-[#1A1A24] border border-white/10 flex items-center justify-center animate-pulse"
                                style={{
                                    left: `calc(50% + ${x}px)`,
                                    top: `calc(50% + ${y}px)`,
                                    transform: 'translate(-50%, -50%)',
                                    animationDelay: `${i * 0.2}s`,
                                }}
                            >
                                <svg className="w-5 h-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>

                            {/* Voting animation */}
                            <div
                                className={`absolute w-3 h-3 rounded-full bg-${i % 2 === 0 ? '[#37E8FF]' : '[#FF3D8A]'} animate-vote-travel`}
                                style={{
                                    left: `calc(50% + ${x / 1.2}px)`,
                                    top: `calc(50% + ${y / 1.2}px)`,
                                    transform: 'translate(-50%, -50%)',
                                    animationDelay: `${i * 1}s`,
                                    animationDuration: '3s',
                                }}
                            ></div>
                        </div>
                    );
                })}

                {/* Governance label */}
                <div className="absolute -bottom-4 left-0 right-0 text-center text-white/70 text-sm font-bold">
                    Decentralized Governance
                </div>
            </div>
        </div>
    </div>
);

// AI Editor Concept Animation
const AIEditorAnimation = () => (
    <div className="relative w-full h-64 md:h-80 rounded-lg border border-white/10 bg-[#1A1A24]/50 overflow-hidden p-6">
        <div className="absolute inset-0 overflow-hidden bg-[#0A0A10]/80">
            {/* Code editor interface */}
            <div className="absolute top-8 left-8 right-8 bottom-8 bg-[#1A1A24] rounded-lg border border-white/10 overflow-hidden">
                {/* Editor header */}
                <div className="h-8 bg-[#121218] flex items-center px-4">
                    <div className="flex space-x-2">
                        <div className="w-3 h-3 rounded-full bg-[#FF3D8A]/80"></div>
                        <div className="w-3 h-3 rounded-full bg-[#FFA53D]/80"></div>
                        <div className="w-3 h-3 rounded-full bg-[#37E8FF]/80"></div>
                    </div>
                    <div className="ml-4 text-white/50 text-xs">ContentEditor.ai</div>
                </div>

                {/* Code content */}
                <div className="p-4 text-[10px] text-white/70 font-mono overflow-hidden h-full">
                    <div className="flex mb-2">
                        <span className="text-[#A742FF] mr-2">import</span>
                        <span className="text-white/70 mr-2">{'{'}</span>
                        <span className="text-[#37E8FF] mr-2">ContentGenerator</span>
                        <span className="text-white/70 mr-2">{'}'}</span>
                        <span className="text-[#A742FF] mr-2">from</span>
                        <span className="text-[#FF3D8A]">'./ai/generator';</span>
                    </div>

                    <div className="flex mb-2">
                        <span className="text-[#A742FF] mr-2">const</span>
                        <span className="text-[#37E8FF] mr-2">createReel</span>
                        <span className="text-white/70 mr-2">=</span>
                        <span className="text-[#A742FF] mr-2">async</span>
                        <span className="text-white/70">(</span>
                        <span className="text-[#FF3D8A]">topic, style, duration</span>
                        <span className="text-white/70">)</span>
                        <span className="text-white/70 mr-2">{' => {'}</span>
                    </div>

                    {/* Animated typing effect */}
                    <div className="flex pl-4 mb-2">
                        <span className="text-[#A742FF] mr-2">const</span>
                        <span className="text-[#37E8FF] mr-2">content</span>
                        <span className="text-white/70 mr-2">=</span>
                        <span className="text-[#A742FF] mr-2">await</span>
                        <span className="text-[#37E8FF]">ContentGenerator</span>
                        <span className="text-white/70">.</span>
                        <span className="text-[#FF3D8A]">generate</span>
                        <span className="text-white/70">(</span>
                        <span className="text-[#37E8FF]">{'{'}</span>
                    </div>

                    <div className="flex pl-8 mb-2">
                        <span className="text-white/70">topic,</span>
                    </div>

                    <div className="flex pl-8 mb-2">
                        <span className="text-white/70">style,</span>
                    </div>

                    <div className="flex pl-8 mb-2">
                        <span className="text-white/70">duration,</span>
                    </div>

                    <div className="flex pl-8 mb-2">
                        <span className="text-white/70">learningLevel: </span>
                        <span className="text-[#FF3D8A]">'adaptive'</span>
                        <span className="text-white/70 animate-typing-cursor"></span>
                    </div>
                </div>
            </div>

            {/* AI suggestions popup */}
            <div className="absolute bottom-12 right-12 bg-[#1A1A24]/90 backdrop-blur-md w-40 rounded-lg border border-[#37E8FF]/30 p-3 animate-float-slow shadow-glow-sm">
                <div className="text-xs text-white/80 font-semibold mb-2 flex items-center">
                    <div className="w-2 h-2 bg-[#37E8FF] rounded-full mr-2"></div>
                    AI Suggestions
                </div>
                <div className="text-[10px] text-white/70">
                    • Add visual examples<br />
                    • Simplify key concepts<br />
                    • Include quiz element
                </div>
            </div>
        </div>
    </div>
);

// Interactive card component
const FeatureCard = ({ icon, title, description, color = "blue" }) => {
    const [isHovered, setIsHovered] = useState(false);

    const colorVariants = {
        blue: {
            bgGlow: "bg-[#37E8FF]/10",
            border: "border-[#37E8FF]/30",
            iconColor: "text-[#37E8FF]",
            hoverText: "group-hover:text-[#37E8FF]"
        },
        pink: {
            bgGlow: "bg-[#FF3D8A]/10",
            border: "border-[#FF3D8A]/30",
            iconColor: "text-[#FF3D8A]",
            hoverText: "group-hover:text-[#FF3D8A]"
        },
        purple: {
            bgGlow: "bg-[#A742FF]/10",
            border: "border-[#A742FF]/30",
            iconColor: "text-[#A742FF]",
            hoverText: "group-hover:text-[#A742FF]"
        }
    };

    const variant = colorVariants[color];

    return (
        <div
            className="p-6 rounded-lg border border-white/10 bg-[#1A1A24]/50 backdrop-filter backdrop-blur-lg group hover:border-white/30 transition-all duration-300"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className={`w-12 h-12 rounded-full ${variant.bgGlow} ${variant.border} flex items-center justify-center mb-4 transition-all duration-300 ${isHovered ? 'scale-110' : ''}`}>
                <div className={`${variant.iconColor} w-6 h-6`}>{icon}</div>
            </div>
            <h3 className={`text-xl font-bold mb-2 transition-colors duration-300 ${variant.hoverText}`}>{title}</h3>
            <p className="text-white/70">{description}</p>
        </div>
    );
};

// Header component with navigation
const Header = () => (
    <header className="py-4 border-b border-white/10 relative z-20">
        <div className="max-w-screen-xl mx-auto px-4 flex justify-between items-center">
            <Logo />
            <nav className="hidden md:flex items-center space-x-8">
                <Link href="/explore" className="text-white/80 hover:text-white transition-colors">
                    Explore
                </Link>
                <Link href="/marketplace" className="text-white/80 hover:text-white transition-colors">
                    Marketplace
                </Link>
                <Link href="/channels" className="text-white/80 hover:text-white transition-colors">
                    Channels
                </Link>
                <Link href="/about" className="text-white/80 hover:text-white transition-colors">
                    About
                </Link>
            </nav>
            <div className="flex items-center space-x-4">
                <Link href="/login" className="text-white/80 hover:text-white transition-colors px-4 py-2 border border-white/20 rounded-full hover:border-white/40">
                    Login
                </Link>
                <Link href="/signup" className="bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A] text-white px-4 py-2 rounded-full hover:shadow-glow transition-all hidden md:block">
                    Sign Up
                </Link>
                <button className="md:hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>
        </div>
    </header>
);

// Main Learn More page component
export default function LearnMore() {
    // Intersection observer for animated sections
    const [activeSection, setActiveSection] = useState(null);
    const sections = useRef([]);

    useEffect(() => {
        const observerOptions = {
            threshold: 0.3,
            rootMargin: "0px 0px -10% 0px"
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        }, observerOptions);

        const sectionElements = document.querySelectorAll('[data-section]');
        sections.current = Array.from(sectionElements);

        sections.current.forEach(section => {
            observer.observe(section);
        });

        return () => {
            sections.current.forEach(section => {
                observer.unobserve(section);
            });
        };
    }, []);

    return (
        <div className="min-h-screen bg-[#121218] text-white relative">
            <AnimatedBackground />
            <Header />

            <main className="max-w-screen-xl mx-auto px-4 py-8">
                {/* Hero Section */}
                <div className="py-16 md:py-24 text-center" data-section id="hero">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 max-w-4xl mx-auto">
                        Transforming <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A]">Mindless Scrolling</span> into <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF3D8A] to-[#A742FF]">Meaningful Learning</span>
                    </h1>
                    <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto">
                        KnowScroll reimagines social media as a productive, enriching experience where every swipe builds knowledge and earns rewards.
                    </p>

                    <div className="flex flex-wrap justify-center gap-8 mb-12">
                        <div className="flex flex-col items-center">
                            <div className="text-4xl font-bold text-[#37E8FF] mb-2">40-45</div>
                            <div className="text-white/60 text-sm">Minutes of daily<br />mindless scrolling</div>
                        </div>
                        <div className="flex items-center text-4xl text-white/30">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                            </svg>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="text-4xl font-bold text-[#FF3D8A] mb-2">10-15</div>
                            <div className="text-white/60 text-sm">Minutes of focused<br />micro-learning</div>
                        </div>
                        <div className="flex items-center text-4xl text-white/30">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#37E8FF] to-[#A742FF] mb-2">∞</div>
                            <div className="text-white/60 text-sm">Valuable knowledge<br />& rewards</div>
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center gap-6">
                        <Link href="/explore" className="bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A] text-white px-8 py-4 rounded-full font-medium hover:shadow-glow transition-all">
                            Start Exploring
                        </Link>
                        <Link href="#problem" className="border border-white/20 hover:border-white/40 text-white px-8 py-4 rounded-full font-medium transition-all">
                            Learn More
                        </Link>
                    </div>
                </div>

                <SectionDivider />

                {/* The Problem Section */}
                <section className="py-12 md:py-16" data-section id="problem">
                    <ScrollAnimation
                        title="The Problem with Today's Social Media"
                        description="We're caught in an endless scroll of entertainment that leaves us unfulfilled and wastes our valuable time."
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-12">
                            <div>
                                <div className="space-y-6">
                                    <div className="flex">
                                        <div className="w-10 h-10 rounded-full bg-[#FF3D8A]/10 border border-[#FF3D8A]/30 flex items-center justify-center mr-4 shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#FF3D8A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-2">Time Wasted</h3>
                                            <p className="text-white/70">The average person spends 40-45 minutes daily on social media, often leaving with nothing of value to show for it.</p>
                                        </div>
                                    </div>

                                    <div className="flex">
                                        <div className="w-10 h-10 rounded-full bg-[#37E8FF]/10 border border-[#37E8FF]/30 flex items-center justify-center mr-4 shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#37E8FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-2">Guilt and FOMO</h3>
                                            <p className="text-white/70">The endless scroll of random content creates FOMO (fear of missing out) and post-browsing guilt.</p>
                                        </div>
                                    </div>

                                    <div className="flex">
                                        <div className="w-10 h-10 rounded-full bg-[#A742FF]/10 border border-[#A742FF]/30 flex items-center justify-center mr-4 shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#A742FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-2">Centralized Control</h3>
                                            <p className="text-white/70">Traditional social platforms own and control all content, giving users no stake in the platforms they help build.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <PhoneMockup className="mt-8 md:mt-0">
                                <div className="relative h-full overflow-hidden">
                                    {/* Traditional social media content */}
                                    <div className="absolute inset-0 flex flex-col animate-subtle-scroll">
                                        {Array.from({ length: 3 }).map((_, i) => (
                                            <div key={i} className="p-2 mb-2">
                                                <div className="w-full h-56 bg-[#1A1A24] rounded-xl overflow-hidden relative">
                                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 flex items-end p-3">
                                                        <div className="w-full">
                                                            <div className="flex items-center mb-2">
                                                                <div className="w-8 h-8 rounded-full bg-white/20"></div>
                                                                <div className="ml-2 text-xs text-white/80">@random_user</div>
                                                            </div>
                                                            <div className="text-xs text-white/70">
                                                                Just another random video with no educational value... #trending #viral
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Overlay with scattered attention icons */}
                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                        <div className="relative w-full h-full">
                                            {Array.from({ length: 15 }).map((_, i) => (
                                                <div
                                                    key={i}
                                                    className="absolute"
                                                    style={{
                                                        top: `${Math.random() * 100}%`,
                                                        left: `${Math.random() * 100}%`,
                                                        transform: 'translate(-50%, -50%)',
                                                        opacity: Math.random() * 0.5 + 0.2,
                                                    }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </div>
                                            ))}

                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <div className="rounded-full bg-black/50 backdrop-blur-md p-4 animate-pulse-slow">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                <div className="mt-4 text-white/60 text-center max-w-[200px]">
                                                    <div className="text-xl font-bold mb-1">Time Lost</div>
                                                    <div className="text-sm">Hours spent scrolling through endless, meaningless content</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </PhoneMockup>
                        </div>

                        <div className="bg-[#1A1A24]/50 backdrop-blur-sm border border-white/10 rounded-lg p-6 md:p-8">
                            <div className="text-xl text-white/90 italic relative">
                                <span className="absolute -left-4 top-0 text-4xl text-[#FF3D8A]/50">"</span>
                                <p className="mb-4">
                                    I used to lose myself in that hypnotic scroll, feeling excited in the moment yet empty afterward.
                                    Now, picture an app that takes that same addictive, dopamine-fueled experience and transforms it into something that nourishes your mind and spirit.
                                </p>
                                <div className="flex items-center mt-4">
                                    <div className="w-10 h-10 rounded-full bg-[#1A1A24] border border-[#FF3D8A]/30 mr-3"></div>
                                    <div className="text-base text-white/70">- Early KnowScroll User</div>
                                </div>
                            </div>
                        </div>
                    </ScrollAnimation>
                </section>

                <SectionDivider />

                {/* The Solution Section */}
                <section className="py-12 md:py-16" data-section id="solution">
                    <ScrollAnimation
                        title="Our Solution: Knowledge Through Scrolling"
                        description="KnowScroll reimagines the social media experience—keeping what we love while making every moment count."
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-12">
                            <PhoneMockup className="md:order-2">
                                <div className="relative h-full overflow-hidden">
                                    {/* KnowScroll content */}
                                    <div className="absolute inset-0 flex flex-col animate-subtle-scroll">
                                        {[
                                            { title: "The Science of Black Holes", category: "Astronomy", progress: "65%" },
                                            { title: "Evolution of Modern Computing", category: "Technology", progress: "42%" },
                                            { title: "Renaissance Art Explained", category: "Art History", progress: "78%" },
                                        ].map((item, i) => (
                                            <div key={i} className="p-2 mb-2">
                                                <div className="w-full h-56 bg-[#1A1A24] rounded-xl overflow-hidden relative">
                                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70 flex items-end p-3">
                                                        <div className="w-full">
                                                            <div className="flex justify-between items-center mb-2">
                                                                <div className="text-white text-sm font-medium">{item.title}</div>
                                                                <div className="px-2 py-1 rounded-full bg-[#37E8FF]/20 text-[#37E8FF] text-xs">{item.category}</div>
                                                            </div>

                                                            <div className="w-full h-1 bg-white/10 rounded-full mb-2">
                                                                <div
                                                                    className="h-full bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A] rounded-full"
                                                                    style={{ width: item.progress }}
                                                                ></div>
                                                            </div>

                                                            <div className="flex justify-between items-center">
                                                                <div className="flex items-center">
                                                                    <div className="w-4 h-4 rounded-full bg-[#37E8FF]/20 flex items-center justify-center">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-2 w-2 text-[#37E8FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                                        </svg>
                                                                    </div>
                                                                    <span className="text-[10px] ml-1 text-white/50">You own 2.5%</span>
                                                                </div>
                                                                <span className="text-[10px] text-white/50">+0.004 S</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Navigation overlay */}
                                    <div className="absolute inset-0 pointer-events-none">
                                        <div className="absolute inset-x-0 top-1/2 flex justify-between items-center px-2 opacity-40">
                                            <div className="p-1 rounded-full bg-white/20 flex flex-col items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                </svg>
                                                <span className="text-[8px] mt-1">Topics</span>
                                            </div>
                                            <div className="p-1 rounded-full bg-white/20 flex flex-col items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                                <span className="text-[8px] mt-1">Topics</span>
                                            </div>
                                        </div>

                                        <div className="absolute inset-y-0 right-0 flex flex-col justify-center items-center px-2 opacity-40">
                                            <div className="p-1 rounded-full bg-white/20 flex items-center flex-col">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                                </svg>
                                                <span className="text-[8px] mt-1">Previous</span>
                                            </div>
                                            <div className="p-1 rounded-full bg-white/20 flex items-center flex-col mt-4">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                                <span className="text-[8px] mt-1">Continue</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Knowledge gained / time well spent indicator */}
                                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-md rounded-lg px-3 py-1 text-xs border border-[#37E8FF]/20 text-white/90 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-[#37E8FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                        Knowledge Gained
                                    </div>
                                </div>
                            </PhoneMockup>

                            <div className="md:order-1">
                                <div className="space-y-6">
                                    <div className="flex">
                                        <div className="w-10 h-10 rounded-full bg-[#37E8FF]/10 border border-[#37E8FF]/30 flex items-center justify-center mr-4 shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#37E8FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-2">Smart Educational Content</h3>
                                            <p className="text-white/70">AI-generated micro-learning videos deliver valuable knowledge in the same addictive, bite-sized format as entertainment reels.</p>
                                        </div>
                                    </div>

                                    <div className="flex">
                                        <div className="w-10 h-10 rounded-full bg-[#FF3D8A]/10 border border-[#FF3D8A]/30 flex items-center justify-center mr-4 shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#FF3D8A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-2">Structured Learning Journeys</h3>
                                            <p className="text-white/70">Topics follow a logical sequence—swipe vertically to continue a series or horizontally to explore new topics, giving you control of your learning path.</p>
                                        </div>
                                    </div>

                                    <div className="flex">
                                        <div className="w-10 h-10 rounded-full bg-[#A742FF]/10 border border-[#A742FF]/30 flex items-center justify-center mr-4 shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#A742FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-2">Own What You Love</h3>
                                            <p className="text-white/70">Purchase fractional NFT shares in your favorite content channels, earn revenue as they grow, and help govern their future direction.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Features grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
                            <FeatureCard
                                color="blue"
                                icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                }
                                title="Same Dopamine, More Value"
                                description="We maintain the addictive nature of reels but fill them with meaningful content that enriches your mind."
                            />

                            <FeatureCard
                                color="pink"
                                icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                }
                                title="No Guilt, Just Growth"
                                description="Every scrolling session feels productive and rewarding, eliminating the post-browsing emptiness."
                            />

                            <FeatureCard
                                color="purple"
                                icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                }
                                title="Personalized Learning Feed"
                                description="Content adapts to your interests and learning pace, creating a unique educational experience tailored just for you."
                            />
                        </div>
                    </ScrollAnimation>
                </section>

                <SectionDivider />

                {/* How It Works Section */}
                <section className="py-12 md:py-16" data-section id="how-it-works">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#37E8FF] to-[#A742FF]">
                        How KnowScroll Works
                    </h2>
                    <p className="text-lg text-white/70 max-w-2xl mx-auto text-center mb-12">
                        A revolutionary platform combining AI content creation, Web3 ownership, and guilt-free scrolling.
                    </p>

                    <div className="space-y-20">
                        {/* AI Generation */}
                        <ScrollAnimation>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                                <div>
                                    <div className="inline-flex items-center px-3 py-1 mb-4 text-sm rounded-full bg-[#1A1A24]/80 backdrop-blur-sm border border-[#37E8FF]/20">
                                        <div className="w-2 h-2 rounded-full bg-[#37E8FF] mr-2"></div>
                                        <span className="text-white/80">AI Content Generation</span>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4">Intelligent Content Creation</h3>
                                    <p className="text-white/70 mb-6">
                                        Our advanced AI models generate engaging, educational short-form videos on topics ranging from history and science to art and technology. Each piece of content is:
                                    </p>
                                    <ul className="space-y-3">
                                        <li className="flex items-start">
                                            <div className="w-5 h-5 rounded-full bg-[#37E8FF]/20 flex items-center justify-center mr-3 mt-0.5">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-[#37E8FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <span className="text-white/70">Accurately researched and fact-checked for educational integrity</span>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="w-5 h-5 rounded-full bg-[#37E8FF]/20 flex items-center justify-center mr-3 mt-0.5">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-[#37E8FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <span className="text-white/70">Presented in an engaging, visually appealing format optimized for retention</span>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="w-5 h-5 rounded-full bg-[#37E8FF]/20 flex items-center justify-center mr-3 mt-0.5">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-[#37E8FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <span className="text-white/70">Customized to your learning level and interests based on your viewing habits</span>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="w-5 h-5 rounded-full bg-[#37E8FF]/20 flex items-center justify-center mr-3 mt-0.5">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-[#37E8FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <span className="text-white/70">Part of a larger learning sequence that builds knowledge systematically</span>
                                        </li>
                                    </ul>
                                </div>
                                <DigitalBrainAnimation />
                            </div>
                        </ScrollAnimation>

                        {/* Channels and Curation */}
                        <ScrollAnimation>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                                <div className="md:order-2">
                                    <div className="inline-flex items-center px-3 py-1 mb-4 text-sm rounded-full bg-[#1A1A24]/80 backdrop-blur-sm border border-[#FF3D8A]/20">
                                        <div className="w-2 h-2 rounded-full bg-[#FF3D8A] mr-2"></div>
                                        <span className="text-white/80">Channels & Curation</span>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4">Thematic Learning Channels</h3>
                                    <p className="text-white/70 mb-6">
                                        Content is organized into cohesive channels, each following a narrative arc that builds knowledge systematically instead of presenting random, disconnected videos.
                                    </p>

                                    <div className="space-y-6">
                                        <div className="bg-[#1A1A24]/50 border border-white/10 rounded-lg p-4">
                                            <h4 className="text-lg font-bold mb-2 flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#FF3D8A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                </svg>
                                                Structured Series
                                            </h4>
                                            <p className="text-white/70 text-sm">
                                                Instead of random videos, topics are arranged in a logical sequence. For example, a channel on the theory of relativity starts with time dilation and gradually builds up to spacetime curvature.
                                            </p>
                                        </div>

                                        <div className="bg-[#1A1A24]/50 border border-white/10 rounded-lg p-4">
                                            <h4 className="text-lg font-bold mb-2 flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#FF3D8A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                                </svg>
                                                Expert & Community Curation
                                            </h4>
                                            <p className="text-white/70 text-sm">
                                                Experts and community curators work with our AI to fine-tune the content. They "direct" the narrative of each channel, ensuring that what you see is both engaging and enriching.
                                            </p>
                                        </div>

                                        <div className="bg-[#1A1A24]/50 border border-white/10 rounded-lg p-4">
                                            <h4 className="text-lg font-bold mb-2 flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#FF3D8A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                                </svg>
                                                Quality Control
                                            </h4>
                                            <p className="text-white/70 text-sm">
                                                All content undergoes rigorous quality checks to ensure accuracy, educational value, and engagement level. This maintains the platform's integrity while keeping the addictive scroll experience.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="md:order-1">
                                    <div className="relative">
                                        <div className="absolute -inset-4 bg-gradient-to-r from-[#FF3D8A]/10 to-[#A742FF]/10 rounded-xl blur-xl"></div>
                                        <div className="relative bg-[#1A1A24]/80 backdrop-blur-sm rounded-lg border border-white/10 p-6">
                                            <h4 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#FF3D8A] to-[#A742FF]">Channel Example: Quantum Physics</h4>

                                            <div className="space-y-4">
                                                <div className="bg-[#121218]/70 rounded-lg p-3 border border-white/5">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <div className="text-sm font-medium">1. Quantum Basics</div>
                                                        <div className="h-5 w-5 rounded-full bg-[#37E8FF]/20 flex items-center justify-center">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-[#37E8FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    <div className="text-xs text-white/60">Wave-particle duality, uncertainty principle, and quantum states</div>
                                                </div>

                                                <div className="bg-[#121218]/70 rounded-lg p-3 border border-white/5">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <div className="text-sm font-medium">2. Quantum Mechanics</div>
                                                        <div className="h-5 w-5 rounded-full bg-[#37E8FF]/20 flex items-center justify-center">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-[#37E8FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    <div className="text-xs text-white/60">Schrödinger's equation, quantum operators, and measurement</div>
                                                </div>

                                                <div className="bg-[#121218]/70 rounded-lg p-3 border border-white/5">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <div className="text-sm font-medium">3. Quantum Entanglement</div>
                                                        <div className="h-5 w-5 rounded-full bg-[#37E8FF]/20 flex items-center justify-center animate-pulse">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-[#37E8FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    <div className="text-xs text-white/60">EPR paradox, Bell's inequalities, and non-locality</div>
                                                </div>

                                                <div className="bg-[#121218]/70 rounded-lg p-3 border border-white/5 opacity-50">
                                                    <div className="text-sm font-medium mb-2">4. Quantum Computing</div>
                                                    <div className="text-xs text-white/60">Qubits, quantum gates, and quantum algorithms</div>
                                                </div>

                                                <div className="bg-[#121218]/70 rounded-lg p-3 border border-white/5 opacity-30">
                                                    <div className="text-sm font-medium mb-2">5. Quantum Field Theory</div>
                                                    <div className="text-xs text-white/60">Virtual particles, quantum electrodynamics, and the Standard Model</div>
                                                </div>
                                            </div>

                                            <div className="mt-4 w-full h-1 bg-white/10 rounded-full">
                                                <div className="h-full bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A] rounded-full" style={{ width: '50%' }}></div>
                                            </div>
                                            <div className="mt-2 text-xs text-white/50 text-right">Progress: 3/6</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ScrollAnimation>

                        {/* Governance and Ownership */}
                        <ScrollAnimation>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                                <div>
                                    <div className="inline-flex items-center px-3 py-1 mb-4 text-sm rounded-full bg-[#1A1A24]/80 backdrop-blur-sm border border-[#A742FF]/20">
                                        <div className="w-2 h-2 rounded-full bg-[#A742FF] mr-2"></div>
                                        <span className="text-white/80">Governance & Ownership</span>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4">Fractional NFT Ownership</h3>
                                    <p className="text-white/70 mb-6">
                                        KnowScroll brings the power of Web3 to social media by enabling users to own shares in content channels as NFTs, creating a fully decentralized ecosystem.
                                    </p>

                                    <div className="space-y-4">
                                        <div className="flex">
                                            <div className="w-8 h-8 rounded-full bg-[#A742FF]/10 border border-[#A742FF]/30 flex items-center justify-center mr-3 shrink-0">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#A742FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-bold mb-1">Revenue Sharing</h4>
                                                <p className="text-white/70 text-sm">
                                                    Channel shareholders earn a percentage of the revenue generated by their content, creating a passive income stream while supporting quality educational content.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex">
                                            <div className="w-8 h-8 rounded-full bg-[#A742FF]/10 border border-[#A742FF]/30 flex items-center justify-center mr-3 shrink-0">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#A742FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-bold mb-1">Content Direction</h4>
                                                <p className="text-white/70 text-sm">
                                                    Stakeholders can vote on channel direction, topics, and content focus, ensuring the platform evolves based on community preferences and educational goals.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex">
                                            <div className="w-8 h-8 rounded-full bg-[#A742FF]/10 border border-[#A742FF]/30 flex items-center justify-center mr-3 shrink-0">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#A742FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-bold mb-1">Transparent Governance</h4>
                                                <p className="text-white/70 text-sm">
                                                    All governance decisions are recorded on the Sonic blockchain, providing complete transparency and immutability for community decisions and revenue distribution.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <GovernanceAnimation />
                            </div>
                        </ScrollAnimation>

                        {/* Token Economics */}
                        <ScrollAnimation>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                                <div className="md:order-2">
                                    <div className="inline-flex items-center px-3 py-1 mb-4 text-sm rounded-full bg-[#1A1A24]/80 backdrop-blur-sm border border-[#37E8FF]/20">
                                        <div className="w-2 h-2 rounded-full bg-[#37E8FF] mr-2"></div>
                                        <span className="text-white/80">Token Economics</span>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4">Rewards & Incentives System</h3>
                                    <p className="text-white/70 mb-6">
                                        KnowScroll's token system rewards engagement, learning, and contribution to create a self-sustaining ecosystem where everyone benefits.
                                    </p>

                                    <div className="space-y-6">
                                        <div className="bg-[#1A1A24]/50 border border-white/10 rounded-lg p-4">
                                            <h4 className="text-lg font-bold mb-2">Smart Contract-Triggered Rewards</h4>
                                            <p className="text-white/70 text-sm">
                                                Every positive interaction—whether it's viewing a reel, completing a micro-learning module, or engaging with content—triggers a smart contract that automatically distributes tokens as rewards.
                                            </p>
                                        </div>

                                        <div className="bg-[#1A1A24]/50 border border-white/10 rounded-lg p-4">
                                            <h4 className="text-lg font-bold mb-2">Token Utility</h4>
                                            <p className="text-white/70 text-sm">
                                                Platform tokens can be used for:
                                            </p>
                                            <ul className="mt-2 space-y-2">
                                                <li className="flex items-start">
                                                    <div className="w-4 h-4 rounded-full bg-[#37E8FF]/20 flex items-center justify-center mr-2 mt-0.5">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-2 w-2 text-[#37E8FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                    <span className="text-white/70 text-sm">Purchasing channel shares and increasing ownership</span>
                                                </li>
                                                <li className="flex items-start">
                                                    <div className="w-4 h-4 rounded-full bg-[#37E8FF]/20 flex items-center justify-center mr-2 mt-0.5">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-2 w-2 text-[#37E8FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                    <span className="text-white/70 text-sm">Voting in platform governance decisions</span>
                                                </li>
                                                <li className="flex items-start">
                                                    <div className="w-4 h-4 rounded-full bg-[#37E8FF]/20 flex items-center justify-center mr-2 mt-0.5">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-2 w-2 text-[#37E8FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                    <span className="text-white/70 text-sm">Unlocking premium content and features</span>
                                                </li>
                                                <li className="flex items-start">
                                                    <div className="w-4 h-4 rounded-full bg-[#37E8FF]/20 flex items-center justify-center mr-2 mt-0.5">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-2 w-2 text-[#37E8FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                    <span className="text-white/70 text-sm">Trading on external exchanges</span>
                                                </li>
                                            </ul>
                                        </div>

                                        <div className="bg-[#1A1A24]/50 border border-white/10 rounded-lg p-4">
                                            <h4 className="text-lg font-bold mb-2">Powered by Sonic Blockchain</h4>
                                            <p className="text-white/70 text-sm">
                                                KnowScroll utilizes the ultra-fast Sonic blockchain with 10,000 TPS and sub-second finality, ensuring seamless revenue distribution, smooth ownership transfers, and lightning-fast content interactions.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <TokenEconomicsAnimation />
                            </div>
                        </ScrollAnimation>

                        {/* Creator Tools */}
                        <ScrollAnimation>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                                <div>
                                    <div className="inline-flex items-center px-3 py-1 mb-4 text-sm rounded-full bg-[#1A1A24]/80 backdrop-blur-sm border border-[#FF3D8A]/20">
                                        <div className="w-2 h-2 rounded-full bg-[#FF3D8A] mr-2"></div>
                                        <span className="text-white/80">Creator Tools</span>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4">AI-Powered Content Editor</h3>
                                    <p className="text-white/70 mb-6">
                                        While AI generates the core content, KnowScroll provides powerful tools for creators and channel owners to customize and refine their educational reels.
                                    </p>

                                    <div className="space-y-4">
                                        <div className="flex">
                                            <div className="w-8 h-8 rounded-full bg-[#FF3D8A]/10 border border-[#FF3D8A]/30 flex items-center justify-center mr-3 shrink-0">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#FF3D8A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-bold mb-1">Content Customization</h4>
                                                <p className="text-white/70 text-sm">
                                                    The intuitive editor lets creators tweak AI-generated content, add personal touches, adjust visual elements, and customize the learning experience.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex">
                                            <div className="w-8 h-8 rounded-full bg-[#FF3D8A]/10 border border-[#FF3D8A]/30 flex items-center justify-center mr-3 shrink-0">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#FF3D8A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-bold mb-1">Theme and Style Controls</h4>
                                                <p className="text-white/70 text-sm">
                                                    Choose from various visual themes, presentation styles, and engagement techniques to match your channel's unique identity and learning approach.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex">
                                            <div className="w-8 h-8 rounded-full bg-[#FF3D8A]/10 border border-[#FF3D8A]/30 flex items-center justify-center mr-3 shrink-0">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#FF3D8A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-bold mb-1">AI Assistance</h4>
                                                <p className="text-white/70 text-sm">
                                                    Get intelligent suggestions for improving content, enhancing engagement, optimizing learning outcomes, and increasing viewer retention.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <AIEditorAnimation />
                            </div>
                        </ScrollAnimation>
                    </div>
                </section>

                <SectionDivider />

                {/* Guilt-Free Scrolling Section */}
                <section className="py-12 md:py-16" data-section id="mindful-scrolling">
                    <ScrollAnimation
                        title="Mindful, Guilt-Free Scrolling"
                        description="KnowScroll transforms your screen time into a wellness-oriented experience that promotes growth instead of waste."
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <div>
                                <div className="space-y-6">
                                    <div className="flex">
                                        <div className="w-10 h-10 rounded-full bg-[#A742FF]/10 border border-[#A742FF]/30 flex items-center justify-center mr-4 shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#A742FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-2">Adaptive Mindful Breaks</h3>
                                            <p className="text-white/70">
                                                Our AI tracks your scrolling habits and gently nudges you to pause when it senses you're getting lost in the endless loop with mindfulness prompts and calming visuals.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex">
                                        <div className="w-10 h-10 rounded-full bg-[#37E8FF]/10 border border-[#37E8FF]/30 flex items-center justify-center mr-4 shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#37E8FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-2">Personal Well-Being Dashboard</h3>
                                            <p className="text-white/70">
                                                Track your mood, time spent, and knowledge gained. See how your curated, guilt-free scroll actually boosts your energy, creativity, and inspires personal growth.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex">
                                        <div className="w-10 h-10 rounded-full bg-[#FF3D8A]/10 border border-[#FF3D8A]/30 flex items-center justify-center mr-4 shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#FF3D8A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-2">Thematic Journeys</h3>
                                            <p className="text-white/70">
                                                Every channel tells a coherent, uplifting story. Instead of losing yourself in distractions, your feed evolves like a journey that adds meaning to every swipe.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 bg-[#1A1A24]/50 backdrop-blur-sm border border-white/10 rounded-lg p-6">
                                    <div className="text-xl text-white/90 italic relative">
                                        <span className="absolute -left-4 top-0 text-4xl text-[#A742FF]/50">"</span>
                                        <p className="mb-4">
                                            This isn't about turning your feed into a lecture hall—it's about preserving that irresistible Instagram vibe while making every scroll feel purposeful. It's the evolution of social media: addictive by design, yet kind to your mind.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="absolute -inset-4 bg-gradient-to-r from-[#A742FF]/10 to-[#37E8FF]/10 rounded-xl blur-xl"></div>
                                <div className="relative bg-[#1A1A24]/80 backdrop-blur-sm rounded-lg border border-white/10 p-6">
                                    <h4 className="text-xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#A742FF] to-[#37E8FF]">Well-Being Dashboard</h4>

                                    <div className="space-y-6">
                                        <div className="bg-[#121218]/70 rounded-lg p-4 border border-white/5">
                                            <div className="flex justify-between items-center mb-4">
                                                <div className="text-lg font-medium">Daily Usage</div>
                                                <div className="text-white/50 text-sm">14 min today</div>
                                            </div>

                                            <div className="w-full h-2 bg-white/10 rounded-full mb-1">
                                                <div className="h-full bg-gradient-to-r from-[#37E8FF] to-[#A742FF] rounded-full" style={{ width: '35%' }}></div>
                                            </div>
                                            <div className="flex justify-between text-xs text-white/50">
                                                <span>0 min</span>
                                                <span>Goal: 40 min</span>
                                            </div>
                                        </div>

                                        <div className="bg-[#121218]/70 rounded-lg p-4 border border-white/5">
                                            <div className="flex justify-between items-center mb-3">
                                                <div className="text-lg font-medium">Knowledge Stats</div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="flex flex-col">
                                                    <div className="text-2xl font-bold text-[#37E8FF]">7</div>
                                                    <div className="text-xs text-white/50">Topics Explored</div>
                                                </div>
                                                <div className="flex flex-col">
                                                    <div className="text-2xl font-bold text-[#FF3D8A]">3</div>
                                                    <div className="text-xs text-white/50">Series Completed</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-[#121218]/70 rounded-lg p-4 border border-white/5">
                                            <div className="flex justify-between items-center mb-3">
                                                <div className="text-lg font-medium">Mood Tracker</div>
                                                <div className="px-2 py-1 rounded-full bg-[#37E8FF]/20 text-[#37E8FF] text-xs">Improved</div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex space-x-1">
                                                    {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                                                        <div
                                                            key={day}
                                                            className="w-8 h-16 bg-[#121218] rounded-md overflow-hidden"
                                                        >
                                                            <div
                                                                className="w-full bg-gradient-to-t from-[#37E8FF] to-[#A742FF]"
                                                                style={{
                                                                    height: `${(Math.sin(day * 0.8) * 0.3 + 0.5) * 100}%`,
                                                                    opacity: day === 7 ? 0.9 : 0.5
                                                                }}
                                                            ></div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="text-4xl text-[#37E8FF]">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ScrollAnimation>
                </section>

                <SectionDivider />

                {/* Blockchain Integration */}
                <section className="py-12 md:py-16" data-section id="blockchain">
                    <ScrollAnimation
                        title="Powered by Sonic Blockchain"
                        description="KnowScroll leverages ultra-fast blockchain technology to enable seamless ownership, transparent governance, and automatic rewards."
                    >
                        <div className="relative rounded-xl overflow-hidden mb-12">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#121218] via-transparent to-[#121218]"></div>
                            <div className="relative py-12 flex flex-col items-center">
                                <div className="w-20 h-20 rounded-full bg-[#1A1A24] border border-[#37E8FF]/30 flex items-center justify-center mb-6">
                                    <svg className="h-10 w-10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M50 95C74.8528 95 95 74.8528 95 50C95 25.1472 74.8528 5 50 5C25.1472 5 5 25.1472 5 50C5 74.8528 25.1472 95 50 95Z" stroke="url(#sonic_gradient)" strokeWidth="2" />
                                        <path d="M36 36L64 64" stroke="url(#sonic_gradient)" strokeWidth="3" strokeLinecap="round" />
                                        <path d="M36 64L64 36" stroke="url(#sonic_gradient)" strokeWidth="3" strokeLinecap="round" />
                                        <defs>
                                            <linearGradient id="sonic_gradient" x1="5" y1="50" x2="95" y2="50" gradientUnits="userSpaceOnUse">
                                                <stop stopColor="#37E8FF" />
                                                <stop offset="1" stopColor="#FF3D8A" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </div>

                                <h3 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A] text-center">
                                    Sonic Blockchain Integration
                                </h3>

                                <div className="flex flex-wrap justify-center gap-8 mb-8">
                                    <div className="flex flex-col items-center">
                                        <div className="text-3xl font-bold text-[#37E8FF] mb-2">10,000</div>
                                        <div className="text-white/60 text-sm">Transactions<br />Per Second</div>
                                    </div>

                                    <div className="flex flex-col items-center">
                                        <div className="text-3xl font-bold text-[#FF3D8A] mb-2">&lt;1s</div>
                                        <div className="text-white/60 text-sm">Transaction<br />Finality</div>
                                    </div>

                                    <div className="flex flex-col items-center">
                                        <div className="text-3xl font-bold text-[#A742FF] mb-2">Seamless</div>
                                        <div className="text-white/60 text-sm">Ethereum<br />Compatibility</div>
                                    </div>
                                </div>

                                <p className="text-white/70 text-center max-w-3xl">
                                    KnowScroll leverages the Sonic blockchain's lightning-fast performance to create a responsive,
                                    decentralized experience. From reward distribution to governance voting, every transaction
                                    happens in real-time with no delays or high fees.
                                </p>

                                {/* Blockchain visual effect */}
                                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                    <div className="absolute inset-0 flex items-center">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <div
                                                key={i}
                                                className="absolute flex animate-slide-blockchain"
                                                style={{
                                                    top: `${20 + i * 15}%`,
                                                    animationDuration: `${15 + i * 5}s`,
                                                    animationDelay: `${i * 2}s`,
                                                    opacity: 0.3
                                                }}
                                            >
                                                {Array.from({ length: 10 }).map((_, j) => (
                                                    <div
                                                        key={j}
                                                        className="mx-4 px-3 py-2 rounded-md bg-[#1A1A24] border border-white/10 flex items-center whitespace-nowrap text-xs"
                                                    >
                                                        <div
                                                            className="w-2 h-2 rounded-full mr-2"
                                                            style={{
                                                                backgroundColor: (i + j) % 3 === 0 ? '#37E8FF' : (i + j) % 3 === 1 ? '#FF3D8A' : '#A742FF',
                                                            }}
                                                        ></div>
                                                        0x{Math.random().toString(16).substring(2, 10)}
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-[#1A1A24]/50 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:border-[#37E8FF]/30 transition-all group">
                                <div className="w-12 h-12 rounded-full bg-[#37E8FF]/10 border border-[#37E8FF]/20 flex items-center justify-center mb-4 group-hover:bg-[#37E8FF]/20 transition-all">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#37E8FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold mb-3 group-hover:text-[#37E8FF] transition-colors">Real-Time Rewards</h3>
                                <p className="text-white/70">
                                    Smart contracts automatically distribute tokens the moment users interact with content, creating immediate incentives for learning and engagement.
                                </p>
                            </div>

                            <div className="bg-[#1A1A24]/50 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:border-[#FF3D8A]/30 transition-all group">
                                <div className="w-12 h-12 rounded-full bg-[#FF3D8A]/10 border border-[#FF3D8A]/20 flex items-center justify-center mb-4 group-hover:bg-[#FF3D8A]/20 transition-all">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#FF3D8A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold mb-3 group-hover:text-[#FF3D8A] transition-colors">Verifiable Ownership</h3>
                                <p className="text-white/70">
                                    All channel shares and ownership stakes are recorded immutably on the blockchain, ensuring complete transparency and protection of user assets.
                                </p>
                            </div>

                            <div className="bg-[#1A1A24]/50 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:border-[#A742FF]/30 transition-all group">
                                <div className="w-12 h-12 rounded-full bg-[#A742FF]/10 border border-[#A742FF]/20 flex items-center justify-center mb-4 group-hover:bg-[#A742FF]/20 transition-all">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#A742FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold mb-3 group-hover:text-[#A742FF] transition-colors">Decentralized Governance</h3>
                                <p className="text-white/70">
                                    Token holders vote on platform features, content direction, and revenue allocation through transparent on-chain governance mechanisms.
                                </p>
                            </div>
                        </div>
                    </ScrollAnimation>
                </section>

                <SectionDivider />

                {/* CTA Section */}
                <section className="py-12 md:py-16" data-section id="join">
                    <div className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-br from-[#37E8FF]/10 via-[#FF3D8A]/10 to-[#A742FF]/10 rounded-xl blur-xl"></div>
                        <div className="relative py-16 px-8 flex flex-col items-center text-center bg-[#1A1A24]/50 backdrop-blur-sm rounded-lg border border-white/10">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6 max-w-3xl">
                                Ready to Make Your Scrolling Time{" "}
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A]">
                                    Meaningful?
                                </span>
                            </h2>
                            <p className="text-lg text-white/70 mb-10 max-w-2xl">
                                Join KnowScroll today and transform your daily social media habit into a source of knowledge,
                                growth, and potential revenue. No more guilt, just value.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    href="/explore"
                                    className="bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A] text-white px-8 py-4 rounded-full font-medium text-lg hover:shadow-glow transition-all"
                                >
                                    Start Exploring Now
                                </Link>
                                <Link
                                    href="/marketplace"
                                    className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-8 py-4 rounded-full font-medium text-lg transition-all"
                                >
                                    View Channels
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="border-t border-white/10 py-12 mt-12">
                <div className="max-w-screen-xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                        <div>
                            <div className="mb-4">
                                <Logo />
                            </div>
                            <p className="text-white/60 text-sm">
                                Redefining social media with AI-generated content and decentralized ownership.
                            </p>
                            <div className="mt-4 flex space-x-4">
                                <a href="#" className="text-white/40 hover:text-white/80 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                                    </svg>
                                </a>
                                <a href="#" className="text-white/40 hover:text-white/80 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                    </svg>
                                </a>
                                <a href="#" className="text-white/40 hover:text-white/80 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Platform</h4>
                            <ul className="space-y-2">
                                <li><Link href="/explore" className="text-white/60 hover:text-white">Explore</Link></li>
                                <li><Link href="/marketplace" className="text-white/60 hover:text-white">Marketplace</Link></li>
                                <li><Link href="/create" className="text-white/60 hover:text-white">Create Channel</Link></li>
                                <li><Link href="/rewards" className="text-white/60 hover:text-white">Rewards</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Resources</h4>
                            <ul className="space-y-2">
                                <li><Link href="/docs" className="text-white/60 hover:text-white">Documentation</Link></li>
                                <li><Link href="/help" className="text-white/60 hover:text-white">Help Center</Link></li>
                                <li><Link href="/blog" className="text-white/60 hover:text-white">Blog</Link></li>
                                <li><Link href="/developers" className="text-white/60 hover:text-white">Developer API</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Company</h4>
                            <ul className="space-y-2">
                                <li><Link href="/about" className="text-white/60 hover:text-white">About Us</Link></li>
                                <li><Link href="/careers" className="text-white/60 hover:text-white">Careers</Link></li>
                                <li><Link href="/contact" className="text-white/60 hover:text-white">Contact</Link></li>
                                <li><Link href="/press" className="text-white/60 hover:text-white">Press Kit</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
                        <p className="text-white/50 text-sm mb-4 md:mb-0">
                            &copy; {new Date().getFullYear()} KnowScroll. All rights reserved.
                        </p>
                        <div className="flex space-x-4">
                            <Link href="/terms" className="text-white/50 text-sm hover:text-white">Terms</Link>
                            <Link href="/privacy" className="text-white/50 text-sm hover:text-white">Privacy</Link>
                            <Link href="/community" className="text-white/50 text-sm hover:text-white">Community</Link>
                        </div>
                    </div>
                </div>
            </footer>

            <style jsx>{`
        @keyframes float-slow {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-7px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.7;
          }
          50% {
            opacity: 0.4;
          }
        }
        
        @keyframes rotate-slow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        
        @keyframes orbit {
          0% {
            transform: rotate(0deg) translateX(50px) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translateX(50px) rotate(-360deg);
          }
        }
        
        @keyframes float-token {
          0% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-15px) translateX(10px);
          }
          100% {
            transform: translateY(0) translateX(0);
          }
        }
        
        @keyframes vote-travel {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
          }
          20% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          80% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) translate(35px, 35px) scale(0.8);
          }
        }
        
        @keyframes slide-blockchain {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        
        @keyframes typing-cursor {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }
        
        @keyframes stream-left {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        
        @keyframes subtle-scroll {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-40%);
          }
        }
        
        .animate-orbit {
          animation: orbit linear infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        
        .animate-rotate-slow {
          animation: rotate-slow 20s linear infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s infinite;
        }
        
        .animate-typing-cursor::after {
          content: "|";
          animation: typing-cursor 1s infinite;
        }
        
        .animate-subtle-scroll {
          animation: subtle-scroll 15s linear infinite;
        }
        
        .shadow-glow {
          box-shadow: 0 0 25px rgba(55, 232, 255, 0.5);
        }
        
        .shadow-glow-sm {
          box-shadow: 0 0 15px rgba(55, 232, 255, 0.3);
        }
      `}</style>
        </div>
    );
}