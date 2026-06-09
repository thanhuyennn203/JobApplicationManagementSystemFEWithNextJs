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
} from "lucide-react";

import {
    fetchPackages,
    fetchPackageById,
} from "@/services/jobs/packageService";

import { PackageData } from "@/types/package";


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


                <div className="
flex items-center gap-2
bg-white border rounded-xl px-3 py-2
">

                    <Search size={16}
                        className="text-gray-400" />

                    <input
                        placeholder="Search package..."
                        value={keyword}
                        onChange={e => setKeyword(e.target.value)}
                        className="
outline-none text-sm
"
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