"use client";

import React, { useState, useEffect } from 'react';
import {
    PartyPopper,
    Rings,
    Briefcase,
    Cake,
    Baby,
    Music,
    Star,
    ShieldCheck,
    Users
} from 'lucide-react';
import { useRouter } from 'next/navigation';
// --- Typing Effect Hook ---
import { RightPanel } from './RightPanel.js';
import { v4 as uuidv4 } from 'uuid';
import { useEventDraft } from '../../event-wizard/hooks/useEventDraft.js';
// --- Main Component ---
export function CreateEventLandingPage() {
    const router = useRouter();
    
    // creating UID for event workspace
    const [eventUID] = useState(uuidv4());
    const {
        hydrated,
        draft,
        upsertDraft,
        upsertDraftDebounced,
        setDraft,
        removeDraft,
        clearAllDrafts,
    } = useEventDraft(eventUID);

    // local data store
    const [title, setTitle] = useState('');
    const [selectedType, setSelectedType] = useState(null);

    const eventTypes = [
        { id: 'wedding', label: 'Wedding', icon: <PartyPopper size={18} /> },
        { id: 'birthday', label: 'Birthday', icon: <Cake size={18} /> },
        { id: 'corporate', label: 'Corporate', icon: <Briefcase size={18} /> },
        { id: 'baby-shower', label: 'Baby Shower', icon: <Baby size={18} /> },
        { id: 'party', label: 'Private Party', icon: <Music size={18} /> },
    ];
    const createEventWorkSpace = () => {
        const newDraft = {
            title: title,
            type: selectedType,
        };
        upsertDraft(newDraft);

        // call your api endpoint here to create the most outer layer of event

        //----------------on successful create execute the below line---------

        router.replace(`/event-wizard/${selectedType}/steps?node=${eventUID}`)
    }
    

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 font-sans">

            {/* LEFT PANEL - 30% */}
            <div className="w-full md:w-[30%] bg-white p-8 lg:p-12 shadow-[4px_0_24px_rgba(0,0,0,0.05)] z-10 flex flex-col justify-center min-h-screen">
                <div className="max-w-md mx-auto w-full">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Create an Event</h2>
                    <p className="text-gray-500 mb-8 text-sm">Let's start by setting up the basics for your upcoming celebration.</p>

                    <div className="space-y-6">
                        {/* Event Title Input */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Event Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g., Sarah's 30th Birthday"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Event Type Chips */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Type of Event</label>
                            <div className="flex flex-wrap gap-3">
                                {eventTypes.map((type) => (
                                    <button
                                        key={type.id}
                                        onClick={() => setSelectedType(type.id)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200 ease-in-out
                      ${selectedType === type.id
                                                ? 'bg-pink-500 border-pink-500 text-white shadow-md transform scale-105'
                                                : 'bg-white border-gray-200 text-gray-600 hover:border-pink-300 hover:bg-pink-50'
                                            }`}
                                    >
                                        {type.icon}
                                        {type.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={createEventWorkSpace}
                            disabled={!title || !selectedType}
                            className="w-full mt-8 bg-gray-900 text-white py-3.5 rounded-xl font-semibold hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                        >
                            Create Workspace
                        </button>
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL - 70% */}
            <RightPanel />
        </div>
    );
}