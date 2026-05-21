"use client";

import { useMemo, useState } from "react";

interface Props {
    title: string;
    suggestions: string[];
    selectedTags: string[];
    onAdd: (tag: string) => void;
    onRemove: (tag: string) => void;
}

export default function SearchableTagInput({
    title,
    suggestions,
    selectedTags,
    onAdd,
    onRemove
}: Props) {

    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);

    const filtered = useMemo(() => {

        return suggestions
            .filter(
                (tag) =>
                    tag
                        .toLowerCase()
                        .includes(query.toLowerCase()) &&
                    !selectedTags.includes(tag)
            )
            .slice(0, 10);

    }, [query, suggestions, selectedTags]);

    return (

        <div>

            <label className="
                mb-3
                block
                text-sm
                font-semibold
                text-gray-700
            ">
                {title}
            </label>

            {/* SELECTED */}
            <div className="
                mb-3
                flex
                flex-wrap
                gap-2
            ">

                {selectedTags.map((tag) => (

                    <div
                        key={tag}
                        className="
                            flex
                            items-center
                            gap-2
                            rounded-full
                            bg-[#00b14f]/10
                            px-4
                            py-2
                            text-sm
                            font-medium
                            text-[#00b14f]
                        "
                    >

                        {tag}

                        <button
                            type="button"
                            onClick={() => onRemove(tag)}
                            className="text-[#00b14f]"
                        >
                            ×
                        </button>

                    </div>

                ))}

            </div>

            {/* INPUT */}
            <div className="relative">

                <input
                    type="text"
                    value={query}
                    placeholder={`Search ${title.toLowerCase()}...`}
                    onFocus={() => setOpen(true)}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setOpen(true);
                    }}
                    className="
                        w-full
                        rounded-2xl
                        border
                        border-gray-200
                        bg-white
                        px-4
                        py-3
                        text-sm
                        outline-none
                        transition-all
                        focus:border-[#00b14f]
                        focus:ring-4
                        focus:ring-[#00b14f]/10
                    "
                />

                {open && filtered.length > 0 && (

                    <div className="
                        absolute
                        z-50
                        mt-2
                        max-h-72
                        w-full
                        overflow-y-auto
                        rounded-2xl
                        border
                        border-gray-100
                        bg-white
                        shadow-2xl
                    ">

                        {filtered.map((tag) => (

                            <button
                                key={tag}
                                type="button"
                                onClick={() => {
                                    onAdd(tag);
                                    setQuery("");
                                    setOpen(false);
                                }}
                                className="
                                    flex
                                    w-full
                                    items-center
                                    justify-between
                                    px-4
                                    py-3
                                    text-left
                                    text-sm
                                    transition-all
                                    hover:bg-[#00b14f]/5
                                "
                            >
                                {tag}
                            </button>

                        ))}

                    </div>

                )}

            </div>

        </div>

    );

}