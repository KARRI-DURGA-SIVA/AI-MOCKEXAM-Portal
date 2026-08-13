import { ArrowRight, Info, Search } from "lucide-react";

function Dashboard() {
  return (
    <div className="h-full bg-[#f3f4f6] p-8 md:p-12">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-5xl font-extrabold tracking-tight text-[#1f2937]">
            Exams
          </h1>

          <p className="mt-5 text-2xl text-[#4b5563]">
            Search Exam what you want to Experience
          </p>
        </div>

        <button className="rounded-[20px] border border-[#3a3a3a] bg-[#f7f7f7] px-6 py-3 text-xl font-medium text-[#1f2937] shadow-sm transition hover:bg-white">
          Generate Exam
        </button>
      </div>

      <div className="mt-10 flex items-center justify-between gap-4 rounded-[20px] border border-[#3b3b3b] bg-white px-5 py-4 shadow-sm">
        <input
          type="text"
          placeholder="Search Example : ServiceNow , AWS"
          className="w-full border-none bg-transparent text-lg text-[#111827] placeholder:text-[#6b7280] focus:outline-none"
        />

        <button type="button" className="flex h-12 w-12 items-center justify-center rounded-full text-[#1f2937] transition hover:bg-gray-100">
          <Search size={24} />
        </button>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 xl:grid-cols-2">
        <div className="flex min-h-[240px] flex-col justify-between rounded-[20px] bg-[#0d9bf6] p-8 text-white shadow-sm">
          <div>
            <p className="text-4xl font-bold">AWS</p>
            <p className="mt-8 max-w-[320px] text-4xl font-semibold leading-tight">
              Cloud Practitioner Fundamentals
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <button className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-base font-medium text-[#202020] shadow-sm">
              <span>More Details</span>
              <Info size={18} />
            </button>

            <button className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-base font-medium text-[#202020] shadow-sm">
              <span>Start Exam</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <div className="flex min-h-[240px] flex-col justify-between rounded-[20px] bg-[#0d9bf6] p-8 text-white shadow-sm">
          <div>
            <p className="text-4xl font-bold">ServiceNow</p>
            <p className="mt-8 max-w-[360px] text-4xl font-semibold leading-tight">
              Certified Application Developer
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <button className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-base font-medium text-[#202020] shadow-sm">
              <span>More Details</span>
              <Info size={18} />
            </button>

            <button className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-base font-medium text-[#202020] shadow-sm">
              <span>Start Exam</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;