function Dashboard() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-[748px] rounded-[20px] overflow-hidden bg-white shadow-[0_30px_85px_rgba(15,23,42,0.08)]">
        <div className="relative h-[772px] bg-white">
          <div className="h-[579px] bg-sky-600" />

          <div className="absolute left-[43px] top-[75px] text-white text-5xl font-bold font-['Google_Sans_Flex'] leading-tight">
            AWS
          </div>

          <div className="absolute left-[32px] top-[259px] w-[541px] text-white text-5xl font-medium font-['Google_Sans_Flex'] leading-tight">
            Cloud Practitioner
            <br />
            Fundamentals
          </div>

          <div className="absolute left-[43px] top-[682px] text-stone-900 text-2xl font-semibold font-['Google_Sans_Flex']">
            More Details
          </div>

          <div className="absolute left-[196px] top-[678px] h-9 w-9 rounded-full bg-stone-900">
            <div className="absolute inset-0 flex items-center justify-center text-white text-base font-semibold font-['Google_Sans_Flex']">
              i
            </div>
          </div>

          <div className="absolute left-[0px] top-[588px] h-0 w-full border-t-4 border-sky-500" />

          <button className="absolute left-[549px] top-[665px] h-14 rounded bg-stone-900 px-6 text-white text-xl font-extrabold font-['Google_Sans_Flex'] shadow-lg shadow-slate-900/10">
    Start Exam
</button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
