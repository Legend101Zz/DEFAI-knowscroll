import ChannelView from "@/components/channel/ChannelView";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function ChannelPage({ params }: PageProps) {
    // Await the params promise to get the actual id
    const resolvedParams = await params;
    const channelId = parseInt(resolvedParams.id);

    return <ChannelView channelId={channelId} />;
}