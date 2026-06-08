"use client";

import { useEffect, useState } from "react";
import PackageCard from "@/components/recruiter/PackageCard";
import { getPackages } from "@/services/companies/company.service";
import { PackageData } from "@/types/package";


export default function PackagesPage() {
    const [packages, setPackages] = useState<PackageData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPackages = async () => {
            const data = await getPackages();
            setPackages(data);
            setLoading(false);
        };
        fetchPackages();
    }, []);

    return (
        <main className="min-h-screen bg-[#f5f7fa] py-12">
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-10">
                    <h1 className="text-4xl font-bold text-gray-900">
                        Recruitment Packages
                    </h1>

                    <p className="mt-3 text-lg text-gray-600">
                        Choose the package that best suits your hiring needs.
                    </p>
                </div>

                {loading ? (
                    <div className="text-center py-20">
                        Loading packages...
                    </div>
                ) : (
                    <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                        {packages.map((pkg) => (
                            <PackageCard
                                key={pkg.id}
                                packageData={pkg}
                            />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}