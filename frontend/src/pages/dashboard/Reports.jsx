import React, { useState } from "react";
import ReportForm from "../../components/dashboard/report/ReportForm";
import ReportTable from "../../components/dashboard/report/ReportTable";

const Reports = () => {
  const [reportURL, setReportURL] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const token = localStorage.getItem("token"); // your auth token

  return (
    <div className="p-6">
      <ReportForm
        setReportURL={setReportURL}
        setDateRange={setDateRange}
        token={token}
      />
      {reportURL && (
        <ReportTable url={reportURL} token={token} dateRange={dateRange} />
      )}
    </div>
  );
};

export default Reports;
