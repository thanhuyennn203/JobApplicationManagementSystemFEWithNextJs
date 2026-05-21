"use client";

import { SelectedTag } from "@/types/tagging";

interface Props {
    title: string;
    tags: SelectedTag[];
    onRemove: (tag: SelectedTag) => void;
}

export default function SelectedTagsPreview({
    title,
    tags,
    onRemove
}: Props) {

    if (tags.length === 0) {
        return null;
    }

    return (
        <div className="space-y-3 mt-6 p-4 bg-gray-50 rounded-xl">

            <h4 className="text-sm font-semibold text-gray-700">
                {title} Selected ({tags.length}/6)
            </h4>

            <div className="flex flex-wrap gap-2">

                {tags.map((tag, index) => (
                    <div
                        key={`${tag.category}-${tag.tagText}-${index}`}
                        className="
                            inline-flex
                            items-center
                            gap-2
                            px-3
                            py-1
                            bg-black
                            text-white
                            text-sm
                            rounded-full
                        "
                    >

                        <span>
                            {tag.tagText}
                            {tag.isUserCreated && (
                                <span className="ml-1 text-xs opacity-70">
                                    (custom)
                                </span>
                            )}
                        </span>

                        <button
                            type="button"
                            onClick={() => onRemove(tag)}
                            className="
                                ml-1
                                hover:opacity-70
                                transition
                            "
                            title="Remove tag"
                        >
                            ×
                        </button>

                    </div>
                ))}

            </div>

        </div>
    );
}
