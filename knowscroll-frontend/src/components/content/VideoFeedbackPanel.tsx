import React, { useState, useEffect } from 'react';

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

interface VideoFeedbackPanelProps {
    segment: VideoSegment;
    onSaveFeedback: (segmentId: string, feedback: string, approved?: boolean) => void;
    readOnly?: boolean;
}

const VideoFeedbackPanel: React.FC<VideoFeedbackPanelProps> = ({
    segment,
    onSaveFeedback,
    readOnly = false
}) => {
    const [feedback, setFeedback] = useState(segment.feedback || '');
    const [approved, setApproved] = useState<boolean | undefined>(segment.approved);
    const [isEditing, setIsEditing] = useState(!segment.feedback);

    useEffect(() => {
        setFeedback(segment.feedback || '');
        setApproved(segment.approved);
        setIsEditing(!segment.feedback);
    }, [segment]);

    const handleSave = () => {
        onSaveFeedback(segment.id || segment.title, feedback, approved);
        setIsEditing(false);
    };

    return (
        <div className="bg-[#121218] rounded-lg p-4 border border-white/10">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">Feedback</h3>

                {!readOnly && (
                    <div>
                        {isEditing ? (
                            <button
                                onClick={handleSave}
                                className="px-3 py-1 bg-[#37E8FF]/20 text-[#37E8FF] rounded-md text-sm hover:bg-[#37E8FF]/30 transition-colors"
                            >
                                Save Feedback
                            </button>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-3 py-1 bg-white/10 text-white rounded-md text-sm hover:bg-white/20 transition-colors"
                            >
                                Edit Feedback
                            </button>
                        )}
                    </div>
                )}
            </div>

            {isEditing && !readOnly ? (
                <div className="space-y-4">
                    <div>
                        <textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Provide your feedback for this video segment..."
                            className="w-full h-32 bg-[#1A1A24] border border-white/10 rounded-lg p-3 text-white placeholder-white/40 focus:outline-none focus:border-[#37E8FF]/50"
                        />
                    </div>

                    <div className="flex items-center space-x-4">
                        <span className="text-white/70">Approve this segment?</span>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setApproved(true)}
                                className={`px-3 py-1 rounded-md text-sm transition-colors ${approved === true
                                        ? 'bg-green-500/20 text-green-500 border border-green-500/50'
                                        : 'bg-white/10 text-white hover:bg-white/20'
                                    }`}
                            >
                                Approve
                            </button>
                            <button
                                onClick={() => setApproved(false)}
                                className={`px-3 py-1 rounded-md text-sm transition-colors ${approved === false
                                        ? 'bg-red-500/20 text-red-500 border border-red-500/50'
                                        : 'bg-white/10 text-white hover:bg-white/20'
                                    }`}
                            >
                                Reject
                            </button>
                            <button
                                onClick={() => setApproved(undefined)}
                                className={`px-3 py-1 rounded-md text-sm transition-colors ${approved === undefined
                                        ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/50'
                                        : 'bg-white/10 text-white hover:bg-white/20'
                                    }`}
                            >
                                Undecided
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    {segment.feedback ? (
                        <div>
                            <p className="text-white/80 whitespace-pre-line">{segment.feedback}</p>
                            {segment.approved !== undefined && (
                                <div className="mt-4">
                                    <span className="text-white/70 mr-2">Decision:</span>
                                    {segment.approved === true ? (
                                        <span className="px-2 py-1 bg-green-500/20 text-green-500 rounded-md text-sm">
                                            Approved
                                        </span>
                                    ) : segment.approved === false ? (
                                        <span className="px-2 py-1 bg-red-500/20 text-red-500 rounded-md text-sm">
                                            Rejected
                                        </span>
                                    ) : (
                                        <span className="px-2 py-1 bg-yellow-500/20 text-yellow-500 rounded-md text-sm">
                                            Undecided
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-white/50 italic">
                            {readOnly
                                ? "No feedback provided yet."
                                : "No feedback provided yet. Click 'Edit Feedback' to add your thoughts."}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default VideoFeedbackPanel;