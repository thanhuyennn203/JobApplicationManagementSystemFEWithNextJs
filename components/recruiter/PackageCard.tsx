"use client";

import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { PackageData } from "@/types/package";

interface Props {
    packageData: PackageData;
}

export default function PackageCard({
    packageData,
}: Props) {
    // const {
    //     name,
    //     price,
    //     descriptions,
    //     badge,
    // } = packageData;
    const router = useRouter();
        const { addItem } = useCart();

    // console.log("packages in card",packageData);
    return (
        <div className="relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300">
            <div className="h-2 bg-green-500" />

            {/* {badge && (
                <div className="absolute top-0 right-6">
                    <div className="bg-yellow-400 text-yellow-900 font-bold px-4 py-2 text-sm rounded-b-lg shadow">
                        {badge}
                    </div>
                </div>
            )} */}

            <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900"
                    onClick={() => router.push(`/recruiter/packages/${packageData.id}`)}>
                    {packageData.name}
                </h2>

                <div className="mb-2">
                    <i className="fa-solid fa-dollar-sign"></i>
                    <span className="text-xl font-bold text-green-600">
                        {packageData.price.toLocaleString()}
                    </span>


                </div>

                <p className="text-gray-600 text-sm leading-8 min-h-[150px]">
                    {packageData.descriptions}
                </p>

                <div className="grid grid-cols-2 gap-4 mt-8">
                    <button
                        className="
              border-2 border-green-500
              text-green-600
              rounded-xl
              py-3
              font-semibold
              flex items-center
              justify-center
              gap-2
              hover:bg-green-50
            "
                   onClick={() => addItem(packageData, 1)} >
                        <ShoppingCart size={18} />
                        Add to cart
                    </button>

                    <button
                        className="
              bg-green-500
              hover:bg-green-600
              text-white
              rounded-xl
              py-3
              font-semibold
            "
                    >
                        Buy now
                    </button>
                </div>
            </div>
        </div>
    );
}