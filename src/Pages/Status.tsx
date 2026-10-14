
import { useNavigate } from "react-router-dom";
import {
  Award,
  BookOpen,
  CheckCircle2,
  Clock3,
  Target,

  Trophy,
  ArrowRight,
  CalendarDays,
} from "lucide-react";

type ExamResult = {
  id: number;
  name: string;
  category: string;
  date: string;
  score: number;
  total: number;
  duration: string;
  rank: number;
  participants: number;
};

// DEMO DATA: Replace with results fetched from your backend.
const examResults: ExamResult[] = [
  
  
];

function Results() {
  const navigate = useNavigate();

  const completed = examResults.length;

  const averageScore =
    completed > 0
      ? Math.round(
          examResults.reduce(
            (sum, exam) => sum + (exam.score / exam.total) * 100,
            0
          ) / completed
        )
      : 0;

  const highestScore =
    completed > 0
      ? Math.max(
          ...examResults.map(
            (exam) => Math.round((exam.score / exam.total) * 100)
          )
        )
      : 0;

  const passed = examResults.filter(
    (exam) => (exam.score / exam.total) * 100 >= 40
  ).length;

  return (
    <div className="">
      {/* Header */}
      <header className="px-5 py-5 sm:px-8">
        <div className="">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-600">
              Performance Center
            </p>
            <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">
              Status Overview
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Track your progress, scores and examination performance.
            </p>
          </div>

        
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-5 py-7 sm:px-8">
        {/* Demo notice */}
    

        {/* Summary cards */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 -mt-10">
          <SummaryCard
            title="Exams Completed"
            value={completed}
            subtitle="Total submitted exams"
            icon={<BookOpen size={21} />}
          />

          <SummaryCard
            title="Average Score"
            value={`${averageScore}%`}
            subtitle="Across completed exams"
            icon={<Target size={21} />}
          />

          <SummaryCard
            title="Highest Score"
            value={`${highestScore}%`}
            subtitle="Your best performance"
            icon={<Trophy size={21} />}
          />

          <SummaryCard
            title="Pass Rate"
            value={`${completed ? Math.round((passed / completed) * 100) : 0}%`}
            subtitle={`${passed} of ${completed} exams passed`}
            icon={<Award size={21} />}
          />
        </section>

        {/* Performance overview */}
        <section className="grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr]">
          

            <div className="mt-7 space-y-6">
              {examResults.map((exam) => {
                const percentage = Math.round(
                  (exam.score / exam.total) * 100
                );

                return (
                  <div key={exam.id}>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold">
                        {exam.name}
                      </span>
                      <span className="text-sm font-bold text-blue-600">
                        {percentage}%
                      </span>
                    </div>

                    <div
                      className="h-2.5 overflow-hidden rounded-full bg-gray-100"
                      role="progressbar"
                      aria-valuenow={percentage}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${exam.name} score`}
                    >
                      <div
                        className="h-full rounded-full bg-blue-600 transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}

              {completed === 0 && (
                <p className="py-6 text-center text-sm text-gray-500">
                 
                </p>
              )}
            </div>
  

          

            <div className="mt-5 space-y-3">
              {examResults.map((exam) => (
                <div
                  key={exam.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 p-4"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {exam.name}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {exam.participants} participants
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-lg font-extrabold text-blue-600">
                      #{exam.rank}
                    </p>
                    <p className="text-xs text-gray-500">Rank</p>
                  </div>
                </div>
              ))}

              {completed === 0 && (
                <p className="py-6 text-center text-sm text-gray-500">
                 
                </p>
              )}
            </div>
          
        </section>

        {/* Results table */}
        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm -mt-37">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-5 sm:px-6">
            <div>
              <h2 className="font-bold">Recent Exam Results</h2>
              <p className="mt-1 text-sm text-gray-500">
                Review your submitted examinations.
              </p>
            </div>
            <CalendarDays className="text-gray-400" size={21} />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">Exam</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Score</th>
                  <th className="px-6 py-4 font-semibold">Duration</th>
                  <th className="px-6 py-4 font-semibold">Rank</th>
                  <th className="px-6 py-4 font-semibold">Result</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {examResults.map((exam) => {
                  const percentage = Math.round(
                    (exam.score / exam.total) * 100
                  );
                  const isPassed = percentage >= 40;

                  return (
                    <tr key={exam.id} className="hover:bg-gray-50">
                      <td className="px-6 py-5">
                        <p className="font-semibold">{exam.name}</p>
                        <p className="mt-1 text-xs text-gray-500">
                          {exam.category}
                        </p>
                      </td>

                      <td className="whitespace-nowrap px-6 py-5 text-gray-600">
                        {exam.date}
                      </td>

                      <td className="whitespace-nowrap px-6 py-5 font-bold">
                        {exam.score}/{exam.total}
                        <span className="ml-2 text-xs font-medium text-gray-500">
                          ({percentage}%)
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-6 py-5 text-gray-600">
                        <span className="inline-flex items-center gap-1.5">
                          <Clock3 size={14} />
                          {exam.duration}
                        </span>
                      </td>

                      <td className="px-6 py-5 font-bold text-blue-600">
                        #{exam.rank}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                            isPassed
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          <CheckCircle2 size={14} />
                          {isPassed ? "Passed" : "Failed"}
                        </span>
                      </td>
                    </tr>
                  );
                })}

                {completed === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      No exam results yet. Start an exam to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="text-xs text-gray-500">
              Showing {completed} exam results
            </p>

            <button
              onClick={() => navigate("/exams")}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Explore Exams
              <ArrowRight size={16} />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

type SummaryCardProps = {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
};

function SummaryCard({
  title,
  value,
  subtitle,
  icon,
}: SummaryCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-3 text-3xl font-extrabold tracking-tight">
            {value}
          </p>
        </div>

        <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
          {icon}
        </div>
      </div>

      <p className="mt-4 text-xs text-gray-500">{subtitle}</p>
    </div>
  );
}

export default Results;
