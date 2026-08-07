function Dashboard() {
  const examCards = [
    {
      title: 'AWS',
      subtitle: 'Cloud Practitioner Fundamentals',
      detail: 'More Details',
      info: 'Start Exam',
    },
    {
      title: 'AI Paper',
      subtitle: 'Machine Learning Principles',
      detail: 'More Details',
      info: 'Start Exam',
    },
    {
      title: 'Web',
      subtitle: 'Front-End Development',
      detail: 'More Details',
      info: 'Start Exam',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6">
          <div className="rounded-[30px] border border-black/10 bg-white shadow-[0_24px_80px_rgba(0,0,0,0.12)]">
            <div className="bg-blue-600 px-8 py-10 text-white">
              <p className="text-sm uppercase tracking-[0.4em] font-semibold">Dean's Board</p>
              <h1 className="mt-6 text-5xl font-bold leading-tight">Cloud Practitioner Fundamentals</h1>
            </div>
            <div className="border-t border-blue-600 bg-white px-8 py-6">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-base font-semibold text-black">More Details</p>
                </div>
                <button className="inline-flex items-center justify-center rounded-full bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-slate-900 transition">
                  Start Exam
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {examCards.map((exam) => (
              <article key={exam.title} className="rounded-[30px] border border-black/10 shadow-[0_24px_80px_rgba(0,0,0,0.08)]">
                <div className="bg-blue-600 px-6 py-7 text-white">
                  <p className="text-sm uppercase tracking-[0.35em] font-semibold">{exam.title}</p>
                  <h2 className="mt-5 text-3xl font-bold leading-tight">{exam.subtitle}</h2>
                </div>
                <div className="border-t border-blue-600 bg-white px-6 py-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-black">{exam.detail}</p>
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-sm font-bold text-white">i</div>
                  </div>
                  <button className="mt-6 w-full rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-900">
                    {exam.info}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
