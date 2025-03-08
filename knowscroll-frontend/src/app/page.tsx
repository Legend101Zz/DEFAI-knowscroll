
"use client";

import Link from 'next/link';
import Image from 'next/image';
import AppNavBar from '@/components/layout/AppNavBar';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#121218] text-white">
      <AppNavBar />

      <main className="max-w-screen-lg mx-auto px-4 py-8">
        <div className="flex flex-col items-center text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="text-[#37E8FF]">Transform</span> Your{" "}
            <span className="text-[#FF3D8A]">Scrolling</span> Habit
          </h1>

          <p className="text-lg text-white/70 max-w-2xl mb-8">
            Turn mindless scrolling into enlightening moments. Learn something new with every swipe.
          </p>

          <Link
            href="/explore"
            className="bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A] text-white px-8 py-4 rounded-full font-medium text-lg hover:shadow-glow transition-all"
          >
            Start Exploring
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="content-card p-6">
            <div className="w-12 h-12 rounded-full bg-[#37E8FF]/20 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#37E8FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">AI-Generated Content</h3>
            <p className="text-white/70">
              Quality content created by autonomous AI agents, ensuring you always have something interesting to explore.
            </p>
          </div>

          <div className="content-card p-6">
            <div className="w-12 h-12 rounded-full bg-[#FF3D8A]/20 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#FF3D8A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Dual Navigation</h3>
            <p className="text-white/70">
              Swipe up/down to continue in a series, or left/right to discover new topics and expand your knowledge.
            </p>
          </div>

          <div className="content-card p-6">
            <div className="w-12 h-12 rounded-full bg-[#A742FF]/20 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#A742FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Earn While You Learn</h3>
            <p className="text-white/70">
              Own shares in your favorite channels and earn revenue as they grow in popularity on the platform.
            </p>
          </div>
        </div>

        {/* Preview image */}
        <div className="relative h-[500px] w-full rounded-xl overflow-hidden mb-12">
          <Image
            src="https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?q=80&w=1200"
            alt="App Preview"
            fill
            style={{ objectFit: 'cover' }}
            className="brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121218] to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <h2 className="text-2xl font-bold mb-2">Start Your Journey Today</h2>
            <p className="text-white/70 mb-4">
              Transform your daily scrolling habit into valuable knowledge with KnowScroll
            </p>
            <Link
              href="/explore"
              className="bg-white text-[#121218] px-6 py-3 rounded-full font-medium hover:bg-[#37E8FF]"
            >
              Explore Content
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/10 py-8">
        <div className="max-w-screen-lg mx-auto px-4 text-center text-white/50">
          &copy; {new Date().getFullYear()} KnowScroll. All rights reserved.
        </div>
      </footer>
    </div>
  );
}