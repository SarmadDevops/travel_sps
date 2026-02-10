import React, { useEffect, useState } from "react";
import {
  UserOutlined,
  FileDoneOutlined,
  DollarCircleOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import { getAllPoliciesAnalyticsApi } from "../../../api/underWriting";

const AnalyticsAdminCards = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await getAllPoliciesAnalyticsApi();
        setAnalytics(data);
      } catch (error) {
        console.error("Analytics error 👉", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="text-gray-500">Loading analytics...</div>;
  }

 
  const cards = [
    {
      title: "Total Policies",
      value: analytics.totalPolicies,
      color: "bg-gradient-to-br from-[#17BDB8] via-[#14A3A0] to-[#0F7F7C]",
      icon: <UserOutlined style={{ fontSize: 28, color: "white" }} />,
    },
    {
      title: "Posted Policies",
      value: analytics.postedPolicies,
      color: "bg-gradient-to-br from-[#102A3C] via-[#123A52] to-[#0B1F2E]",
      icon: <FileDoneOutlined style={{ fontSize: 28, color: "white" }} />,
    },
    {
      title: "Cancelled Policies",
      value: analytics.cancelledPolicies,
      color: "bg-gradient-to-br from-[#3E3E3E] via-[#4F4F4F] to-[#2B2B2B]",
      icon: <FileDoneOutlined style={{ fontSize: 28, color: "white" }} />,
    },
    {
      title: "Paid Policies",
      value: analytics.paidPolicies,
      color: "bg-gradient-to-br from-[#0D4A52] via-[#0F5E66] to-[#0A3A40]",
      icon: <DollarCircleOutlined style={{ fontSize: 28, color: "white" }} />,
    },
    {
      title: "Unpaid Policies",
      value: analytics.unpaidPolicies,
      color: "bg-gradient-to-br from-[#8B0F0F] via-[#A31616] to-[#610B0B]",
      icon: <DollarCircleOutlined style={{ fontSize: 28, color: "white" }} />,
    },
    {
      title: "Total Revenue",
      value: `Rs ${analytics.totalPaidAmount}`,
      color: "bg-gradient-to-br from-[#204B6B] via-[#2A628D] to-[#183A55]",
      icon: <RiseOutlined style={{ fontSize: 28, color: "white" }} />,
    },
  ];

  return (
    <div className="flex flex-wrap gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`
            ${card.color}
            flex-grow basis-[240px]
            rounded-2xl p-6
            flex items-center justify-between
            text-white
            shadow-lg shadow-black/20
            transition-all duration-300 ease-out
            hover:-translate-y-2 hover:scale-[1.02] hover:brightness-110
            cursor-pointer
          `}
        >
          {/* Left */}
          <div className="flex flex-col">
            <span className="text-[12px] font-semibold uppercase tracking-wider opacity-80 mb-1">
              {card.title}
            </span>
            <span className="text-3xl font-extrabold tracking-tight">
              {card.value}
            </span>
          </div>

          {/* Icon */}
          <div className="
            w-14 h-14
            bg-white/15
            border border-white/20
            rounded-2xl
            flex items-center justify-center
            backdrop-blur-md
          ">
            {card.icon}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnalyticsAdminCards;
