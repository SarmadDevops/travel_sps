import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button, Spin, message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

import PolicyDetails from "../../components/dashboard/home/PolicyDetails";
import { getPolicyByIdApi } from "../../api/underWriting";

const ViewPolicyPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [policyData, setPolicyData] = useState(
    location.state?.policyData || null,
  );
  const [loading, setLoading] = useState(false);
  const readOnly = location.state?.readOnly || false;

  useEffect(() => {
    const fetchPolicyData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await getPolicyByIdApi(id);
        const fetchedPolicy = response.policy || response;
        setPolicyData(fetchedPolicy);
      } catch (error) {
        console.error("Error fetching policy:", error);
        if (!location.state?.policyData) {
          setPolicyData(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPolicyData();
  }, [id]); // Runs whenever id changes or component mounts

  if (loading && !policyData) {
    return (
      <div className="p-10 text-center flex flex-col items-center justify-center min-h-[50vh]">
        <Spin size="large" />
        <p className="mt-4 text-gray-500">Loading policy details...</p>
      </div>
    );
  }

  if (!policyData && !loading) {
    return (
      <div className="p-10 text-center flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-red-500 font-bold text-xl mb-2">No Data Found</h2>
        <Button type="primary" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="p-2 w-full max-w-[100vw] overflow-x-hidden animate-fade-in bg-gray-50 min-h-screen">
      <div className="mb-6">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          className="bg-white border border-gray-300 text-gray-600 hover:!text-[#13c2c2] hover:!border-[#13c2c2] shadow-sm px-5 h-9 flex items-center gap-2 rounded-md font-medium transition-all"
        >
          Back
        </Button>
      </div>

      <Spin spinning={loading}>
        <PolicyDetails data={policyData} readOnly={readOnly} />
      </Spin>
    </div>
  );
};

export default ViewPolicyPage;
