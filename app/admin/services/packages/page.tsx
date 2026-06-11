"use client";

import { useEffect, useState } from "react";
import {
    CheckCircle,
    XCircle,
    Package,
    CalendarDays,
    Star,
    Eye,
    Search,
    X,
    HelpCircle,
    ShoppingCart,
} from "lucide-react";

import {
    fetchPackages,
    fetchPackageById,
} from "@/services/jobs/packageService";

import { PackageData } from "@/types/package";

// ─── Add-on mock data (replace with API call when BE is ready) ────────────────

interface AddonData {
    code: string;
    name: string;
    price: number;
    accent: string;
    description: string;
}

const MOCK_ADDONS: AddonData[] = [
    {
        code: "ADV",
        name: "Add-on Value",
        price: 2000000,
        accent: "#22c55e",
        description:
            "Display 3 reasons to apply on the job listing box in search results and at the top of the job detail page.",
    },
    {
        code: "ALG",
        name: "Add-on Label: Urgent",
        price: 1000000,
        accent: "#3b82f6",
        description:
            "Job posting is tagged with an URGENT label on the listing title to attract immediate attention from candidates.",
    },
    {
        code: "ALH",
        name: "Add-on Label: Hot",
        price: 1000000,
        accent: "#f59e0b",
        description:
            "Job posting is tagged with a HOT label on the listing title for high-demand roles.",
    },
    {
        code: "ALR",
        name: "Add-on Label: Red",
        price: 1000000,
        accent: "#ef4444",
        description:
            "Job posting is displayed across all site pages with the listing title highlighted in red.",
    },
    {
        code: "BRM",
        name: "Box Remarketing",
        price: 6250000,
        accent: "#8b5cf6",
        description:
            "Job posting is re-shown to candidates who previously saved or viewed the listing, boosting recall.",
    },
];

// ─── Main component ───────────────────────────────────────────────────────────

