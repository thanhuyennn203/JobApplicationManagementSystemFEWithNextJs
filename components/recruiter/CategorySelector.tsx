"use client";

import { JobCategory } from "@/types/tagging";

interface Props {
    categories: JobCategory[];
    selectedCategory: number | null;
    onSelect: (id: number) => void;
}

export default function CategorySelector({
    categories,
    selectedCategory,
    onSelect
}: Props) {

    return (

        <div className="space-y-4">

            <h3 className="text-2xl font-semibold">
                Select Category
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {categories.map((category) => {

                    const active =
                        selectedCategory === category.id;

                    return (

                        <button
                            key={category.id}
                            type="button"
                            onClick={() =>
                                onSelect(category.id)
                            }
                            className={`
                                text-left
                                border rounded-2xl
                                p-5 transition-all
                                ${active
                                    ? "border-black bg-black text-white"
                                    : "border-gray-200 bg-white hover:border-black"}
                            `}
                        >

                            <h4 className="font-semibold text-lg">
                                {category.name}
                            </h4>

                            <p className="text-sm opacity-80 mt-1">
                                {category.description}
                            </p>

                        </button>

                    );
                })}

            </div>

        </div>
    );
}