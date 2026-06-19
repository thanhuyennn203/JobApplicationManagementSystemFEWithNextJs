"use client";
import { useEffect, useState } from "react";
import PackageCard from "@/components/recruiter/PackageCard";
import ActivePackageCard from "@/components/recruiter/ActivePackageCard";
import { fetchPackages, getActivePackages } from "@/services/jobs/packageService";
import { PackageData, CompanyPackageData } from "@/types/package";
import { useAuth } from "@/context/AuthContext";

export default function PackagesPage() {
    const auth = useAuth();
    const companyId = auth?.user?.companyId;

    const [packages, setPackages] = useState<PackageData[]>([]);
    const [activePackages, setActivePackages] = useState<CompanyPackageData[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingActive, setLoadingActive] = useState(true);

    useEffect(() => {
        const fetchAllPackages = async () => {
            const data = await fetchPackages();
            setPackages(data);
            setLoading(false);
        };
        fetchAllPackages();
    }, []);

    useEffect(() => {
        if (!companyId) return;
        const fetchActivePackages = async () => {
            try {
                const data = await getActivePackages(companyId);
                setActivePackages(data);
                console.log(data);
                
            } catch (error: any) {
                if (error?.status === 404) {
                    setActivePackages([]);
                }
            } finally {
                setLoadingActive(false);
            }
        };
        fetchActivePackages();
        console.log("active pkg:", activePackages);
    }, [companyId]);

    return (
        <main className="min-h-screen bg-[#f5f7fa]">
            <div className="max-w-7xl mx-auto px-6 pb-10">
                {/* All Packages */}
                <div className="mb-10">
                    <h1 className="text-lg font-bold text-gray-900">
                        Recruitment Packages
                    </h1>
                    <p className="mt-3 text-base text-gray-600">
                        Choose the package that best suits your hiring needs.
                    </p>
                </div>
                {loading ? (
                    <div className="text-center py-20">Loading packages...</div>
                ) : (
                    <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                        {packages.map((pkg) => (
                            <PackageCard key={pkg.id} packageData={pkg} />
                        ))}
                    </div>
                )}

                {/* Active Packages */}
                <div className="mt-10 mb-5">
                    <h2 className="text-lg font-bold text-gray-900">
                        Your Active Packages
                    </h2>
                    <p className="mt-3 text-base text-gray-600">
                        Packages currently active on your account.
                    </p>
                </div>
                {loadingActive ? (
                    <div className="text-center py-10">
                        Loading active packages...
                    </div>
                ) : activePackages.length === 0 ? (
                    <div className="text-center py-10 text-gray-400">
                        You have no active packages.
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {activePackages.map((pkg) => (
                            <ActivePackageCard
                                key={pkg.id}
                                data={pkg}
                            />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}