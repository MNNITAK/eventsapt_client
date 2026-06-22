'use client'
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useSearchParams, useRouter } from "next/navigation"
import {
    fetchPublicVendorProfile,
    fetchVendorPosts,
    fetchVendorReels,
    fetchVendorPortfolio,
    fetchVendorReviews,
    resolveVendorIdByName,
} from "@/features/vendor/api/fetchPublicVendorProfile"
import { axiosInstance } from "@/axios/axios"
import { getCookies } from "@/app/action"
import { LuLoaderCircle, LuArrowLeft, LuMapPin, LuStar, LuUsers, LuCalendar, LuInstagram, LuYoutube, LuGlobe } from "react-icons/lu"
import { FaFacebook } from "react-icons/fa"
import { FaRegHeart, FaHeart, FaRegBookmark, FaBookmark } from "react-icons/fa"
import { IoPersonAddOutline, IoCheckmark } from "react-icons/io5"
import { MdOutlineMessage } from "react-icons/md"
import { BsChevronDown, BsChevronUp, BsGridFill } from "react-icons/bs"
import { TbMovie, TbShare3 } from "react-icons/tb"
import { RiImageLine } from "react-icons/ri"
import { BiMessageSquareDetail } from "react-icons/bi"
import { PostCard } from "@/features/feed/components/PostCard"
import { ReelCard } from "@/features/feed/components/ReelCard"

// ── Sub-components ───────────────────────────────────────────────────────────

const StarRating = ({ value = 0, max = 5, size = "sm" }) => (
    <div className="flex gap-0.5">
        {Array.from({ length: max }).map((_, i) => (
            <LuStar
                key={i}
                className={`${size === "lg" ? "text-lg" : "text-sm"} ${
                    i < Math.round(value) ? "fill-amber-400 text-amber-400" : "text-[#3f3f46]"
                }`}
            />
        ))}
    </div>
)

