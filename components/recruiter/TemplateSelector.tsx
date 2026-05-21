"use client";

import { JobTemplate } from "@/types/tagging";

interface Props {
    templates: JobTemplate[];
    selectedTemplate: number | null;
    onSelect: (id: number) => void;
}

export default function TemplateSelector({
    templates,
    selectedTemplate,
    onSelect
}: Props) {

    return (

        <div className="space-y-4">

            <h3 className="text-2xl font-semibold">
                Select Template
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {templates.map((template) => {

                    const active =
                        selectedTemplate === template.id;

                    return (

                        <button
                            key={template.id}
                            type="button"
                            onClick={() =>
                                onSelect(template.id)
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
                                {template.name}
                            </h4>

                            <p className="text-sm opacity-80 mt-1">
                                {template.description}
                            </p>

                        </button>

                    );
                })}

            </div>

        </div>
    );
}