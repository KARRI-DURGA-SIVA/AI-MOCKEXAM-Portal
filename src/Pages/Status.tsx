import { useEffect, useState } from "react";
import {
  Clock3,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Flag,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

type Question = {
  id: number;
  question: string;
  options: string[];
};

const questions: Question[] = [
  {
    id: 1,
    question:
      "Which of the following is primarily used to structure the content of a web page?",
    options: [
      "CSS",
      "HTML",
      "JavaScript",
      "SQL",
    ],
  },
  {
    id: 2,
    question:
      "Which data structure follows the Last In First Out (LIFO) principle?",
    options: [
      "Queue",
      "Array",
      "Stack",
      "Linked List",
    ],
  },
  {
    id: 3,
    question:
      "Which HTTP method is commonly used to retrieve data from a server?",
    options: [
      "POST",
      "DELETE",
      "GET",
      "PUT",
    ],
  },
  {
    id: 4,
    question:
      "Which keyword is used to declare a constant in JavaScript?",
    options: [
      "var",
      "let",
      "const",
      "static",
    ],
  },
  {
    id: 5,
    question:
      "Which of the following is a relational database?",
    options: [
      "MongoDB",
      "MySQL",
      "Redis",
      "Cassandra",
    ],
  },
  {
    id: 6,
    question:
      "What is the time complexity of binary search on a sorted array?",
    options: [
      "O(n)",
      "O(log n)",
      "O(n²)",
      "O(1)",
    ],
  },
  {
    id: 7,
    question:
      "Which Java keyword is used to inherit a class?",
    options: [
      "implements",
      "extends",
      "inherits",
      "super",
    ],
  },
  {
    id: 8,
    question:
      "Which traversal visits the left subtree, root, and then right subtree?",
    options: [
      "Preorder",
      "Postorder",
      "Inorder",
      "Level Order",
    ],
  },
  {
    id: 9,
    question:
      "Which protocol is commonly used for secure web communication?",
    options: [
      "HTTP",
      "FTP",
      "HTTPS",
      "SMTP",
    ],
  },
  {
    id: 10,
    question:
      "Which language is primarily used for styling web pages?",
    options: [
      "HTML",
      "CSS",
      "Java",
      "Python",
    ],
  },
];

function Status() {
  const navigate = useNavigate();

  const TOTAL_TIME = 60 * 60; // 60 minutes

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [answers, setAnswers] = useState<Record<number, string>>({});

  const [marked, setMarked] = useState<number[]>([]);

  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);

  const [showSubmit, setShowSubmit] = useState(false);

  const current = questions[currentQuestion];

  /* ================= TIMER ================= */

  useEffect(() => {
    if (timeLeft <= 0) {
      setShowSubmit(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((time) => time - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  /* ================= FORMAT TIME ================= */

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);

    const minutes = Math.floor((seconds % 3600) / 60);

    const secs = seconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(
      minutes
    ).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  /* ================= SELECT ANSWER ================= */

  const selectAnswer = (answer: string) => {
    setAnswers((previous) => ({
      ...previous,
      [current.id]: answer,
    }));
  };

  /* ================= MARK REVIEW ================= */

  const toggleMark = () => {
    setMarked((previous) =>
      previous.includes(current.id)
        ? previous.filter((id) => id !== current.id)
        : [...previous, current.id]
    );
  };

  /* ================= NAVIGATION ================= */

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((previous) => previous + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((previous) => previous - 1);
    }
  };

  const answeredCount = Object.keys(answers).length;

  const progress =
    ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-[#f5f6f8] text-[#1f2937]">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">

        <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between px-4 sm:px-6">

          {/* LEFT */}

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
              <ShieldCheck size={21} />
            </div>

            <div>

              <h1 className="text-sm font-extrabold sm:text-base">
                Secure Examination
              </h1>

              <p className="hidden text-xs text-gray-500 sm:block">
                Online Computer Based Examination
              </p>

            </div>

          </div>

          {/* CENTER */}

          <div className="hidden text-center md:block">

            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Examination
            </p>

            <p className="text-sm font-bold text-gray-800">
              NPTEL / ServiceNow / Government Exam
            </p>

          </div>

          {/* TIMER */}

          <div
            className={`flex items-center gap-2 rounded-full px-4 py-2 ${
              timeLeft <= 300
                ? "bg-red-100 text-red-600"
                : "bg-blue-50 text-blue-600"
            }`}
          >

            <Clock3 size={18} />

            <div>

              <p className="hidden text-[10px] font-bold uppercase sm:block">
                Time Remaining
              </p>

              <p className="font-mono text-sm font-extrabold sm:text-base">
                {formatTime(timeLeft)}
              </p>

            </div>

          </div>

        </div>

        {/* PROGRESS */}

        <div className="h-1 bg-gray-100">

          <div
            className="h-1 bg-blue-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />

        </div>

      </header>

      {/* ================================================= */}
      {/* MAIN */}
      {/* ================================================= */}

      <main className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8">

        {/* EXAM INFO */}

        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

          <div>

            <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-600">
              Examination in Progress
            </p>

            <h2 className="mt-1 text-xl font-extrabold sm:text-2xl">
              Question {currentQuestion + 1}
              <span className="font-medium text-gray-400">
                {" "}
                / {questions.length}
              </span>
            </h2>

          </div>

          <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 shadow-sm">

            <CheckCircle2
              size={17}
              className="text-green-600"
            />

            <span className="text-sm font-semibold text-gray-600">
              {answeredCount} Answered
            </span>

          </div>

        </div>

        {/* ================================================= */}
        {/* GRID */}
        {/* ================================================= */}

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_300px]">

          {/* ================================================= */}
          {/* QUESTION */}
          {/* ================================================= */}

          <section className="rounded-[10px] bg-white shadow-sm">

            <div className="border-b border-gray-100 p-5 sm:p-7">

              <div className="flex items-start gap-3">

                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                  {current.id}
                </span>

                <h3 className="text-base font-bold leading-7 text-gray-800 sm:text-lg">
                  {current.question}
                </h3>

              </div>

            </div>

            {/* OPTIONS */}

            <div className="p-5 sm:p-7">

              <p className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-400">
                Select one answer
              </p>

              <div className="space-y-3">

                {current.options.map((option, index) => {

                  const selected =
                    answers[current.id] === option;

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() =>
                        selectAnswer(option)
                      }
                      className={`group flex w-full items-center gap-4 rounded-lg border p-4 text-left transition-all ${
                        selected
                          ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
                          : "border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50"
                      }`}
                    >

                      {/* OPTION LETTER */}

                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                          selected
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600"
                        }`}
                      >
                        {String.fromCharCode(65 + index)}
                      </span>

                      {/* TEXT */}

                      <span
                        className={`text-sm font-medium ${
                          selected
                            ? "text-blue-700"
                            : "text-gray-700"
                        }`}
                      >
                        {option}
                      </span>

                      {/* SELECTED */}

                      {selected && (
                        <CheckCircle2
                          size={20}
                          className="ml-auto shrink-0 text-blue-600"
                        />
                      )}

                    </button>
                  );
                })}

              </div>

            </div>

            {/* QUESTION FOOTER */}

            <div className="flex flex-col gap-3 border-t border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">

              {/* MARK */}

              <button
                type="button"
                onClick={toggleMark}
                className={`flex h-10 items-center justify-center gap-2 rounded-full border px-5 text-xs font-bold transition ${
                  marked.includes(current.id)
                    ? "border-orange-300 bg-orange-50 text-orange-600"
                    : "border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
              >

                <Flag size={16} />

                {marked.includes(current.id)
                  ? "Marked for Review"
                  : "Mark for Review"}

              </button>

              {/* NAVIGATION */}

              <div className="flex gap-2">

                <button
                  type="button"
                  disabled={currentQuestion === 0}
                  onClick={previousQuestion}
                  className="flex h-10 items-center gap-2 rounded-full border border-gray-300 bg-white px-5 text-xs font-bold text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={17} />
                  Previous
                </button>

                {currentQuestion ===
                questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setShowSubmit(true)}
                    className="flex h-10 items-center gap-2 rounded-full bg-green-600 px-6 text-xs font-bold text-white hover:bg-green-700"
                  >
                    Submit Exam
                    <CheckCircle2 size={17} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={nextQuestion}
                    className="flex h-10 items-center gap-2 rounded-full bg-blue-600 px-6 text-xs font-bold text-white hover:bg-blue-700"
                  >
                    Next
                    <ChevronRight size={17} />
                  </button>
                )}

              </div>

            </div>

          </section>

          {/* ================================================= */}
          {/* QUESTION PALETTE */}
          {/* ================================================= */}

          <aside className="h-fit rounded-[10px] bg-white p-5 shadow-sm lg:sticky lg:top-24">

            <h3 className="text-sm font-extrabold">
              Question Palette
            </h3>

            <p className="mt-1 text-xs text-gray-500">
              Navigate to any question
            </p>

            {/* LEGEND */}

            <div className="mt-5 space-y-2 border-b border-gray-100 pb-5">

              <div className="flex items-center gap-2 text-xs text-gray-600">

                <span className="h-3 w-3 rounded-full bg-green-500" />

                Answered

              </div>

              <div className="flex items-center gap-2 text-xs text-gray-600">

                <span className="h-3 w-3 rounded-full bg-orange-400" />

                Marked for Review

              </div>

              <div className="flex items-center gap-2 text-xs text-gray-600">

                <span className="h-3 w-3 rounded-full bg-gray-200" />

                Not Answered

              </div>

            </div>

            {/* NUMBERS */}

            <div className="mt-5 grid grid-cols-5 gap-2">

              {questions.map((question, index) => {

                const isAnswered =
                  Boolean(answers[question.id]);

                const isMarked =
                  marked.includes(question.id);

                const isCurrent =
                  currentQuestion === index;

                return (
                  <button
                    key={question.id}
                    type="button"
                    onClick={() =>
                      setCurrentQuestion(index)
                    }
                    className={`relative h-10 rounded-md text-xs font-bold transition ${
                      isCurrent
                        ? "bg-blue-600 text-white ring-2 ring-blue-200"
                        : isMarked
                        ? "bg-orange-400 text-white"
                        : isAnswered
                        ? "bg-green-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {question.id}
                  </button>
                );
              })}

            </div>

            {/* SUMMARY */}

            <div className="mt-6 rounded-lg bg-gray-50 p-4">

              <div className="flex justify-between text-xs">

                <span className="text-gray-500">
                  Answered
                </span>

                <strong>
                  {answeredCount}
                </strong>

              </div>

              <div className="mt-2 flex justify-between text-xs">

                <span className="text-gray-500">
                  Remaining
                </span>

                <strong>
                  {questions.length - answeredCount}
                </strong>

              </div>

              <div className="mt-2 flex justify-between text-xs">

                <span className="text-gray-500">
                  Marked
                </span>

                <strong>
                  {marked.length}
                </strong>

              </div>

            </div>

            {/* WARNING */}

            <div className="mt-4 flex gap-2 rounded-lg border border-orange-100 bg-orange-50 p-3">

              <AlertTriangle
                size={16}
                className="mt-0.5 shrink-0 text-orange-500"
              />

              <p className="text-[11px] leading-5 text-orange-700">
                Do not refresh or close the examination
                window while the exam is in progress.
              </p>

            </div>

          </aside>

        </div>

      </main>

      {/* ================================================= */}
      {/* SUBMIT MODAL */}
      {/* ================================================= */}

      {showSubmit && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl sm:p-7">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-orange-600">

              <AlertTriangle size={27} />

            </div>

            <h2 className="mt-5 text-center text-xl font-extrabold">
              Submit Examination?
            </h2>

            <p className="mt-2 text-center text-sm leading-6 text-gray-500">

              You have answered{" "}
              <strong className="text-gray-800">
                {answeredCount}
              </strong>{" "}
              out of{" "}
              <strong className="text-gray-800">
                {questions.length}
              </strong>{" "}
              questions.

              <br />

              Once submitted, you cannot change your answers.

            </p>

            <div className="mt-6 flex gap-3">

              {timeLeft > 0 && (
                <button
                  type="button"
                  onClick={() => setShowSubmit(false)}
                  className="flex h-11 flex-1 items-center justify-center rounded-full border border-gray-300 text-sm font-bold text-gray-700 hover:bg-gray-50"
                >
                  Continue Exam
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  // Replace this with your result page
                  navigate("/result");
                }}
                className="flex h-11 flex-1 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white hover:bg-blue-700"
              >
                Submit Exam
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default Status;