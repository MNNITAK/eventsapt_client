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
import { TbMovie } from "react-icons/tb"
import { RiImageLine } from "react-icons/ri"
import { BiMessageSquareDetail } from "react-icons/bi"
import { CommentsDrawer } from "@/features/feed/components/CommentsDrawer"
import { PostCard } from "@/features/feed/components/PostCard"
import { ReelCard } from "@/features/feed/components/ReelCard"

// ── Small sub-components ────────────────────────────────────────────────────

const StarRating = ({ value = 0, max = 5 }) => (
    <div className="flex gap-0.5">
        {Array.from({ length: max }).map((_, i) => (
            <LuStar
                key={i}
                className={`text-sm ${i < Math.round(value) ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
            />
        ))}
    </div>
)

const ReviewCard = ({ review }) => (
    <div className="bg-gray-50 rounded-2xl p-4 mb-3">
        <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#C94C73] to-[#f5a3bb] flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">
                    {review?.reviewer?.name?.[0]?.toUpperCase() || "U"}
                </span>
            </div>
            <div>
                <p className="text-sm font-semibold text-gray-800">{review?.reviewer?.name || "Guest"}</p>
                <StarRating value={review?.rating || 0} />
            </div>
            {review?.createdAt && (
                <span className="ml-auto text-[11px] text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                </span>
            )}
        </div>
        {review?.title && <p className="text-sm font-medium text-gray-700 mb-1">{review.title}</p>}
        {review?.review && <p className="text-sm text-gray-600 leading-relaxed">{review.review}</p>}
        {review?.vendorResponse?.response && (
            <div className="mt-3 pl-3 border-l-2 border-[#C94C73]">
                <p className="text-xs text-[#C94C73] font-semibold mb-0.5">Vendor replied</p>
                <p className="text-xs text-gray-600">{review.vendorResponse.response}</p>
            </div>
        )}
    </div>
)

const ServiceAccordion = ({ service }) => {
    const [open, setOpen] = useState(false)
    return (
        <div className="border border-gray-100 rounded-2xl overflow-hidden mb-3">
            <button
                onClick={() => setOpen((o) => !o)}
                className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50 transition-colors"
            >
                <div className="text-left">
                    <p className="font-semibold text-gray-800 text-sm">{service?.category}</p>
                    {service?.description && (
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{service.description}</p>
                    )}
                </div>
                {open ? <BsChevronUp className="text-gray-400 flex-shrink-0" /> : <BsChevronDown className="text-gray-400 flex-shrink-0" />}
            </button>

            {open && service?.packages?.length > 0 && (
                <div className="px-4 pb-4 pt-1 bg-gray-50 space-y-3">
                    {service.packages.map((pkg, i) => (
                        <div key={i} className="bg-white rounded-xl p-3 shadow-sm">
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <p className="font-semibold text-sm text-gray-800">{pkg.name}</p>
                                    {pkg.description && (
                                        <p className="text-xs text-gray-500 mt-0.5">{pkg.description}</p>
                                    )}
                                </div>
                                {pkg.price && (
                                    <div className="text-right flex-shrink-0">
                                        <p className="text-sm font-bold text-[#C94C73]">
                                            ₹{Number(pkg.price).toLocaleString("en-IN")}
                                        </p>
                                        {pkg.priceType && (
                                            <p className="text-[10px] text-gray-400">{pkg.priceType}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                            {pkg.deliverables?.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {pkg.deliverables.slice(0, 4).map((d, j) => (
                                        <span key={j} className="text-[10px] bg-[#fff0f4] text-[#C94C73] px-2 py-0.5 rounded-full">
                                            {d}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

// ── Main Component ──────────────────────────────────────────────────────────

const TABS = [
    { id: "posts", label: "Posts", icon: RiImageLine },
    { id: "reels", label: "Reels", icon: TbMovie },
    { id: "portfolio", label: "Portfolio", icon: BsGridFill },
    { id: "reviews", label: "Reviews", icon: BiMessageSquareDetail },
]

const VendorPublicProfile = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const vendorIdParam = searchParams.get("vendorId")
    const vendorNameParam = searchParams.get("vendorName")

    // Step 1: resolve vendorId — either direct from param, or look up by name
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

    // ── Data fetching ──────────────────────────────────────────────
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
            await axiosInstance.post("/auth/users/vendor/follow", { vendorId }, {
                headers: { wedoraCredentials: token },
            })
        } catch {
            setFollowing((f) => !f)
        } finally {
            setActionLoading(null)
        }
    }

    const handleLike = async () => {
        if (actionLoading) return
        setActionLoading("like")
        setLiked((l) => !l)
        try {
            const token = await getCookies()
            await axiosInstance.post("/auth/users/vendor/like", { vendorId }, {
                headers: { wedoraCredentials: token },
            })
        } catch {
            setLiked((l) => !l)
        } finally {
            setActionLoading(null)
        }
    }

    const handleSave = async () => {
        if (actionLoading) return
        setActionLoading("save")
        setSaved((s) => !s)
        try {
            const token = await getCookies()
            await axiosInstance.post("/auth/users/vendor/save", { vendorId }, {
                headers: { wedoraCredentials: token },
            })
        } catch {
            setSaved((s) => !s)
        } finally {
            setActionLoading(null)
        }
    }

    const goBack = () => {
        const params = new URLSearchParams(searchParams.toString())
        params.delete("vendorId")
        params.set("tab", "home")
        router.push(`?${params.toString()}`)
    }

    // ── Render ─────────────────────────────────────────────────────
    if (!vendorIdParam && !vendorNameParam) return null

    if (resolving || profileLoading) return (
        <div className="w-full h-screen flex items-center justify-center">
            <LuLoaderCircle className="animate-spin text-[#C94C73] text-3xl" />
        </div>
    )

    if (profileError || !profile) return (
        <div className="w-full h-screen flex flex-col items-center justify-center gap-3">
            <p className="text-gray-500 text-sm">Could not load vendor profile.</p>
            <button onClick={goBack} className="text-[#C94C73] text-sm underline">Go back</button>
        </div>
    )

    const coverImages = profile?.coverImages || []
    const coverUrl = coverImages[0] || null
    const logo = profile?.logo || null
    const stats = profile?.stats || {}
    const socialLinks = profile?.socialLinks || {}

    return (
        <div className="w-full h-full overflow-y-auto bg-white pb-10">

            {/* ── Hero ──────────────────────────────────────────── */}
            <div className="relative">
                {/* Cover image */}
                <div className="w-full h-48 bg-gradient-to-br from-[#C94C73] to-[#f5a3bb] relative">
                    {coverUrl && (
                        <img src={coverUrl} alt="cover" className="w-full h-full object-cover" />
                    )}
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                    {/* Back button */}
                    <button
                        onClick={goBack}
                        className="absolute top-4 left-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-all"
                    >
                        <LuArrowLeft />
                    </button>
                </div>

                {/* Logo */}
                <div className="absolute left-5 -bottom-10 w-20 h-20 rounded-2xl border-4 border-white shadow-lg bg-white overflow-hidden">
                    {logo ? (
                        <img src={logo} alt="logo" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#C94C73] to-[#f5a3bb] flex items-center justify-center">
                            <span className="text-white font-bold text-2xl">
                                {profile?.businessName?.[0]?.toUpperCase() || "W"}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Name + actions ────────────────────────────────── */}
            <div className="pt-14 px-5">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                        <h1 className="text-xl font-bold text-gray-900 leading-tight">
                            {profile?.businessName || "Vendor"}
                        </h1>
                        <div className="flex items-center flex-wrap gap-2 mt-1">
                            {profile?.category && (
                                <span className="text-xs bg-[#fff0f4] text-[#C94C73] font-semibold px-2.5 py-0.5 rounded-full border border-[#f5c8d6]">
                                    {profile.category}
                                </span>
                            )}
                            {(profile?.city || profile?.address) && (
                                <span className="text-xs text-gray-500 flex items-center gap-0.5">
                                    <LuMapPin className="text-[#C94C73] text-xs" />
                                    {profile?.city || profile?.address}
                                </span>
                            )}
                        </div>
                        {profile?.tagline && (
                            <p className="text-sm text-gray-500 mt-2 italic">"{profile.tagline}"</p>
                        )}
                    </div>
                </div>

                {/* Stats row */}
                <div className="flex items-center gap-5 mt-4 py-3 border-y border-gray-100">
                    {stats.avgRating > 0 && (
                        <div className="flex flex-col items-center gap-0.5">
                            <div className="flex items-center gap-1">
                                <LuStar className="text-amber-400 fill-amber-400 text-sm" />
                                <span className="font-bold text-gray-800 text-sm">{stats.avgRating?.toFixed(1)}</span>
                            </div>
                            <span className="text-[10px] text-gray-400">Rating</span>
                        </div>
                    )}
                    {stats.totalReviews > 0 && (
                        <div className="flex flex-col items-center gap-0.5">
                            <span className="font-bold text-gray-800 text-sm">{stats.totalReviews}</span>
                            <span className="text-[10px] text-gray-400">Reviews</span>
                        </div>
                    )}
                    {stats.totalBookings > 0 && (
                        <div className="flex flex-col items-center gap-0.5">
                            <span className="font-bold text-gray-800 text-sm">{stats.totalBookings}</span>
                            <span className="text-[10px] text-gray-400">Events</span>
                        </div>
                    )}
                    {profile?.followedBy?.length > 0 && (
                        <div className="flex flex-col items-center gap-0.5">
                            <span className="font-bold text-gray-800 text-sm">{profile.followedBy.length}</span>
                            <span className="text-[10px] text-gray-400">Followers</span>
                        </div>
                    )}
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 mt-4">
                    <button
                        onClick={handleFollow}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                            following
                                ? "bg-gray-100 text-gray-700"
                                : "bg-[#C94C73] text-white shadow-md shadow-[#C94C73]/30"
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
                        className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all border ${
                            liked ? "bg-[#fff0f4] border-[#f5c8d6]" : "bg-gray-50 border-gray-200"
                        }`}
                    >
                        {liked
                            ? <FaHeart className="text-[#C94C73] text-lg" />
                            : <FaRegHeart className="text-gray-500 text-lg" />
                        }
                    </button>

                    <button
                        onClick={handleSave}
                        className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all border ${
                            saved ? "bg-[#fff0f4] border-[#f5c8d6]" : "bg-gray-50 border-gray-200"
                        }`}
                    >
                        {saved
                            ? <FaBookmark className="text-[#C94C73] text-lg" />
                            : <FaRegBookmark className="text-gray-500 text-lg" />
                        }
                    </button>

                    <button className="w-11 h-11 rounded-xl flex items-center justify-center bg-gray-50 border border-gray-200">
                        <MdOutlineMessage className="text-gray-500 text-lg" />
                    </button>
                </div>

                {/* Social links */}
                {(socialLinks.instagram || socialLinks.youtube || socialLinks.facebook || socialLinks.website) && (
                    <div className="flex items-center gap-3 mt-4">
                        {socialLinks.instagram && (
                            <a href={socialLinks.instagram} target="_blank" rel="noreferrer"
                                className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-[#C94C73] transition-colors">
                                <LuInstagram />
                            </a>
                        )}
                        {socialLinks.youtube && (
                            <a href={socialLinks.youtube} target="_blank" rel="noreferrer"
                                className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-red-500 transition-colors">
                                <LuYoutube />
                            </a>
                        )}
                        {socialLinks.facebook && (
                            <a href={socialLinks.facebook} target="_blank" rel="noreferrer"
                                className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-blue-600 transition-colors">
                                <FaFacebook />
                            </a>
                        )}
                        {socialLinks.website && (
                            <a href={socialLinks.website} target="_blank" rel="noreferrer"
                                className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors">
                                <LuGlobe />
                            </a>
                        )}
                    </div>
                )}

                {/* About */}
                {profile?.bio && (
                    <div className="mt-5">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">About</p>
                        <p className="text-sm text-gray-700 leading-relaxed">{profile.bio}</p>
                    </div>
                )}

                {/* Meta info pills */}
                <div className="flex flex-wrap gap-2 mt-4">
                    {profile?.foundedYear && (
                        <span className="text-xs text-gray-500 flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                            <LuCalendar className="text-[#C94C73]" />
                            Since {profile.foundedYear}
                        </span>
                    )}
                    {profile?.teamSize && (
                        <span className="text-xs text-gray-500 flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                            <LuUsers className="text-[#C94C73]" />
                            {profile.teamSize} team members
                        </span>
                    )}
                    {profile?.serviceAreas?.map((area, i) => area.isPrimary && (
                        <span key={i} className="text-xs text-gray-500 flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                            <LuMapPin className="text-[#C94C73]" />
                            Serves {area.city}
                        </span>
                    ))}
                </div>

                {/* Services accordion */}
                {profile?.services?.length > 0 && (
                    <div className="mt-6">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Services & Packages</p>
                        {profile.services.map((svc, i) => (
                            <ServiceAccordion key={i} service={svc} />
                        ))}
                    </div>
                )}
            </div>

            {/* ── Tabs ─────────────────────────────────────────── */}
            <div className="sticky top-0 bg-white z-10 px-5 mt-6 border-b border-gray-100">
                <div className="flex gap-1">
                    {TABS.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                                activeTab === id
                                    ? "border-[#C94C73] text-[#C94C73]"
                                    : "border-transparent text-gray-400 hover:text-gray-600"
                            }`}
                        >
                            <Icon className="text-base" />
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Tab content ──────────────────────────────────── */}
            <div className="px-4 mt-5">

                {/* Posts tab */}
                {activeTab === "posts" && (
                    postsLoading ? (
                        <div className="flex justify-center py-10">
                            <LuLoaderCircle className="animate-spin text-[#C94C73] text-2xl" />
                        </div>
                    ) : posts.length === 0 ? (
                        <p className="text-center text-gray-400 text-sm py-10">No posts yet</p>
                    ) : (
                        <div className="space-y-4">
                            {posts.map((post) => (
                                <PostCard key={post._id} item={{ ...post, contentType: "post" }} />
                            ))}
                        </div>
                    )
                )}

                {/* Reels tab */}
                {activeTab === "reels" && (
                    reelsLoading ? (
                        <div className="flex justify-center py-10">
                            <LuLoaderCircle className="animate-spin text-[#C94C73] text-2xl" />
                        </div>
                    ) : reels.length === 0 ? (
                        <p className="text-center text-gray-400 text-sm py-10">No reels yet</p>
                    ) : (
                        <div className="space-y-4">
                            {reels.map((reel) => (
                                <ReelCard key={reel._id} item={{ ...reel, contentType: "reel" }} />
                            ))}
                        </div>
                    )
                )}

                {/* Portfolio tab */}
                {activeTab === "portfolio" && (
                    portfolioLoading ? (
                        <div className="flex justify-center py-10">
                            <LuLoaderCircle className="animate-spin text-[#C94C73] text-2xl" />
                        </div>
                    ) : !portfolio || portfolio?.albums?.length === 0 ? (
                        <p className="text-center text-gray-400 text-sm py-10">No portfolio albums yet</p>
                    ) : (
                        <div className="space-y-6">
                            {portfolio.albums.filter((a) => a.isPublic !== false).map((album, i) => (
                                <div key={i}>
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="font-semibold text-gray-800 text-sm">{album.name}</p>
                                        <span className="text-xs text-gray-400">{album.media?.length || 0} photos</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-1 rounded-xl overflow-hidden">
                                        {(album.media || []).slice(0, 9).map((m, j) => (
                                            <div key={j} className="aspect-square bg-gray-100 overflow-hidden">
                                                <img src={m.url} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                )}

                {/* Reviews tab */}
                {activeTab === "reviews" && (
                    reviewsLoading ? (
                        <div className="flex justify-center py-10">
                            <LuLoaderCircle className="animate-spin text-[#C94C73] text-2xl" />
                        </div>
                    ) : !reviewsData?.reviews?.length ? (
                        <p className="text-center text-gray-400 text-sm py-10">No reviews yet</p>
                    ) : (
                        <div>
                            {/* Rating summary */}
                            {reviewsData?.stats && (
                                <div className="flex items-center gap-4 bg-gray-50 rounded-2xl p-4 mb-5">
                                    <div className="text-center">
                                        <p className="text-4xl font-bold text-gray-900">{reviewsData.stats.averageRating?.toFixed(1) || "—"}</p>
                                        <StarRating value={reviewsData.stats.averageRating || 0} />
                                        <p className="text-xs text-gray-400 mt-1">{reviewsData.stats.totalReviews || 0} reviews</p>
                                    </div>
                                    <div className="flex-1 space-y-1.5">
                                        {[5, 4, 3, 2, 1].map((star) => {
                                            const count = reviewsData.stats.ratingBreakdown?.[star] || 0
                                            const total = reviewsData.stats.totalReviews || 1
                                            return (
                                                <div key={star} className="flex items-center gap-2">
                                                    <span className="text-xs text-gray-500 w-3">{star}</span>
                                                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-amber-400 rounded-full"
                                                            style={{ width: `${(count / total) * 100}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs text-gray-400 w-4">{count}</span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}
                            {reviewsData.reviews.map((r, i) => (
                                <ReviewCard key={i} review={r} />
                            ))}
                        </div>
                    )
                )}
            </div>
        </div>
    )
}

export { VendorPublicProfile }
