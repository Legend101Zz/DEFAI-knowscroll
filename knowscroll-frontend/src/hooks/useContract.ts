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
    const setupContract = async () => {
      try {
        setLoading(true);

        if (!provider) {
          console.log("No provider available");
          setContract(null);
          setError("No provider connected");
          setLoading(false);
          return;
        }

        // Always create a read-only version of the contract with provider
        const readContract = new ethers.Contract(address, abi, provider);

        // If signer is available, create a writable version
        const contractInstance = signer
          ? readContract.connect(signer)
          : readContract;

        console.log(`Contract initialized at ${address}`);
        setContract(contractInstance);
        setError(null);
      } catch (err) {
        console.error("Contract initialization error:", err);
        setError("Failed to connect to contract");
        setContract(null);
      } finally {
        setLoading(false);
      }
    };

    setupContract();
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
