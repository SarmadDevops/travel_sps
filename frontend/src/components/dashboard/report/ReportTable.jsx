import React, { useEffect, useState } from "react";
import {
  Table,
  Spin,
  Tag,
  ConfigProvider,
  Button,
  message,
  Card,
  Row,
  Col,
  Statistic,
} from "antd";
import {
  FilePdfOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { generateReportsPDF } from "../../../utils/reportspdfGenerator";

const headerGradient = "linear-gradient(90deg, #1a3a5c 0%, #1f7b85 100%)";

const ReportTable = ({ url, token, dateRange }) => {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);

  useEffect(() => {
    if (!url) return;
    fetchReport();
  }, [url]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSummary(res.data.summary);

      const grouped = res.data.data || {};
      const allPolicies = [];
      Object.keys(grouped).forEach((admin) => {
        grouped[admin].forEach((item) => {
          allPolicies.push({
            key: item.policy.id,
            policyNo: item.policy.policyNumber,
            insuredName: item.policy.insuredName,
            issueDate: item.policy.dateFrom,
            expiryDate: item.policy.dateTo,
            country: item.policy.countryToTravel,
            package: item.policy.plan,
            covid: item.policy.covidCovered,
            amount: item.policy.policyAmount,
          });
        });
      });
      setData(allPolicies);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrintPDF = async () => {
    if (data.length === 0) {
      message.warning("No data to print");
      return;
    }

    setGeneratingPDF(true);
    try {
      await generateReportsPDF({
        reportData: data,
        summary: summary,
        dateRange: dateRange || { from: "", to: "" },
      });
      message.success("PDF Downloaded Successfully!");
    } catch (error) {
      console.error("PDF generation error:", error);
      message.error("Failed to generate PDF");
    } finally {
      setGeneratingPDF(false);
    }
  };

  const columns = [
    {
      title: "Policy No",
      dataIndex: "policyNo",
      width: 140,
      render: (text) => (
        <span className="font-bold text-[#10314a]">{text}</span>
      ),
    },
    {
      title: "Insured Name",
      dataIndex: "insuredName",
      width: 180,
      render: (text) => (
        <span className="font-medium text-gray-700">{text}</span>
      ),
    },
    { title: "Issue Date", dataIndex: "issueDate", width: 170 },
    { title: "Expiry Date", dataIndex: "expiryDate", width: 170 },
    { title: "Country", dataIndex: "country", width: 120 },
    { title: "Package", dataIndex: "package", width: 120 },
    {
      title: "Covid",
      dataIndex: "covid",
      width: 90,
      align: "center",
      render: (val, record) => {
        if (record.isTotal) return null;
        return (
          <Tag
            color={val ? "green" : "red"}
            className="font-bold rounded-full border-none"
          >
            {val ? "YES" : "NO"}
          </Tag>
        );
      },
    },
    {
      title: "Amount",
      dataIndex: "amount",
      width: 120,
      align: "right",
      render: (a) => <b className="text-[#ffff]">Rs {a?.toLocaleString()}</b>,
    },
  ];

  // Add total paid amount row to data
  const dataWithTotal = [
    ...data,
    {
      key: "total",
      policyNo: "",
      insuredName: "",
      issueDate: "",
      expiryDate: "",
      country: "",
      package: "",
      covid: null,
      amount: summary?.totalPaidAmount || 0,
      isTotal: true,
    },
  ];

  return (
    <ConfigProvider
      theme={{
        token: { colorPrimary: "#13c2c2" },
        components: {
          Table: {
            headerColor: "white",
            headerBg: "transparent",
            borderColor: "#e5e7eb",
            cellPaddingBlock: 12,
            rowHoverBg: "#f0fdfa",
          },
        },
      }}
    >
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Spin size="large" />
          </div>
        ) : (
          <>
            <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
              <div
                className="flex justify-between items-center p-4 border-b"
                style={{ background: headerGradient }}
              >
                <h2 className="text-xl font-semibold text-white m-0">
                  Policy Report Results
                </h2>
                <Button
                  type="primary"
                  icon={<FilePdfOutlined />}
                  onClick={handlePrintPDF}
                  loading={generatingPDF}
                  disabled={data.length === 0}
                  className="bg-white text-[#1a3a5c] hover:bg-gray-100 border-none font-semibold"
                >
                  Print PDF
                </Button>
              </div>
              <Table
                columns={columns}
                dataSource={data}
                pagination={false}
                scroll={{ x: 1100 }}
                bordered={false}
                components={{
                  header: {
                    row: (props) => (
                      <tr {...props} style={{ background: headerGradient }} />
                    ),
                    cell: (props) => (
                      <th
                        {...props}
                        style={{
                          ...props.style,
                          background: "transparent",
                          color: "white",
                          fontWeight: 600,
                          padding: "12px 16px",
                        }}
                      />
                    ),
                  },
                }}
              />
            </div>

            {summary && (
              <Card
                title={
                  <div className="flex items-center gap-2">
                    <FileTextOutlined className="text-[#13c2c2]" />
                    <span>Summary</span>
                  </div>
                }
                className="shadow-sm"
                headStyle={{
                  background: headerGradient,
                  color: "white",
                  fontWeight: 600,
                }}
              >
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12} md={6}>
                    <Statistic
                      title="Total Policies"
                      value={summary.totalPolicies || 0}
                      prefix={<FileTextOutlined style={{ color: "#13c2c2" }} />}
                      valueStyle={{ color: "#1a3a5c", fontWeight: "bold" }}
                    />
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <Statistic
                      title="Paid"
                      value={summary.paidPoliciesCount || 0}
                      prefix={
                        <CheckCircleOutlined style={{ color: "#52c41a" }} />
                      }
                      valueStyle={{ color: "#52c41a", fontWeight: "bold" }}
                    />
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <Statistic
                      title="Cancelled"
                      value={summary.cancelledPoliciesCount || 0}
                      prefix={
                        <CloseCircleOutlined style={{ color: "#ff4d4f" }} />
                      }
                      valueStyle={{ color: "#ff4d4f", fontWeight: "bold" }}
                    />
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <Statistic
                      title="Total Paid Amount"
                      value={summary.totalPaidAmount || 0}
                      prefix={<DollarOutlined style={{ color: "#13c2c2" }} />}
                      valueStyle={{ color: "#1a3a5c", fontWeight: "bold" }}
                      formatter={(value) => `Rs ${value.toLocaleString()}`}
                    />
                  </Col>
                </Row>
              </Card>
            )}
          </>
        )}
      </div>
    </ConfigProvider>
  );
};

export default ReportTable;
