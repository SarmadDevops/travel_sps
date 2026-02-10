import React from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const SalesBarChart = ({ data = [] }) => {
  const getFillUrl = (value) => {
    if (value > 3500) return "url(#gradHigh)";
    if (value >= 2000) return "url(#gradMedium)";
    return "url(#gradLow)";
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-fade-in w-full">
      {/* Header with Legend */}
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="text-lg font-bold text-[#10314a]">
            Monthly Sales Overview
          </h3>
          <p className="text-xs text-gray-500">Sales performance by volume</p>
        </div>

        {/* Color Legend using Card Colors */}
        <div className="flex gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#102A3C]"></span>
            <span className="text-xs font-medium text-gray-600">
              High (&gt;3.5k)
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#17BDB8]"></span>
            <span className="text-xs font-medium text-gray-600">Medium</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#204B6B]"></span>
            <span className="text-xs font-medium text-gray-600">
              Low (&lt;2k)
            </span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: -10, bottom: 5 }}
            barSize={55}
          >
            <defs>
              <linearGradient id="gradHigh" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#102A3C" stopOpacity={1} />
                <stop offset="100%" stopColor="#0B1F2E" stopOpacity={1} />
              </linearGradient>

              {/* Medium Sales: Teal Gradient (Matches Card 1) */}
              <linearGradient id="gradMedium" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#17BDB8" stopOpacity={1} />
                <stop offset="100%" stopColor="#0F7F7C" stopOpacity={1} />
              </linearGradient>

              {/* Low Sales: Steel Blue Gradient (Matches Card 4) */}
              <linearGradient id="gradLow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#204B6B" stopOpacity={1} />
                <stop offset="100%" stopColor="#183A55" stopOpacity={1} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e5e7eb"
            />

            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 12, fontWeight: 500 }}
              dy={10}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 12 }}
              interval={0}
              ticks={[0, 1000, 2000, 3000, 4000, 5000, 6000]}
            />

            <Tooltip
              cursor={{ fill: "rgba(0,0,0,0.03)" }}
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                backgroundColor: "#fff",
                color: "#10314a",
                fontWeight: "bold",
              }}
            />

            <Bar dataKey="sales" radius={[6, 6, 0, 0]} animationDuration={1500}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getFillUrl(entry.sales)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesBarChart;
