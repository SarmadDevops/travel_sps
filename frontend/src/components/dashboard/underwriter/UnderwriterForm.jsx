import React, { useEffect, useState } from "react";
import { Form, ConfigProvider, message } from "antd";
import dayjs from "dayjs";
import { generatePolicyPDF } from "../../../utils/pdfGenerator";
import { createPolicyApi } from "../../../api/underWriting";
import { getAllAgents } from "../../../api/agent";
import {
  PACKAGE_API_MAP,
  PLAN_KEY_MAP,
  PLAN_OPTIONS,
} from "./underwriterConstants";
import PackageCategorySelector from "./form-sections/PackageCategorySelector";
import TravelInformation from "./form-sections/TravelInformation";
import InsuredPersonDetails from "./form-sections/InsuredPersonalDetails";
import ContactBeneficiaryDetails from "./form-sections/ContactBeneficiaryDetails";
import FamilyMembersInformation from "./form-sections/FamilyMembersInformation";
import PlanSelectionSubmission from "./form-sections/PlanSelectionSubmission";

const UnderwriterForm = () => {
  const [form] = Form.useForm();
  const planRequired = Form.useWatch("planRequired", form);
  const planType = Form.useWatch("planType", form);
  const [agents, setAgents] = useState([]);
  const [loadingAgents, setLoadingAgents] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [planPrices, setPlanPrices] = useState({});
  const [numberOfChildren, setNumberOfChildren] = useState(0);
  const [calculatedPrices, setCalculatedPrices] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchAgents = async () => {
      setLoadingAgents(true);
      try {
        const data = await getAllAgents();
        setAgents(data || []);
      } catch {
        message.error("Failed to load agents");
      } finally {
        setLoadingAgents(false);
      }
    };
    fetchAgents();
  }, []);

  useEffect(() => {
    if (!planPrices || !selectedPackage) return;

    const values = form.getFieldsValue();

    recalcPrices(
      values.planRequired || PLAN_OPTIONS[selectedPackage]?.[0],
      values,
    );
  }, [planPrices, selectedPackage]);

  const updatePlanPrices = async (values) => {
    const { package: pkg, days, planType } = values;

    if (!pkg || !days || !planType) {
      setPlanPrices({});
      return;
    }
    try {
      const apiFn = PACKAGE_API_MAP[pkg];
      if (!apiFn) return;
      const res = await apiFn();
      const packages = res?.packages || res || [];
      const selectedDuration = packages.find((p) => {
        if (!p?.duration) return false;
        let apiStr = String(p.duration || "")
          .trim()
          .toLowerCase()
          .replace(/\s+/g, " ")
          .replace(/days?/gi, "days")
          .replace(" days", "days")
          .replace(/consecutive/gi, "")
          .replace(/\(.*?\)/g, "")
          .trim();

        let inputStr = String(days || "")
          .trim()
          .toLowerCase()
          .replace("-consecutive", "")
          .replace(" days", "days")
          .replace(" day", "days");
        return (
          apiStr === inputStr + "days" ||
          apiStr.startsWith(inputStr + "days") ||
          apiStr.startsWith(inputStr) ||
          apiStr.includes(inputStr) ||
          apiStr.replace(/\D/g, "") === inputStr.replace(/\D/g, "")
        );
      });
      if (!selectedDuration) {
        setPlanPrices({});
        return;
      }
      const prices = {};
      (PLAN_OPTIONS[pkg] || []).forEach((planKey) => {
        const config = PLAN_KEY_MAP[pkg]?.[planKey];
        if (!config) return;
        const priceKey =
          typeof config === "string"
            ? config
            : config[planType === "family" ? "family" : "single"];
        const price = selectedDuration[priceKey];
        if (price != null && !isNaN(Number(price))) {
          prices[planKey] = Number(price);
        }
      });
      setPlanPrices(prices);
    } catch (err) {
      console.error("Price fetch error:", err);
      message.error("Failed to load plan prices");
      setPlanPrices({});
    }
  };
  const recalcPrices = (planRequired, allValues) => {
    if (!planPrices || !selectedPackage || !planRequired) return;
    const newCalculated = {};
    (PLAN_OPTIONS[selectedPackage] || []).forEach((plan) => {
      if (!planPrices[plan]) return;
      if (allValues.planType === "family") {
        newCalculated[plan] = calculateFamilyPrice(
          { ...allValues, planRequired: plan },
          planPrices,
        );
      } else if (allValues.dob) {
        newCalculated[plan] = applyAgeIncrease(allValues.dob, planPrices[plan]);
      } else {
        newCalculated[plan] = planPrices[plan];
      }
    });
    setCalculatedPrices(newCalculated);
  };
  const applyAgeIncrease = (dob, basePrice) => {
    if (!dob || !basePrice) return basePrice;
    const today = dayjs();
    const birthDate = dayjs(dob);
    const age = today.diff(birthDate, "year");
    let multiplier = 1;
    if (age >= 66 && age <= 75) multiplier = 1.5;
    else if (age >= 76 && age <= 80) multiplier = 1.75;
    else if (age >= 81 && age <= 85) multiplier = 2;
    else if (age >= 86 && age <= 90) multiplier = 3;
    return Math.round(basePrice * multiplier);
  };
  const calculateFamilyPrice = (values, planPrices) => {
    if (!values.planRequired) return 0;
    const basePrice = planPrices[values.planRequired];
    if (!basePrice) return 0;
    const ages = [];
    if (values.dob) {
      ages.push(dayjs().diff(values.dob, "year"));
    }
    if (values.spouseDob) {
      ages.push(dayjs().diff(values.spouseDob, "year"));
    }
    for (let i = 1; i <= 3; i++) {
      const childAge = values[`child${i}Age`];
      if (childAge != null) {
        ages.push(childAge);
      }
    }
    const maxAge = ages.length ? Math.max(...ages) : 0;
    let multiplier = 1;
    if (maxAge >= 66 && maxAge <= 75) multiplier = 1.5;
    else if (maxAge >= 76 && maxAge <= 80) multiplier = 1.75;
    else if (maxAge >= 81 && maxAge <= 85) multiplier = 2;
    else if (maxAge >= 86 && maxAge <= 90) multiplier = 3;

    return Math.round(basePrice * multiplier);
  };
  const handleSubmitPolicy = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      let selectedPrice = 0;
      if (values.planType === "family") {
        selectedPrice = calculateFamilyPrice(values, planPrices);
      } else {
        selectedPrice = values.dob
          ? applyAgeIncrease(values.dob, planPrices[values.planRequired])
          : planPrices[values.planRequired];
      }
      if (!selectedPrice) {
        message.error("Cannot find price for selected plan.");
        return;
      }
      const payload = {
        travelPolicyFor:
          values.policyFor === "pakistani" ? "PAKISTANI" : "FOREIGN",
        covidCovered: true,
        dateFrom: values.dateFrom.format("YYYY-MM-DD"),
        dateTo: values.dateFrom
          .add(Number(values.days), "days")
          .format("YYYY-MM-DD"),
        durationDays: Number(values.days),
        countryToTravel: values.country?.toUpperCase() || "",
        underWriterNotes: values.underWriterNotes || "",
        policyType: values.planType === "family" ? "FAMILY" : "SINGLE",
        packageType: values.package?.toUpperCase().replace(/-/g, "_"),
        plan: values.planRequired?.toUpperCase(),
        policyAmount: selectedPrice,
        insuredName: values.insuredName,
        dob: values.dob.format("YYYY-MM-DD"),
        passportNo: values.passport,
        cnic: values.cnic,
        contactNo: values.contact,
        address: values.address,
        beneficiaryName: values.beneficiary,
        beneficiaryRelationship: values.beneficiaryRelationship,
        agentId: values.agentId,
        spouseName: values.spouseName || null,
        spousePassport: values.spousePassport || null,
        spouseCnic: values.spouseCnic || null,
        spouseDob: values.spouseDob
          ? values.spouseDob.format("YYYY-MM-DD")
          : null,
        children:
          values.planType === "family"
            ? [
                values.child1Name && {
                  name: values.child1Name,
                  dob: values.child1Age
                    ? dayjs()
                        .subtract(values.child1Age, "year")
                        .format("YYYY-MM-DD")
                    : null,
                  passportNo: values.child1Passport,
                },
                values.child2Name && {
                  name: values.child2Name,
                  dob: values.child2Age
                    ? dayjs()
                        .subtract(values.child2Age, "year")
                        .format("YYYY-MM-DD")
                    : null,
                  passportNo: values.child2Passport,
                },
                values.child3Name && {
                  name: values.child3Name,
                  dob: values.child3Age
                    ? dayjs()
                        .subtract(values.child3Age, "year")
                        .format("YYYY-MM-DD")
                    : null,
                  passportNo: values.child3Passport,
                },
              ].filter(Boolean)
            : [],
      };
      await createPolicyApi(payload);
      message.success("Policy created successfully ✅");
      if (values.policyView === "pdf") {
        const apiFn = PACKAGE_API_MAP[values.package];
        const res = apiFn ? await apiFn() : [];
        const packagesData = res?.packages || res || [];
        await generatePolicyPDF({
          formValues: values,
          selectedPrice,
          packageType: values.package,
          packagesData,
        });
        message.success("PDF generated successfully!");
      }
      form.resetFields();
      setPlanPrices({});
      setCalculatedPrices({});
    } catch (err) {
      if (err.errorFields) {
        message.error("Please fill in all required fields correctly.");
      } else {
        message.error(err.message || "Policy creation failed ");
      }
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#13c2c2",
          borderRadius: 8,
          colorTextHeading: "#10314a",
          fontFamily: "'Inter', sans-serif",
        },
        components: {
          Button: { fontWeight: 600, controlHeight: 45 },
          Input: { controlHeight: 45 },
          Select: { controlHeight: 45 },
          DatePicker: { controlHeight: 45 },
          Radio: { controlHeight: 40 },
        },
      }}
    >
      <div className="bg-white p-6 md:p-10 rounded-xl shadow-sm border border-gray-100 animate-fade-in">
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            planType: "single",
            policyFor: "pakistani",
            policyView: "pdf",
          }}
          onValuesChange={(changed, allValues) => {
            if (changed.package) {
              setSelectedPackage(allValues.package);
              form.setFieldsValue({
                days: undefined,
                planRequired: undefined,
              });
              setPlanPrices({});
              setCalculatedPrices({});

              const firstPlan = PLAN_OPTIONS[allValues.package]?.[0];
              if (firstPlan) {
                form.setFieldsValue({ planRequired: firstPlan });
              }
            }

            if (changed.package || changed.days || changed.planType) {
              updatePlanPrices(allValues);
            }

            const ageFields = [
              "dob",
              "spouseDob",
              "child1Age",
              "child2Age",
              "child3Age",
            ];
            if (ageFields.some((f) => f in changed)) {
              recalcPrices(
                allValues.planRequired || PLAN_OPTIONS[allValues.package]?.[0],
                allValues,
              );
            }

            if (allValues.dateFrom && allValues.days) {
              const expiryDate = dayjs(allValues.dateFrom).add(
                Number(allValues.days),
                "day",
              );
              form.setFieldsValue({
                dateTo: expiryDate.format("DD/MM/YYYY"),
              });
            }
          }}
        >
          <PackageCategorySelector />

          {selectedPackage && (
            <div className="animate-fade-in mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
                <TravelInformation
                  agents={agents}
                  loadingAgents={loadingAgents}
                  selectedPackage={selectedPackage}
                />
                <InsuredPersonDetails />
              </div>
              <ContactBeneficiaryDetails />
              <div className="my-8 border-t border-gray-100" />
              <FamilyMembersInformation
                planType={planType}
                numberOfChildren={numberOfChildren}
                setNumberOfChildren={setNumberOfChildren}
                form={form}
              />
              <PlanSelectionSubmission
                selectedPackage={selectedPackage}
                calculatedPrices={calculatedPrices}
                submitting={submitting}
                handleSubmitPolicy={handleSubmitPolicy}
                planRequired={planRequired}
              />
            </div>
          )}
        </Form>
      </div>
    </ConfigProvider>
  );
};
export default UnderwriterForm;
