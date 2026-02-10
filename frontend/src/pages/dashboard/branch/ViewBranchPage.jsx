import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Spin, message } from "antd";
import BranchDetails from "../../../components/dashboard/branch/BranchDetails";
import { getBranchByIdApi } from "../../../api/branch";

const ViewBranchPage = () => {
  const location = useLocation();
  const { branchId } = useParams();

  const [branchData, setBranchData] = useState(
    location.state?.branchData || null,
  );
  const [loading, setLoading] = useState(false);
  const initialShowAgents = location.state?.showAgents ?? false;

  useEffect(() => {
    const fetchBranchData = async () => {
      if (!branchId) return;

      try {
        setLoading(true);
        const response = await getBranchByIdApi(branchId);

        // Extract branch data from response
        const rawBranch = response.data || response.branch || response;

        // Transform the data to match component expectations
        const transformedBranch = {
          ...rawBranch,
          key: rawBranch.id || rawBranch.key || rawBranch._id,
          branchName: rawBranch.name || rawBranch.branchName,
          adminName: rawBranch.Users?.[0]?.name || rawBranch.adminName,
          adminEmail: rawBranch.Users?.[0]?.email || rawBranch.adminEmail,
        };

        setBranchData(transformedBranch);
      } catch (error) {
        console.error("Error fetching branch:", error);
        message.error(error.message || "Failed to load branch details");
        if (!location.state?.branchData) {
          setBranchData(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBranchData();
  }, [branchId]);

  if (loading && !branchData) {
    return (
      <div className="p-10 text-center flex flex-col items-center justify-center min-h-[50vh]">
        <Spin size="large" />
        <p className="mt-4 text-gray-500">Loading branch details...</p>
      </div>
    );
  }

  if (!branchData && !loading) {
    return (
      <div className="p-6 text-center text-red-500">
        Error: No branch data found. Please select a branch from the list.
      </div>
    );
  }

  return (
    <div className="p-6 w-full max-w-[100vw] overflow-x-hidden">
      <Spin spinning={loading}>
        <BranchDetails
          branchData={branchData}
          branchId={branchId}
          initialShowAgents={initialShowAgents}
        />
      </Spin>
    </div>
  );
};

export default ViewBranchPage;
