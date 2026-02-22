import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="text-center">
        <h1 className="text-6xl font-serif font-bold text-gray-200">404</h1>
        <p className="mt-4 text-lg text-gray-600">Page not found</p>
        <Link
          href="/"
          className="mt-6 inline-block px-6 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
