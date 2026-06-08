"use client";

import { useMemo, useState, useRef, useEffect } from "react";

interface Props {
    title: string;
    suggestions: string[];
    selectedTags: string[];
    maxLength?: number;
    maxTags?: number;
    onAdd: (tag: string) => void;
    onRemove: (tag: string) => void;
}

export default function SearchableTagInput({
    title,
    suggestions,
    selectedTags,
    maxLength = 80,
    maxTags = 6,
    onAdd,
    onRemove,
}: Props) {
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const filtered = useMemo(() => {
        return suggestions
            .filter(
                (tag) =>
                    tag.toLowerCase().includes(query.toLowerCase()) &&
                    !selectedTags.includes(tag)
            )
            .slice(0, 10);
    }, [query, suggestions, selectedTags]);

    // Can add custom tag if query doesn't match any existing suggestion exactly
    const canAddCustom =
        query.trim().length > 0 &&
        query.trim().length <= maxLength &&
        !selectedTags.some((t) => t.toLowerCase() === query.trim().toLowerCase()) &&
        !suggestions.some((s) => s.toLowerCase() === query.trim().toLowerCase());

    const handleAdd = (tag: string) => {
        onAdd(tag);
        setQuery("");
        setOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            // If there's exactly one filtered suggestion, pick it
            if (filtered.length === 1) {
                handleAdd(filtered[0]);
                return;
            }
            // Otherwise add as custom tag if valid
            if (canAddCustom) {
                handleAdd(query.trim());
            }
        }
        if (e.key === "Escape") {
            setOpen(false);
        }
    };

    const atMax = selectedTags.length >= maxTags;

    return (
        <div>
            <div className="mb-3 flex items-center justify-between">
                <label className="block text-sm font-semibold text-gray-700">
                    {title}
                </label>
                <span className="text-xs text-gray-400">
                    {selectedTags.length}/{maxTags}
                </span>
            </div>

            {/* Selected tags */}
            {selectedTags.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                    {selectedTags.map((tag) => (
                        <div
                            key={tag}
                            className="
                                flex items-center gap-2
                                rounded-full bg-[#00b14f]/10
                                px-4 py-1.5
                                text-sm font-medium text-[#00b14f]
                            "
                        >
                            {tag}
                            <button
                                type="button"
                                onClick={() => onRemove(tag)}
                                className="text-[#00b14f] hover:text-[#009245] leading-none"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Input */}
            <div className="relative" ref={wrapperRef}>
                <input
                    type="text"
                    value={query}
                    disabled={atMax}
                    placeholder={
                        atMax
                            ? `Max ${maxTags} tags reached`
                            : `Search or type to add ${title.toLowerCase()}...`
                    }
                    onFocus={() => setOpen(true)}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setOpen(true);
                    }}
                    onKeyDown={handleKeyDown}
                    maxLength={maxLength}
                    className="
                        w-full rounded-2xl border border-gray-200
                        bg-white px-4 py-3 text-sm outline-none
                        transition-all
                        focus:border-[#00b14f] focus:ring-4 focus:ring-[#00b14f]/10
                        disabled:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-400
                    "
                />

                {/* Character count hint */}
                {query.length > 0 && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                        {query.length}/{maxLength}
                    </span>
                )}

                {open && (filtered.length > 0 || canAddCustom) && (
                    <div className="
                        absolute z-50 mt-2 max-h-72 w-full
                        overflow-y-auto rounded-2xl border border-gray-100
                        bg-white shadow-2xl
                    ">
                        {/* Suggestion list */}
                        {filtered.map((tag) => (
                            <button
                                key={tag}
                                type="button"
                                onClick={() => handleAdd(tag)}
                                className="
                                    flex w-full items-center justify-between
                                    px-4 py-3 text-left text-sm
                                    transition-all hover:bg-[#00b14f]/5
                                "
                            >
                                <span>{tag}</span>
                                <span className="text-xs text-gray-400">Suggested</span>
                            </button>
                        ))}

                        {/* Custom tag option */}
                        {canAddCustom && (
                            <button
                                type="button"
                                onClick={() => handleAdd(query.trim())}
                                className="
                                    flex w-full items-center justify-between
                                    px-4 py-3 text-left text-sm
                                    border-t border-gray-100
                                    transition-all hover:bg-[#00b14f]/5
                                "
                            >
                                <span>
                                    Add <strong>"{query.trim()}"</strong>
                                </span>
                                <span className="text-xs text-[#00b14f] font-medium">
                                    + Custom
                                </span>
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Hint */}
            <p className="mt-1.5 text-xs text-gray-400">
                Press <kbd className="px-1 py-0.5 rounded bg-gray-100 text-gray-500 font-mono text-[10px]">Enter</kbd> to add a custom tag
            </p>
        </div>
    );
}