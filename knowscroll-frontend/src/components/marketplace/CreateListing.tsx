"use client";

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWallet } from '@/context/WalletContext';
import { useChannelNFT, useMarketplace } from '@/hooks/useContract';

interface CreateListingProps {
    channelId: number;
    onSuccess?: () => void;
}

export default function CreateListing({ channelId, onSuccess }: CreateListingProps) {
    const { isConnected, account } = useWallet();
    const { contract: channelNFT, loading: loadingNFT } = useChannelNFT();
    const { contract: marketplace, loading: loadingMarketplace } = useMarketplace();

    const [amount, setAmount] = useState<number>(1);
    const [pricePerShare, setPricePerShare] = useState<string>('0.01');
    const [maxSharesAvailable, setMaxSharesAvailable] = useState<number>(0);
    const [creating, setCreating] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const [approving, setApproving] = useState<boolean>(false);
    const [needsApproval, setNeedsApproval] = useState<boolean>(true);

    // Calculate total price
    const totalPrice = amount * parseFloat(pricePerShare);

    // Format to display with 6 decimal places
    const formattedTotalPrice = totalPrice.toFixed(6);

    // Check if form is valid
    const isValid = amount > 0 && amount <= maxSharesAvailable && parseFloat(pricePerShare) > 0;

    // Fetch user's available shares for the channel
    useEffect(() => {
        const fetchUserShares = async () => {
            if (!channelNFT || !account || !isConnected) return;

            try {
                // Get user's balance for this channel
                const balance = await channelNFT.balanceOf(account, channelId);
                setMaxSharesAvailable(Number(balance.toString()));

                // Check if marketplace is approved to transfer shares
                const isApproved = await channelNFT.isApprovedForAll(account, marketplace!.address || await marketplace!.getAddress?.());
                setNeedsApproval(!isApproved);

            } catch (error) {
                console.error("Error fetching user shares:", error);
                setError("Failed to fetch your available shares. Please try again.");
            }
        };

        fetchUserShares();
    }, [channelNFT, marketplace, account, channelId, isConnected]);

    // Handle approval for the marketplace to transfer shares
    const handleApprove = async () => {
        if (!channelNFT || !marketplace || !isConnected) return;

        try {
            setApproving(true);
            setError(null);

            const tx = await channelNFT.setApprovalForAll(marketplace.address || await marketplace.getAddress?.(), true);
            await tx.wait();

            setNeedsApproval(false);

        } catch (error) {
            console.error("Error approving marketplace:", error);
            setError("Failed to approve the marketplace. Please try again.");
        } finally {
            setApproving(false);
        }
    };

    // Handle create listing submission
    const handleCreateListing = async () => {
        if (!marketplace || !isConnected || !isValid) return;

        try {
            setCreating(true);
            setError(null);
            setSuccess(false);

            // Convert price to wei
            const priceInWei = ethers.utils.parseEther(pricePerShare);

            // Create the listing
            const tx = await marketplace.createListing(channelId, amount, priceInWei);
            await tx.wait();

            setSuccess(true);

            // Reset form
            setAmount(1);
            setPricePerShare('0.01');

            // Call success callback
            if (onSuccess) {
                onSuccess();
            }

        } catch (error) {
            console.error("Error creating listing:", error);
            setError("Failed to create listing. Please try again.");
        } finally {
            setCreating(false);
        }
    };

    // Handle input changes with validation
    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (isNaN(value) || value < 1) {
            setAmount(1);
        } else if (value > maxSharesAvailable) {
            setAmount(maxSharesAvailable);
        } else {
            setAmount(value);
        }
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Allow empty string for typing
        if (value === '') {
            setPricePerShare('');
            return;
        }

        // Only allow valid numbers
        const floatValue = parseFloat(value);
        if (!isNaN(floatValue) && floatValue >= 0) {
            setPricePerShare(value);
        }
    };

    if (loadingNFT || loadingMarketplace) {
        return (
            <div className="p-4 text-center">
                <div className="w-8 h-8 border-t-2 border-b-2 border-[#37E8FF] rounded-full animate-spin mx-auto mb-2"></div>
                <div className="text-white/70 text-sm">Loading...</div>
            </div>
        );
    }

    return (
        <div>
            {maxSharesAvailable > 0 ? (
                <div className="space-y-4">
                    {needsApproval ? (
                        <div className="space-y-4">
                            <div className="p-4 rounded-lg bg-[#121218] border border-white/10">
                                <div className="text-sm mb-2">Before creating a listing, you need to approve the marketplace contract to transfer your shares.</div>
                                <button
                                    onClick={handleApprove}
                                    disabled={approving}
                                    className="w-full py-2 bg-[#37E8FF]/20 text-[#37E8FF] rounded-lg font-medium text-sm hover:bg-[#37E8FF]/30 transition-all disabled:opacity-50 flex justify-center items-center"
                                >
                                    {approving ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#37E8FF]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Approving...
                                        </>
                                    ) : (
                                        'Approve Marketplace'
                                    )}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-white/70 text-sm mb-1">Number of Shares</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            min="1"
                                            max={maxSharesAvailable}
                                            value={amount}
                                            onChange={handleAmountChange}
                                            className="w-full px-4 py-2 bg-[#121218] rounded-lg border border-white/10 focus:border-[#37E8FF]/50 focus:outline-none text-white"
                                        />
                                        <div className="absolute right-2 top-2 text-xs text-white/50">
                                            Max: {maxSharesAvailable}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-white/70 text-sm mb-1">Price per Share (S)</label>
                                    <input
                                        type="text"
                                        value={pricePerShare}
                                        onChange={handlePriceChange}
                                        className="w-full px-4 py-2 bg-[#121218] rounded-lg border border-white/10 focus:border-[#37E8FF]/50 focus:outline-none text-white"
                                    />
                                </div>
                            </div>

                            <div className="p-3 rounded-lg bg-[#121218] border border-white/10">
                                <div className="flex justify-between">
                                    <span className="text-white/70">Total Sale Value:</span>
                                    <span className="font-bold text-[#37E8FF]">{formattedTotalPrice} S</span>
                                </div>
                            </div>

                            {error && (
                                <div className="p-3 rounded-lg bg-[#FF3D8A]/10 border border-[#FF3D8A]/30 text-[#FF3D8A] text-sm">
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-500 text-sm">
                                    Listing created successfully!
                                </div>
                            )}

                            <button
                                onClick={handleCreateListing}
                                disabled={creating || !isValid}
                                className="w-full py-3 bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A] text-white rounded-lg font-medium hover:shadow-glow transition-all disabled:opacity-50 flex justify-center items-center"
                            >
                                {creating ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating Listing...
                                    </>
                                ) : (
                                    'Create Listing'
                                )}
                            </button>
                        </>
                    )}
                </div>
            ) : (
                <div className="p-6 text-center bg-[#121218] rounded-lg border border-white/10">
                    <div className="text-white/70 mb-4">You don&apos;t have any shares for Channel #{channelId}.</div>
                    <a
                        href={`/channels/${channelId}`}
                        className="inline-flex items-center px-4 py-2 bg-[#37E8FF]/20 text-[#37E8FF] rounded-lg hover:bg-[#37E8FF]/30 transition-colors"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View Channel Details
                    </a>
                </div>
            )}
        </div>
    );
}