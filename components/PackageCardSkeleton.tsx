export default function PackageCardSkeleton() {
  return (
    <div
      className="relative bg-white rounded-2xl border border-gray-100 p-6
      animate-pulse flex flex-col gap-4"
    >
      {/* Title */}
      <div className="h-5 w-24 bg-gray-200 rounded" />

      {/* Speed */}
      <div className="h-4 w-32 bg-gray-200 rounded" />

      {/* Price */}
      <div className="h-8 w-28 bg-gray-200 rounded" />

      {/* Features */}
      <div className="space-y-2">
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-5/6 bg-gray-200 rounded" />
        <div className="h-4 w-4/6 bg-gray-200 rounded" />
      </div>

      {/* Button */}
      <div className="mt-auto h-10 w-full bg-gray-300 rounded-xl" />
    </div>
  );
}