const ReviewCard = ({ review }) => (
    <div className="bg-[rgba(32,31,31,0.6)] backdrop-blur-sm rounded-[32px] p-8 flex flex-col gap-6">
        {/* Reviewer header */}
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#ff89ac] to-[#a68cff] flex items-center justify-center flex-shrink-0">
                <span className="text-black font-bold text-sm">
                    {review?.reviewer?.name?.[0]?.toUpperCase() || "U"}
                </span>
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-base leading-tight">
                    {review?.reviewer?.name || "Guest"}
                </p>
                <p className="text-[#adaaaa] text-xs mt-0.5">
                    {review?.eventType && `${review.eventType} • `}
                    {review?.createdAt && new Date(review.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                </p>
            </div>
            <StarRating value={review?.rating || 0} />
        </div>

        {/* Review text */}
        {review?.title && <p className="text-white font-semibold text-sm">"{review.title}"</p>}
        {review?.review && (
            <p className="text-[#adaaaa] text-base leading-relaxed">
                "{review.review}"
            </p>
        )}

        {/* Vendor response */}
        {review?.vendorResponse?.response && (
            <div className="pl-4 border-l-2 border-[#ff89ac]">
                <p className="text-xs text-[#ff89ac] font-semibold mb-1">Vendor replied</p>
                <p className="text-xs text-[#adaaaa]">{review.vendorResponse.response}</p>
            </div>
        )}
    </div>
)

const ServiceAccordion = ({ service }) => {
    const [open, setOpen] = useState(false)
    return (
        <div className="bg-[#131313] border border-[rgba(255,255,255,0.05)] rounded-[32px] overflow-hidden mb-3">
            <button
                onClick={() => setOpen((o) => !o)}
                className="w-full flex items-center justify-between px-6 py-5 hover:bg-[#1a1a1a] transition-colors"
            >
                <div className="text-left">
                    <p className="font-semibold text-white text-sm">{service?.category}</p>
                    {service?.description && (
                        <p className="text-xs text-[#adaaaa] mt-0.5 line-clamp-1">{service.description}</p>
                    )}
                </div>
                {open
                    ? <BsChevronUp className="text-[#adaaaa] flex-shrink-0" />
                    : <BsChevronDown className="text-[#adaaaa] flex-shrink-0" />}
            </button>

            {open && service?.packages?.length > 0 && (
                <div className="px-6 pb-6 pt-2 space-y-3">
                    {service.packages.map((pkg, i) => (
                        <div key={i} className="bg-[#0e0e0e] border border-[rgba(255,255,255,0.05)] rounded-2xl p-4">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm text-white">{pkg.name}</p>
                                    {pkg.description && (
                                        <p className="text-xs text-[#adaaaa] mt-1">{pkg.description}</p>
                                    )}
                                </div>
                                {pkg.price && (
                                    <div className="text-right flex-shrink-0">
                                        <p className="text-lg font-extrabold text-white">
                                            ₹{Number(pkg.price).toLocaleString("en-IN")}
                                        </p>
                                        {pkg.priceType && (
                                            <p className="text-[10px] text-[#adaaaa] uppercase">{pkg.priceType}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                            {pkg.deliverables?.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-3">
                                    {pkg.deliverables.slice(0, 4).map((d, j) => (
                                        <span key={j} className="text-[10px] bg-[#ff89ac]/10 text-[#ff89ac] px-2.5 py-1 rounded-full border border-[#ff89ac]/20">
                                            {d}
                                        </span>
                                    ))}
                                </div>
                            )}
                            <button className="mt-4 w-full py-3 rounded-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white text-sm font-semibold hover:bg-[rgba(255,255,255,0.1)] transition-colors">
                                Book Now
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

// ── Main Component ────────────────────────────────────────────────────────────

const TABS = [
    { id: "posts",     label: "Posts",     icon: RiImageLine },
    { id: "reels",     label: "Reels",     icon: TbMovie },
    { id: "portfolio", label: "Portfolio", icon: BsGridFill },
    { id: "reviews",   label: "Reviews",   icon: BiMessageSquareDetail },
]

const VendorPublicProfile = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const vendorIdParam = searchParams.get("vendorId")
    const vendorNameParam = searchParams.get("vendorName")

    const { data: resolvedId, isLoading: resolving } = useQuery({
        queryKey: ["vendor-resolve", vendorIdParam, vendorNameParam],
        queryFn: async () => {
            if (vendorIdParam) return vendorIdParam
            if (vendorNameParam) return resolveVendorIdByName(vendorNameParam)
            return null
        },
        enabled: !!(vendorIdParam || vendorNameParam),
        staleTime: Infinity,
    })

    const vendorId = resolvedId

    const [activeTab, setActiveTab] = useState("posts")
    const [following, setFollowing] = useState(false)
    const [liked, setLiked] = useState(false)
    const [saved, setSaved] = useState(false)
    const [actionLoading, setActionLoading] = useState(null)

    const { data: profile, isLoading: profileLoading, isError: profileError } = useQuery({
        queryKey: ["vendor-public-profile", vendorId],
        queryFn: () => fetchPublicVendorProfile(vendorId),
        enabled: !!vendorId,
        onSuccess: (d) => {
            if (d?.isFollowedByUser !== undefined) setFollowing(d.isFollowedByUser)
            if (d?.isLikedByUser !== undefined) setLiked(d.isLikedByUser)
            if (d?.isSavedByUser !== undefined) setSaved(d.isSavedByUser)
        },
    })

    const { data: posts = [], isLoading: postsLoading } = useQuery({
        queryKey: ["vendor-posts", vendorId],
        queryFn: () => fetchVendorPosts(vendorId),
        enabled: !!vendorId && activeTab === "posts",
    })

    const { data: reels = [], isLoading: reelsLoading } = useQuery({
        queryKey: ["vendor-reels", vendorId],
        queryFn: () => fetchVendorReels(vendorId),
        enabled: !!vendorId && activeTab === "reels",
    })

    const { data: portfolio, isLoading: portfolioLoading } = useQuery({
        queryKey: ["vendor-portfolio", vendorId],
        queryFn: () => fetchVendorPortfolio(vendorId),
        enabled: !!vendorId && activeTab === "portfolio",
    })

    const { data: reviewsData, isLoading: reviewsLoading } = useQuery({
        queryKey: ["vendor-reviews", vendorId],
        queryFn: () => fetchVendorReviews(vendorId),
        enabled: !!vendorId && activeTab === "reviews",
    })

    // ── Actions ────────────────────────────────────────────────────
    const handleFollow = async () => {
        if (actionLoading) return
        setActionLoading("follow")
        setFollowing((f) => !f)
        try {
            const token = await getCookies()
            await axiosInstance.post("/auth/users/vendor/follow", { vendorId }, { headers: { wedoraCredentials: token } })
        } catch { setFollowing((f) => !f) }
        finally { setActionLoading(null) }
    }

    const handleLike = async () => {
        if (actionLoading) return
        setActionLoading("like")
        setLiked((l) => !l)
        try {
            const token = await getCookies()
            await axiosInstance.post("/auth/users/vendor/like", { vendorId }, { headers: { wedoraCredentials: token } })
        } catch { setLiked((l) => !l) }
        finally { setActionLoading(null) }
    }

    const handleSave = async () => {
        if (actionLoading) return
        setActionLoading("save")
        setSaved((s) => !s)
        try {
            const token = await getCookies()
            await axiosInstance.post("/auth/users/vendor/save", { vendorId }, { headers: { wedoraCredentials: token } })
        } catch { setSaved((s) => !s) }
        finally { setActionLoading(null) }
    }

    const goBack = () => {
        const params = new URLSearchParams(searchParams.toString())
        params.delete("vendorId")
        params.set("tab", "home")
        router.push(`?${params.toString()}`)
    }

    // ── Guards ─────────────────────────────────────────────────────
    if (!vendorIdParam && !vendorNameParam) return null

    if (resolving || profileLoading) return (
        <div className="w-full h-screen flex items-center justify-center bg-[#0e0e0e]">
            <LuLoaderCircle className="animate-spin text-[#ff89ac] text-3xl" />
        </div>
    )

    if (profileError || !profile) return (
        <div className="w-full h-screen flex flex-col items-center justify-center gap-3 bg-[#0e0e0e]">
            <p className="text-[#adaaaa] text-sm">Could not load vendor profile.</p>
            <button onClick={goBack} className="text-[#ff89ac] text-sm underline">Go back</button>
        </div>
    )

    const coverUrl    = profile?.coverImages?.[0] || null
    const logo        = profile?.logo || null
    const stats       = profile?.stats || {}
    const socialLinks = profile?.socialLinks || {}

    return (
        <div className="w-full h-full overflow-y-auto bg-[#0e0e0e] pb-16">

            {/* ── Hero / Cover ──────────────────────────────────── */}
            <div className="relative h-[200px] sm:h-[300px] md:h-[400px] overflow-hidden">
                {coverUrl ? (
                    <img src={coverUrl} alt="cover" className="w-full h-full object-cover opacity-60" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#1a1919] via-[#2a1f2f] to-[#1a1919]" />
                )}
                {/* Bottom gradient fade into page bg */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-[rgba(14,14,14,0)] to-transparent" />

                {/* Back button */}
                <button
                    onClick={goBack}
                    className="absolute top-5 left-5 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-all border border-white/10"
                >
                    <LuArrowLeft />
                </button>
            </div>

            {/* ── Profile Header ────────────────────────────────── */}
            <div className="px-4 sm:px-6 md:px-8 -mt-14 sm:-mt-20 relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">
                    {/* Avatar + name — kept on one row across breakpoints */}
                    <div className="flex items-end gap-4 sm:gap-6 flex-1 min-w-0">
                    {/* Avatar with glow */}
                    <div className="relative flex-shrink-0">
                        {/* Glow blur behind avatar */}
                        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#ff89ac] to-[#a68cff] opacity-40 blur-[6px]" />
                        <div className="relative w-[96px] h-[96px] sm:w-[120px] sm:h-[120px] md:w-[140px] md:h-[140px] rounded-full border-4 border-[#0e0e0e] overflow-hidden shadow-2xl">
                            {logo ? (
                                <img src={logo} alt="logo" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-[#ff89ac] to-[#a68cff] flex items-center justify-center">
                                    <span className="text-black font-extrabold text-4xl">
                                        {profile?.businessName?.[0]?.toUpperCase() || "W"}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Name + meta */}
                    <div className="flex-1 min-w-0 pb-4">
                        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
                                {profile?.businessName || "Vendor"}
                            </h1>
                            {profile?.category && (
                                <span className="bg-[rgba(255,137,172,0.1)] border border-[rgba(255,137,172,0.2)] text-[#ff89ac] text-[10px] font-semibold px-3 py-1.5 rounded-full tracking-widest uppercase">
                                    {profile.category}
                                </span>
                            )}
                        </div>

                        {/* Meta row */}
                        <div className="flex items-center gap-5 mt-2 flex-wrap">
                            {stats.avgRating > 0 && (
                                <div className="flex items-center gap-1.5">
                                    <LuStar className="text-amber-400 fill-amber-400 text-sm" />
                                    <span className="text-white font-medium text-sm">{stats.avgRating?.toFixed(1)}</span>
                                    {stats.totalReviews > 0 && (
                                        <span className="text-[#adaaaa] text-sm">({stats.totalReviews} Reviews)</span>
                                    )}
                                </div>
                            )}
                            {(profile?.city || profile?.address) && (
                                <div className="flex items-center gap-1.5">
                                    <LuMapPin className="text-[#adaaaa] text-sm" />
                                    <span className="text-[#adaaaa] text-sm">{profile?.city || profile?.address}</span>
                                </div>
                            )}
                            {profile?.foundedYear && (
                                <div className="flex items-center gap-1.5">
                                    <LuCalendar className="text-[#adaaaa] text-sm" />
                                    <span className="text-[#adaaaa] text-sm">Professional since {profile.foundedYear}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    </div>{/* /avatar+name row */}

                    {/* Share Profile button */}
                    <div className="pb-1 sm:pb-4 flex-shrink-0 w-full sm:w-auto">
                        <button className="w-full sm:w-auto justify-center backdrop-blur-md bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white font-semibold text-sm px-7 py-3.5 rounded-full hover:bg-[rgba(255,255,255,0.1)] transition-all flex items-center gap-2">
                            <TbShare3 className="text-base" />
                            Share Profile
                        </button>
                    </div>
                </div>

                {/* Tagline */}
                {profile?.tagline && (
                    <p className="text-[#adaaaa] text-sm italic mt-4">"{profile.tagline}"</p>
                )}

                {/* Stats bar */}
                <div className="flex items-center flex-wrap gap-6 sm:gap-8 mt-6 py-4 border-y border-[#1f1f1f]">
                    {stats.totalBookings > 0 && (
                        <div className="flex flex-col gap-0.5">
                            <span className="text-white font-bold text-lg">{stats.totalBookings}</span>
                            <span className="text-[#52525b] text-xs uppercase tracking-wider">Events</span>
                        </div>
                    )}
                    {profile?.followedBy?.length > 0 && (
                        <div className="flex flex-col gap-0.5">
                            <span className="text-white font-bold text-lg">{profile.followedBy.length}</span>
                            <span className="text-[#52525b] text-xs uppercase tracking-wider">Followers</span>
                        </div>
                    )}
                    {stats.totalReviews > 0 && (
                        <div className="flex flex-col gap-0.5">
                            <span className="text-white font-bold text-lg">{stats.totalReviews}</span>
                            <span className="text-[#52525b] text-xs uppercase tracking-wider">Reviews</span>
                        </div>
                    )}
                    {profile?.teamSize && (
                        <div className="flex flex-col gap-0.5">
                            <span className="text-white font-bold text-lg">{profile.teamSize}</span>
                            <span className="text-[#52525b] text-xs uppercase tracking-wider">Team</span>
                        </div>
                    )}
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 mt-5">
                    <button
                        onClick={handleFollow}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full font-semibold text-sm transition-all ${
                            following
                                ? "bg-[#1f1f1f] text-[#adaaaa] border border-[#2a2828]"
                                : "bg-gradient-to-r from-[#ff89ac] to-[#a68cff] text-black shadow-[0px_0px_20px_0px_rgba(255,137,172,0.3)]"
                        }`}
                    >
                        {actionLoading === "follow"
                            ? <LuLoaderCircle className="animate-spin text-base" />
                            : following ? <IoCheckmark className="text-base" /> : <IoPersonAddOutline className="text-base" />
                        }
                        {following ? "Following" : "Follow"}
                    </button>

                    <button
                        onClick={handleLike}
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all border ${
                            liked
                                ? "bg-[#ff89ac]/10 border-[#ff89ac]/30"
                                : "bg-[#1f1f1f] border-[#2a2828]"
                        }`}
                    >
                        {liked
                            ? <FaHeart className="text-[#ff89ac] text-lg" />
                            : <FaRegHeart className="text-[#adaaaa] text-lg" />}
                    </button>

                    <button
                        onClick={handleSave}
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all border ${
                            saved
                                ? "bg-[#ff89ac]/10 border-[#ff89ac]/30"
                                : "bg-[#1f1f1f] border-[#2a2828]"
                        }`}
                    >
                        {saved
                            ? <FaBookmark className="text-[#ff89ac] text-lg" />
                            : <FaRegBookmark className="text-[#adaaaa] text-lg" />}
                    </button>

                    <button className="w-12 h-12 rounded-full flex items-center justify-center bg-[#1f1f1f] border border-[#2a2828] hover:border-[#ff89ac]/30 transition-all">
                        <MdOutlineMessage className="text-[#adaaaa] text-lg" />
                    </button>
                </div>

                {/* Social links */}
                {(socialLinks.instagram || socialLinks.youtube || socialLinks.facebook || socialLinks.website) && (
                    <div className="flex items-center gap-3 mt-4">
                        {socialLinks.instagram && (
                            <a href={socialLinks.instagram} target="_blank" rel="noreferrer"
                                className="w-10 h-10 rounded-full bg-[#1f1f1f] border border-[#2a2828] flex items-center justify-center text-[#adaaaa] hover:text-[#ff89ac] hover:border-[#ff89ac]/30 transition-all">
                                <LuInstagram />
                            </a>
                        )}
                        {socialLinks.youtube && (
                            <a href={socialLinks.youtube} target="_blank" rel="noreferrer"
                                className="w-10 h-10 rounded-full bg-[#1f1f1f] border border-[#2a2828] flex items-center justify-center text-[#adaaaa] hover:text-red-500 hover:border-red-500/30 transition-all">
                                <LuYoutube />
                            </a>
                        )}
                        {socialLinks.facebook && (
                            <a href={socialLinks.facebook} target="_blank" rel="noreferrer"
                                className="w-10 h-10 rounded-full bg-[#1f1f1f] border border-[#2a2828] flex items-center justify-center text-[#adaaaa] hover:text-blue-400 hover:border-blue-400/30 transition-all">
                                <FaFacebook />
                            </a>
                        )}
                        {socialLinks.website && (
                            <a href={socialLinks.website} target="_blank" rel="noreferrer"
                                className="w-10 h-10 rounded-full bg-[#1f1f1f] border border-[#2a2828] flex items-center justify-center text-[#adaaaa] hover:text-white hover:border-white/30 transition-all">
                                <LuGlobe />
                            </a>
                        )}
                    </div>
                )}

                {/* About / Bio */}
                {profile?.bio && (
                    <div className="mt-8">
                        <p className="text-[#71717a] text-xs font-bold uppercase tracking-widest mb-3">About</p>
                        <p className="text-[#adaaaa] text-sm leading-relaxed">{profile.bio}</p>
                    </div>
                )}

                {/* Service area pills */}
                {profile?.serviceAreas?.some(a => a.isPrimary) && (
                    <div className="flex flex-wrap gap-2 mt-4">
                        {profile.serviceAreas.map((area, i) => area.isPrimary && (
                            <span key={i} className="text-xs text-[#adaaaa] flex items-center gap-1 bg-[#1a1919] border border-[#2a2828] px-3 py-1.5 rounded-full">
                                <LuMapPin className="text-[#ff89ac] text-xs" />
                                Serves {area.city}
                            </span>
                        ))}
                    </div>
                )}

                {/* ── Services & Packages ───────────────────────── */}
                {profile?.services?.length > 0 && (
                    <div className="mt-10">
                        <p className="text-white text-2xl font-bold mb-6">Service Packages</p>
                        <div className="flex flex-col gap-3">
                            {profile.services.map((svc, i) => (
                                <ServiceAccordion key={i} service={svc} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* ── Tabs ─────────────────────────────────────────── */}
            <div className="sticky top-0 bg-[#0e0e0e]/90 backdrop-blur-md z-10 px-4 sm:px-6 md:px-8 mt-10 border-b border-[#1f1f1f]">
                <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                    {TABS.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={`flex items-center gap-1.5 px-3 sm:px-5 py-4 text-sm font-medium border-b-2 transition-all whitespace-nowrap flex-shrink-0 ${
                                activeTab === id
                                    ? "border-[#ff89ac] text-[#ff89ac]"
                                    : "border-transparent text-[#71717a] hover:text-[#adaaaa]"
                            }`}
                        >
                            <Icon className="text-base" />
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Tab Content ──────────────────────────────────── */}
            <div className="px-4 sm:px-6 md:px-8 mt-8">

                {/* Posts */}
                {activeTab === "posts" && (
                    postsLoading ? (
                        <div className="flex justify-center py-16">
                            <LuLoaderCircle className="animate-spin text-[#ff89ac] text-2xl" />
                        </div>
                    ) : posts.length === 0 ? (
                        <p className="text-center text-[#52525b] text-sm py-16">No posts yet</p>
                    ) : (
                        <div className="space-y-5 max-w-2xl mx-auto">
                            {posts.map((post) => (
                                <PostCard key={post._id} item={{ ...post, contentType: "post" }} />
                            ))}
                        </div>
                    )
                )}

                {/* Reels */}
                {activeTab === "reels" && (
                    reelsLoading ? (
                        <div className="flex justify-center py-16">
                            <LuLoaderCircle className="animate-spin text-[#ff89ac] text-2xl" />
                        </div>
                    ) : reels.length === 0 ? (
                        <p className="text-center text-[#52525b] text-sm py-16">No reels yet</p>
                    ) : (
                        <div className="space-y-5 max-w-2xl mx-auto">
                            {reels.map((reel) => (
                                <ReelCard key={reel._id} item={{ ...reel, contentType: "reel" }} />
                            ))}
                        </div>
                    )
                )}

                {/* Portfolio */}
                {activeTab === "portfolio" && (
                    portfolioLoading ? (
                        <div className="flex justify-center py-16">
                            <LuLoaderCircle className="animate-spin text-[#ff89ac] text-2xl" />
                        </div>
                    ) : !portfolio?.albums?.length ? (
                        <p className="text-center text-[#52525b] text-sm py-16">No portfolio albums yet</p>
                    ) : (
                        <div className="space-y-10">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-white text-2xl font-bold">Curated Portfolio</p>
                                <button className="text-[#ff89ac] text-sm font-semibold hover:underline">View All Gallery</button>
                            </div>
                            {portfolio.albums.filter((a) => a.isPublic !== false).map((album, i) => (
                                <div key={i}>
                                    <div className="flex items-center justify-between mb-3">
                                        <p className="font-semibold text-white text-sm">{album.title}</p>
                                        <span className="text-xs text-[#52525b]">{album.media?.length || 0} photos</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 rounded-[32px] overflow-hidden">
                                        {(album.media || []).slice(0, 6).map((m, j) => (
                                            <div key={j} className="aspect-square bg-[#1a1919] overflow-hidden rounded-lg">
                                                <img src={m.url} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                )}

                {/* Reviews */}
                {activeTab === "reviews" && (
                    reviewsLoading ? (
                        <div className="flex justify-center py-16">
                            <LuLoaderCircle className="animate-spin text-[#ff89ac] text-2xl" />
                        </div>
                    ) : !reviewsData?.reviews?.length ? (
                        <p className="text-center text-[#52525b] text-sm py-16">No reviews yet</p>
                    ) : (
                        <div>
                            {/* Rating summary header */}
                            {reviewsData?.stats && (
                                <div className="flex items-center justify-between mb-8">
                                    <p className="text-white text-2xl font-bold">Client Love</p>
                                    <div className="flex items-center gap-3">
                                        <span className="text-white text-2xl font-extrabold">
                                            {reviewsData.stats.averageRating?.toFixed(1) || "—"}
                                        </span>
                                        <StarRating value={reviewsData.stats.averageRating || 0} size="lg" />
                                    </div>
                                </div>
                            )}

                            {/* Rating breakdown */}
                            {reviewsData?.stats && (
                                <div className="bg-[#131313] border border-[rgba(255,255,255,0.05)] rounded-[32px] p-6 mb-8">
                                    <div className="space-y-2">
                                        {[5, 4, 3, 2, 1].map((star) => {
                                            const count = reviewsData.stats.ratingBreakdown?.[star] || 0
                                            const total = reviewsData.stats.totalReviews || 1
                                            return (
                                                <div key={star} className="flex items-center gap-3">
                                                    <span className="text-[#adaaaa] text-xs w-3">{star}</span>
                                                    <div className="flex-1 h-1.5 bg-[#1a1919] rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-amber-400 rounded-full"
                                                            style={{ width: `${(count / total) * 100}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs text-[#52525b] w-4">{count}</span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Review cards — 2-column grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {reviewsData.reviews.map((r, i) => (
                                    <ReviewCard key={i} review={r} />
                                ))}
                            </div>
                        </div>
                    )
                )}
            </div>

            {/* ── Footer ───────────────────────────────────────── */}
            <footer className="mt-20 mx-4 sm:mx-8 pt-12 border-t border-[rgba(39,39,42,0.4)] flex items-center justify-between flex-wrap gap-4">
                <div>
                    <p className="text-white font-semibold text-lg">Wedora</p>
                    <p className="text-[#71717a] text-[10px] uppercase tracking-widest mt-1">
                        © 2025 Wedora. Built for the elite.
                    </p>
                </div>
                <div className="flex gap-6">
                    {["Privacy", "Terms", "Support", "Careers"].map((l) => (
                        <span key={l} className="text-[#71717a] text-xs uppercase tracking-widest cursor-pointer hover:text-[#adaaaa] transition-colors">
                            {l}
                        </span>
                    ))}
                </div>
            </footer>
        </div>
    )
}

export { VendorPublicProfile }
