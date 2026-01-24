"use client";

import { Clock, Smartphone, Check, Zap } from "lucide-react";


interface PackageCardProps {
  name: string;
  duration: string;
  price: number;
  features: string[];
  devices: number;
  bestValue?: boolean;
  onBuy: () => void;
}

export default function PackageCard({
  name,
  duration,
  price,
  features,
  devices,
  bestValue = false,
  onBuy,
}: PackageCardProps) {
  return (
    
     <div
  className={`relative bg-white rounded-2xl border border-gray-100 shadow-sm
  transition-all duration-300 ease-out
  hover:-translate-y-1 hover:shadow-xl hover:ring-2 hover:ring-blue-500/30
  p-6 flex flex-col
  ${bestValue ? "ring-2 ring-green-500/40" : ""}`}
>
      {/* Best Value Badge */}
      {bestValue && (
        <span className="absolute top-4 right-4 bg-green-600 text-white text-[11px] tracking-wide px-3 py-1 rounded-full font-semibold uppercase">
          Best Value
        </span>
      )}

      {/* Package Name */}
      <h3 className="text-lg font-semibold text-gray-900 tracking-tight">
        {name}
      </h3>

      {/* Duration */}
      <div className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
        <Clock size={14} />
        <span>{duration}</span>
      </div>

      {/* Price */}
      <div className="mt-4 flex items-center gap-2">
        <Zap size={18} className="text-blue-600" />
        <p className="text-3xl font-bold text-blue-600">
          {price}
        </p>
      </div>

      {/* Device Badge */}
      <div className="mt-3 inline-flex items-center gap-2 w-fit bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">
        <Smartphone size={14} />
        <span>
          {devices} Device{devices > 1 ? "s" : ""}
        </span>
      </div>

      {/* Features */}
      <ul className="mt-5 space-y-2 text-sm text-gray-600">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <Check
              size={14}
              className="mt-0.5 text-green-600"
            />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        onClick={onBuy}
        className="mt-6 bg-green-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-green-700 transition"
      >
        Buy Now
      </button>
    </div>
  );
}
