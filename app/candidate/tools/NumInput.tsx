import { useState } from "react";

interface NumInputProps {
    value: number;
    onChange: (val: number) => void;
    placeholder?: string;
    hint?: string;
    className?: string;
}

/**
 * A number input that:
 * - Formats large numbers with commas while the user is not focused
 * - Strips non-numeric characters so users can't type letters
 * - Works safely with numbers up to billions (no floating point display bugs)
 */
export default function NumInput({
    value,
    onChange,
    placeholder = "0",
    hint,
    className = "",
}: NumInputProps) {
    const [isFocused, setIsFocused] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/[^0-9]/g, "");
        onChange(raw === "" ? 0 : parseInt(raw, 10));
    };

    const displayValue = isFocused
        ? value === 0
            ? ""
            : String(value)
        : value === 0
            ? ""
            : Math.round(value).toLocaleString("en-US");

    return (
        <div>
            <input
                type="text"
                inputMode="numeric"
                placeholder={placeholder}
                value={displayValue}
                onChange={handleChange}
                onFocus={() => setIsFocused(true)
                }
                onBlur={() => setIsFocused(false)}
                className={`w-full h-10 px-3 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition ${className}`}
            />
            {hint && <p className="mt-1 text-xs text-gray-400" > {hint} </p>}
        </div>
    );
}