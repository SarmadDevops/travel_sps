import React, { useState } from "react";
import VerifyPolicyForm from "../../components/dashboard/verifypolicy/VerifyPolicyForm";
import { searchPolicyByPassportAndPolicyNumber } from "../../api/underWriting";
import { message } from "antd";
// ✅ Import the new Card Component
import PolicyVerificationCard from "../../components/dashboard/verifypolicy/PolicyVerificationCard";

const VerifyPolicy = () => {
  const [searchedPolicy, setSearchedPolicy] = useState(null); // Changed to null (object, not array)

  const handleSearch = async (searchValues) => {
    console.log("Search triggered with values:", searchValues);
    setSearchedPolicy(null); // Clear previous result

    try {
      const res = await searchPolicyByPassportAndPolicyNumber({
        passportNo: searchValues.passportNo,
        policyNumber: searchValues.policyNo,
      });

      if (res.policy) {
        // ✅ Direct Object Store kar rahe hain, Table Array nahi
        setSearchedPolicy(res.policy);
        message.success(res.message || "Policy fetched successfully");
      } else {
        message.info("No policy found");
      }
    } catch (error) {
      console.error(error);
      setSearchedPolicy(null);
      message.error(error.response?.data?.message || "Search failed");
    }
  };

  return (
    <div>
      {/* Search Form */}
      <VerifyPolicyForm onSearch={handleSearch} />

      {/* ✅ Shows Card ONLY when data exists */}
      {searchedPolicy && (
        <PolicyVerificationCard 
            data={searchedPolicy} 
            readOnly={false} // ✅ False rakha taake aap Buttons use kar sakein
        />
      )}
    </div>
  );
};

export default VerifyPolicy;