import React, { useEffect, useState } from "react";
import { message } from "antd";
import SchengenForm from "../../../components/dashboard/packages/SchengenForm";
import PackageTable from "../../../components/dashboard/packages/PackageTable";
import {
  getAllSchengenPackages,
  updateSchengenPackage,
  deleteSchengenPackage,
} from "../../../api/schengenPackage";

const Schengen = ({ userRole = "SUPER_ADMIN" }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const canModify = userRole === "SUPER_ADMIN";

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const res = await getAllSchengenPackages();

      const formattedData = res.packages.map((item) => ({
        key: item.id,
        id: item.id,
        packageType: "schengen",
        duration: item.duration,
        maxStay: item.maxStay,
        diamondSingle: item.diamondSingle ?? 0,
        diamondFamily: item.diamondFamily ?? 0,
        goldSingle: item.goldSingle ?? 0,
        goldFamily: item.goldFamily ?? 0,
        notes: item.notes,
      }));

      setData(formattedData);
    } catch (err) {
      message.error(err.message || "Failed to load Schengen packages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleUpdate = async (updatedRow) => {
    try {
      const { key, ...payload } = updatedRow;
      await updateSchengenPackage(key, payload);
      message.success("Package updated successfully");
      fetchPackages();
    } catch (err) {
      message.error(err.message || "Failed to update package");
    }
  };

  const handleDelete = async (key) => {
    try {
      await deleteSchengenPackage(key);
      message.success("Package deleted successfully");
      fetchPackages();
    } catch (err) {
      message.error(err.message || "Failed to delete package");
    }
  };

  const columns = [
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      width: 150,
      align: "center",
      render: (text) => (
        <span className="font-bold text-[#10314a]">{text}</span>
      ),
    },
    {
      title: "Max. Stay",
      dataIndex: "maxStay",
      key: "maxStay",
      width: 150,
      align: "center",
      render: (text) => (
        <span className="px-3 py-1 bg-cyan-100 rounded-full font-semibold">
          {text}
        </span>
      ),
    },
    {
      title: "Diamond Plan",
      children: [
        {
          title: "Single (RS)",
          dataIndex: "diamondSingle",
          key: "ds",
          align: "center",
          render: (v) => `${v.toLocaleString()}`,
        },
        {
          title: "Family (RS)",
          dataIndex: "diamondFamily",
          key: "df",
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
          key: "gs",
          align: "center",
          render: (v) => `${v.toLocaleString()}`,
        },
        {
          title: "Family (RS)",
          dataIndex: "goldFamily",
          key: "gf",
          align: "center",
          render: (v) => `${v.toLocaleString()}`,
        },
      ],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto py-2 animate-fade-in px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#10314a]">Schengen Packages</h1>
        <p className="text-gray-500 mt-1">
          Manage pricing and duration for Schengen visa travel insurance.
        </p>
      </div>

      {canModify && (
        <div className="mb-10">
          <SchengenForm onSuccess={fetchPackages} />
        </div>
      )}

      <PackageTable
        columns={columns}
        data={data}
        title="Schengen Visa Rates Table"
        loading={loading}
        onUpdateAPI={canModify ? handleUpdate : undefined}
        onDeleteAPI={canModify ? handleDelete : undefined}
        showActions={canModify}
        minWidth="1000px"
      />
    </div>
  );
};

export default Schengen;