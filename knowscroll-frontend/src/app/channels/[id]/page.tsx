import ChannelView from "@/components/channel/ChannelView";

export default function ChannelPage({ params }: { params: { id: string } }) {
    const channelId = parseInt(params.id);

    return <ChannelView channelId={channelId} />;
}