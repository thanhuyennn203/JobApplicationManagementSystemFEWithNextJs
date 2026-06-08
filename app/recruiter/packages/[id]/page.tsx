import PackageDetailPage from "@/components/recruiter/PackageDetail";
import {fetchPackageById} from "@/services/jobs/packageService";

export default async function PackageDetailRoute({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const packageData = await fetchPackageById(Number(id));

    return (
        <PackageDetailPage
            packageData={packageData}
        />
    );
}