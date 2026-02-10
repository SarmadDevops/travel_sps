import React, { useEffect, useState } from 'react';
import UnderwriterForm from '../../components/dashboard/underwriter/UnderwriterForm';
import { getMyBranchFinancialApi } from '../../api/branch'; // import API

const Underwriter = () => {
  const [credit, setCredit] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchCredit = async () => {
    setLoading(true);
    try {
      const res = await getMyBranchFinancialApi();
      if (res.success && res.data) {
        setCredit(res.data.remainingBalance || 0); 
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCredit();
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-6 animate-fade-in">
      <div className="mb-6 px-4">
        <h1 className="text-2xl font-bold text-[#10314a]">Travel & Health Guard Insurance Policy</h1>
        <p className="text-[#ff4d4f] font-semibold mt-1">
          Your Credit: {loading ? "Loading..." : credit.toLocaleString()} Rs.
        </p>
      </div>
      
      <UnderwriterForm credit={credit} />
    </div>
  );
};

export default Underwriter;
