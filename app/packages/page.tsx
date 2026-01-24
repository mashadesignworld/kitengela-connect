"use client";

import { useState } from "react";
import PackageCard from "@/components/PackageCard";
import MpesaModal from "@/components/MpesaModal";
import { packages } from "@/data/packages";
import { InternetPackage } from "@/types/package";

export default function PackagesPage() {
  const [selectedPackage, setSelectedPackage] =
    useState<InternetPackage | null>(null);

  const [activeCategory, setActiveCategory] = useState<
    "all" | "hourly" | "daily" | "weekly" | "monthly" | "family"
  >("all");

  const filteredPackages =
    activeCategory === "all"
      ? packages
      : packages.filter((pkg) => pkg.category === activeCategory);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      {/* HERO */}
      <section className="mb-10 text-center">
        <h1 className="mb-3 text-3xl font-bold text-gray-900">
          Fast & Affordable Internet in Kitengela
        </h1>
        <p className="mx-auto max-w-2xl text-gray-600">
          Choose from flexible internet packages designed for reliable
          connectivity at home or on the go.
        </p>
      </section>

      {/* TABS */}
      <div className="mb-8 flex flex-wrap justify-center gap-3">
        {["all", "hourly", "daily", "weekly", "monthly", "family"].map(
          (category) => (
            <button
              key={category}
              onClick={() =>
                setActiveCategory(
                  category as
                    | "all"
                    | "hourly"
                    | "daily"
                    | "weekly"
                    | "monthly"
                    | "family"
                )
              }
              className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition
                ${
                  activeCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              {category}
            </button>
          )
        )}
      </div>

      {/* PACKAGES */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {filteredPackages.map((pkg) => (
          <PackageCard
            key={pkg.name}
            {...pkg}
            onBuy={() => setSelectedPackage(pkg)}
          />
        ))}
      </div>

      {/* M-PESA MODAL */}
      {selectedPackage && (
        <MpesaModal
          pkg={selectedPackage}
          onClose={() => setSelectedPackage(null)}
        />
      )}
    </main>
  );
}
