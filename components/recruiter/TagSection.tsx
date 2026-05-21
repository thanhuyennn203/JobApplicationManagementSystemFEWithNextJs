"use client";

interface TagSectionProps {
    title: string;
    tags: string[];
    selectedTags: string[];
    onToggle: (tag: string) => void;
}

export default function TagSection({
    title,
    tags,
    selectedTags,
    onToggle
}: TagSectionProps) {

    return (

        <div className="space-y-4">

            <div className="flex items-center justify-between">

                <h3 className="text-xl font-semibold text-gray-900">
                    {title}
                </h3>

                <span className="text-sm text-gray-500">
                    {selectedTags.length}/6 selected
                </span>

            </div>

            <div className="flex flex-wrap gap-3">

                {tags.map((tag) => {

                    const active =
                        selectedTags.includes(tag);

                    return (

                        <button
                            key={tag}
                            type="button"
                            onClick={() => onToggle(tag)}
                            className={`
                                px-4 py-2 rounded-full
                                border text-sm font-medium
                                transition-all duration-200
                                ${active
                                    ? "bg-black text-white border-black"
                                    : "bg-white text-gray-700 border-gray-300 hover:border-black"}
                            `}
                        >
                            {tag}
                        </button>

                    );
                })}

            </div>

        </div>
    );
}