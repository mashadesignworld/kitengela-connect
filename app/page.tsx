import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <h1 className="text-3xl font-bold text-gray-900">
        Kitengela Connect
      </h1>

      <p className="mt-4 max-w-md text-gray-600">
        Fast, reliable internet packages designed for homes and families
        in Kitengela.
      </p>

      <Link
        href="/packages"
        className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition"
      >
        View Packages
      </Link>
    </main>
  );
}
