import { JobCategory } from "@/types/tagging";

const API_URL = "http://localhost:9191/api/jobs/categories";

const getAuthHeader = () => {
    const token = localStorage.getItem("token");

    return {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
    };
};

export const getCategories = async (): Promise<JobCategory[]> => {

    const res = await fetch(API_URL);

    if (!res.ok) {
        throw new Error("Failed to fetch categories");
    }

    return res.json();
};

export const createCategory = async (payload: {
    name: string;
    description?: string;
    icon?: string;
}) => {

    const res = await fetch(API_URL, {
        method: "POST",
        headers: getAuthHeader(),
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        throw new Error("Failed to create category");
    }

    return res.json();
};

// Mock data - giả lập response từ API job/category/top
// Khi API thật sẵn sàng, thay thế hàm fetchTopJobCategories bằng fetch thật

export const mockJobCategories = [
  { id: 1, name: "Business - Sales", jobCount: 9913, icon: "Tag" },
  { id: 2, name: "Marketing - PR - Advertising", jobCount: 7217, icon: "Megaphone" },
  { id: 3, name: "Customer Service - Operations", jobCount: 1558, icon: "Headset" },
  { id: 4, name: "Human Resources - Admin", jobCount: 3470, icon: "Briefcase" },
  { id: 5, name: "Information technology", jobCount: 1841, icon: "Laptop" },
  { id: 6, name: "Finance - Banking - Insurance", jobCount: 1183, icon: "Landmark" },
  { id: 7, name: "Real estate", jobCount: 400, icon: "Building2" },
  { id: 8, name: "Accounting - Auditing - Tax", jobCount: 4866, icon: "Calculator" },
  { id: 9, name: "Engineering - Manufacturing", jobCount: 2530, icon: "Settings" },
  { id: 10, name: "Education - Training", jobCount: 1920, icon: "GraduationCap" },
  { id: 11, name: "Healthcare - Medical", jobCount: 2750, icon: "Stethoscope" },
  { id: 12, name: "Design - Creative", jobCount: 980, icon: "Palette" },
];

/**
 * Giả lập gọi API: GET /job/category/top
 * Trả về Promise giống fetch thật, để dễ dàng thay thế sau này
 */
export async function fetchTopJobCategories() {
  // Giả lập độ trễ network
  await new Promise((resolve) => setTimeout(resolve, 300));

  return {
    success: true,
    data: mockJobCategories,
  };

  // ----- Khi có API thật, dùng đoạn dưới -----
  // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/job/category/top`);
  // if (!res.ok) throw new Error("Failed to fetch job categories");
  // return res.json();
}