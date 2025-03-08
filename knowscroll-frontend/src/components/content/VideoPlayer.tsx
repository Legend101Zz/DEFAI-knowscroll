"use client";

import React, { useRef, useEffect, useState } from 'react';

interface VideoPlayerProps {
    src?: string;
    isPlaying: boolean;
    playbackSpeed?: number;
    onTimeUpdate?: (progress: number) => void;
    onEnded?: () => void;
    className?: string;
    controls?: boolean;
    autoplay?: boolean;
    poster?: string;
}

export default function VideoPlayer({
    src,
    isPlaying,
    playbackSpeed = 1,
    onTimeUpdate,
    onEnded,
    className,
    controls = false,
    autoplay = false,
    poster
}: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Handle source changes
    useEffect(() => {
        setIsLoaded(false);
        setError(null);
    }, [src]);

    // Handle video loading
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleLoaded = () => {
            setIsLoaded(true);
            if (autoplay) {
                video.play().catch(err => {
                    console.error("Autoplay prevented:", err);
                    setError("Autoplay prevented");
                });
            }
        };

        const handleError = () => {
            setError("Video failed to load");
            console.error("Video failed to load");
        };

        video.addEventListener('loadeddata', handleLoaded);
        video.addEventListener('error', handleError);

        return () => {
            video.removeEventListener('loadeddata', handleLoaded);
            video.removeEventListener('error', handleError);
        };
    }, [src, autoplay]);

    // Handle play/pause state
    useEffect(() => {
        const video = videoRef.current;
        if (!video || !isLoaded) return;

        if (isPlaying) {
            video.play().catch(err => {
                console.error("Video play error:", err);
                setError("Video play error");
            });
        } else {
            video.pause();
        }
    }, [isPlaying, isLoaded]);

    // Handle playback speed
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        video.playbackRate = playbackSpeed;
    }, [playbackSpeed]);

    // Handle time updates
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleTimeUpdate = () => {
            if (onTimeUpdate && video.duration) {
                const progress = (video.currentTime / video.duration) * 100;
                onTimeUpdate(progress);
            }
        };

        const handleEnded = () => {
            if (onEnded) {
                onEnded();
            }
        };

        video.addEventListener('timeupdate', handleTimeUpdate);
        video.addEventListener('ended', handleEnded);

        return () => {
            video.removeEventListener('timeupdate', handleTimeUpdate);
            video.removeEventListener('ended', handleEnded);
        };
    }, [onTimeUpdate, onEnded]);

    return (
        <div className="relative w-full h-full">
            <video
                ref={videoRef}
                src={src}
                poster={poster}
                className={`${className} ${!isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
                playsInline
                loop
                muted
                controls={controls}
                preload="auto"
            />

            {!isLoaded && !error && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <div className="w-12 h-12 rounded-full border-4 border-white/30 border-t-white animate-spin"></div>
                </div>
            )}

            {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <div className="text-white text-center">
                        <svg className="w-10 h-10 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p>{error}</p>
                    </div>
                </div>
            )}
        </div>
    );
}