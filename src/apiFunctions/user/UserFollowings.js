'use client'
import { CoupleLiked, VendorIdea, VendorLiked, VendorSaved } from "@/features/user/components/UserLikedFollowed";
import { useState } from "react"
const UserFollowStat = ({ userData }) => {
    const [userView, setView] = useState('likes')
    return (
        <>
            <div className="flex md:w-[80%]  w-[95%] mt-3 mx-auto justify-center">
                <button onClick={() => { setView("likes") }} className={`px-2 py-1 ${userView == "likes" ? "bg-gray-300" : ""}`}>Liked</button>
                <button onClick={() => { setView("follows") }} className={`px-2 py-1 ${userView == "follows" ? "bg-gray-300" : ""}`}>Folowed</button>
                <button onClick={() => { setView("saved") }} className={`px-2 py-1 ${userView == "saved" ? "bg-gray-300" : ""}`}>Saved</button>
                <button onClick={() => { setView("ideas") }} className={`px-2 py-1 ${userView == "ideas" ? "bg-gray-300" : ""}`}>Ideas</button>
            </div>
            <div className="grid mt-3 md:w-[80%] w-[90%] pb-[13vh] mx-auto grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-2">
                {
                    userData.map((item, pos) => {
                        if (item.type === 'likedVendors' && userView === "likes") {
                            return item.items.map((item1, pos1) => (
                                <VendorLiked isFollowed={false} key={pos1} dt={item1} />
                            ));
                        }
                        if(item.type=='followedVendors' && userView=='follows'){
                            return item.items.map((item1, pos1) => (
                                <VendorLiked isFollowed={true} key={pos1} dt={item1}/>
                            ))
                        } // Ensure `map()` always returns something
                        if(item.type=='savedVendor' && userView=='saved'){
                            return item.items.map((item1, pos1) => (
                                <VendorSaved isFollowed={true} key={pos1} dt={item1}/>
                            ))
                        }
                        if(item.type=='savedIdea' && userView=='ideas'){
                            return item.items.map((item1, pos1) => (
                                <VendorIdea key={pos1} dt={item1}/>
                            ))
                        }
                        if(item.type=='likedCouples' && userView=='likes'){
                            return item.items.map((item1, pos1) => (
                                <CoupleLiked key={pos1} dt={item1}/>
                            ))
                        }
                    })
                }
            </div>
        </>
    )
}
export { UserFollowStat }