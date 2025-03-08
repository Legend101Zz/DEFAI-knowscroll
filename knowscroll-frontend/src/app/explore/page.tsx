"use client";

import { useState } from 'react';
import SwipeableContent, { ContentItem } from '@/components/content/SwipeableContent';
import ChannelInfo from '@/components/channel/ChannelInfo';
import NavBar from '@/components/layout/NavBar';
import { useWallet } from '@/context/WalletContext';

// Dummy data for initial implementation
const SAMPLE_CONTENT = {
    series1: [
        {
            id: 1,
            title: "Origin of World War II",
            body: "The origins of World War II can be traced back to the harsh Treaty of Versailles that ended World War I. This treaty imposed severe economic sanctions on Germany and required the country to accept responsibility for the war. The Great Depression of the 1930s further destabilized Europe, creating conditions that allowed Adolf Hitler and the Nazi Party to rise to power in Germany. Hitler's aggressive territorial ambitions, beginning with the remilitarization of the Rhineland in 1936 and culminating in the invasion of Poland on September 1, 1939, ultimately triggered the conflict that would engulf the world.",
            seriesIndex: 1,
            seriesLength: 5,
            channelName: "History Channel",
            channelId: 1
        },
        {
            id: 2,
            title: "Key Battles of WWII",
            body: "Several decisive battles shaped the outcome of World War II. The Battle of Britain in 1940 prevented Nazi Germany from establishing air superiority over the UK, thwarting Hitler's invasion plans. The Battle of Stalingrad (1942-1943) marked a turning point on the Eastern Front, halting the German advance into the Soviet Union. The Battle of Midway in June 1942 was a decisive naval battle that shifted the balance of power in the Pacific in favor of the United States. D-Day (June 6, 1944) began the Allied liberation of Western Europe, while the Battle of the Bulge (December 1944) was Hitler's last major offensive on the Western Front.",
            seriesIndex: 2,
            seriesLength: 5,
            channelName: "History Channel",
            channelId: 1
        },
        {
            id: 3,
            title: "The Holocaust",
            body: "The Holocaust was the systematic murder of six million Jews and millions of others by Nazi Germany and its collaborators during World War II. Beginning with discriminatory laws in the 1930s, persecution escalated to mass killings by the Einsatzgruppen (mobile killing units) following the invasion of the Soviet Union in 1941. The Nazis established death camps like Auschwitz-Birkenau, Treblinka, and Sobibor specifically designed for mass murder. By 1945, about two-thirds of European Jews had been killed. The Holocaust stands as one of history's darkest chapters and has profoundly shaped our understanding of human rights, genocide, and the responsibilities of nations to protect vulnerable populations.",
            seriesIndex: 3,
            seriesLength: 5,
            channelName: "History Channel",
            channelId: 1
        },
    ],
    series2: [
        {
            id: 1,
            title: "Understanding Blockchain",
            body: "Blockchain is a distributed ledger technology that allows data to be stored across a network of computers. This creates a transparent and immutable record of transactions that doesn't require a central authority to maintain. Each block contains a cryptographic hash of the previous block, a timestamp, and transaction data, making it extremely difficult to alter any block without changing all subsequent blocks. This property gives blockchain its significant security advantages. Originally developed as the underlying technology for Bitcoin, blockchain applications now extend far beyond cryptocurrencies to include supply chain management, digital identity verification, and smart contracts.",
            seriesIndex: 1,
            seriesLength: 3,
            channelName: "Tech Explained",
            channelId: 2
        },
        {
            id: 2,
            title: "How Smart Contracts Work",
            body: "Smart contracts are self-executing contracts with the terms directly written into code. Running on blockchain networks like Ethereum, they automatically execute when predetermined conditions are met. For example, a smart contract could automatically transfer payment to a seller once a package's delivery is confirmed. Unlike traditional contracts that require third-party enforcement, smart contracts are enforced by code and distributed across the blockchain. This reduces the need for intermediaries, minimizes fraud, and increases efficiency. However, smart contracts also present challenges like code vulnerabilities and the immutability of errors once deployed.",
            seriesIndex: 2,
            seriesLength: 3,
            channelName: "Tech Explained",
            channelId: 2
        },
    ]
};

export default function ExplorePage() {
    const { isConnected } = useWallet();
    const [currentSeries, setCurrentSeries] = useState('series1');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [content, setContent] = useState<ContentItem>(SAMPLE_CONTENT.series1[0]);

    const navigateNextInSeries = () => {
        const series = SAMPLE_CONTENT[currentSeries as keyof typeof SAMPLE_CONTENT];
        if (currentIndex < series.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setContent(series[currentIndex + 1]);
        }
    };

    const navigatePrevInSeries = () => {
        const series = SAMPLE_CONTENT[currentSeries as keyof typeof SAMPLE_CONTENT];
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setContent(series[currentIndex - 1]);
        }
    };

    const navigateToNewTopic = () => {
        // Switch to a different series
        const newSeries = currentSeries === 'series1' ? 'series2' : 'series1';
        setCurrentSeries(newSeries);
        setCurrentIndex(0);
        setContent(SAMPLE_CONTENT[newSeries as keyof typeof SAMPLE_CONTENT][0]);
    };

    return (
        <div className="h-screen flex flex-col">
            <NavBar />

            <main className="flex-1 overflow-hidden">
                <SwipeableContent
                    content={content}
                    onSwipeUp={navigateNextInSeries}
                    onSwipeDown={navigatePrevInSeries}
                    onSwipeLeft={navigateToNewTopic}
                    onSwipeRight={navigateToNewTopic}
                />
            </main>

            <footer className="p-4 border-t bg-white">
                <ChannelInfo
                    channel={{
                        name: content.channelName,
                        id: content.channelId || 1,
                        totalShares: 100
                    }}
                    showBuyOption={isConnected}
                />
            </footer>
        </div>
    );
}