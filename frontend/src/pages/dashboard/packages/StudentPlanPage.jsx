import React, { useEffect, useState } from "react";
import { message } from "antd";
import StudentPlanForm from "../../../components/dashboard/packages/StudentPlanForm";
import PackageTable from "../../../components/dashboard/packages/PackageTable";
import {
  getAllStudentPackages,
  updateStudentPackage,
  deleteStudentPackage,
} from "../../../api/studentPackage";

const StudentPlanPage = ({ userRole = "SUPER_ADMIN" }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

 
  const canModify = userRole === "SUPER_ADMIN";


  const fetchPackages = async () => {
    try {
      setLoading(true);
      const res = await getAllStudentPackages();

      const formattedData = res.packages.map((item) => ({
        key: item.id,
        id: item.id,
        duration: item.duration,
        scholar: item.scholar ?? 0,
        scholarPlus: item.scholarPlus ?? 0,
        scholarPro: item.scholarPro ?? 0,
        notes: item.notes ?? "",
      }));

      setData(formattedData);
    } catch (err) {
      message.error(err.message || "Failed to load Student Packages");
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
      await updateStudentPackage(key, payload);
      message.success("Package updated successfully");
      fetchPackages();
    } catch (err) {
      message.error(err.message || "Failed to update package");
    }
  };


  const handleDelete = async (key) => {
    try {
      await deleteStudentPackage(key);
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
      title: "Scholar Plan",
      children: [
        {
          title: "Scholar (RS)",
          dataIndex: "scholar",
          key: "scholar",
          align: "center",
          render: (v) => `${v.toLocaleString()}`,
        },
        {
          title: "Scholar Plus (RS)",
          dataIndex: "scholarPlus",
          key: "scholarPlus",
          align: "center",
          render: (v) => `${v.toLocaleString()}`,
        },
        {
          title: "Scholar Pro (RS)",
          dataIndex: "scholarPro",
          key: "scholarPro",
          align: "center",
          render: (v) => `${v.toLocaleString()}`,
        },
      ],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto animate-fade-in px-4">
      {canModify && (
        <div className="mb-10">
          <StudentPlanForm onSuccess={fetchPackages} />
        </div>
      )}

      <PackageTable
        columns={columns}
        data={data}
        title="Student Plan Rates Table"
        loading={loading}
        onUpdateAPI={canModify ? handleUpdate : undefined}
        onDeleteAPI={canModify ? handleDelete : undefined}
        showActions={canModify}
        minWidth="800px"
      />
    </div>
  );
};

export default StudentPlanPage;
