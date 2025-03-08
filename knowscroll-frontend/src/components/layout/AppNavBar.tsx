"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useWallet } from '@/context/WalletContext';

export default function AppNavBar() {
    const { account, isConnected, connect, disconnect } = useWallet();
    const [showMenu, setShowMenu] = useState(false);

    return (
        <div className="bg-[#121218] text-white">
            <div className="max-w-screen-lg mx-auto px-4 py-4 flex justify-between items-center">
                <Link href="/" className="text-xl font-bold text-[#37E8FF]">
                    KnowScroll
                </Link>

                <div className="flex items-center space-x-4">
                    <Link href="/explore" className="text-white/70 hover:text-white">
                        Explore
                    </Link>

                    {isConnected ? (
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="flex items-center space-x-2 bg-[#1A1A24] px-4 py-2 rounded-full"
                        >
                            <div className="w-2 h-2 rounded-full bg-[#37E8FF]"></div>
                            <span className="text-sm">{account?.substring(0, 4)}...{account?.substring(account.length - 4)}</span>
                        </button>
                    ) : (
                        <button
                            onClick={connect}
                            className="bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A] text-white px-4 py-2 rounded-full text-sm"
                        >
                            Connect
                        </button>
                    )}
                </div>
            </div>

            {/* Dropdown menu */}
            {showMenu && (
                <div className="absolute right-4 mt-2 w-48 bg-[#1A1A24] rounded-lg shadow-lg overflow-hidden z-50">
                    <Link
                        href="/portfolio"
                        className="block px-4 py-3 text-sm text-white hover:bg-[#37E8FF]/10"
                        onClick={() => setShowMenu(false)}
                    >
                        My Portfolio
                    </Link>
                    <Link
                        href="/marketplace"
                        className="block px-4 py-3 text-sm text-white hover:bg-[#37E8FF]/10"
                        onClick={() => setShowMenu(false)}
                    >
                        Marketplace
                    </Link>
                    <button
                        onClick={() => {
                            disconnect();
                            setShowMenu(false);
                        }}
                        className="block w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10"
                    >
                        Disconnect
                    </button>
                </div>
            )}
        </div>
    );
}