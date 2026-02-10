import React, { useState, useEffect } from "react";
import { Input, message, Spin, Select, ConfigProvider } from "antd"; 
import { SearchOutlined } from "@ant-design/icons";

import AnalyticsCards from "../../components/dashboard/home/AnalyticsAdminCards";
import SalesBarChart from "../../components/dashboard/home/SalesBarChart";
import PolicyTable from "../../components/dashboard/home/PolicyTable";

import { getAllPoliciesApi ,getAllMonthlyBusinessApi} from "../../api/underWriting";

const { Option } = Select;

const Home = () => {
  const [policies, setPolicies] = useState([]);
    const [monthlySales, setMonthlySales] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [paymentFilter, setPaymentFilter] = useState("ALL");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPolicies();
    fetchMonthlySales();
  }, []);

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const policiesData = await getAllPoliciesApi();

      const mappedPolicies = policiesData.map((policy) => ({
        key: policy.id,
        policyNo: policy.policyNumber,
        insuredName: policy.insuredName,
        producerName: policy.User?.name || "—",
        status: policy.postStatus,
        paymentStatus: policy.paymentStatus,
        originalData: policy,
      }));

      setPolicies(mappedPolicies);
    } catch (error) {
      message.error(error.message || "Failed to load policies");
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthlySales = async () => {
    try {
      setLoading(true);
      const result = await getAllMonthlyBusinessApi();

      // Recharts ke liye format
      const formatted = result.map(item => ({
        name: item.month, // Jan, Feb ...
        sales: item.amount
      }));

      setMonthlySales(formatted);
    } catch (error) {
      message.error(error.message || "Failed to fetch monthly sales");
    } finally {
      setLoading(false);
    }
  };
  const filteredPolicies = policies.filter((item) => {
    const matchesSearch = item.policyNo
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || item.status === statusFilter;
    const matchesPayment =
      paymentFilter === "ALL" || item.paymentStatus === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      <section>
        <AnalyticsCards />
      </section>

      <section>
        <SalesBarChart data={monthlySales} />
      </section>

      <section>
        <div className="flex flex-col gap-4 mb-4">
          <h2 className="text-xl font-bold text-[#10314a]">Recent Policies</h2>
          <ConfigProvider
            theme={{
              token: {
             
                colorPrimary: "#13c2c2", 
                borderRadius: 6,
              },
            }}
          >
            <div className="flex flex-col md:flex-row gap-3">
          
              <Input
                placeholder="Search by Policy No..."
                prefix={<SearchOutlined className="text-gray-400" />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full md:w-72"
                allowClear
              />
              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                className="w-full md:w-48"
                placeholder="Filter by Status"
              >
                <Option value="ALL">All Status</Option>
                <Option value="POSTED">Posted</Option>
                <Option value="UNPOSTED">Unposted</Option>
                <Option value="CANCELLED">Cancelled</Option>
              </Select>
              <Select
                value={paymentFilter}
                onChange={setPaymentFilter}
                className="w-full md:w-48"
                placeholder="Filter by Payment"
              >
                <Option value="ALL">All Payment</Option>
                <Option value="PAID">Paid</Option>
                <Option value="UNPAID">Unpaid</Option>
              </Select>
            </div>
          </ConfigProvider>
        </div>

        <Spin spinning={loading}>
          <PolicyTable data={filteredPolicies} readOnly={false} />
        </Spin>
      </section>
    </div>
  );
};

export default Home;