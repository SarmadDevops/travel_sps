import React, { useEffect, useState } from "react";
import { message, Spin } from "antd";
import BranchForm from "../../../components/dashboard/branch/BranchForm";
import BranchTable from "../../../components/dashboard/branch/BranchTable";
import { getAllBranchesApi } from "../../../api/branch";

const CreateBranch = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBranches = async () => {
    setLoading(true);
    try {
      const res = await getAllBranchesApi();

   
      setBranches(
        res.branches.map((b) => ({
          key: b.id,
          branchCode: b.branchCode,
          branchName: b.name,
          city: b.city,
          branchPhone: b.branchPhone,
          branchAddress: b.branchAddress,
          branchOfficialEmail: b.branchOfficialEmail,
          branchDateOfOpening: b.branchDateOfOpening,
          creditTrial: b.creditTrial,
          commissionSlab: b.commissionSlab,
          adminContactNo: b.adminContactNo || "-",
          adminCnic: b.adminCnic || "-",
          isActive: b.isActive, 
          adminName: b.Users?.[0]?.name || "-",
          adminEmail: b.Users?.[0]?.email || "-",
        }))
      );
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches(); 
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-2 animate-fade-in px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#10314a]">Branch Management</h1>
        <p className="text-gray-500">
          Create new branches and manage existing office locations.
        </p>
      </div>

      <div className="mb-8 w-full">
        <BranchForm onSuccess={fetchBranches} />
      </div>

      <hr className="border-gray-200 my-8" />

    
      <Spin spinning={loading}>
        <BranchTable data={branches} minWidth={800} />
      </Spin>

    </div>
  );
};

export default CreateBranch;