import React from "react";
import Link from "next/link";

const NotFoundPage = async () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-700">
    <div className="text-center">
      {/* SVG Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-48 w-48 text-primary mx-auto mb-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.75 9.75a3 3 0 116 0m-3 3v3m-5.25 0a3 3 0 100 6h9a3 3 0 100-6m-9 0h9"
        />
      </svg>

      {/* 404 Heading */}
      <h1 className="text-9xl font-bold text-gray-800">404</h1>
      <p className="text-2xl mt-4 font-semibold">
        Oops! The page {"you're"} looking for {"isn't"} here.
      </p>
      <p className="mt-2 text-gray-500">
        It seems we {"can't"} find what {"you're"} looking for. Try going back
        to the homepage.
      </p>

      {/* Back to Home Button */}
      <Link
        href="/"
        className="mt-6 inline-block bg-primary text-white px-8 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
      >
        Go Back Home
      </Link>
    </div>
  </div>
);

export default NotFoundPage;
