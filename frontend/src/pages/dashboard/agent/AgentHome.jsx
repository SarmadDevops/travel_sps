import React, { useState, useEffect } from "react";
import AnalyticsCards from "../../../components/dashboard/agent/AnalyticsCards";
import SaleBarChart from "../../../components/dashboard/home/SalesBarChart";
import PolicyTable from "../../../components/dashboard/home/PolicyTable";
import { getMyPoliciesApi,getAgentMonthlyBusinessApi } from "../../../api/underWriting";
import PolicyChart from "../../../components/dashboard/home/PolicyChart";
const AgentHome = () => {
   const [policies, setPolicies] = useState([]);
    const [monthlySales, setMonthlySales] = useState([]);
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
  const fetchMonthlySales = async () => {
    try {
      setLoading(true);
      const result = await getAgentMonthlyBusinessApi();

      // Recharts ke liye format
      const formatted = result.map(item => ({
        name: item.month, // Jan, Feb ...
        sales: item.amount
      }));

      setMonthlySales(formatted);
    } catch (error) {
      message.error(error.message || "Failed to fetch agent monthly sales");
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
      fetchPolicies();
      fetchMonthlySales();
    }, []);
  
   
    const filteredPolicies = policies.filter((item) =>
      item.policyNo?.toLowerCase().includes(searchText.toLowerCase())
    );
  return (
    <div className="p-6 space-y-6 animate-fade-in">
    
    

    
      <AnalyticsCards />

      <SaleBarChart data={monthlySales}/>

   
  <PolicyTable
          data={filteredPolicies}
          loading={loading}
          readOnly={true}
          basePath="/agent/policy-view"
        />
    </div>
  );
};

export default AgentHome;
