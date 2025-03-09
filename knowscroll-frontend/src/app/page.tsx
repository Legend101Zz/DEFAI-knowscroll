"use client";

import { useState, useEffect, useRef } from 'react';
import AppNavBar from '@/components/layout/AppNavBar';
import Link from 'next/link';
import Image from 'next/image';

const HeroAnimation = () => {
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
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[#121218]"></div>

      {/* Animated gradient blobs that react to mouse movement */}
      <div
        className="absolute transition-transform duration-500 ease-out top-0 left-1/4 w-1/2 h-1/2 bg-[#37E8FF]/10 rounded-full filter blur-[100px]"
        style={{
          transform: `translate(${mousePosition.x * -20}px, ${mousePosition.y * -20}px)`
        }}
      ></div>
      <div
        className="absolute transition-transform duration-500 ease-out bottom-0 right-1/4 w-1/2 h-1/2 bg-[#FF3D8A]/10 rounded-full filter blur-[100px]"
        style={{
          transform: `translate(${mousePosition.x * 30}px, ${mousePosition.y * 30}px)`
        }}
      ></div>
      <div
        className="absolute transition-transform duration-500 ease-out top-1/4 right-1/4 w-1/3 h-1/3 bg-[#A742FF]/10 rounded-full filter blur-[80px]"
        style={{
          transform: `translate(${mousePosition.x * 15}px, ${mousePosition.y * 15}px)`
        }}
      ></div>

      {/* Digital lines/grid effect */}
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

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-30"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 6 + 1}px`,
              height: `${Math.random() * 6 + 1}px`,
              backgroundColor: i % 3 === 0 ? '#37E8FF' : i % 3 === 1 ? '#FF3D8A' : '#A742FF',
              animation: `float ${Math.random() * 10 + 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const countersInitialized = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Counter animation effect
  useEffect(() => {
    if (countersInitialized.current) return;

    const counterElements = document.querySelectorAll('.animate-counter');
    if (counterElements.length === 0) return;

    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseFloat(entry.target.getAttribute('data-target'));
          const duration = 5000; // Animation duration in milliseconds
          const frameDuration = 1000 / 60; // Assuming 60fps
          const totalFrames = Math.round(duration / frameDuration);
          let frame = 0;

          const isDecimal = target % 1 !== 0;
          const countToDecimal = isDecimal ? 1 : 0;

          const counter = setInterval(() => {
            frame++;

            const progress = frame / totalFrames;
            const currentCount = isDecimal
              ? (target * progress).toFixed(countToDecimal)
              : Math.round(target * progress);

            entry.target.textContent = currentCount;

            if (frame === totalFrames) {
              clearInterval(counter);
              entry.target.textContent = isDecimal ? target.toFixed(countToDecimal) : target;
            }
          }, frameDuration);

          observer.unobserve(entry.target);
        }
      });
    }, options);

    counterElements.forEach(element => {
      observer.observe(element);
    });

    countersInitialized.current = true;

    return () => {
      counterElements.forEach(element => {
        observer.unobserve(element);
      });
    };
  }, []);

  const testimonials = [
    {
      name: "Alex Chen",
      role: "Channel Stakeholder",
      content: "I've always loved scrolling, but felt guilty about wasting time. With KnowScroll, I learn something new with every swipe and even earn from it!",
      avatar: "/images/person3.jpg"
    },
    {
      name: "Sofia Garcia",
      role: "Content Creator",
      content: "Setting up my AI channel was simple. Now I curate the direction while AI does the heavy lifting, and stakeholders help govern content strategy.",
      avatar: "/images/person1.jpg"
    },
    {
      name: "Mark Johnson",
      role: "Daily User",
      content: "The dual navigation is brilliant. I can follow a deep series about topics I care about, or swipe for variety. No more mindless scrolling.",
      avatar: "/images/person2.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-[#121218] text-white relative">
      <HeroAnimation />
      <AppNavBar />

      <main className="max-w-screen-xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center md:justify-between py-16 md:py-24">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <div className="relative z-10">
              <div className="inline-flex items-center px-3 py-1 mb-6 text-sm rounded-full bg-[#1A1A24]/80 backdrop-blur-sm border border-[#37E8FF]/20">
                <div className="w-2 h-2 rounded-full bg-[#37E8FF] mr-2 animate-pulse"></div>
                <span className="text-white/80">Powered by Sonic Blockchain</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A]">
                  Transform
                </span> Your Scrolling Into{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF3D8A] to-[#A742FF]">
                  Value & Knowledge
                </span>
              </h1>
              <p className="text-lg text-white/70 mb-8 max-w-lg">
                The first guilt-free social media platform where AI-generated content meets
                decentralized ownership. Learn with every swipe, earn with every view.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/explore"
                  className="bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A] text-white px-8 py-4 rounded-full font-medium text-lg hover:shadow-glow transition-all text-center"
                >
                  Start Exploring
                </Link>
                <Link
                  href="/learn-more"
                  className="border border-white/20 hover:border-white/40 text-white px-8 py-4 rounded-full font-medium text-lg transition-all text-center"
                >
                  How It Works
                </Link>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 relative h-[400px] md:h-[500px]">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#37E8FF]/20 to-[#FF3D8A]/20 rounded-2xl backdrop-blur-sm border border-white/10 animate-pulse-slow"></div>

            {/* Sonic Chain Decoration */}
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-[#1A1A24] px-4 py-2 rounded-full border border-[#37E8FF]/30 shadow-glow-sm z-10 flex items-center space-x-2">
              <div className="w-2 h-2 bg-[#37E8FF] rounded-full animate-pulse"></div>
              <span className="text-xs font-medium bg-clip-text text-transparent bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A]">
                Powered by Sonic Blockchain
              </span>
            </div>

            {/* Interactive Phone Mockup */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[280px] h-[560px] bg-[#0A0A10] rounded-[32px] border-4 border-[#1A1A24] overflow-hidden shadow-lg rotate-0 hover:rotate-1 transition-all duration-700">
              {/* Phone notch */}
              <div className="absolute top-0 left-0 right-0 h-8 bg-[#1A1A24] rounded-t-[28px] flex items-center justify-center">
                <div className="w-16 h-4 bg-[#0A0A10] rounded-full"></div>
              </div>

              {/* Phone screen content */}
              <div className="absolute top-8 bottom-0 left-0 right-0 overflow-hidden">
                <div className="relative w-full h-full">
                  {/* Screen content with animation */}
                  <div className="absolute inset-0 transition-all duration-700 animate-float">
                    <div className="relative h-full overflow-hidden">
                      {/* Content */}
                      <div className="absolute inset-0 h-full w-full">
                        <Image
                          src="/images/demo.png"
                          alt="App Preview"
                          width={280}
                          height={560}
                          className="object-cover animate-zoom-slow"
                        />

                        {/* Navigation help overlays */}
                        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1 text-[10px] text-white/80 border border-white/20 animate-fadeIn animate-fadeOut">
                          Swipe directions to navigate
                        </div>

                        {/* Swipe indicators - horizontal (topics) */}
                        <div className="absolute inset-x-0 top-1/2 flex justify-between items-center px-2 opacity-50 animate-pulse-slow">
                          <div className="p-1 rounded-full bg-white/20 flex flex-col items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span className="text-[8px] mt-1">New Topics</span>
                          </div>
                          <div className="p-1 rounded-full bg-white/20 flex flex-col items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            <span className="text-[8px] mt-1">New Topics</span>
                          </div>
                        </div>

                        {/* Swipe indicators - vertical (series) */}
                        <div className="absolute inset-y-0 right-0 flex flex-col justify-center items-center px-2 opacity-50 animate-pulse-slow">
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

                        <div className="absolute inset-0 bg-gradient-to-t from-[#121218] to-transparent"></div>

                        {/* Content info */}
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <div className="bg-[#1A1A24]/70 backdrop-blur-md rounded-lg p-4 border border-white/10 transform transition-transform duration-700 hover:translate-y-1">
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="text-sm font-medium">The Science of Black Holes</h3>
                              <div className="h-6 w-6 rounded-full bg-[#FF3D8A]/20 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-[#FF3D8A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                              </div>
                            </div>
                            <p className="text-xs text-white/70">Swipe up to continue this journey through astrophysics...</p>

                            {/* Progress bar */}
                            <div className="mt-3 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A] rounded-full animate-progress" style={{ width: '65%' }}></div>
                            </div>

                            {/* NFT ownership indicator */}
                            <div className="mt-3 flex items-center justify-between">
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

                      {/* Notification animations */}
                      <div className="absolute top-4 right-4 flex flex-col items-end space-y-2">
                        <div className="bg-[#1A1A24]/80 backdrop-blur-md rounded-lg p-2 border border-[#37E8FF]/20 transform translate-x-full animate-slide-in-delayed">
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] text-white/70">Revenue earned: 0.002 S</span>
                            <div className="h-3 w-3 rounded-full bg-[#37E8FF]/20 flex items-center justify-center">
                              <div className="h-1 w-1 rounded-full bg-[#37E8FF]"></div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-[#1A1A24]/80 backdrop-blur-md rounded-lg p-2 border border-[#A742FF]/20 transform translate-x-full animate-slide-in">
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] text-white/70">New series added!</span>
                            <div className="h-3 w-3 rounded-full bg-[#A742FF]/20 flex items-center justify-center">
                              <div className="h-1 w-1 rounded-full bg-[#A742FF]"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Blockchain transaction indicators */}
              <div className="absolute -right-12 top-1/4 flex flex-col space-y-2 opacity-80">
                <div className="flex items-center space-x-2 animate-slide-in-right">
                  <div className="w-8 h-8 rounded-full bg-[#37E8FF]/10 border border-[#37E8FF]/30 flex items-center justify-center text-[#37E8FF] text-xs">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="bg-[#1A1A24]/80 px-2 py-1 rounded text-[10px] whitespace-nowrap border border-[#37E8FF]/20">
                    Transaction confirmed
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative sonic logo */}
            <div className="absolute -bottom-6 right-1/4 transform rotate-12 opacity-50">
              <svg className="h-12 w-12" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 95C74.8528 95 95 74.8528 95 50C95 25.1472 74.8528 5 50 5C25.1472 5 5 25.1472 5 50C5 74.8528 25.1472 95 50 95Z" stroke="url(#paint0_linear)" strokeWidth="2" />
                <path d="M36 36L64 64" stroke="url(#paint1_linear)" strokeWidth="3" strokeLinecap="round" />
                <path d="M36 64L64 36" stroke="url(#paint2_linear)" strokeWidth="3" strokeLinecap="round" />
                <defs>
                  <linearGradient id="paint0_linear" x1="5" y1="50" x2="95" y2="50" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#37E8FF" />
                    <stop offset="1" stopColor="#FF3D8A" />
                  </linearGradient>
                  <linearGradient id="paint1_linear" x1="36" y1="50" x2="64" y2="50" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#37E8FF" />
                    <stop offset="1" stopColor="#FF3D8A" />
                  </linearGradient>
                  <linearGradient id="paint2_linear" x1="36" y1="50" x2="64" y2="50" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FF3D8A" />
                    <stop offset="1" stopColor="#37E8FF" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <style jsx>{`
              @keyframes pulse-slow {
                0%, 100% {
                  opacity: 0.7;
                }
                50% {
                  opacity: 0.4;
                }
              }
              @keyframes zoom-slow {
                0% {
                  transform: scale(1);
                }
                50% {
                  transform: scale(1.05);
                }
                100% {
                  transform: scale(1);
                }
              }
              @keyframes float {
                0% {
                  transform: translateY(0px);
                }
                50% {
                  transform: translateY(-10px);
                }
                100% {
                  transform: translateY(0px);
                }
              }
              @keyframes progress {
                0% {
                  width: 0%;
                }
                100% {
                  width: 65%;
                }
              }
              @keyframes slide-in {
                0%, 20% {
                  transform: translateX(100%);
                  opacity: 0;
                }
                100% {
                  transform: translateX(0);
                  opacity: 1;
                }
              }
              @keyframes slide-in-delayed {
                0%, 50% {
                  transform: translateX(100%);
                  opacity: 0;
                }
                100% {
                  transform: translateX(0);
                  opacity: 1;
                }
              }
              @keyframes slide-in-right {
                0%, 70% {
                  transform: translateX(50px);
                  opacity: 0;
                }
                100% {
                  transform: translateX(0);
                  opacity: 1;
                }
              }
              @keyframes fadeIn {
                0% {
                  opacity: 0;
                }
                100% {
                  opacity: 1;
                }
              }
              @keyframes fadeOut {
                0%, 70% {
                  opacity: 1;
                }
                100% {
                  opacity: 0;
                }
              }
              .animate-pulse-slow {
                animation: pulse-slow 3s infinite;
              }
              .animate-zoom-slow {
                animation: zoom-slow 15s infinite;
              }
              .animate-float {
                animation: float 6s ease-in-out infinite;
              }
              .animate-progress {
                animation: progress 8s ease-out forwards;
              }
              .animate-slide-in {
                animation: slide-in 2s forwards;
              }
              .animate-slide-in-delayed {
                animation: slide-in-delayed 3s forwards;
              }
              .animate-slide-in-right {
                animation: slide-in-right 2s 1s forwards;
              }
              .animate-fadeIn {
                animation: fadeIn 0.5s forwards;
              }
              .animate-fadeOut {
                animation: fadeOut 4s forwards 2s;
              }
              .shadow-glow-sm {
                box-shadow: 0 0 15px rgba(55, 232, 255, 0.3);
              }
            `}</style>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-12 md:py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A]">
                Not Just Another Social Platform
              </span>
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              KnowScroll reimagines social media with a focus on enrichment, ownership, and guilt-free enjoyment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="content-card p-6 border border-white/10 rounded-2xl hover:border-[#37E8FF]/30 transition-all group">
              <div className="w-14 h-14 rounded-full bg-[#37E8FF]/10 border border-[#37E8FF]/20 flex items-center justify-center mb-6 group-hover:bg-[#37E8FF]/20 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#37E8FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-[#37E8FF] transition-colors">AI-Generated Content</h3>
              <p className="text-white/70">
                Quality microlearning created by autonomous AI agents, ensuring you always have something interesting and educational.
              </p>
            </div>

            <div className="content-card p-6 border border-white/10 rounded-2xl hover:border-[#FF3D8A]/30 transition-all group">
              <div className="w-14 h-14 rounded-full bg-[#FF3D8A]/10 border border-[#FF3D8A]/20 flex items-center justify-center mb-6 group-hover:bg-[#FF3D8A]/20 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#FF3D8A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-[#FF3D8A] transition-colors">Dual Navigation</h3>
              <p className="text-white/70">
                Swipe up/down to continue in a series or left/right to discover new topics. Navigate content on your own terms.
              </p>
            </div>

            <div className="content-card p-6 border border-white/10 rounded-2xl hover:border-[#A742FF]/30 transition-all group">
              <div className="w-14 h-14 rounded-full bg-[#A742FF]/10 border border-[#A742FF]/20 flex items-center justify-center mb-6 group-hover:bg-[#A742FF]/20 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#A742FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-[#A742FF] transition-colors">Earn While You Learn</h3>
              <p className="text-white/70">
                Own shares in your favorite channels and earn revenue as they grow in popularity through fractional NFT ownership.
              </p>
            </div>
          </div>
        </div>

        {/* Sonic Blockchain Integration Section */}
        <div className="py-12 md:py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#121218] via-[#1A1A24] to-[#121218] opacity-70"></div>
          <div className="relative max-w-screen-xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-2/5">
                <div className="rounded-2xl bg-[#1A1A24]/60 backdrop-blur-sm border border-[#37E8FF]/10 p-6 md:p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-[#37E8FF]/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>

                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#37E8FF] to-[#FF3D8A] p-0.5 mr-4">
                      <div className="w-full h-full rounded-full bg-[#1A1A24] flex items-center justify-center">
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="url(#sonic_gradient)" strokeWidth="1.5" />
                          <path d="M7.5 12H16.5" stroke="url(#sonic_gradient)" strokeWidth="1.5" strokeLinecap="round" />
                          <path d="M15 8L19 12L15 16" stroke="url(#sonic_gradient)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <defs>
                            <linearGradient id="sonic_gradient" x1="2" y1="12" x2="22" y2="12" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#37E8FF" />
                              <stop offset="1" stopColor="#FF3D8A" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A]">
                      Powered by Sonic
                    </h3>
                  </div>

                  <p className="text-white/70 mb-6">
                    KnowScroll leverages the ultra-fast Sonic blockchain with 10,000 TPS and sub-second finality, ensuring seamless revenue distribution, smooth ownership transfers, and lightning-fast content interactions.
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-[#121218]/50 rounded-lg p-4 border border-white/5">
                      <div className="text-2xl font-bold text-white mb-1">10,000</div>
                      <div className="text-xs text-white/50">Transactions Per Second</div>
                    </div>
                    <div className="bg-[#121218]/50 rounded-lg p-4 border border-white/5">
                      <div className="text-2xl font-bold text-white mb-1">&lt;1s</div>
                      <div className="text-xs text-white/50">Transaction Finality</div>
                    </div>
                  </div>

                  <Link href="/sonic-integration" className="inline-flex items-center text-sm text-[#37E8FF] hover:text-white transition-colors">
                    Learn about our Sonic integration
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>

              <div className="md:w-3/5">
                <div className="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden border border-white/10">
                  <div className="absolute inset-0 bg-[#121218]"></div>

                  {/* Blockchain visualization */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute inset-0 flex flex-col">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="py-2 flex animate-slide-blockchain" style={{
                          animationDuration: `${10 + i * 2}s`,
                          animationDelay: `${i * 0.5}s`
                        }}>
                          {Array.from({ length: 8 }).map((_, j) => (
                            <div
                              key={j}
                              className="mx-1 px-2 py-1 rounded bg-[#1A1A24] border border-white/5 flex items-center text-xs whitespace-nowrap"
                              style={{ opacity: Math.random() * 0.3 + 0.3 }}
                            >
                              <div className="w-2 h-2 rounded-full mr-1" style={{
                                backgroundColor: j % 3 === 0 ? '#37E8FF' : j % 3 === 1 ? '#FF3D8A' : '#A742FF',
                                opacity: 0.7
                              }}></div>
                              0x{Math.random().toString(16).substring(2, 10)}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>

                    {/* Transaction highlights */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative w-80 h-60">
                        <div className="absolute animate-fade-in-up" style={{ top: '20%', left: '10%', animationDelay: '0.5s' }}>
                          <div className="bg-[#1A1A24]/90 backdrop-blur-sm rounded-lg p-3 border border-[#37E8FF]/30 shadow-glow-sm">
                            <div className="flex items-center text-[#37E8FF] text-xs mb-1">
                              <svg className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" />
                                <path d="M16 12L8 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                <path d="M12 8L8 12L12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                              Revenue Transfer
                            </div>
                            <div className="text-white text-xs">0.042 S to Channel Owners</div>
                          </div>
                        </div>

                        <div className="absolute animate-fade-in-up" style={{ top: '50%', right: '5%', animationDelay: '1.5s' }}>
                          <div className="bg-[#1A1A24]/90 backdrop-blur-sm rounded-lg p-3 border border-[#FF3D8A]/30 shadow-glow-pink">
                            <div className="flex items-center text-[#FF3D8A] text-xs mb-1">
                              <svg className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                              NFT Acquisition
                            </div>
                            <div className="text-white text-xs">User bought 2.5% stake</div>
                          </div>
                        </div>

                        <div className="absolute animate-fade-in-up" style={{ bottom: '10%', left: '30%', animationDelay: '2.5s' }}>
                          <div className="bg-[#1A1A24]/90 backdrop-blur-sm rounded-lg p-3 border border-[#A742FF]/30 shadow-glow-purple">
                            <div className="flex items-center text-[#A742FF] text-xs mb-1">
                              <svg className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" />
                                <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                              </svg>
                              Content Governance
                            </div>
                            <div className="text-white text-xs">Proposal approved (82%)</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121218] via-transparent to-[#121218]"></div>
                  </div>

                  {/* Style for blockchain animation */}
                  <style jsx>{`
                    @keyframes slide-blockchain {
                      0% {
                        transform: translateX(100%);
                      }
                      100% {
                        transform: translateX(-100%);
                      }
                    }
                    
                    @keyframes fade-in-up {
                      0% {
                        opacity: 0;
                        transform: translateY(10px);
                      }
                      10%, 90% {
                        opacity: 1;
                        transform: translateY(0);
                      }
                      100% {
                        opacity: 0;
                        transform: translateY(-10px);
                      }
                    }
                    
                    .animate-slide-blockchain {
                      animation: slide-blockchain linear infinite;
                    }
                    
                    .animate-fade-in-up {
                      animation: fade-in-up 8s ease-in-out infinite;
                    }
                    
                    .shadow-glow-pink {
                      box-shadow: 0 0 15px rgba(255, 61, 138, 0.3);
                    }
                    
                    .shadow-glow-purple {
                      box-shadow: 0 0 15px rgba(167, 66, 255, 0.3);
                    }
                  `}</style>
                </div>
              </div>
            </div>

            {/* Blockchain stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-[#1A1A24]/30 backdrop-blur-md rounded-lg p-4 border border-white/5 text-center">
                <div className="text-3xl font-bold text-white mb-1 bg-clip-text text-transparent bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A]">
                  <span className="animate-counter" data-target="147">0</span>
                </div>
                <div className="text-xs text-white/50">Active AI Channels</div>
              </div>
              <div className="bg-[#1A1A24]/30 backdrop-blur-md rounded-lg p-4 border border-white/5 text-center">
                <div className="text-3xl font-bold text-white mb-1 bg-clip-text text-transparent bg-gradient-to-r from-[#FF3D8A] to-[#A742FF]">
                  <span className="animate-counter" data-target="4.8">0</span>M
                </div>
                <div className="text-xs text-white/50">Content Views</div>
              </div>
              <div className="bg-[#1A1A24]/30 backdrop-blur-md rounded-lg p-4 border border-white/5 text-center">
                <div className="text-3xl font-bold text-white mb-1 bg-clip-text text-transparent bg-gradient-to-r from-[#A742FF] to-[#37E8FF]">
                  <span className="animate-counter" data-target="86.4">0</span>K
                </div>
                <div className="text-xs text-white/50">Transactions</div>
              </div>
              <div className="bg-[#1A1A24]/30 backdrop-blur-md rounded-lg p-4 border border-white/5 text-center">
                <div className="text-3xl font-bold text-white mb-1 bg-clip-text text-transparent bg-gradient-to-r from-[#37E8FF] to-[#A742FF]">
                  <span className="animate-counter" data-target="325">0</span>
                </div>
                <div className="text-xs text-white/50">Channel Shareholders</div>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="py-12 md:py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#37E8FF] to-[#A742FF]">
                How KnowScroll Works
              </span>
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              A revolutionary platform combining AI content creation, Web3 ownership, and guilt-free scrolling.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="order-2 md:order-1">
              <div className="bg-[#1A1A24] p-6 rounded-2xl border border-white/10 mb-6">
                <div className="flex items-start mb-4">
                  <div className="w-8 h-8 rounded-full bg-[#37E8FF]/20 flex items-center justify-center mr-4 shrink-0">
                    <span className="text-[#37E8FF] font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">AI-Generated Content</h3>
                    <p className="text-white/70">
                      Advanced AI agents create engaging, educational content customized based on stakeholder direction and user preferences.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[#1A1A24] p-6 rounded-2xl border border-white/10 mb-6">
                <div className="flex items-start mb-4">
                  <div className="w-8 h-8 rounded-full bg-[#FF3D8A]/20 flex items-center justify-center mr-4 shrink-0">
                    <span className="text-[#FF3D8A] font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Fractional Ownership</h3>
                    <p className="text-white/70">
                      Purchase shares in AI channels as NFTs. Stakeholders influence content direction and share in the revenue generated.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[#1A1A24] p-6 rounded-2xl border border-white/10">
                <div className="flex items-start mb-4">
                  <div className="w-8 h-8 rounded-full bg-[#A742FF]/20 flex items-center justify-center mr-4 shrink-0">
                    <span className="text-[#A742FF] font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Revenue Distribution</h3>
                    <p className="text-white/70">
                      Smart contracts automatically distribute ad revenue and engagement rewards to channel owners based on their stake.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Channel Card */}
            <div className="order-1 md:order-2 flex justify-center">
              <div className="relative w-full max-w-md transform transition-all hover:scale-105 duration-500">
                {/* Glow effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A] rounded-lg blur opacity-30 animate-pulse-slow"></div>

                {/* Card content */}
                <div className="relative bg-[#1A1A24] p-6 rounded-lg border border-white/10">
                  <div className="space-y-4">
                    {/* Channel header with floating badge */}
                    <div className="relative">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white group-hover:text-[#37E8FF] transition-colors">
                          Channel: Cosmic Wonders
                        </h3>
                        <div className="px-3 py-1 bg-[#37E8FF]/20 rounded-full text-[#37E8FF] text-xs font-medium animate-pulse-slow">
                          History & Space
                        </div>
                      </div>

                      {/* Decorative particles */}
                      <div className="absolute -top-2 -right-2 w-2 h-2 rounded-full bg-[#37E8FF]/50"></div>
                      <div className="absolute -top-1 -left-1 w-1 h-1 rounded-full bg-[#FF3D8A]/50"></div>
                    </div>

                    {/* Stakeholder progress */}
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white/70">Total Stakeholders</span>
                        <span className="font-medium animate-counter" data-target="487">0</span>
                      </div>
                      <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A] h-full rounded-full animate-progress" style={{ width: '70%' }}></div>
                      </div>
                    </div>

                    {/* Revenue metrics */}
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="bg-[#121218]/50 rounded-lg p-3 border border-white/5 group hover:border-[#37E8FF]/30 transition-all">
                        <div className="text-sm text-white/70 mb-1">24h Revenue</div>
                        <div className="text-lg font-bold text-white group-hover:text-[#37E8FF] transition-colors">1.24 S</div>
                      </div>
                      <div className="bg-[#121218]/50 rounded-lg p-3 border border-white/5 group hover:border-[#FF3D8A]/30 transition-all">
                        <div className="text-sm text-white/70 mb-1">Available Shares</div>
                        <div className="text-lg font-bold text-white group-hover:text-[#FF3D8A] transition-colors">23/100</div>
                      </div>
                    </div>

                    <hr className="border-white/10 my-6" />

                    {/* Current series info */}
                    <div className="bg-[#121218] p-4 rounded-lg border border-white/5 transform transition-all hover:translate-y-1 hover:shadow-lg hover:border-[#A742FF]/20 duration-300">
                      <h4 className="font-medium mb-2 text-white flex items-center">
                        <svg className="w-4 h-4 mr-2 text-[#A742FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                        </svg>
                        Current Series
                      </h4>
                      <p className="text-white/70 text-sm">Origins of the Universe: From Big Bang to Black Holes</p>
                      <div className="mt-4 flex justify-between text-xs text-white/50">
                        <div className="flex items-center">
                          <svg className="w-3 h-3 mr-1 text-[#37E8FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          <span>Episodes: 12/20</span>
                        </div>
                        <div className="flex items-center">
                          <svg className="w-3 h-3 mr-1 text-[#FF3D8A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span>Avg. Watch: 92%</span>
                        </div>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <button className="w-full mt-4 bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A] text-white py-3 rounded-lg font-medium hover:shadow-glow transition-all relative overflow-hidden group"
                      onClick={() => window.location.href = '/marketplace'}>
                      <span className="relative z-10">Acquire Shares</span>
                      <div className="absolute inset-0 h-full w-0 bg-gradient-to-r from-[#A742FF] to-[#FF3D8A] transition-all duration-300 group-hover:w-full"></div>
                    </button>

                    {/* Blockchain info */}
                    <div className="flex items-center justify-between text-xs text-white/50 mt-2">
                      <div className="flex items-center">
                        <svg className="w-3 h-3 mr-1 text-[#37E8FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>1,483 Transactions</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-3 h-3 mr-1 text-[#37E8FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span>Verified on Sonic</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="py-12 md:py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF3D8A] to-[#37E8FF]">
                Community Voices
              </span>
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Hear from people who have transformed their scrolling habits and found value on KnowScroll.
            </p>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden h-[280px] md:h-[220px]">
              <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="w-full shrink-0 px-4">
                    <div className="bg-[#1A1A24] p-8 rounded-2xl border border-white/10 h-full flex flex-col justify-between group hover:border-[#37E8FF]/30 transition-all">
                      <p className="text-white/80 mb-6">"{testimonial.content}"</p>
                      <div className="flex items-center">
                        <Image
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          width={48}
                          height={48}
                          className="rounded-full mr-4 border-2 border-transparent group-hover:border-[#37E8FF]/50 transition-all"
                        />
                        <div>
                          <h4 className="font-bold">{testimonial.name}</h4>
                          <p className="text-sm text-white/60">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${currentSlide === index
                    ? "bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A] w-8"
                    : "bg-white/20"
                    }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="py-16 md:py-24">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#37E8FF]/20 via-[#FF3D8A]/20 to-[#A742FF]/20"></div>
            <div className="absolute inset-0 backdrop-blur-sm"></div>
            <div className="relative z-10 py-16 px-8 md:py-20 flex flex-col items-center text-center">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 max-w-3xl">
                Ready to Make Your Scrolling Time{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A]">
                  Meaningful?
                </span>
              </h2>
              <p className="text-lg text-white/70 mb-10 max-w-2xl">
                Join KnowScroll today and transform your daily habit into a source of knowledge,
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
        </div>
      </main >

      <footer className="border-t border-white/10 py-12">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A]">KnowScroll</h3>
              <p className="text-white/60 text-sm">
                Redefining social media with AI-generated content and decentralized ownership.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Platform</h4>
              <ul className="space-y-2">
                <li><Link href="/explore" className="text-white/60 hover:text-white">Explore</Link></li>
                <li><Link href="/marketplace" className="text-white/60 hover:text-white">Marketplace</Link></li>
                <li><Link href="/create" className="text-white/60 hover:text-white">Create Channel</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link href="/docs" className="text-white/60 hover:text-white">Documentation</Link></li>
                <li><Link href="/help" className="text-white/60 hover:text-white">Help Center</Link></li>
                <li><Link href="/blog" className="text-white/60 hover:text-white">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-white/60 hover:text-white">About Us</Link></li>
                <li><Link href="/careers" className="text-white/60 hover:text-white">Careers</Link></li>
                <li><Link href="/contact" className="text-white/60 hover:text-white">Contact</Link></li>
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
    </div >
  );
}