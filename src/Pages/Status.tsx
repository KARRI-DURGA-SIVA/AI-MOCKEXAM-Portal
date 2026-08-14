import React from "react";
import { FileCheck2, ChartNoAxesColumnIncreasing, Trophy } from "lucide-react";

function Status() {
  return (
    <section className="mx-auto max-w-7xl px-8 pb-16">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">
          Your Exam Performance
        </h2>
        <p className="mt-2 text-gray-500">
          Track your progress and performance at a glance
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-gray-100 bg-white p-7 shadow-sm transition hover:shadow-md">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
            <FileCheck2 size={25} />
          </div>
          <p className="mt-6 text-sm text-gray-500">Exams Taken</p>
          <p className="mt-2 text-4xl font-bold text-gray-800">12</p>
          <p className="mt-2 text-sm text-gray-500">
            Total examinations completed
          </p>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-7 shadow-sm transition hover:shadow-md">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
            <ChartNoAxesColumnIncreasing size={25} />
          </div>
          <p className="mt-6 text-sm text-gray-500">Average Score</p>
          <p className="mt-2 text-4xl font-bold text-gray-800">78%</p>
          <p className="mt-2 text-sm text-gray-500">
            Average performance across exams
          </p>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-7 shadow-sm transition hover:shadow-md">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
            <Trophy size={25} />
          </div>
          <p className="mt-6 text-sm text-gray-500">Best Score</p>
          <p className="mt-2 text-4xl font-bold text-gray-800">94%</p>
          <p className="mt-2 text-sm text-gray-500">
            Your highest exam score
          </p>
        </div>
      </div>
    </section>
  );
}

export default Status;