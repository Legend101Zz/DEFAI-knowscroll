"use client";

import Link from 'next/link';

interface ChannelInfoProps {
    channel: {
        name: string;
        id: number;
        totalShares: number;
    };
    showBuyOption?: boolean;
}

export default function ChannelInfo({ channel, showBuyOption = false }: ChannelInfoProps) {
    return (
        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
            <div>
                <h3 className="font-medium text-gray-900">{channel.name}</h3>
                <p className="text-xs text-gray-500">Channel #{channel.id} • {channel.totalShares} total shares</p>
            </div>

            <div className="flex space-x-2">
                <Link
                    href={`/channels/${channel.id}`}
                    className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
                >
                    View Details
                </Link>

                {showBuyOption && (
                    <Link
                        href={`/marketplace?channel=${channel.id}`}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                        Buy Shares
                    </Link>
                )}
            </div>
        </div>
    );
}