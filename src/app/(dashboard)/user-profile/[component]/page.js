import { MainCard } from "@/features/user/dashboard/personal/MainCard.js";
import { ProfileHeroCard } from "@/features/user/dashboard/personal/ProfileCard.js";

export default async function UserProfileCompoent({params}) {
    const {component}=await params
    
    return <div>
        <ProfileHeroCard/>
        <MainCard/>
    </div>;
}