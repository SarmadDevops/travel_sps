import React, { useEffect, useState } from "react";
import { message } from "antd";
import DomesticForm from "../../../components/dashboard/packages/DomesticForm";
import PackageTable from "../../../components/dashboard/packages/PackageTable";
import {
  getAllDomesticPackages,
  updateDomesticPackage,
  deleteDomesticPackage,
} from "../../../api/domesticPackages";

const Domestic = ({ userRole = "SUPER_ADMIN" }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const canModify = userRole === "SUPER_ADMIN";

  const fetchDomesticPackages = async () => {
    try {
      setLoading(true);
      const res = await getAllDomesticPackages();

      const formattedData = res.map((item) => ({
        key: item.id,
        id: item.id,
        packageType: "domestic",
        duration: item.duration,
        platinumSingle: item.platinumSingle ?? 0,
        platinumFamily: item.platinumFamily ?? 0,
        goldSingle: item.goldSingle ?? 0,
        goldFamily: item.goldFamily ?? 0,
      }));

      setData(formattedData);
    } catch (err) {
      message.error(err.message || "Failed to load domestic packages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDomesticPackages();
  }, []);

  const columns = [
    {
      title: "Duration",
      dataIndex: "duration",
      width: 150,
      align: "center",
      render: (t) => <span className="font-bold text-[#10314a]">{t}</span>,
    },

    {
      title: "Platinum Plan",
      children: [
        {
          title: "Single (RS)",
          dataIndex: "platinumSingle",
          width: 150,
          align: "center",
          render: (v) => (
            <span className="text-gray-700 font-medium">
              {v.toLocaleString()}
            </span>
          ),
        },
        {
          title: "Family (RS)",
          dataIndex: "platinumFamily",
          width: 150,
          align: "center",
          render: (v) => (
            <span className="text-gray-700 font-medium">
              {v.toLocaleString()}
            </span>
          ),
        },
      ],
    },

    {
      title: "Gold Plan",
      children: [
        {
          title: "Single (RS)",
          dataIndex: "goldSingle",
          width: 150,
          align: "center",
          render: (v) => (
            <span className="text-gray-700 font-medium">
              {v.toLocaleString()}
            </span>
          ),
        },
        {
          title: "Family (RS)",
          dataIndex: "goldFamily",
          width: 150,
          align: "center",
          render: (v) => (
            <span className="text-gray-700 font-medium">
              {v.toLocaleString()}
            </span>
          ),
        },
      ],
    },
  ];

  const handleUpdateAPI = async (updatedRow) => {
    try {
      await updateDomesticPackage(updatedRow.id, updatedRow);
      message.success("Domestic package updated successfully");
      fetchDomesticPackages();
    } catch (err) {
      message.error(err.message || "Failed to update package");
    }
  };

  const handleDeleteAPI = async (id) => {
    try {
      await deleteDomesticPackage(id);
      message.success("Domestic package deleted successfully");
      fetchDomesticPackages();
    } catch (err) {
      message.error(err.message || "Failed to delete package");
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-6 animate-fade-in px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#10314a]">Domestic Packages</h1>
        <p className="text-gray-500 mt-1">
          Local travel packages (Platinum & Gold).
        </p>
      </div>

      {canModify && (
        <div className="mb-10">
          <DomesticForm onSuccess={fetchDomesticPackages} />
        </div>
      )}

      <PackageTable
        columns={columns}
        data={data}
        title="Domestic Rates Table"
        onUpdateAPI={canModify ? handleUpdateAPI : undefined}
        onDeleteAPI={canModify ? handleDeleteAPI : undefined}
        showActions={canModify}
        loading={loading}
      />
    </div>
  );
};

export default Domestic;