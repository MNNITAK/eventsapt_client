import { MainCard } from "@/features/user/dashboard/personal/MainCard.js";
import { ProfileHeroCard } from "@/features/user/dashboard/personal/ProfileCard.js";
const renderUserComponent = (component) => {
    switch (component) {
        case "personal":
            return (<>
                <ProfileHeroCard />
                <MainCard />
            </>);
        case "memoeries":
            return <div>memoeries</div>;
        case "contacts":
            return <div>contacts</div>;
        case "features":
            return <div>features</div>;
        case "library":
            return <div>library</div>;
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