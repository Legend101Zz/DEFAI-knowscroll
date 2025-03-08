"use client";

import { useState } from 'react';
import Image from 'next/image';

interface FullScreenContentProps {
    content: {
        title: string;
        body: string;
        channelName: string;
        seriesTitle: string;
        episodeNumber: number;
        imageSrc: string;
    };
    onClose: () => void;
}

export default function FullScreenContent({ content, onClose }: FullScreenContentProps) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [progress, setProgress] = useState(0);

    return (
        <div className="fixed inset-0 bg-[#121218] z-50 flex flex-col">
            {/* Header */}
            <div className="p-4 flex justify-between items-center">
                <button
                    onClick={onClose}
                    className="text-white/70 hover:text-white"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <div className="text-white/70">{content.seriesTitle} • Episode {content.episodeNumber}</div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1 bg-white/10">
                <div
                    className="h-full bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A]"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
                {/* Hero image */}
                <div className="relative h-60 w-full">
                    <Image
                        src={content.imageSrc}
                        alt={content.title}
                        fill
                        style={{ objectFit: 'cover' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#121218]"></div>
                </div>

                {/* Text content */}
                <div className="p-6">
                    <h1 className="text-2xl font-bold mb-2">{content.title}</h1>
                    <div className="text-sm text-[#37E8FF] mb-4">{content.channelName}</div>
                    <div className="prose prose-invert max-w-none">
                        <p>{content.body}</p>
                    </div>
                </div>
            </div>

            {/* Bottom controls */}
            <div className="p-6 bg-gradient-to-t from-[#121218] to-transparent">
                <div className="flex justify-between items-center mb-4">
                    <button className="control-btn w-12 h-12 rounded-full flex items-center justify-center border border-[#A742FF]/30 bg-[#121218]/70">
                        <div className="w-10 h-10 rounded-full bg-[#A742FF]/20 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#A742FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </div>
                    </button>

                    <button className="control-btn w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A] p-[2px]">
                        <div className="w-full h-full rounded-full bg-[#121218] flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </button>

                    <button className="control-btn w-12 h-12 rounded-full flex items-center justify-center border border-[#37E8FF]/30 bg-[#121218]/70">
                        <div className="w-10 h-10 rounded-full bg-[#37E8FF]/20 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#37E8FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}