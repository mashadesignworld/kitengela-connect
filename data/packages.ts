import { InternetPackage } from "@/types/package";

export const packages: InternetPackage[] = [
  // HOURLY
  {
    name: "Kumi",
    duration: "40 Minutes",
    price: 10,
    devices: 1,
    category: "hourly",
    features: ["Unlimited Internet"],
  },
  {
    name: "Mbao",
    duration: "2 Hours",
    price: 20,
    devices: 1,
    category: "hourly",
    features: ["Unlimited Internet"],
  },

  // DAILY
  {
    name: "Daily",
    duration: "24 Hours",
    price: 80,
    devices: 1,
    category: "daily",
    features: ["Unlimited Internet"],
  },

  // WEEKLY
  {
    name: "Weekly Solo",
    duration: "7 Days",
    price: 280,
    devices: 1,
    category: "weekly",
    bestValue: true,
    features: ["Unlimited Internet"],
  },

  // MONTHLY
  {
    name: "Monthly Solo",
    duration: "30 Days",
    price: 720,
    devices: 1,
    category: "monthly",
    features: ["Unlimited Internet"],
  },

  // FAMILY
  {
    name: "Family x3",
    duration: "30 Days",
    price: 1300,
    devices: 3,
    category: "family",
    features: ["Unlimited Internet", "Multiple Devices"],
  },
];
