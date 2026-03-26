"use client";

import { useRef, useState, useEffect } from "react";
import { ImageUp, X, Loader2 } from "lucide-react";

export  function CreatePostBox() {
  const fileInputRef = useRef(null);

  const [text, setText] = useState("");
  const [images, setImages] = useState([]); 
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    const newImages = files
      .filter(file => file.type.startsWith("image/"))
      .map(file => ({
        file,
        preview: URL.createObjectURL(file),
      }));

    setImages(prev => [...prev, ...newImages]);
    
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index) => {
    setImages(prev => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleCreate = async () => {
    if (!text && images.length === 0) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("text", text);
      
      images.forEach((img) => {
        formData.append("images", img.file); 
      });

      // Simulating a backend delay for demonstration
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log("Uploaded successfully!");

      images.forEach(img => URL.revokeObjectURL(img.preview));
      setImages([]);
      setText("");

    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    return () => {
      images.forEach(img => URL.revokeObjectURL(img.preview));
    };
  }, [images]);

  return (
    <>
    <div className="w-[100%]">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-md">
        <h3 className="text-sm font-semibold text-slate-700">
          Want to create something?
        </h3>

        {/* TEXTAREA */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isUploading}
          className="mt-2 min-h-20 w-full resize-none rounded-xl border border-[#efc2d1] px-4 py-3 text-sm outline-none focus:border-[#C94C73] focus:ring-2 focus:ring-[#f4d8e1] disabled:opacity-50"
          placeholder="e.g I am looking to host a reception party with venues looking like the photos attached"
        />

        {/* IMAGE PREVIEW GRID */}
        {images.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-3">
            {images.map((img, index) => (
              <div
                key={index}
                className={`relative h-24 w-full overflow-hidden rounded-xl border ${isUploading ? 'opacity-50' : ''}`}
              >
                <img
                  src={img.preview}
                  alt="preview"
                  className="h-full w-full object-cover"
                />

                {/* ✅ FIXED BUTTON TAG HERE */}
                {!isUploading && (
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-black"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ACTIONS */}
        <div className="mt-4 flex items-center justify-between">
          <div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current.click()}
              disabled={isUploading}
              className="flex items-center gap-2 rounded-xl border border-[#efc2d1] px-4 py-2 text-[#9a2143] hover:bg-[#fff5f8] disabled:opacity-50"
            >
              <ImageUp size={16} />
              Attach Images
            </button>
          </div>

          <button
            onClick={handleCreate}
            disabled={isUploading || (!text && images.length === 0)}
            className="flex items-center gap-2 rounded-xl bg-[#C94C73] px-5 py-2 text-white hover:bg-[#b43f63] disabled:opacity-50"
          >
            {isUploading && <Loader2 size={16} className="animate-spin" />}
            {isUploading ? "Posting..." : "Create"}
          </button>
        </div>
      </div>
    </div>
    </>
  );
}