export default function PackagesPage() {

    const [packages, setPackages] = useState<PackageData[]>([]);
    const [selected, setSelected] = useState<PackageData | null>(null);
    const [keyword, setKeyword] = useState("");
    const [loading, setLoading] = useState(false);


    useEffect(() => {

        loadPackages();

    }, []);


    async function loadPackages() {

        setLoading(true);

        try {

            const data = await fetchPackages();
            setPackages(data);

        } finally {
            setLoading(false);
        }

    }



    async function openDetail(id: number) {

        const data = await fetchPackageById(id);
        setSelected(data);

    }



    async function toggleStatus(pkg: PackageData) {


        await fetch(
            `http://localhost:9191/api/companies/members/packages/${pkg.id}/status`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    enabled: !pkg.vip
                })
            }
        );


        loadPackages();

    }



    const filtered = packages.filter(p =>
        p.name.toLowerCase()
            .includes(keyword.toLowerCase())
    );


    return (

        <div className="p-6 bg-[#f7f9fc] min-h-screen">


            {/* HEADER */}

            <div className="flex justify-between items-center mb-6">

                <div>

                    <h1 className="text-2xl font-bold text-gray-900">
                        Package Management
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        Manage recruitment service packages
                    </p>

                </div>


                <div className="flex items-center gap-2 bg-white border rounded-xl px-3 py-2">

                    <Search size={16}
                        className="text-gray-400" />

                    <input
                        placeholder="Search package..."
                        value={keyword}
                        onChange={e => setKeyword(e.target.value)}
                        className="outline-none text-sm"
                    />

                </div>


            </div>




            {/* PACKAGE GRID */}


            <div className="
grid
grid-cols-1
md:grid-cols-2
xl:grid-cols-3
gap-5
">


                {
                    filtered.map(pkg => (


                        <div
                            key={pkg.id}
                            className="
bg-white
rounded-2xl
border
border-gray-200
shadow-sm
hover:shadow-md
transition
p-5
relative
"
                        >


                            <div className="
flex justify-between items-start
">


                                <div>

                                    <div className="
flex items-center gap-2
">

                                        <div className="
w-10 h-10 rounded-xl
bg-blue-50
flex items-center justify-center
">

                                            <Package
                                                size={20}
                                                className="text-[#0b77da]"
                                            />

                                        </div>


                                        <h3 className="
font-bold text-gray-900
">

                                            {pkg.name}

                                        </h3>

                                    </div>


                                    <p className="
text-xs text-gray-400 mt-3
">

                                        Code: {pkg.code}

                                    </p>


                                </div>



                                {
                                    pkg.vip &&

                                    <div className="
flex items-center gap-1
bg-yellow-50
text-yellow-600
px-2 py-1
rounded-full
text-xs
">

                                        <Star size={12} />
                                        VIP

                                    </div>

                                }


                            </div>





                            <div className="mt-5">


                                <div className="
text-3xl font-bold
text-[#0b77da]
">

                                    {pkg.price.toLocaleString()}
                                    <span className="text-sm">
                                        đ
                                    </span>

                                </div>


                                <div className="
flex gap-4 mt-3
text-sm text-gray-500
">

                                    <span className="flex gap-1 items-center">

                                        <CalendarDays size={15} />

                                        {pkg.serviceDays} days

                                    </span>


                                </div>


                            </div>





                            <div className="
mt-5 flex gap-2
">


                                <button
                                    onClick={() => openDetail(pkg.id)}
                                    className="
flex-1
border
rounded-xl
py-2
text-sm
flex items-center
justify-center
gap-2
hover:bg-gray-50
">

                                    <Eye size={15} />
                                    Detail

                                </button>



                                <button
                                    onClick={() => toggleStatus(pkg)}
                                    className={`
px-4
rounded-xl
text-sm
flex gap-1
items-center
${pkg.vip
                                            ?
                                            "bg-red-50 text-red-600"
                                            :
                                            "bg-green-50 text-green-600"
                                        }
`}
                                >


                                    {
                                        pkg.vip
                                            ?
                                            <XCircle size={15} />
                                            :
                                            <CheckCircle size={15} />
                                    }


                                    {
                                        pkg.vip
                                            ?
                                            "Disable"
                                            :
                                            "Enable"
                                    }


                                </button>


                            </div>



                        </div>


                    ))

                }



            </div>


            {/* ADD-ON SERVICES SECTION */}

            <div className="mt-10">

                <div className="mb-5">
                    <h2 className="text-xl font-bold text-gray-900">
                        Add-on Services
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Optional upgrades to make your job posting stand out to candidates
                    </p>
                </div>

                <div className="
grid
grid-cols-1
sm:grid-cols-2
xl:grid-cols-3
gap-5
">

                    {MOCK_ADDONS.map(addon => (

                        <div
                            key={addon.code}
                            className="
bg-white
rounded-2xl
border
border-gray-200
shadow-sm
hover:shadow-md
transition
p-5
flex flex-col
relative
overflow-hidden
"
                        >
                            {/* Color accent bar — matches the design in the screenshot */}
                            <div
                                className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                                style={{ background: addon.accent }}
                            />

                            {/* Header */}
                            <div className="flex justify-between items-start mt-2 mb-4">
                                <h3 className="font-bold text-gray-900 text-base">
                                    {addon.name}
                                </h3>
                                <button
                                    title="More information"
                                    className="
w-6 h-6
rounded-full
border border-gray-200
flex items-center justify-center
hover:bg-gray-50
flex-shrink-0
"
                                >
                                    <HelpCircle size={13} className="text-gray-400" />
                                </button>
                            </div>

                            {/* Price */}
                            <div className="mb-1">
                                <span className="text-2xl font-bold text-green-600">
                                    {addon.price.toLocaleString()}
                                    <span className="text-base font-semibold ml-1">VNĐ</span>
                                </span>
                            </div>
                            <p className="text-xs text-gray-400 mb-4">
                                ( Price excludes VAT )
                            </p>

                            {/* Description */}
                            <p className="text-sm text-gray-600 leading-relaxed flex-1 text-center">
                                {addon.description}
                            </p>

                            {/* CTA */}
                            <button
                                className="
                                            mt-5
                                            w-full
                                            flex items-center justify-center gap-2
                                            text-sm
                                            border border-gray-200
                                            rounded-xl
                                            py-2
                                            hover:bg-gray-50
                                            transition
                                            text-gray-700
                                            "
                            >
                                {/* <ShoppingCart size={14} /> */}
                                View
                            </button>

                        </div>

                    ))}

                </div>

            </div>


            {/* DETAIL MODAL */}


            {
                selected &&


                <div className="
fixed inset-0
bg-black/30
z-50
flex
justify-end
">


                    <div className="
w-full
max-w-md
bg-white
h-full
p-6
overflow-y-auto
shadow-xl
">


                        <div className="
flex justify-between
items-center
">


                            <h2 className="
text-xl font-bold
">

                                Package Detail

                            </h2>


                            <button
                                onClick={() => setSelected(null)}
                            >

                                <X />

                            </button>


                        </div>





                        <div className="mt-6">


                            <h3 className="
text-2xl font-bold
text-[#0b77da]
">

                                {selected.name}

                            </h3>


                            <p className="
text-gray-500 mt-2
">

                                {selected.descriptions}

                            </p>





                            <div className="
mt-5 space-y-3
">


                                <div className="info">
                                    Price:
                                    <b>
                                        {selected.price.toLocaleString()} đ
                                    </b>
                                </div>


                                <div className="info">
                                    Display:
                                    <b>
                                        {selected.displayDays} days
                                    </b>
                                </div>


                                <div className="info">
                                    Service:
                                    <b>
                                        {selected.serviceDays} days
                                    </b>
                                </div>


                            </div>






                            <h4 className="
mt-6 font-semibold
">

                                Benefits

                            </h4>


                            <div className="mt-3 space-y-3">


                                {
                                    selected.benefits.map(b => (

                                        <div
                                            key={b.code}
                                            className="
border
rounded-xl
p-3
flex
justify-between
"
                                        >


                                            <div>

                                                <p className="font-medium">
                                                    {b.title}
                                                </p>

                                                <p className="text-xs text-gray-500">
                                                    {b.description}
                                                </p>

                                            </div>


                                            {
                                                b.enabled
                                                    ?
                                                    <CheckCircle
                                                        size={18}
                                                        className="text-green-500"
                                                    />
                                                    :
                                                    <XCircle
                                                        size={18}
                                                        className="text-gray-300"
                                                    />
                                            }


                                        </div>


                                    ))

                                }


                            </div>


                        </div>


                    </div>


                </div>

            }


        </div>

    )

}