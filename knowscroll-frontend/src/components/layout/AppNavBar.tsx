/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useWallet } from '@/context/WalletContext';
import { Menu, X, ChevronDown, ExternalLink, Wallet, LogOut, LayoutGrid, Zap } from 'lucide-react';

export default function AppNavBar() {
    const { account, isConnected, connect, disconnect } = useWallet();
    const [showMenu, setShowMenu] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Format wallet address display
    const formatAddress = (address: any) => {
        if (!address) return '';
        return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#121218]/90 shadow-lg backdrop-blur-md' : 'bg-[#121218]'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo & Brand */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="relative w-8 h-8 overflow-hidden">
                                <Image
                                    src="/images/knowscroll3.png"
                                    alt="KnowScroll Logo"
                                    width={32}
                                    height={32}
                                    className="object-contain"
                                />
                            </div>
                            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-[#37E8FF] via-[#a742ff] to-[#FF3D8A] text-transparent bg-clip-text">
                                KnowScroll
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link href="/explore" className="text-white/80 hover:text-[#37E8FF] transition-colors duration-200 text-sm font-medium">
                            Explore
                        </Link>
                        <Link href="/learn" className="text-white/80 hover:text-[#37E8FF] transition-colors duration-200 text-sm font-medium">
                            Learn
                        </Link>
                        <Link href="/channels" className="text-white/80 hover:text-[#37E8FF] transition-colors duration-200 text-sm font-medium">
                            Channels
                        </Link>

                        {/* Wallet Connection */}
                        {isConnected ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowMenu(!showMenu)}
                                    className="flex items-center gap-2 bg-[#1A1A24] border border-[#37E8FF]/20 px-3 py-1.5 rounded-full group hover:shadow-glow transition-all duration-300"
                                >
                                    <span className="inline-block w-2 h-2 rounded-full bg-[#37E8FF] animate-pulse-subtle"></span>
                                    <span className="text-sm text-white/90 group-hover:text-white">{formatAddress(account)}</span>
                                    <ChevronDown size={14} className={`text-[#37E8FF] transition-transform duration-200 ${showMenu ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Account Dropdown */}
                                {showMenu && (
                                    <div className="absolute right-0 mt-2 w-56 bg-[#1A1A24] border border-[#37E8FF]/20 rounded-xl shadow-xl backdrop-blur-xl overflow-hidden z-50 animate-slide-up">
                                        <div className="px-4 py-3 border-b border-white/10">
                                            <p className="text-xs text-white/50">Connected Wallet</p>
                                            <p className="text-sm font-medium text-white">{formatAddress(account)}</p>
                                        </div>
                                        <div className="py-1">
                                            <Link
                                                href="/portfolio"
                                                className="flex items-center gap-2 px-4 py-2 text-sm text-white hover:bg-[#37E8FF]/10 transition-colors"
                                                onClick={() => setShowMenu(false)}
                                            >
                                                <LayoutGrid size={16} className="text-[#37E8FF]" />
                                                <span>My Portfolio</span>
                                            </Link>
                                            <Link
                                                href="/marketplace"
                                                className="flex items-center gap-2 px-4 py-2 text-sm text-white hover:bg-[#37E8FF]/10 transition-colors"
                                                onClick={() => setShowMenu(false)}
                                            >
                                                <Zap size={16} className="text-[#FF3D8A]" />
                                                <span>Marketplace</span>
                                            </Link>
                                            <a
                                                href={`https://sonicscan.org/address/${account}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 px-4 py-2 text-sm text-white hover:bg-[#37E8FF]/10 transition-colors"
                                                onClick={() => setShowMenu(false)}
                                            >
                                                <ExternalLink size={16} className="text-[#a742ff]" />
                                                <span>View on Explorer</span>
                                            </a>
                                        </div>
                                        <div className="border-t border-white/10">
                                            <button
                                                onClick={() => {
                                                    disconnect();
                                                    setShowMenu(false);
                                                }}
                                                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                                            >
                                                <LogOut size={16} />
                                                <span>Disconnect</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button
                                onClick={connect}
                                className="relative overflow-hidden bg-transparent text-white px-5 py-1.5 rounded-full text-sm font-medium border border-[#37E8FF]/50 transition-all duration-300 hover:shadow-glow group"
                            >
                                <span className="absolute inset-0 bg-gradient-to-r from-[#37E8FF] via-transparent to-[#FF3D8A] opacity-0 group-hover:opacity-20 transition-opacity"></span>
                                <div className="flex items-center gap-2">
                                    <Wallet size={16} />
                                    <span>Connect Wallet</span>
                                </div>
                            </button>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        {isConnected && (
                            <button
                                className="flex items-center gap-2 bg-[#1A1A24] border border-[#37E8FF]/20 px-3 py-1.5 rounded-full mr-2"
                            >
                                <span className="inline-block w-2 h-2 rounded-full bg-[#37E8FF] animate-pulse-subtle"></span>
                                <span className="text-xs text-white/90">{formatAddress(account)}</span>
                            </button>
                        )}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="text-gray-400 hover:text-white focus:outline-none"
                        >
                            {mobileMenuOpen ? (
                                <X size={24} className="text-[#FF3D8A]" />
                            ) : (
                                <Menu size={24} className="text-[#37E8FF]" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-[#121218]/95 backdrop-blur-lg animate-slide-down">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-white/10">
                        <Link
                            href="/explore"
                            className="block px-3 py-2 rounded-md text-white hover:bg-[#37E8FF]/10 transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Explore
                        </Link>
                        <Link
                            href="/learn"
                            className="block px-3 py-2 rounded-md text-white hover:bg-[#37E8FF]/10 transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Learn
                        </Link>
                        <Link
                            href="/channels"
                            className="block px-3 py-2 rounded-md text-white hover:bg-[#37E8FF]/10 transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Channels
                        </Link>

                        {isConnected ? (
                            <>
                                <Link
                                    href="/portfolio"
                                    className="flex items-center gap-2 px-3 py-2 rounded-md text-white hover:bg-[#37E8FF]/10 transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <LayoutGrid size={16} className="text-[#37E8FF]" />
                                    <span>My Portfolio</span>
                                </Link>
                                <Link
                                    href="/marketplace"
                                    className="flex items-center gap-2 px-3 py-2 rounded-md text-white hover:bg-[#37E8FF]/10 transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <Zap size={16} className="text-[#FF3D8A]" />
                                    <span>Marketplace</span>
                                </Link>
                                <button
                                    onClick={() => {
                                        disconnect();
                                        setMobileMenuOpen(false);
                                    }}
                                    className="flex w-full items-center gap-2 px-3 py-2 rounded-md text-red-400 hover:bg-red-500/10 transition-colors"
                                >
                                    <LogOut size={16} />
                                    <span>Disconnect</span>
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => {
                                    connect();
                                    setMobileMenuOpen(false);
                                }}
                                className="flex w-full items-center justify-center gap-2 px-3 py-2 rounded-md bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A] text-white font-medium"
                            >
                                <Wallet size={16} />
                                <span>Connect Wallet</span>
                            </button>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}