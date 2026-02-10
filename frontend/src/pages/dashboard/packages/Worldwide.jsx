import React, { useEffect, useState } from "react";
import { message, Tag } from "antd";
import PackageTable from "../../../components/dashboard/packages/PackageTable";
import WorldwideForm from "../../../components/dashboard/packages/WorldwideForm";
import {
  getAllWorldWidePackages,
  updateWorldWidePackage,
  deleteWorldWidePackage,
} from "../../../api/worldWidePackages";

const Worldwide = ({ userRole = "SUPER_ADMIN" }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);


  const canModify = userRole === "SUPER_ADMIN";


  const fetchPackages = async () => {
    try {
      setLoading(true);
      const res = await getAllWorldWidePackages();

      const formattedData = res.map((item) => ({
        key: item.id,
        id: item.id,
        duration: item.duration,
        maxStay: item.maxStay,
        platinumSingle: item.platinumSingle ?? 0,
        platinumFamily: item.platinumFamily ?? 0,
        goldPlusSingle: item.goldPlusSingle ?? 0,
        goldPlusFamily: item.goldPlusFamily ?? 0,
        titaniumSingle: item.titaniumSingle ?? 0,
        titaniumFamily: item.titaniumFamily ?? 0,
      }));

      setData(formattedData);
    } catch (err) {
      message.error(err.message || "Failed to load Worldwide packages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);


  const columns = [
    {
      title: "Duration",
      dataIndex: "duration",
      width: 110,
      align: "center",
      render: (t) => <span className="font-bold text-[#10314a]">{t}</span>,
    },
    {
      title: "Max. Stay",
      dataIndex: "maxStay",
      width: 110,
      align: "center",
      render: (t) => <Tag color="purple">{t}</Tag>,
    },
    {
      title: "Platinum Plan",
      children: [
        {
          title: "Single (RS)",
          dataIndex: "platinumSingle",
          align: "center",
          render: (v) => `${v.toLocaleString()}`,
        },
        {
          title: "Family (RS)",
          dataIndex: "platinumFamily",
          align: "center",
          render: (v) => `${v.toLocaleString()}`,
        },
      ],
    },
    {
      title: "Gold Plus Plan",
      children: [
        {
          title: "Single (RS)",
          dataIndex: "goldPlusSingle",
          align: "center",
          render: (v) => `${v.toLocaleString()}`,
        },
        {
          title: "Family (RS)",
          dataIndex: "goldPlusFamily",
          align: "center",
          render: (v) => `${v.toLocaleString()}`,
        },
      ],
    },
    {
      title: "Titanium Plan",
      children: [
        {
          title: "Single (RS)",
          dataIndex: "titaniumSingle",
          align: "center",
          render: (v) => `${v.toLocaleString()}`,
        },
        {
          title: "Family (RS)",
          dataIndex: "titaniumFamily",
          align: "center",
          render: (v) => `${v.toLocaleString()}`,
        },
      ],
    },
  ];


  const handleUpdatePackage = async (updatedRow) => {
    try {
      await updateWorldWidePackage(updatedRow.id, updatedRow);
      message.success("Package updated successfully");
      fetchPackages();
    } catch (err) {
      console.error(err);
      message.error(err.message || "Failed to update package");
    }
  };

  const handleDeletePackage = async (id) => {
    try {
      await deleteWorldWidePackage(id);
      message.success("Package deleted successfully");
      fetchPackages(); 
    } catch (err) {
      console.error(err);
      message.error(err.message || "Failed to delete package");
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-2 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#10314a]">
          Worldwide Packages
        </h1>
        <p className="text-gray-500 mt-1">
          Global coverage rates including Platinum, Gold Plus, and Titanium
          tiers.
        </p>
      </div>

      {canModify && (
        <div className="mb-10">
          <WorldwideForm onSuccess={fetchPackages} />
        </div>
      )}

      <PackageTable
        columns={columns}
        data={data}
        title="Worldwide Packages Table"
        onUpdateAPI={canModify ? handleUpdatePackage : undefined}
        onDeleteAPI={canModify ? handleDeletePackage : undefined}
        showActions={canModify}
        minWidth="1100px"
        loading={loading}
      />
    </div>
  );
};

export default Worldwide;
