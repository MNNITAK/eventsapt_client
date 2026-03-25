"use client";

import { useEffect, useState, useRef } from "react";
import { PencilLine, Check, ImageUp, X, Plus,Loader2 } from "lucide-react";
import { CreatePostBox } from "./CreateCard";
export const MainCard = ({
    initialValue = "Add yoir description here or about yourself... Like - Once i looked into the sky and you know it was all black?",
    onSave,
    className = "",
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [aboutValue, setValue] = useState(initialValue);
    const [savedValue, setSavedValue] = useState(initialValue);
    const fileInputRef = useRef(null);

    const [text, setText] = useState("");
    const [images, setImages] = useState([]);
    // [{ file, preview }]
    useEffect(() => {
        setValue(initialValue);
        setSavedValue(initialValue);
    }, [initialValue]);

    const handleEdit = () => {
        setValue(savedValue);
        setIsEditing(true);
    };

    const handleSave = () => {
        const finalValue = aboutValue.trim() || " ";
        setSavedValue(finalValue);
        setIsEditing(false);

        if (onSave) onSave(finalValue);
    };

    const handleCancel = () => {
        setValue(savedValue);
        setIsEditing(false);
    };
    return (
        <div className="w-[95%] flex mx-auto mt-5 gap-2">
            {/* About yourself card + Left Panel */}
            <div
                className={`rounded-2xl w-[40%] h-[40vh] border border-slate-200 bg-white p-4 shadow-md transition ${className}`}
            >
                <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-700">Description</h3>

                    {!isEditing ? (
                        <button
                            type="button"
                            onClick={handleEdit}
                            className="flex items-center text-[12px]  gap-1 rounded-md  bg-[#C94C73] text-white p-1.5  font-medium  transition "
                        >
                            Edit
                            <PencilLine size={13} />

                        </button>
                    ) : (
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={handleSave}
                                className="inline-flex items-center gap-1 rounded-md bg-[#C94C73] p-1.5 text-[12px] font-medium text-white transition "
                            >
                                <Check size={13} />
                                Save
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white p-1.5 text-[12px] font-medium text-slate-700 transition hover:bg-slate-50"
                            >
                                <X size={13} />
                                Cancel
                            </button>
                        </div>
                    )}
                </div>

                {!isEditing ? (
                    <div className="min-h-40 whitespace-pre-wrap rounded-xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">
                        {savedValue}
                    </div>
                ) : (
                    <textarea
                        value={aboutValue}
                        onChange={(e) => setValue(e.target.value)}
                        autoFocus
                        className="h-[30vh] w-full resize-none rounded-xl border border-indigo-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                        placeholder="Write something..."
                    />
                )}
            </div>
            {/* Right Panel */}
            <div className="w-[60%]">
                <CreatePostBox/>
                
            </div>
            <div></div>
        </div>
    )
}