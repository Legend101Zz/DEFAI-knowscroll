"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';

type WalletContextType = {
    provider: ethers.providers.Web3Provider | null;
    signer: ethers.Signer | null;
    account: string | null;
    chainId: number | null;
    isConnected: boolean;
    connect: () => Promise<void>;
    disconnect: () => void;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
    const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
    const [signer, setSigner] = useState<ethers.Signer | null>(null);
    const [account, setAccount] = useState<string | null>(null);
    const [chainId, setChainId] = useState<number | null>(null);
    const [web3Modal, setWeb3Modal] = useState<Web3Modal | null>(null);

    useEffect(() => {
        const modal = new Web3Modal({
            cacheProvider: true,
            theme: 'light',
        });

        setWeb3Modal(modal);

        // Auto-connect if previously connected
        if (modal.cachedProvider) {
            connect();
        }
    }, []);

    const connect = async () => {
        if (!web3Modal) return;

        try {
            const connection = await web3Modal.connect();
            const ethProvider = new ethers.providers.Web3Provider(connection);
            const ethSigner = ethProvider.getSigner();
            const accounts = await ethProvider.listAccounts();
            const { chainId: network } = await ethProvider.getNetwork();

            setProvider(ethProvider);
            setSigner(ethSigner);
            setAccount(accounts[0]);
            setChainId(network);

            // Setup event listeners for wallet changes
            connection.on('accountsChanged', (accounts: string[]) => {
                setAccount(accounts[0]);
            });

            connection.on('chainChanged', () => {
                window.location.reload();
            });
        } catch (error) {
            console.error('Connection failed:', error);
        }
    };

    const disconnect = () => {
        if (web3Modal) {
            web3Modal.clearCachedProvider();
        }

        setProvider(null);
        setSigner(null);
        setAccount(null);
        setChainId(null);
    };

    return (
        <WalletContext.Provider value={{
            provider,
            signer,
            account,
            chainId,
            isConnected: !!account,
            connect,
            disconnect
        }}>
            {children}
        </WalletContext.Provider>
    );
}

export function useWallet() {
    const context = useContext(WalletContext);
    if (context === undefined) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
}