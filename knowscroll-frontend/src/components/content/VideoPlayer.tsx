"use client";

import React, { useRef, useEffect, useState } from 'react';

interface VideoPlayerProps {
    src?: string;
    isPlaying: boolean;
    onTimeUpdate?: (progress: number) => void;
    className?: string;
    controls?: boolean;
    autoplay?: boolean;
    poster?: string;
}

export default function VideoPlayer({
    src,
    isPlaying,
    onTimeUpdate,
    className,
    controls = false,
    autoplay = false,
    poster
}: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleLoaded = () => {
            setIsLoaded(true);
            if (autoplay) {
                video.play().catch(err => console.error("Autoplay prevented:", err));
            }
        };

        video.addEventListener('loadeddata', handleLoaded);

        return () => {
            video.removeEventListener('loadeddata', handleLoaded);
        };
    }, [src, autoplay]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !isLoaded) return;

        if (isPlaying) {
            video.play().catch(err => console.error("Video play error:", err));
        } else {
            video.pause();
        }
    }, [isPlaying, isLoaded]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleTimeUpdate = () => {
            if (onTimeUpdate && video.duration) {
                const progress = (video.currentTime / video.duration) * 100;
                onTimeUpdate(progress);
            }
        };

        video.addEventListener('timeupdate', handleTimeUpdate);

        return () => {
            video.removeEventListener('timeupdate', handleTimeUpdate);
        };
    }, [onTimeUpdate]);

    return (
        <video
            ref={videoRef}
            src={src}
            poster={poster}
            className={className}
            playsInline
            loop
            muted
            controls={controls}
            preload="auto"
        />
    );
}