import  { useEffect, useState } from "react";
import {
  UserOutlined,
  FileDoneOutlined,
  DollarCircleOutlined,
  RiseOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { getBranchPolicyAnalyticsApi } from "../../../api/underWriting";

const AnalyticsCards = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await getBranchPolicyAnalyticsApi();
        setAnalytics(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="text-gray-500">Loading analytics...</div>;
  }

  if (!analytics) return null;

  const cards = [
    {
      title: "Total Policies",
      value: analytics.totalPolicies,
      color: "bg-gradient-to-br from-[#17BDB8] to-[#0F7F7C]",
      icon: <UserOutlined style={{ fontSize: 28, color: "white" }} />,
    },
    {
      title: "Posted Policies",
      value: analytics.postedPolicies,
      color: "bg-gradient-to-br from-[#102A3C] to-[#0B1F2E]",
      icon: <FileDoneOutlined style={{ fontSize: 28, color: "white" }} />,
    },
    {
      title: "Cancelled Policies",
      value: analytics.cancelledPolicies,
      color: "bg-gradient-to-br from-[#5A1E1E] to-[#3A0F0F]",
      icon: <CloseCircleOutlined style={{ fontSize: 28, color: "white" }} />,
    },
    {
      title: "Paid Policies",
      value: analytics.paidPolicies,
      color: "bg-gradient-to-br from-[#0D4A52] to-[#0A3A40]",
      icon: <DollarCircleOutlined style={{ fontSize: 28, color: "white" }} />,
    },
    {
      title: "Unpaid Policies",
      value: analytics.unpaidPolicies,
      color: "bg-gradient-to-br from-[#6B3A20] to-[#4A2715]",
      icon: <CloseCircleOutlined style={{ fontSize: 28, color: "white" }} />,
    },
    {
      title: "Total Revenue",
      value: `Rs ${analytics.totalPaidAmount}`,
      color: "bg-gradient-to-br from-[#204B6B] to-[#183A55]",
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
            transition-all duration-300
            hover:-translate-y-2 hover:scale-[1.02]
          `}
        >
          <div className="flex flex-col">
            <span className="text-[12px] font-semibold uppercase opacity-80">
              {card.title}
            </span>
            <span className="text-3xl font-extrabold">
              {card.value}
            </span>
          </div>

          <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center">
            {card.icon}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnalyticsCards;
