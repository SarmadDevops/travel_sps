import React, { useEffect, useState } from "react";
import { message, Spin } from "antd";
import ProfileHeader from "../../../components/dashboard/branch-admin/ProfileHeader";
import ProfileDetails from "../../../components/dashboard/branch-admin/ProfileDetails";
import { getBranchByIdApi } from "../../../api/branch"; 

const BranchProfile = () => {
  const [branchData, setBranchData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBranch = async () => {
      setLoading(true);

      try {
    
        const storedUser = localStorage.getItem("user");
        const user = storedUser ? JSON.parse(storedUser) : null;
        const branchId = user?.branchId; 

        if (!branchId) throw new Error("Branch ID not found for this user");

        const res = await getBranchByIdApi(branchId);
       const branch = res.branch;


const adminUser = branch?.Users?.[0] || {};

const mappedData = {

  branchName: branch.name,
  branchCode: branch.branchCode,
  city: branch.city,
  branchPhone: branch.branchPhone,
  branchOfficialEmail: branch.branchOfficialEmail,
  branchAddress: branch.branchAddress,
  branchDateOfOpening: branch.branchDateOfOpening,

  
  adminName: adminUser.name || "—",
  adminEmail: adminUser.email || "—",
  adminContactNo: branch.adminContactNo,
  adminCnic: branch.adminCnic,


  creditTrial: branch.creditTrial,
  commissionSlab: branch.commissionSlab,
};


        setBranchData(mappedData);
      } catch (error) {
        message.error(error.message || "Failed to load branch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchBranch();
  }, []);

  if (loading) return <Spin size="large" />;

  return (
    <div className="p-2 max-w-7xl mx-auto">
      <ProfileHeader branchData={branchData} />
      <ProfileDetails branchData={branchData} />
    </div>
  );
};

export default BranchProfile;
