"use client";

const TIERS = [
  {
    name: "MEMBER",
    color: "bg-gray-100 text-gray-700",
    headerBg: "bg-gray-100",
    textColor: "text-gray-700",
    borderColor: "border-gray-300",
    points: "0 – 30M",
    rewardPoints: "0 Top Point",
    discountVoucher: null,
    serviceActivations: null,
    logoDisplay: null,
    premiumRecruit: null,
    hrTechTickets: null,
    talkshowAccess: true,
    happyTimeFreeTrial: "2 months trial for HappyTime, TestCenter, Shiring",
  },
  {
    name: "SILVER",
    subtitle: "PARTNER",
    color: "bg-gray-200 text-gray-800",
    headerBg: "bg-gray-300",
    textColor: "text-gray-800",
    borderColor: "border-gray-400",
    points: "30M – 80M",
    rewardPoints: "100–400 Top Points",
    discountVoucher: "10%",
    serviceActivations: 1,
    logoDisplay: null,
    premiumRecruit: null,
    hrTechTickets: null,
    talkshowAccess: true,
    happyTimeFreeTrial: "2 months trial for HappyTime, TestCenter, Shiring",
  },
  {
    name: "GOLD",
    subtitle: "PARTNER",
    color: "bg-yellow-100 text-yellow-800",
    headerBg: "bg-yellow-400",
    textColor: "text-yellow-900",
    borderColor: "border-yellow-500",
    points: "80M – 150M",
    rewardPoints: "100–400 Top Points",
    discountVoucher: "20%",
    serviceActivations: 2,
    logoDisplay: "3 months",
    premiumRecruit: "3 months",
    hrTechTickets: null,
    talkshowAccess: true,
    happyTimeFreeTrial: "2 months trial for HappyTime, TestCenter, Shiring",
  },
  {
    name: "PLATINUM",
    subtitle: "PARTNER",
    color: "bg-blue-100 text-blue-800",
    headerBg: "bg-blue-500",
    textColor: "text-white",
    borderColor: "border-blue-600",
    points: "150M – 250M",
    rewardPoints: "1500–2500 Top Points",
    discountVoucher: "25%",
    serviceActivations: 3,
    logoDisplay: "6 months",
    premiumRecruit: "6 months",
    hrTechTickets: 1,
    talkshowAccess: true,
    happyTimeFreeTrial: "2 months trial for HappyTime, TestCenter, Shiring",
  },
  {
    name: "DIAMOND",
    subtitle: "PARTNER",
    color: "bg-purple-100 text-purple-800",
    headerBg: "bg-gradient-to-br from-purple-600 to-indigo-700",
    textColor: "text-white",
    borderColor: "border-purple-700",
    points: "250M+",
    rewardPoints: "2500+ Top Points (1 tier up)",
    discountVoucher: "30%",
    serviceActivations: 4,
    logoDisplay: "12 months",
    premiumRecruit: "12 months",
    hrTechTickets: 2,
    talkshowAccess: true,
    happyTimeFreeTrial: "2 months trial for HappyTime, TestCenter, Shiring",
  },
];

const CHECK = (
  <svg className="w-5 h-5 text-[#00b14f] mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
  </svg>
);
const DASH = <span className="text-gray-300 text-lg mx-auto block text-center">—</span>;

const rowGroups = [
  {
    groupLabel: "EXCLUSIVE DISCOUNT VOUCHERS & SPECIAL BENEFITS",
    groupClass: "bg-green-50",
    rows: [
      {
        label: "Discount Voucher",
        render: (t: typeof TIERS[0]) =>
          t.discountVoucher ? (
            <span className="font-bold text-[#00b14f]">{t.discountVoucher}</span>
          ) : (
            DASH
          ),
      },
      {
        label: "Service Activation Requirements",
        render: (t: typeof TIERS[0]) =>
          t.serviceActivations ? (
            <span>{t.serviceActivations}×</span>
          ) : (
            DASH
          ),
      },
      {
        label: "Prominent Company Logo on Homepage",
        render: (t: typeof TIERS[0]) =>
          t.logoDisplay ? <span className="text-sm">{t.logoDisplay}</span> : DASH,
      },
      {
        label: "Premium Recruitment Page",
        render: (t: typeof TIERS[0]) =>
          t.premiumRecruit ? <span className="text-sm">{t.premiumRecruit}</span> : DASH,
      },
    ],
  },
  {
    groupLabel: "ENHANCED RECRUITMENT EFFICIENCY",
    groupClass: "bg-teal-50",
    rows: [
      {
        label: "Job posting branded to stand out to candidates on topcv.vn",
        render: (t: typeof TIERS[0]) =>
          t.name === "DIAMOND" ? CHECK : DASH,
      },
      {
        label: "Display basic profile information – reduce the need to reply to Top Job ads",
        render: (t: typeof TIERS[0]) => {
          const map: Record<string, string> = {
            SILVER: "1 pkg / 3 mo",
            GOLD: "1 pkg / 6 mo",
            PLATINUM: "1 pkg / 9 mo",
            DIAMOND: "1 pkg / 12 mo",
          };
          return map[t.name] ? <span className="text-sm">{map[t.name]}</span> : DASH;
        },
      },
    ],
  },
  {
    groupLabel: "EVENTS & APPRECIATION ACTIVITIES WITH TOPCV",
    groupClass: "bg-orange-50",
    rows: [
      {
        label: "VIP tickets to HR TECH – the biggest HR event of the year",
        render: (t: typeof TIERS[0]) =>
          t.hrTechTickets ? (
            <span className="font-semibold">{t.hrTechTickets} ticket{t.hrTechTickets > 1 ? "s" : ""}</span>
          ) : (
            DASH
          ),
      },
      {
        label: "Access to Talkshows & Workshops on industry knowledge and expertise",
        render: (t: typeof TIERS[0]) => CHECK,
      },
      {
        label: "Celebration gifts for holidays and anniversaries",
        render: (t: typeof TIERS[0]) =>
          ["GOLD", "PLATINUM", "DIAMOND"].includes(t.name) ? CHECK : DASH,
      },
    ],
  },
  {
    groupLabel: "HR TECH ECOSYSTEM BENEFITS (HAPPYTIME, TESTCENTER, SHIRING)",
    groupClass: "bg-indigo-50",
    rows: [
      {
        label: "Free trial for HappyTime, TestCenter, Shiring HR tools",
        render: (t: typeof TIERS[0]) => (
          <span className="text-xs text-gray-600 leading-tight">{t.happyTimeFreeTrial}</span>
        ),
      },
    ],
  },
];

