import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useWallet } from "@/context/WalletContext";
import {
  ChannelNFTAbi,
  RevenueDistributionAbi,
  MarketplaceAbi,
  GovernanceAbi,
} from "@/lib/contracts/abis";
import { CONTRACT_ADDRESSES } from "@/lib/contracts/addresses";

// Generic hook for any contract
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useContract(address: string, abi: any) {
  const { provider, signer } = useWallet();
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!provider) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const contractInstance = new ethers.Contract(
        address,
        abi,
        signer || provider
      );
      setContract(contractInstance);
      setError(null);
    } catch (err) {
      console.error("Contract initialization error:", err);
      setError("Failed to connect to contract");
    } finally {
      setLoading(false);
    }
  }, [address, abi, provider, signer]);

  return { contract, loading, error };
}

// Specific hooks for each contract
export function useChannelNFT() {
  return useContract(CONTRACT_ADDRESSES.ChannelNFT, ChannelNFTAbi);
}

export function useRevenueDistribution() {
  return useContract(
    CONTRACT_ADDRESSES.RevenueDistribution,
    RevenueDistributionAbi
  );
}

export function useMarketplace() {
  return useContract(CONTRACT_ADDRESSES.Marketplace, MarketplaceAbi);
}

export function useGovernance() {
  return useContract(CONTRACT_ADDRESSES.Governance, GovernanceAbi);
}
