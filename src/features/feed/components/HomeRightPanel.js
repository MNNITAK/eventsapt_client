'use client'
import Link from "next/link"

const trendingCategories = [
    { name: "Luxury Weddings",     posts: "24.5k", color: "#ff89ac", fill: 80 },
    { name: "Destination Events",  posts: "18.2k", color: "#a68cff", fill: 60 },
    { name: "Floral Installations",posts: "12.9k", color: "#ea73fb", fill: 40 },
]

const eliteVendors = [
    { name: "Studio Noir",       specialty: "Interior Architecture",  initial: "S" },
    { name: "Marcus Sterling",   specialty: "Concierge Services",     initial: "M" },
    { name: "Aria Sommelier",    specialty: "Wine Curation",          initial: "A" },
]

export function HomeRightPanel() {
    return (
        <aside className="hidden md:flex flex-col gap-10 w-[280px] xl:w-[300px] flex-shrink-0 py-8 px-6 border-l border-[#1a1a1a] h-full sticky top-0 overflow-y-auto">

            {/* ── Trending Now ─────────────────────────────────── */}
            <section className="flex flex-col gap-6">
                <h3 className="text-[#71717a] text-xs font-bold tracking-widest uppercase">
                    Trending Now
                </h3>
                <div className="flex flex-col gap-4">
                    {trendingCategories.map((cat, i) => (
                        <div key={i} className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <span className="text-white text-sm font-semibold">{cat.name}</span>
                                <span className="text-[#52525b] text-xs">{cat.posts} posts</span>
                            </div>
                            {/* Progress bar */}
                            <div className="w-full h-1 bg-[#18181b] rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full"
                                    style={{ width: `${cat.fill}%`, backgroundColor: cat.color }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Elite Vendors ────────────────────────────────── */}
            <section className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-[#71717a] text-xs font-bold tracking-widest uppercase">
                        Elite Vendors
                    </h3>
                    <button className="text-[#ff89ac] text-xs font-semibold hover:underline">
                        See all
                    </button>
                </div>
                <div className="flex flex-col gap-5">
                    {eliteVendors.map((vendor, i) => (
                        <div key={i} className="flex items-center gap-3">
                            {/* Avatar */}
                            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#ff89ac] to-[#a68cff] flex items-center justify-center flex-shrink-0">
                                <span className="text-black font-bold text-sm">{vendor.initial}</span>
                            </div>
                            {/* Info */}
                            <div className="flex flex-col flex-1 min-w-0">
                                <span className="text-white text-xs font-semibold truncate">{vendor.name}</span>
                                <span className="text-[#adaaaa] text-[10px] truncate">{vendor.specialty}</span>
                            </div>
                            {/* Connect */}
                            <button className="bg-white text-black text-[10px] font-semibold px-3 py-1.5 rounded-full hover:bg-[#f0f0f0] transition-colors flex-shrink-0">
                                Connect
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Footer links ─────────────────────────────────── */}
            <footer className="flex flex-col gap-4 mt-auto pt-8 border-t border-[#1a1a1a]">
                <div className="flex flex-wrap gap-4">
                    {["Privacy", "Terms", "Support", "Careers"].map((link) => (
                        <Link
                            key={link}
                            href="#"
                            className="text-[#52525b] text-[10px] uppercase tracking-widest hover:text-[#adaaaa] transition-colors"
                        >
                            {link}
                        </Link>
                    ))}
                </div>
                <p className="text-[#3f3f46] text-[10px] uppercase tracking-widest leading-relaxed">
                    © 2025 Wedora. Built for the elite.
                </p>
            </footer>
        </aside>
    )
}
