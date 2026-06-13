import Link from "next/link";

interface Tool {
  href: string;
  icon: string;
  name: string;
  description: string;
  badge?: { label: string; color: string };
}

const TOOL_GROUPS: { label: string; tools: Tool[] }[] = [
  {
    label: "Tests & Interview Prep",
    tools: [
      {
        href: "/candidate/tools/interview-questions",
        icon: "💬",
        name: "Interview Questions",
        description: "Practice with curated questions by role and industry",
        badge: { label: "New", color: "bg-orange-50 text-orange-600" },
      },
      {
        href: "/candidate/tools/mbti",
        icon: "🧠",
        name: "MBTI Personality Test",
        description: "Discover your personality type and ideal career paths",
        badge: { label: "Hot", color: "bg-red-50 text-red-500" },
      },
    ],
  },
  {
    label: "Salary & Finance",
    tools: [
      {
        href: "/candidate/tools/salary-calculator",
        icon: "🧮",
        name: "Gross / Net Salary",
        description: "Convert between gross and net salary instantly",
        badge: { label: "Free", color: "bg-green-50 text-green-600" },
      },
      {
        href: "/candidate/tools/salary-lookup",
        icon: "📊",
        name: "Salary Lookup",
        description: "Benchmark your salary against market rates by role",
        badge: { label: "New", color: "bg-orange-50 text-orange-600" },
      },
      {
        href: "/candidate/tools/insurance-calculator",
        icon: "🛡️",
        name: "Insurance Calculator",
        description: "Estimate social insurance and unemployment contributions",
        badge: { label: "Free", color: "bg-green-50 text-green-600" },
      },
      {
        href: "/candidate/tools/savings-planner",
        icon: "🐷",
        name: "Savings Planner",
        description: "Plan your savings goals with compound interest",
        badge: { label: "Free", color: "bg-green-50 text-green-600" },
      },
    ],
  },
];

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-6 py-12">
        {/* Header */}
        <div className="mb-10 border-b border-gray-200 pb-8">
          <h1 className="text-3xl font-semibold text-gray-900">Toolkit</h1>
          <p className="mt-2 text-base text-gray-500">
            Free tools to help you prepare, negotiate, and grow your career.
          </p>
        </div>

        {/* Groups */}
        {TOOL_GROUPS.map((group) => (
          <div key={group.label} className="mb-10">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">
              {group.label}
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {group.tools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="group flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:border-green-200 hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-3xl">{tool.icon}</span>
                    {tool.badge && (
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${tool.badge.color}`}>
                        {tool.badge.label}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                      {tool.name}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-gray-500">
                      {tool.description}
                    </p>
                  </div>
                  <div className="mt-auto flex items-center text-xs font-medium text-green-600 opacity-0 transition group-hover:opacity-100">
                    Open tool
                    <svg className="ml-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

