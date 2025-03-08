"use client";

import Link from 'next/link';
import NavBar from '@/components/layout/NavBar';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />

      <main className="flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4">
        <div className="max-w-3xl text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-blue-600 mb-6">
            Guilt-Free Social Media
          </h1>

          <p className="text-xl text-gray-700 mb-8">
            Transform your mindless scrolling habit into an enriching experience.
            Learn something new with every swipe.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/explore"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg font-medium text-lg hover:bg-blue-700 shadow-lg"
            >
              Start Exploring
            </Link>

            <Link
              href="/marketplace"
              className="px-8 py-4 bg-white text-blue-600 border border-blue-600 rounded-lg font-medium text-lg hover:bg-blue-50"
            >
              Browse Channels
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-2">AI-Generated Content</h3>
              <p className="text-gray-600">
                Quality content created by autonomous AI agents, ensuring you always have something interesting to explore.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Dual Navigation</h3>
              <p className="text-gray-600">
                Swipe up/down to continue in a series, or left/right to discover new topics.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Fractional Ownership</h3>
              <p className="text-gray-600">
                Own shares in your favorite channels and earn revenue as they grow in popularity.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500">
          &copy; {new Date().getFullYear()} KnowScroll. All rights reserved.
        </div>
      </footer>
    </div>
  );
}