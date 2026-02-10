import { getAllSchengenPackages } from "../../../api/schengenPackage";
import { getAllWorldWidePackages } from "../../../api/worldWidePackages";
import { getAllRestOfWorldPackages } from "../../../api/restOfWorld";
import { getAllStudentPackages } from "../../../api/studentPackage";


export const CNIC_PATTERN = /^[0-9]{13}$/;
export const PASSPORT_PATTERN = /^[A-Z0-9]+$/;
export const PHONE_PATTERN = /^03\d{9}$/;


export const PACKAGE_API_MAP = {
  shengen: getAllSchengenPackages,
  worldwide: getAllWorldWidePackages,
  "rest-of-world": getAllRestOfWorldPackages,
  "student-plan": getAllStudentPackages,
};


export const PLAN_KEY_MAP = {
  shengen: {
    diamond: { single: "diamondSingle", family: "diamondFamily" },
    gold: { single: "goldSingle", family: "goldFamily" },
  },
  "rest-of-world": {
    diamond: { single: "diamondSingle", family: "diamondFamily" },
    gold: { single: "goldSingle", family: "goldFamily" },
  },
  worldwide: {
    platinum: { single: "platinumSingle", family: "platinumFamily" },
    goldPlus: { single: "goldPlusSingle", family: "goldPlusFamily" },
    titanium: { single: "titaniumSingle", family: "titaniumFamily" },
  },
  "student-plan": {
    scholar: "scholar",
    scholarPlus: "scholarPlus",
    scholarPro: "scholarPro",
  },
};


export const PLAN_OPTIONS = {
  shengen: ["diamond", "gold"],
  "rest-of-world": ["diamond", "gold"],
  worldwide: ["platinum", "goldPlus", "titanium"],
  "student-plan": ["scholar", "scholarPlus", "scholarPro"],
};


export const getDurationOptions = (packageType) => {
  switch (packageType) {
    case "schengen":
      return [
        { value: "7", label: "7 Days" },
        { value: "10", label: "10 Days" },
        { value: "15", label: "15 Days" },
        { value: "21", label: "21 Days" },
        { value: "31", label: "31 Days" },
        { value: "62", label: "62 Days" },
        { value: "92", label: "92 Days" },
        { value: "180", label: "180 Days" },
        { value: "365", label: "365 Days" },
        { value: "2 Years", label: "2 Years" },
        { value: "365-consecutive", label: "365 Days (Consecutive)" },
      ];
    case "rest-of-world":
      return [
        { value: "7", label: "7 Days" },
        { value: "10", label: "10 Days" },
        { value: "15", label: "15 Days" },
        { value: "21", label: "21 Days" },
        { value: "31", label: "31 Days" },
        { value: "62", label: "62 Days" },
        { value: "92", label: "92 Days" },
        { value: "180", label: "180 Days" },
        { value: "365", label: "365 Days" },
      ];
    case "worldwide":
      return [
        { value: "7", label: "7 Days" },
        { value: "10", label: "10 Days" },
        { value: "15", label: "15 Days" },
        { value: "21", label: "21 Days" },
        { value: "31", label: "31 Days" },
        { value: "62", label: "62 Days" },
        { value: "92", label: "92 Days" },
        { value: "180", label: "180 Days" },
        { value: "365", label: "365 Days" },
        { value: "2 Years", label: "2 Years" },
        { value: "180-consecutive", label: "180 Days (Consecutive)" },
        { value: "365-consecutive", label: "365 Days (Consecutive)" },
        { value: "272-consecutive", label: "272 Days (Consecutive)" },
      ];
    case "student-plan":
      return [
        { value: "180", label: "180 Days" },
        { value: "365", label: "365 Days" },
        { value: "2 Years", label: "2 Years" },
      ];
    default:
      return [];
  }
};