'use client'

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ArrowRightLeft,
  Users,
  ToggleLeft,
  BookOpen,
  Wallet,
  FileText,
  CalendarClock,
  HelpCircle,
  ChevronLeft,
  Menu,
  X,
  TrendingUp
} from 'lucide-react';

const mainNavigation = [
  { name: 'Personal', href: '/user-profile/personal', icon: LayoutDashboard },
  { name: 'Memories', href: '/user-profile/memories', icon: ArrowRightLeft },
  { name: 'Trending', href: '/user-profile/trending', icon: TrendingUp },
  { name: 'Events', href: '/user-profile/events', icon: ToggleLeft },
  { name: 'Chats', href: '/user-profile/chats', icon: BookOpen },
];

const settingsNavigation = [
  { name: 'Base Wallet', href: '/user-profile/wallet', icon: Wallet },
  { name: 'My Contacts', href: '/user-profile/my-contacts', icon: Users },
  { name: 'Invoices', href: '/user-profile/invoices', icon: FileText },
  { name: 'Schedules', href: '/user-profile/schedules', icon: CalendarClock },
];

export  function Sidebar() {


  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  // Mobile drawer is closed by default; the sidebar is hidden off-canvas until
  // the hamburger opens it. On md+ the sidebar is always visible (static).
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobile = () => setMobileOpen(false);
 //console.log(pathname)
  return (
    <>
      {/* Mobile hamburger — opens the drawer */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-3 left-3 z-40 grid h-10 w-10 place-items-center rounded-xl bg-white text-gray-700 shadow-md border border-gray-100"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div onClick={closeMobile} className="md:hidden fixed inset-0 z-40 bg-black/40" />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 md:static md:z-auto flex h-screen flex-col bg-white border-r border-gray-100 py-4 shrink-0 transition-transform md:transition-all duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 w-72 px-6 ${
          isCollapsed ? 'md:w-20 md:px-4' : 'md:w-64 md:px-6'
        }`}
      >
      {/* Header & Toggle */}
      <div className={`flex items-center mb-10 transition-all duration-300 ${isCollapsed ? 'md:justify-center justify-between px-2' : 'justify-between px-2'}`}>
        <div className="flex items-center overflow-hidden">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#9a2143] text-white">
            <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin-slow"></div>
          </div>
          <span
            className={`font-bold text-gray-900 tracking-tight whitespace-nowrap transition-all duration-300 ${
              isCollapsed ? 'md:max-w-0 md:opacity-0 md:ml-0 max-w-[120px] opacity-100 ml-3 text-xl' : 'max-w-[120px] opacity-100 ml-3 text-xl'
            }`}
          >
                <div className="text-[20px] w-[100%] text-semibold text-black text-center"><span className="text-[#C94C73]">E</span>vents<span className="text-[#C94C73]">A</span>pt</div>

          </span>
        </div>

        {/* Desktop collapse toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:block p-1.5 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors shrink-0"
          aria-label="Toggle Sidebar"
        >
          {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </button>

        {/* Mobile close */}
        <button
          onClick={closeMobile}
          className="md:hidden p-1.5 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors shrink-0"
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
      </div>

      {/* Main Navigation */}
      <div className="mb-8">
        <h3 className={`text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 transition-all duration-300 ${
          isCollapsed ? 'md:opacity-0 md:h-0 md:overflow-hidden md:mb-0 opacity-100 px-4' : 'opacity-100 px-4'
        }`}>
          Main Navigation
        </h3>
        <nav className="flex flex-col gap-1">
          {mainNavigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={closeMobile}
                className={`flex items-center rounded-xl py-3 text-sm font-medium transition-all duration-200 group ${
                  isCollapsed ? 'md:justify-center md:px-0 px-4' : 'px-4'
                } ${
                  isActive
                    ? 'bg-[#f7d5e0] text-[#9a2143]'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
                title={isCollapsed ? item.name : undefined}
              >
                <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-[#9a2143]' : 'text-gray-400 group-hover:text-gray-600'}`} />
                <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${
                  isCollapsed ? 'md:max-w-0 md:opacity-0 md:ml-0 max-w-[200px] opacity-100 ml-3' : 'max-w-[200px] opacity-100 ml-3'
                }`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Settings & Schedules */}
      <div className="mb-auto">
        <h3 className={`text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 transition-all duration-300 ${
          isCollapsed ? 'md:opacity-0 md:h-0 md:overflow-hidden md:mb-0 opacity-100 px-4' : 'opacity-100 px-4'
        }`}>
          Settings & Schedules
        </h3>
        <nav className="flex flex-col gap-1">
          {settingsNavigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={closeMobile}
                className={`flex items-center rounded-xl py-3 text-sm font-medium transition-all duration-200 group ${
                  isCollapsed ? 'md:justify-center md:px-0 px-4' : 'px-4'
                } ${
                  isActive
                    ? 'bg-[#f7d5e0] text-[#9a2143]'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
                title={isCollapsed ? item.name : undefined}
              >
                <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${
                  isCollapsed ? 'md:max-w-0 md:opacity-0 md:ml-0 max-w-[200px] opacity-100 ml-3' : 'max-w-[200px] opacity-100 ml-3'
                }`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Help Center */}
      <div className={` transition-all duration-300 overflow-hidden ${
        isCollapsed ? 'md:h-12 md:w-12 md:rounded-xl md:mx-auto md:p-0 md:bg-transparent md:shadow-none relative rounded-2xl bg-gradient-to-br from-amber-200 to-orange-300 p-6 shadow-sm' : 'relative rounded-2xl bg-gradient-to-br from-amber-200 to-orange-300 p-6 shadow-sm'
      }`}>
        {/* Full Card View */}
        <div className={`transition-opacity duration-300 ${isCollapsed ? 'md:opacity-0 md:hidden opacity-100 block text-center' : 'opacity-100 block text-center'}`}>
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-white opacity-20 rounded-full blur-xl"></div>
          <div className="mx-auto mb-1 flex h-10 w-10 items-center justify-center rounded-full bg-white text-orange-400 shadow-sm">
            <HelpCircle className="h-6 w-6" />
          </div>
          <h4 className="font-bold text-gray-900 mb-2">Help Center</h4>
          <p className="text-xs text-orange-900/80 mb-5 leading-relaxed">
            Having trouble in Finti. Please contact us for more questions.
          </p>
          <button className="w-full rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm transition-all hover:bg-gray-50 hover:shadow">
            Go To Help Center
          </button>
        </div>

        {/* Collapsed Icon View (desktop only) */}
        <button
          className={`h-full w-full items-center justify-center rounded-xl bg-pink-300 text-[#9a2143] transition-all ${
            isCollapsed ? 'md:opacity-100 md:flex hidden' : 'hidden'
          }`}
          title="Help Center"
        >
          <HelpCircle className="h-6 w-6" />
        </button>
      </div>
    </aside>
    </>
  );
}