export default function RewardsSection() {
  return (
    <section className="mb-20">
      {/* Header */}
      <div className="mb-2">
        <span className="text-xs font-semibold text-[#00b14f] uppercase tracking-widest">
          TOP REWARDS
        </span>
      </div>
      <h2 className="text-3xl font-black text-gray-900 mb-3 border-l-4 border-[#00b14f] pl-4">
        TopCV Rewards Program
      </h2>
      <p className="text-gray-500 text-sm mb-2 pl-5">
        Terms and conditions apply based on your membership tier.
      </p>
      <p className="text-gray-400 text-xs mb-8 pl-5">
        When you join the TopCV Rewards program and reach a tier higher than Member, you will receive the corresponding rewards in the tier you've reached, without losing any lower-tier benefits.
      </p>

      {/* Tier Header Cards */}
      <div className="overflow-x-auto">
        <div className="min-w-[780px]">
          {/* Tier header row */}
          <div className="grid grid-cols-6 gap-2 mb-4">
            <div className="col-span-1" />
            {TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`col-span-1 rounded-xl overflow-hidden border ${tier.borderColor} shadow-sm`}
              >
                <div className={`${tier.headerBg} px-3 py-3 text-center`}>
                  <p className={`font-black text-base ${["PLATINUM", "DIAMOND"].includes(tier.name) ? "text-white" : "text-gray-800"}`}>
                    {tier.name}
                  </p>
                  {tier.subtitle && (
                    <p className={`text-[10px] font-semibold uppercase tracking-widest ${["PLATINUM", "DIAMOND"].includes(tier.name) ? "text-white/70" : "text-gray-500"}`}>
                      {tier.subtitle}
                    </p>
                  )}
                </div>
                <div className="bg-white px-2 py-2 text-center">
                  <p className="text-[9px] text-gray-400 uppercase tracking-wide">Cumulative spend</p>
                  <p className="text-xs font-bold text-gray-800 mt-0.5">{tier.points}</p>
                  <p className="text-[9px] text-gray-400 mt-1.5 uppercase tracking-wide">Reward points</p>
                  <p className="text-[10px] font-semibold text-[#00b14f] mt-0.5">{tier.rewardPoints}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Benefit Rows */}
          {rowGroups.map((group) => (
            <div key={group.groupLabel} className="mb-2">
              {/* Group heading */}
              <div className={`${group.groupClass} rounded-lg px-4 py-2 mb-1`}>
                <p className="text-[11px] font-bold text-gray-600 uppercase tracking-widest text-center">
                  {group.groupLabel}
                </p>
              </div>

              {/* Row items */}
              {group.rows.map((row) => (
                <div key={row.label} className="grid grid-cols-6 gap-2 py-2 border-b border-gray-100 items-center hover:bg-gray-50 transition-colors rounded-lg px-2">
                  <div className="col-span-1">
                    <p className="text-xs text-gray-600 leading-snug">{row.label}</p>
                  </div>
                  {TIERS.map((tier) => (
                    <div key={tier.name} className="col-span-1 text-center text-sm text-gray-700">
                      {row.render(tier)}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}

          {/* CTA Row */}
          <div className="grid grid-cols-6 gap-2 mt-6">
            <div className="col-span-1" />
            {TIERS.map((tier) => (
              <div key={tier.name} className="col-span-1">
                {tier.name === "MEMBER" ? (
                  <button className="w-full py-2 border border-[#00b14f] text-[#00b14f] text-xs font-semibold rounded-lg hover:bg-green-50 transition">
                    Recruitment Consulting
                  </button>
                ) : (
                  <button className="w-full py-2 bg-[#00b14f] text-white text-xs font-semibold rounded-lg hover:bg-[#009640] transition">
                    Post Now
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}