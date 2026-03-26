import { ChatAppShell } from "@/features/chats/ChatAppShell";
import { EventsOverview } from "@/features/user/dashboard/events/EventsOverview";
import SavedContentGallery from "@/features/user/dashboard/memories/SavedFeed";
import { MainCard } from "@/features/user/dashboard/personal/MainCard.js";
import { ProfileHeroCard } from "@/features/user/dashboard/personal/ProfileCard.js";
import { WeddingMarketInsightsDashboard } from "@/features/user/dashboard/trending/TrendingMarket";
const renderUserComponent = (component) => {
    switch (component) {
        case "personal":
            return (<>
                <ProfileHeroCard />
                <MainCard />
            </>);
        case "memories":
            return <SavedContentGallery
  savedPosts={[
    {
      id: "p1",
      title: "My favorite post",
      thumbnailUrl: "https://images.pexels.com/photos/36026443/pexels-photo-36026443.jpeg",
      likes: 1200,
      savedAt: "2026-03-20T10:00:00Z",
    },
  ]}
  savedReels={[
    {
      id: "r1",
      title: "Saved reel clip",
      coverUrl: "https://images.pexels.com/photos/7615158/pexels-photo-7615158.jpeg",
      views: 58000,
      savedAt: "2026-03-22T10:00:00Z",
    },
  ]}
/>;
        case "trending":
            return <WeddingMarketInsightsDashboard/>;
        case "events":
            return <EventsOverview/>;
        case "chats":
            return <ChatAppShell/>;
        default:
            return <div>Oopsss</div>;
    }
}
export default async function UserProfileCompoent({ params }) {
    const { component } = await params

    return <>
    {renderUserComponent(component)}
    </>
}