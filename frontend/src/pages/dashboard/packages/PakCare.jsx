import React, { useEffect, useState } from "react";
import { message } from "antd";
import PakCareForm from "../../../components/dashboard/packages/PakCareForm";
import PackageTable from "../../../components/dashboard/packages/PackageTable";
import {
  getAllPakCarePackages,
  updatePakCarePackage,
  deletePakCarePackage,
} from "../../../api/pakCarePackages";

const PakCare = ({ userRole = "SUPER_ADMIN" }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

 
  const canModify = userRole === "SUPER_ADMIN";


  const fetchPakCarePackages = async () => {
    try {
      setLoading(true);
      const res = await getAllPakCarePackages();

      const formattedData = res.map((item) => ({
        key: item.id,
        id: item.id,
        duration: item.duration,
        singleCareSingle: item.singleCare ?? 0,
        singleCareFamily: item.familyCare ?? 0,
        singleCarePlusSingle: item.singleCarePlus ?? 0,
        singleCarePlusFamily: item.familyCarePlus ?? 0,
      }));

      setData(formattedData);
    } catch (err) {
      message.error(err.message || "Failed to load PakCare packages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPakCarePackages();
  }, []);

  const handleUpdatePakCare = async (updatedValues) => {
    try {
      await updatePakCarePackage(updatedValues.id, {
        singleCare: updatedValues.singleCareSingle,
        familyCare: updatedValues.singleCareFamily,
        singleCarePlus: updatedValues.singleCarePlusSingle,
        familyCarePlus: updatedValues.singleCarePlusFamily,
        duration: updatedValues.duration,
      });
      message.success("PakCare package updated successfully");
      fetchPakCarePackages(); // refresh table after update
    } catch (err) {
      message.error(err.message || "Failed to update package");
    }
  };

  const handleDeletePakCare = async (id) => {
    try {
      await deletePakCarePackage(id);
      message.success("PakCare package deleted successfully");
      fetchPakCarePackages(); // refresh table after deletion
    } catch (err) {
      message.error(err.message || "Failed to delete package");
    }
  };
 
  const columns = [
    {
      title: "Duration",
      dataIndex: "duration",
      width: 150,
      align: "center",
      render: (t) => <span className="font-bold text-[#10314a]">{t}</span>,
    },
    {
      title: "Single Care Plan",
      children: [
        {
          title: "Single (RS)",
          dataIndex: "singleCareSingle",
          width: 150,
          align: "center",
          render: (v) => `${v.toLocaleString()}`,
        },
        {
          title: "Family (RS)",
          dataIndex: "singleCareFamily",
          width: 150,
          align: "center",
          render: (v) => `${v.toLocaleString()}`,
        },
      ],
    },
    {
      title: "Single Care Plus Plan",
      children: [
        {
          title: "Single (RS)",
          dataIndex: "singleCarePlusSingle",
          width: 150,
          align: "center",
          render: (v) => `${v.toLocaleString()}`,
        },
        {
          title: "Family (RS)",
          dataIndex: "singleCarePlusFamily",
          width: 150,
          align: "center",
          render: (v) => `${v.toLocaleString()}`,
        },
      ],
    },
  ];

  const handleUpdateStub = (val) => {
    console.log("Update:", val);
    message.success("UI Demo: Update Triggered");
  };
  const handleDeleteStub = (id) => {
    console.log("Delete:", id);
    message.success("UI Demo: Delete Triggered");
  };

  return (
    <div className="max-w-5xl mx-auto py-6 animate-fade-in px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#10314a]">PakCare Packages</h1>
        <p className="text-gray-500 mt-1">
          PakCare travel packages coverage rates.
        </p>
      </div>

      {canModify && (
        <div className="mb-10">
        
          <PakCareForm onSuccess={fetchPakCarePackages} />
        </div>
      )}

      <PackageTable
        columns={columns}
        data={data}
        title="PakCare Rates Table"
        onUpdateAPI={canModify ? handleUpdatePakCare : undefined}
        onDeleteAPI={canModify ? handleDeletePakCare : undefined}
        showActions={canModify}
        minWidth="900px"
        loading={loading}
      />
    </div>
  );
};

export default PakCare;
