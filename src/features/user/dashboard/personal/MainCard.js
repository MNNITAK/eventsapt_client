'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Heart, Share2, X, Upload, FolderPlus } from 'lucide-react';

const MultiWeddingMoodboards = () => {
  // Demo data - in production replace with API fetch (Supabase/Prisma/Firebase)
  const [moodboards, setMoodboards] = useState([
    {
      id: 'mb1',
      title: 'Decor & Mandap',
      description: 'Floral arrangements and stage ideas for Varanasi wedding',
      pins: [
        { id: 'p1', url: 'https://picsum.photos/id/1015/600/800', alt: 'Mandap style', tag: 'Mandap style' },
        { id: 'p2', url: 'https://picsum.photos/id/251/600/480', alt: 'Floral mandap', tag: 'Floral mandap' },
      ],
      createdAt: '2025-03-30',
    },
    {
      id: 'mb2',
      title: 'Outfit & Jewelry',
      description: 'Bridal & groom looks + accessories',
      pins: [
        { id: 'p3', url: 'https://picsum.photos/id/401/600/820', alt: 'Decor details', tag: 'Lehenga inspiration' },
        { id: 'p4', url: 'https://picsum.photos/id/1005/600/700', alt: 'Couple portrait', tag: 'Jewelry set' },
      ],
      createdAt: '2025-03-31',
    },
  ]);

  const [selectedMoodboardId, setSelectedMoodboardId] = useState(moodboards[0]?.id || '');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddPinModal, setShowAddPinModal] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [newBoardDesc, setNewBoardDesc] = useState('');
  const [newPinUrl, setNewPinUrl] = useState('');
  const [newPinTag, setNewPinTag] = useState('');

  const currentMoodboard = moodboards.find((mb) => mb.id === selectedMoodboardId);

  // Add new moodboard
  const handleCreateMoodboard = () => {
    if (!newBoardTitle.trim()) return;

    const newBoard = {
      id: `mb-${Date.now()}`,
      title: newBoardTitle,
      description: newBoardDesc || undefined,
      pins: [],
      createdAt: new Date().toISOString().split('T')[0],
    };

    setMoodboards((prev) => [...prev, newBoard]);
    setSelectedMoodboardId(newBoard.id);
    setNewBoardTitle('');
    setNewBoardDesc('');
    setShowCreateModal(false);
  };

  // Delete moodboard
  const handleDeleteMoodboard = (id) => {
    if (confirm('Delete this entire moodboard and all its pins?')) {
      setMoodboards((prev) => prev.filter((mb) => mb.id !== id));
      if (selectedMoodboardId === id) {
        setSelectedMoodboardId(moodboards[0]?.id || '');
      }
    }
  };

  // Add pin to current moodboard
  const handleAddPin = () => {
    if (!newPinUrl.trim() || !currentMoodboard) return;

    const newPin = {
      id: `p-${Date.now()}`,
      url: newPinUrl,
      alt: newPinTag || 'Wedding inspiration',
      tag: newPinTag || 'New pin',
    };

    setMoodboards((prev) =>
      prev.map((mb) =>
        mb.id === selectedMoodboardId
          ? { ...mb, pins: [...mb.pins, newPin] }
          : mb
      )
    );

    setNewPinUrl('');
    setNewPinTag('');
    setShowAddPinModal(false);
  };

  // Delete single pin
  const handleDeletePin = (pinId) => {
    if (!currentMoodboard) return;
    if (confirm('Remove this pin from moodboard?')) {
      setMoodboards((prev) =>
        prev.map((mb) =>
          mb.id === selectedMoodboardId
            ? { ...mb, pins: mb.pins.filter((p) => p.id !== pinId) }
            : mb
        )
      );
    }
  };

  // Toggle heart (demo favorite)
  const toggleFavorite = (pinId) => {
    console.log('❤️ Pin favorited:', pinId);
    // Extend later if you want to add isFavorite field
  };

  return (
    <div className="w-[95%] mx-auto mt-5 mb-5 bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-md border border-purple-100">
      {/* Header + Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900 tracking-tight">My Wedding Moodboards</h2>
          <p className="text-[#C94C73] text-lg">Organize inspiration for every part of your big day</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Create new moodboard */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[#C94C73]  text-white rounded-2xl font-medium shadow-md  transition-all active:scale-95"
          >
            <FolderPlus className="w-5 h-5" />
            New Moodboard
          </button>

          {/* Add pin to current */}
          {currentMoodboard && (
            <button
              onClick={() => setShowAddPinModal(true)}
              className="flex items-center gap-2 px-6 py-3 border border-[#C94C73] text-[#C94C73] rounded-2xl font-medium transition-all"
            >
              <Upload className="w-5 h-5" />
              Add Pin
            </button>
          )}

          {/* Share current moodboard */}
          {currentMoodboard && (
            <button
              onClick={() => {
                navigator.clipboard.writeText(`https://eventsapt.com/moodboard/${selectedMoodboardId}`);
                alert('🔗 Moodboard link copied!');
              }}
              className="flex items-center gap-2 px-6 py-3 border border-[#C94C73] hover:border-[#C94C73] text-[#C94C73] rounded-2xl font-medium transition-all"
            >
              <Share2 className="w-5 h-5" />
              Share
            </button>
          )}
        </div>
      </div>

      {/* Moodboard Tabs / Selector */}
      <div className="flex gap-2 overflow-x-auto pb-4 border-b border-purple-100 mb-8">
        {moodboards.map((board) => (
          <div
            key={board.id}
            onClick={() => setSelectedMoodboardId(board.id)}
            className={`group flex-shrink-0 flex items-center gap-3 px-6 py-3 rounded-3xl cursor-pointer transition-all ${
              board.id === selectedMoodboardId
                ? 'bg-[#C94C73] text-white shadow-md'
                : 'bg-white hover:bg-[#C94C73] border border-[#C94C73] text-[#C94C73] hover:text-[white]'
            }`}
          >
            <div className="text-sm font-medium">{board.title}</div>
            <div className="text-xs opacity-70">({board.pins.length})</div>

            {/* Delete button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteMoodboard(board.id);
              }}
              className="ml-auto opacity-0 group-hover:opacity-100 hover:text-white transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Current Moodboard Content */}
      {currentMoodboard ? (
        <>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900">{currentMoodboard.title}</h3>
              {currentMoodboard.description && (
                <p className="text-[#C94C73] mt-1">{currentMoodboard.description}</p>
              )}
            </div>
            <div className="text-sm text-[#C94C73]">
              {currentMoodboard.pins.length} pins • Created {currentMoodboard.createdAt}
            </div>
          </div>

          {/* Masonry Grid */}
          <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
            {currentMoodboard.pins.map((pin) => (
              <div
                key={pin.id}
                className="break-inside-avoid mb-4 group relative rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <img
                  src={pin.url}
                  alt={pin.alt}
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/60 to-transparent" />

                <div className="absolute bottom-4 left-4 bg-white/90 text-[#C94C73] text-sm font-medium px-4 py-1 rounded-2xl backdrop-blur-md">
                  {pin.tag}
                </div>

                {/* Heart */}
                <button
                  onClick={() => toggleFavorite(pin.id)}
                  className="absolute top-4 right-16 p-3 bg-white/80 hover:bg-white rounded-2xl shadow transition-all active:scale-90"
                >
                  <Heart className="w-6 h-6 text-red-400" />
                </button>

                {/* Delete pin */}
                <button
                  onClick={() => handleDeletePin(pin.id)}
                  className="absolute top-4 right-4 p-3 bg-white/80 hover:bg-red-50 hover:text-red-500 rounded-2xl shadow transition-all active:scale-90"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          {currentMoodboard.pins.length === 0 && (
            <div className="text-center py-16 border-2 border-dashed border-purple-200 rounded-3xl">
              <p className="text-purple-400 text-xl">No pins yet in this moodboard</p>
              <button
                onClick={() => setShowAddPinModal(true)}
                className="mt-6 px-8 py-3 bg-purple-100 text-[#C94C73] rounded-2xl  transition-all font-medium"
              >
                Add your first pin
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="text-center py-12 text-[#C94C73]">No moodboards yet. Create one above!</p>
      )}

      {/* CREATE MOODBOARD MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-2xl font-semibold">Create New Moodboard</h4>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <input
              type="text"
              placeholder="Moodboard title (e.g. Venue Ideas)"
              value={newBoardTitle}
              onChange={(e) => setNewBoardTitle(e.target.value)}
              className="w-full px-5 py-4 border border-[#C94C73] rounded-2xl focus:outline-none focus:border-[#C94C73] mb-4"
            />

            <textarea
              placeholder="Optional description"
              value={newBoardDesc}
              onChange={(e) => setNewBoardDesc(e.target.value)}
              className="w-full px-5 py-4 border border-[#C94C73] rounded-2xl focus:outline-none focus:border-[#C94C73] h-28 resize-none"
            />

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-4 border border-[#C94C73] rounded-2xl font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateMoodboard}
                className="flex-1 py-4 bg-[#C94C73] text-white rounded-2xl font-medium"
              >
                Create Moodboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD PIN MODAL */}
      {showAddPinModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-2xl font-semibold">Add New Pin</h4>
              <button onClick={() => setShowAddPinModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <input
              type="text"
              placeholder="Image URL (or upload in production)"
              value={newPinUrl}
              onChange={(e) => setNewPinUrl(e.target.value)}
              className="w-full px-5 py-4 border border-[#f2c2d1] rounded-2xl focus:outline-none focus:border-[#C94C73] mb-4"
            />

            <input
              type="text"
              placeholder="Tag (e.g. Reception lighting)"
              value={newPinTag}
              onChange={(e) => setNewPinTag(e.target.value)}
              className="w-full px-5 py-4 border border-[#f2c2d1] rounded-2xl focus:outline-none focus:border-[#C94C73] mb-6"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setShowAddPinModal(false)}
                className="flex-1 py-4 border border-[#f2c2d1] rounded-2xl font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPin}
                className="flex-1 py-4 bg-[#C94C73] text-white rounded-2xl font-medium"
              >
                Add to Moodboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { MultiWeddingMoodboards };