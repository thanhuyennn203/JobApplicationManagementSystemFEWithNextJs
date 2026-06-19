
import { CompanyPackageData } from "@/types/package";
import { useRouter } from "next/navigation";

interface Props {
    data: CompanyPackageData;
}

export default function ActivePackageCard({ data }: Props) {
    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const daysLeft = Math.ceil(
        (new Date(data.endDate).getTime() - Date.now()) /
        (1000 * 60 * 60 * 24)
    );
    const router = useRouter();

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4" onClick={() => router.push(`/recruiter/packages/${data.packageId}`)}>
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <span className="text-xs font-medium text-indigo-500 uppercase tracking-wide">
                        {data.categoryCode}
                    </span>
                    <h3 className="mt-1 text-base font-bold text-gray-900">
                        {data.packageName}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                        {data.packageCode}
                    </p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    Active
                </span>
            </div>

            {/* Dates */}
            <div className="flex flex-col gap-1.5 text-sm text-gray-600">
                <div className="flex justify-between">
                    <span className="text-gray-400">Start date</span>
                    <span className="font-medium">
                        {formatDate(data.startDate)}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">End date</span>
                    <span className="font-medium">
                        {formatDate(data.endDate)}
                    </span>
                </div>
            </div>

            {/* Days left */}
            <div className="mt-auto pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Days remaining</span>
                    <span
                        className={`text-sm font-semibold ${daysLeft <= 7
                                ? "text-red-500"
                                : daysLeft <= 30
                                    ? "text-orange-500"
                                    : "text-green-600"
                            }`}
                    >
                        {daysLeft > 0 ? `${daysLeft} days` : "Expired"}
                    </span>
                </div>
                {/* Progress bar */}
                <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all ${daysLeft <= 7
                                ? "bg-red-400"
                                : daysLeft <= 30
                                    ? "bg-orange-400"
                                    : "bg-green-400"
                            }`}
                        style={{
                            width: `${Math.min(
                                100,
                                Math.max(0, (daysLeft / 30) * 100)
                            )}%`,
                        }}
                    />
                </div>
            </div>
        </div>
    );
}