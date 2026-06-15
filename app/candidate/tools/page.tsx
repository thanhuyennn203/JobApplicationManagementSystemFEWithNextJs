'use client';

import { useState } from "react";
import { Coins, ArrowLeftRight, Landmark, ShieldCheck } from "lucide-react";
import GrossNetCalculator from "./Grossnetcalculator";
import PITCalculator from "./Pitcalculator";
import UnemploymentCalculator from "./UnemploymentCalculator ";

type TabId = "gross_net" | "pit" | "bhtn";

interface Tab {
  id: TabId;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const TABS: Tab[] = [
  {
    id: "gross_net",
    label: "Gross / Net",
    icon: <ArrowLeftRight size={15} />,
    description: "Convert between gross and net salary",
  },
  {
    id: "pit",
    label: "Income Tax (PIT)",
    icon: <Landmark size={15} />,
    description: "Calculate personal income tax by bracket",
  },
  {
    id: "bhtn",
    label: "Unemployment Ins.",
    icon: <ShieldCheck size={15} />,
    description: "Calculate BHTN contributions",
  },
];

export default function ToolsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("gross_net");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Coins size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Vietnam Salary Tools
              </h1>
              <p className="text-sm text-gray-500">
                Calculate gross/net salary, personal income tax, and
                unemployment insurance
              </p>
            </div>
          </div>
        </div>

        {/* Tab nav */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="flex overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm whitespace-nowrap border-b-2 transition ${
                  activeTab === tab.id
                    ? "border-indigo-600 text-indigo-600 font-medium"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        {activeTab === "gross_net" && <GrossNetCalculator />}
        {activeTab === "pit" && <PITCalculator />}
        {activeTab === "bhtn" && <UnemploymentCalculator />}
      </div>
    </div>
  );
}