"use client";

import { useState } from "react";

interface Props {
    onAdd: (value: string) => void;
    placeholder?: string;
}

export default function CustomTagInput({
    onAdd,
    placeholder = "Create custom tag..."
}: Props) {

    const [value, setValue] = useState("");

    const handleAdd = () => {
        if (!value.trim()) return;
        onAdd(value.trim());
        setValue("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAdd();
        }
    };

    const remainingChars = 18 - value.length;

    return (
        <div className="space-y-2">

            <div className="flex gap-3">

                <input
                    type="text"
                    value={value}
                    placeholder={placeholder}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    maxLength={18}
                    className="
                        flex-1
                        border border-gray-300
                        rounded-xl
                        px-4 py-3
                        focus:outline-none
                        focus:ring-2
                        focus:ring-black
                    "
                />

                <button
                    type="button"
                    onClick={handleAdd}
                    disabled={!value.trim()}
                    className="
                        px-5 py-3
                        rounded-xl
                        bg-black
                        text-white
                        font-medium
                        hover:opacity-90
                        transition
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                    "
                >
                    Add
                </button>

            </div>

            <p className={`text-xs ${
                remainingChars < 3 ? "text-red-500" : "text-gray-500"
            }`}>
                {remainingChars} characters remaining
            </p>

        </div>
    );
}
