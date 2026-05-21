"use client";

import { useEffect, useMemo, useRef, useState } from "react";

interface Props<T> {
    label: string;
    placeholder: string;
    items: T[];
    selectedItem?: T | null;
    displayKey: keyof T;
    onSelect: (item: T) => void;
}

export default function SearchableSelect<T extends { id: number }>({
    label,
    placeholder,
    items,
    selectedItem,
    displayKey,
    onSelect
}: Props<T>) {

    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {

        const handleClickOutside = (
            e: MouseEvent
        ) => {

            if (
                ref.current &&
                !ref.current.contains(e.target as Node)
            ) {
                setOpen(false);
            }

        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () =>
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );

    }, []);

    const filteredItems = useMemo(() => {

        return items
            .filter((item) =>
                String(item[displayKey])
                    .toLowerCase()
                    .includes(query.toLowerCase())
            )
            .slice(0, 10);

    }, [items, query]);

    return (

        <div
            ref={ref}
            className="relative"
        >

            <label className="
                mb-2
                block
                text-sm
                font-semibold
                text-gray-700
            ">
                {label}
            </label>

            <input
                type="text"
                placeholder={placeholder}
                value={
                    open
                        ? query
                        : selectedItem
                            ? String(selectedItem[displayKey])
                            : query
                }
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

            {open && filteredItems.length > 0 && (

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

                    {filteredItems.map((item) => (

                        <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                                onSelect(item);
                                setQuery(
                                    String(item[displayKey])
                                );
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

                            <span className="font-medium text-gray-800">
                                {String(item[displayKey])}
                            </span>

                        </button>

                    ))}

                </div>

            )}

        </div>

    );

}