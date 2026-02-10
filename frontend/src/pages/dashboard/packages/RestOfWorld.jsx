import React, { useEffect, useState } from "react";
import { Tag, message } from "antd";
import RestOfWorldForm from "../../../components/dashboard/packages/RestOfWorldForm";
import PackageTable from "../../../components/dashboard/packages/PackageTable";
import {
  getAllRestOfWorldPackages,
  updateRestOfWorldPackage,
  deleteRestOfWorldPackage,
} from "../../../api/restOfWorld";

const RestOfWorld = ({ userRole = "SUPER_ADMIN" }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

 
  const canModify = userRole === "SUPER_ADMIN";


  const fetchPackages = async () => {
    try {
      setLoading(true);
      const res = await getAllRestOfWorldPackages();

      const formattedData = res.map((item) => ({
        key: item.id,
        id: item.id,
        duration: item.duration,
        maxStay: item.maxStay,
        diamondSingle: item.diamondSingle ?? 0,
        diamondFamily: item.diamondFamily ?? 0,
        goldSingle: item.goldSingle ?? 0,
        goldFamily: item.goldFamily ?? 0,
      }));

      setData(formattedData);
    } catch (err) {
      message.error(err.message || "Failed to load packages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

 
  const handleUpdate = async (updatedValues) => {
    try {
      await updateRestOfWorldPackage(updatedValues.id, updatedValues);
      message.success("Package updated successfully");
      fetchPackages(); 
    } catch (err) {
      message.error(err.message || "Failed to update package");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteRestOfWorldPackage(id);
      message.success("Package deleted successfully");
      fetchPackages(); // refresh table
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
      title: "Max. Stay",
      dataIndex: "maxStay",
      width: 150,
      align: "center",
      render: (t) => <Tag color="blue">{t}</Tag>,
    },
    {
      title: "Diamond Plan",
      children: [
        {
          title: "Single (RS)",
          dataIndex: "diamondSingle",
          align: "center",
          render: (v) => `${v.toLocaleString()}`,
        },
        {
          title: "Family (RS)",
          dataIndex: "diamondFamily",
          align: "center",
          render: (v) => `${v.toLocaleString()}`,
        },
      ],
    },
    {
      title: "Gold Plan",
      children: [
        {
          title: "Single (RS)",
          dataIndex: "goldSingle",
          align: "center",
          render: (v) => `${v.toLocaleString()}`,
        },
        {
          title: "Family (RS)",
          dataIndex: "goldFamily",
          align: "center",
          render: (v) => `${v.toLocaleString()}`,
        },
      ],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto py-2 animate-fade-in px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#10314a]">
          Rest of World Packages
        </h1>
        <p className="text-gray-500 mt-1">
          Manage rates for international destinations (Excluding Schengen/USA).
        </p>
      </div>

      {canModify && (
        <div className="mb-10">
          <RestOfWorldForm onSuccess={fetchPackages} />
        </div>
      )}

      <PackageTable
        columns={columns}
        data={data}
        title="Rest of World Rates Table"
        onUpdateAPI={canModify ? handleUpdate : undefined}
        onDeleteAPI={canModify ? handleDelete : undefined}
        showActions={canModify}
        loading={loading}
        minWidth="1000px"
      />
    </div>
  );
};

export default RestOfWorld;
