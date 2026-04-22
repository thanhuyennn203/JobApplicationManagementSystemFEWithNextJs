import { useRouter } from "next/navigation";

export function FeatureSection() {
  const router = useRouter();

  const features = [
    {
      title: "Post Job",
      desc: "Create job postings and reach candidates",
      path: "/jobs/create",
      icon: "fa-regular fa-file-lines",
    },
    {
      title: "Search CV",
      desc: "Find candidates quickly",
      path: "/candidates",
      icon: "fa-solid fa-magnifying-glass",
    },
    {
      title: "Buy Services",
      desc: "Boost hiring performance",
      path: "/services",
      icon: "fa-solid fa-gem",
    },
  ];

  return (
    <div className="bg-white p-6 rounded-xl">
      
      {/* HEADER */}
      <div className="flex items-center gap-2 mb-4">
        <i className="fa-solid fa-compass text-green-600"></i>
        <h3 className="font-semibold">
          Explore TopCV for Employers
        </h3>
      </div>

      {/* ITEMS */}
      <div className="grid grid-cols-3 gap-4">
        {features.map((item, i) => (
          <div
            key={i}
            onClick={() => router.push(item.path)}
            className="p-5 rounded-xl border cursor-pointer hover:border-green-500 transition flex justify-between items-center"
          >
            <div className="flex items-center gap-4">
              <i className={`${item.icon} text-2xl text-green-600`}></i>

              <div>
                <h4 className="font-medium">{item.title}</h4>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            </div>

            <button className="bg-green-600 text-white px-4 py-1 rounded-full text-sm">
              Try Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}