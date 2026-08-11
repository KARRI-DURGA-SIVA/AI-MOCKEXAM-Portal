import { FileCheck2, Trophy, ChartNoAxesColumnIncreasing } from "lucide-react";

function Dashboard() {
  return (
    <div className="h-full bg-[#f3f4f6] p-8 md:p-12">
      <h1 className="text-5xl font-extrabold tracking-tight text-[#1f2937]">
        Your Exam Performance
      </h1>

      <p className="mt-5 text-2xl text-[#4b5563]">
        Track your progress and performance at a glance
      </p>

      <div className="mt-10 grid grid-cols-1 gap-8 xl:grid-cols-3">
        <div className="rounded-2xl border border-[#dfe3ea] bg-[#f7f7f8] p-8 shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#dfeeff] text-blue-600">
            <FileCheck2 size={32} />
          </div>

          <p className="mt-8 text-2xl text-[#374151]">Exams Taken</p>

          <p className="mt-6 text-7xl font-black text-[#111827]">12</p>

          <p className="mt-6 text-xl text-[#4b5563]">
            Total examinations completed
          </p>
        </div>

        <div className="rounded-2xl border border-[#dfe3ea] bg-[#f7f7f8] p-8 shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#dfeeff] text-blue-600">
            <ChartNoAxesColumnIncreasing size={32} />
          </div>

          <p className="mt-8 text-2xl text-[#374151]">Average Score</p>

          <p className="mt-6 text-7xl font-black text-[#111827]">78%</p>

          <p className="mt-6 text-xl text-[#4b5563]">
            Average performance across exams
          </p>
        </div>

        <div className="rounded-2xl border border-[#dfe3ea] bg-[#f7f7f8] p-8 shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#dfeeff] text-blue-600">
            <Trophy size={32} />
          </div>

          <p className="mt-8 text-2xl text-[#374151]">Best Score</p>

          <p className="mt-6 text-7xl font-black text-[#111827]">94%</p>

          <p className="mt-6 text-xl text-[#4b5563]">
            Your highest exam score
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;