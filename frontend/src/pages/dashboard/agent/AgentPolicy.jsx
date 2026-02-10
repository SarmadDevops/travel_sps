import React, { useState, useEffect } from "react";
import { Input, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import PolicyTable from "../../../components/dashboard/home/PolicyTable";
import { getMyPoliciesApi } from "../../../api/underWriting";

const AgentPolicy = () => {
  const [policies, setPolicies] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);


  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const data = await getMyPoliciesApi();
      const formattedData = data.map((policy) => ({
        key: policy.id,
        policyNo: policy.policyNumber,
        insuredName: policy.insuredName,
        producerName: policy.User?.name,
        issueDate: policy.createdAt?.split("T")[0],
        effectiveDate: policy.startDate,
        expiryDate: policy.endDate,
        premium: policy.policyAmount,
        status: policy.postStatus,
        paymentStatus: policy.paymentStatus,
        originalData: policy,
      }));

      setPolicies(formattedData);
    } catch (err) {
      message.error(err.message || "Failed to load policies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);
  const filteredPolicies = policies.filter((item) =>
    item.policyNo?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <section>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <h2 className="text-xl font-bold text-[#10314a]">
            Agent Policies
          </h2>

          <Input
            placeholder="Search by Policy No..."
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full md:w-72 rounded-md border-gray-300"
            size="middle"
            allowClear
          />
        </div>

       
        <PolicyTable
          data={filteredPolicies}
          loading={loading}
          readOnly={true}
          basePath="/agent/policy-view"
        />
      </section>
    </div>
  );
};

export default AgentPolicy;
