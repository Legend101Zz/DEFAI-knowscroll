import React from 'react';

interface VideoSegment {
    id?: string;
    title: string;
    description?: string;
    videoUrl?: string;
    thumbnailUrl?: string;
    script?: string;
    duration?: number;
    feedback?: string;
    approved?: boolean;
}

interface VideoReviewTimelineProps {
    segments: VideoSegment[];
    currentIndex: number;
    onSelectSegment: (index: number) => void;
}

const VideoReviewTimeline: React.FC<VideoReviewTimelineProps> = ({
    segments,
    currentIndex,
    onSelectSegment
}) => {
    return (
        <div className="bg-[#1A1A24]/80 backdrop-blur-sm p-4 border-t border-white/10">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-medium">Video Segments</h3>
                <div className="text-white/60 text-sm">
                    {currentIndex + 1} of {segments.length}
                </div>
            </div>

            {/* Timeline visualization */}
            <div className="relative mb-6">
                <div className="h-1 bg-white/10 rounded-full w-full absolute top-1/2 transform -translate-y-1/2"></div>

                <div className="flex justify-between relative z-10">
                    {segments.map((segment, index) => (
                        <button
                            key={segment.id || index}
                            onClick={() => onSelectSegment(index)}
                            className={`w-4 h-4 rounded-full flex-shrink-0 transition-all transform ${index < currentIndex
                                    ? 'bg-[#A742FF]'
                                    : index === currentIndex
                                        ? 'bg-[#37E8FF] ring-4 ring-[#37E8FF]/20 scale-125'
                                        : 'bg-white/30'
                                }`}
                            aria-label={`View segment ${index + 1}: ${segment.title}`}
                        />
                    ))}
                </div>
            </div>

            {/* Segment labels */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {segments.map((segment, index) => (
                    <button
                        key={segment.id || index}
                        onClick={() => onSelectSegment(index)}
                        className={`text-left p-2 rounded-lg transition-colors ${index === currentIndex
                                ? 'bg-[#37E8FF]/10 border border-[#37E8FF]/30'
                                : 'hover:bg-white/5'
                            }`}
                    >
                        <div className="flex items-center">
                            <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 flex-shrink-0 ${index === currentIndex ? 'bg-[#37E8FF]' : 'bg-white/10'
                                    }`}
                            >
                                {index + 1}
                            </div>
                            <div className="truncate text-sm">
                                {segment.title}
                            </div>

                            {segment.approved !== undefined && (
                                <div className="ml-2 flex-shrink-0">
                                    {segment.approved === true ? (
                                        <div className="w-3 h-3 rounded-full bg-green-500" title="Approved"></div>
                                    ) : segment.approved === false ? (
                                        <div className="w-3 h-3 rounded-full bg-red-500" title="Rejected"></div>
                                    ) : (
                                        <div className="w-3 h-3 rounded-full bg-yellow-500" title="Undecided"></div>
                                    )}
                                </div>
                            )}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default VideoReviewTimeline;