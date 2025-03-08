"use client";

import NavBar from '@/components/layout/NavBar';
import ChannelDetails from '@/components/channel/ChannelDetails';
import Link from 'next/link';
import { useWallet } from '@/context/WalletContext';

interface ChannelPageProps {
    params: {
        id: string;
    };
}

export default function ChannelPage({ params }: ChannelPageProps) {
    const { isConnected } = useWallet();
    const channelId = parseInt(params.id);

    return (
        <div className="min-h-screen bg-gray-50">
            <NavBar />

            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Channel Details</h1>
                        <p className="text-gray-500">Viewing details for Channel #{channelId}</p>
                    </div>

                    <div className="flex space-x-4">
                        <Link
                            href={`/marketplace?channel=${channelId}`}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Buy Shares
                        </Link>

                        {isConnected && (
                            <Link
                                href={`/governance?channel=${channelId}`}
                                className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
                            >
                                Governance
                            </Link>
                        )}
                    </div>
                </div>

                <ChannelDetails channelId={channelId} />
            </main>
        </div>
    );
}