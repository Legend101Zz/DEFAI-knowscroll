"use client";

import { useState, useEffect } from 'react';
import { useChannelNFT, useRevenueDistribution } from '@/hooks/useContract';
import { ethers } from 'ethers';
import { useWallet } from '@/context/WalletContext';

interface ChannelDetailsProps {
    channelId: number;
}

export default function ChannelDetails({ channelId }: ChannelDetailsProps) {
    const { account, isConnected } = useWallet();
    const { contract: channelNFT, loading: channelLoading } = useChannelNFT();
    const { contract: revenueDistribution, loading: revenueLoading } = useRevenueDistribution();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [channel, setChannel] = useState<any>(null);
    const [userShares, setUserShares] = useState<number>(0);
    const [totalRevenue, setTotalRevenue] = useState<string>('0');
    const [claimableRevenue, setClaimableRevenue] = useState<string>('0');
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        async function loadChannelData() {
            if (!channelNFT || channelLoading) return;

            try {
                const channelData = await channelNFT.getChannel(channelId);
                setChannel({
                    name: channelData.name,
                    description: channelData.description,
                    category: channelData.category,
                    creator: channelData.creator,
                    totalShares: parseInt(channelData.totalShares.toString()),
                    createdAt: new Date(parseInt(channelData.createdAt.toString()) * 1000),
                    active: channelData.active
                });

                // If user is connected, get their shares
                if (isConnected && account) {
                    const shares = await channelNFT.balanceOf(account, channelId);
                    setUserShares(parseInt(shares.toString()));
                }
            } catch (err) {
                console.error('Error loading channel data:', err);
            }
        }

        async function loadRevenueData() {
            if (!revenueDistribution || revenueLoading) return;

            try {
                // Get total channel revenue
                const revenue = await revenueDistribution.channelRevenue(channelId);
                setTotalRevenue(ethers.utils.formatEther(revenue));

                // If user is connected, get their claimable revenue
                if (isConnected && account) {
                    const claimable = await revenueDistribution.getClaimableRevenue(channelId, account);
                    setClaimableRevenue(ethers.utils.formatEther(claimable));
                }
            } catch (err) {
                console.error('Error loading revenue data:', err);
            }
        }

        async function loadAllData() {
            setLoading(true);
            await Promise.all([loadChannelData(), loadRevenueData()]);
            setLoading(false);
        }

        loadAllData();
    }, [channelId, channelNFT, revenueDistribution, account, isConnected, channelLoading, revenueLoading]);

    const handleClaimRevenue = async () => {
        if (!revenueDistribution || !isConnected) return;

        try {
            const tx = await revenueDistribution.claimRevenue(channelId);
            await tx.wait();

            // Refresh claimable revenue
            const claimable = await revenueDistribution.getClaimableRevenue(channelId, account);
            setClaimableRevenue(ethers.utils.formatEther(claimable));
        } catch (err) {
            console.error('Error claiming revenue:', err);
        }
    };

    if (loading || !channel) {
        return (
            <div className="p-8 text-center">
                <p className="text-gray-500">Loading channel details...</p>
            </div>
        );
    }

    return (
        <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{channel.name}</h2>
                <div className="flex flex-wrap text-sm text-gray-500 mb-4">
                    <span className="mr-4">Category: {channel.category}</span>
                    <span className="mr-4">Total Shares: {channel.totalShares}</span>
                    <span>Created: {channel.createdAt.toLocaleDateString()}</span>
                </div>

                <p className="text-gray-700 mb-6">{channel.description}</p>

                {isConnected && (
                    <div className="bg-blue-50 p-4 rounded-lg mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <p className="text-xs text-gray-500">Your Shares</p>
                                <p className="text-xl font-semibold">{userShares}</p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">Ownership</p>
                                <p className="text-xl font-semibold">
                                    {channel.totalShares > 0 ? ((userShares / channel.totalShares) * 100).toFixed(2) : 0}%
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">Claimable Revenue</p>
                                <p className="text-xl font-semibold">{claimableRevenue} ETH</p>
                            </div>
                        </div>

                        {parseFloat(claimableRevenue) > 0 && (
                            <button
                                onClick={handleClaimRevenue}
                                className="mt-4 w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Claim Revenue
                            </button>
                        )}
                    </div>
                )}

                <div className="border-t pt-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div>
                            <p className="text-sm text-gray-500">Creator</p>
                            <p className="text-gray-700">{channel.creator}</p>
                        </div>

                        <div className="mt-4 md:mt-0">
                            <p className="text-sm text-gray-500">Total Revenue Generated</p>
                            <p className="text-gray-700">{totalRevenue} ETH</p>
                        </div>

                        <div className="mt-4 md:mt-0">
                            <p className="text-sm text-gray-500">Status</p>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${channel.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                {channel.active ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}