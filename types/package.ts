export interface InternetPackage {
  name: string;
  duration: string;
  price: number;
  devices: number;
  category: "hourly" | "daily" | "weekly" | "monthly" | "family";
  features: string[];
  bestValue?: boolean;
}
