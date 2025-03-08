"use client";

import { useState } from 'react';
import { ethers } from 'ethers';
import { useMarketplace, useChannelNFT } from '@/hooks/useContract';
import { useWallet } from '@/context/WalletContext';

interface CreateListingProps {
    channelId: number;
    onSuccess?: () => void;
}

export default function CreateListing({ channelId, onSuccess }: CreateListingProps) {
    const { account } = useWallet();
    const { contract: marketplace } = useMarketplace();
    const { contract: channelNFT } = useChannelNFT();

    const [amount, setAmount] = useState<string>('');
    const [pricePerShare, setPricePerShare] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [sharesOwned, setSharesOwned] = useState<number | null>(null);
    const [isApproved, setIsApproved] = useState<boolean>(false);

    // Check shares owned and approval status on component mount
    useState(() => {
        async function checkSharesAndApproval() {
            if (!channelNFT || !marketplace || !account) return;

            try {
                // Get shares owned
                const shares = await channelNFT.balanceOf(account, channelId);
                setSharesOwned(parseInt(shares.toString()));

                // Check if marketplace is approved to transfer shares
                const approved = await channelNFT.isApprovedForAll(account, await marketplace.getAddress());
                setIsApproved(approved);
            } catch (err) {
                console.error('Error checking shares and approval:', err);
            }
        }

        checkSharesAndApproval();
    }, [channelNFT, marketplace, account, channelId]);

    const handleApproveMarketplace = async () => {
        if (!channelNFT || !marketplace) return;

        try {
            setLoading(true);
            setError(null);

            // Approve marketplace to transfer tokens
            const tx = await channelNFT.setApprovalForAll(await marketplace.getAddress(), true);
            await tx.wait();

            setIsApproved(true);
            setSuccess('Marketplace approved to transfer your shares.');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.message || 'Error approving marketplace.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateListing = async () => {
        if (!marketplace || !isApproved) return;

        try {
            setLoading(true);
            setError(null);
            setSuccess(null);

            // Validate inputs
            if (!amount || parseInt(amount) <= 0) {
                setError('Please enter a valid amount.');
                setLoading(false);
                return;
            }

            if (!pricePerShare || parseFloat(pricePerShare) <= 0) {
                setError('Please enter a valid price per share.');
                setLoading(false);
                return;
            }

            // Check if user has enough shares
            if (sharesOwned && parseInt(amount) > sharesOwned) {
                setError(`You only own ${sharesOwned} shares.`);
                setLoading(false);
                return;
            }

            // Convert price to wei
            const priceInWei = ethers.utils.parseEther(pricePerShare);

            // Create listing
            const tx = await marketplace.createListing(channelId, amount, priceInWei);
            await tx.wait();

            setSuccess('Listing created successfully.');

            // Reset form
            setAmount('');
            setPricePerShare('');

            // Call onSuccess callback if provided
            if (onSuccess) {
                onSuccess();
            }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.message || 'Error creating listing.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-4">Create New Listing</h3>

            {success && (
                <div className="mb-4 p-2 bg-green-100 text-green-800 rounded">
                    {success}
                </div>
            )}

            {error && (
                <div className="mb-4 p-2 bg-red-100 text-red-800 rounded">
                    {error}
                </div>
            )}

            {sharesOwned !== null && (
                <div className="mb-4 text-sm">
                    You own <span className="font-bold">{sharesOwned}</span> shares of this channel.
                </div>
            )}

            {!isApproved ? (
                <div>
                    <p className="mb-4 text-sm text-gray-700">
                        Before listing your shares, you need to approve the marketplace to transfer them.
                    </p>

                    <button
                        onClick={handleApproveMarketplace}
                        disabled={loading}
                        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                    >
                        {loading ? 'Approving...' : 'Approve Marketplace'}
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Amount of Shares
                        </label>
                        <input
                            type="number"
                            min="1"
                            max={sharesOwned || undefined}
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Price per Share (ETH)
                        </label>
                        <input
                            type="number"
                            step="0.000001"
                            min="0.000001"
                            value={pricePerShare}
                            onChange={(e) => setPricePerShare(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                    </div>

                    <button
                        onClick={handleCreateListing}
                        disabled={loading || !amount || !pricePerShare}
                        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                    >
                        {loading ? 'Creating Listing...' : 'Create Listing'}
                    </button>
                </div>
            )}
        </div>
    );
}