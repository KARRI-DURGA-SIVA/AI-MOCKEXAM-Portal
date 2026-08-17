import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileText,
  ShieldCheck,
  AlertTriangle,
  Monitor,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

type ExamType = "NPTEL" | "ServiceNow" | "Government";

type ExamInfo = {
  title: string;
  subtitle: string;
  duration: string;
  questions: string;
};

function Instruction() {
  const navigate = useNavigate();

  const [accepted, setAccepted] = useState(false);
  const [examType, setExamType] = useState<ExamType>("NPTEL");

  const examData: Record<ExamType, ExamInfo> = {
    NPTEL: {
      title: "NPTEL Examination",
      subtitle: "Online Certification Examination",
      duration: "180 Minutes",
      questions: "Multiple Choice Questions",
    },

    ServiceNow: {
      title: "ServiceNow CSA",
      subtitle: "Certified System Administrator Examination",
      duration: "120 Minutes",
      questions: "Multiple Choice Questions",
    },

    Government: {
      title: "Government Examination",
      subtitle: "Computer Based Examination",
      duration: "120 Minutes",
      questions: "Objective Type Questions",
    },
  };

  const currentExam = examData[examType];

  const steps = [
    {
      number: 1,
      title: "Camera & Audio Check",
      description:
        "Take your photo and verify your camera, microphone, and speaker are working properly before continuing.",
      button: "Check Camera & Audio",
    },
    {
      number: 2,
      title: "System Diagnosis & Student ID",
      description:
        "Check your system configuration and upload a valid student ID card for verification.",
      button: "Check System & ID",
    },
    {
      number: 3,
      title: "Environment & Browser Check",
      description:
        "Make sure your internet connection, browser, keyboard, mouse, and examination environment are ready.",
      button: "Check Environment",
    },
    {
      number: 4,
      title: "Final Verification",
      description:
        "Complete all required checks before proceeding to the examination.",
      button: "Final Verification",
    },
  ];

  const rules = [
    "Keep your examination environment quiet and distraction-free.",
    "Do not leave the examination unnecessarily once it has started.",
    "Do not use unauthorized materials or assistance.",
    "Follow the official examination rules applicable to your exam.",
  ];

  const beforeStart = [
    "Ensure you have enough time to complete the examination.",
    "Check your internet connection and device.",
    "Close unnecessary applications and browser tabs.",
    "Keep your login credentials available if required.",
  ];

  return (
    <div className="min-h-screen bg-[#f5f6f8] px-4 py-5 sm:px-6 md:px-10 md:py-8">
      <div className="mx-auto w-full max-w-6xl">

        {/* ================= HEADER ================= */}

        <div className="flex items-center justify-between gap-3">

          <div />

          <div className="flex h-11 items-center gap-2 rounded-full bg-white px-4 text-xs font-semibold text-gray-600 shadow-sm sm:text-sm">
            <ShieldCheck size={17} />
            <span>Secure Examination</span>
          </div>

        </div>

        {/* ================= TITLE ================= */}

        <div className="mt-8">

          <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-600">
            Examination Instructions
          </p>

          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#1f2937] sm:text-4xl md:text-5xl">
            Read Before You Start
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
            Please read all instructions carefully before starting your
            examination. Make sure you understand the exam rules and
            submission process.
          </p>

        </div>

        {/* ================= EXAM TYPE ================= */}

      

        {/* ================= EXAM INFORMATION ================= */}

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">

          {/* Duration */}

          <div className="rounded-[20px] bg-blue-600 p-5 text-white shadow-sm">

            <Clock3 size={20} />

            <p className="mt-4 text-xs text-blue-100">
              Duration
            </p>

            <p className="mt-2 text-sm font-bold">
              {currentExam.duration}
            </p>

          </div>

          {/* Question Type */}

          <div className="rounded-[20px] bg-blue-600 p-5 text-white shadow-sm">

            <FileText size={20} />

            <p className="mt-4 text-xs text-blue-100">
              Question Type
            </p>

            <p className="mt-2 text-sm font-bold">
              {currentExam.questions}
            </p>

          </div>

          {/* Mode */}

          <div className="rounded-[20px] bg-blue-600 p-5 text-white shadow-sm">

            <Monitor size={20} />

            <p className="mt-4 text-xs text-blue-100">
              Mode
            </p>

            <p className="mt-2 text-sm font-bold">
              Online Examination
            </p>

          </div>

        </div>

        {/* ================= STEP BY STEP ================= */}

        <div className="mt-6 rounded-[28px] bg-white p-6 shadow-sm sm:mt-8 sm:p-8 md:p-9">

          {/* Heading */}

          <div className="flex items-start gap-3">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <CheckCircle2 size={23} />
            </div>

            <div>

              <h2 className="text-xl font-extrabold text-[#1f2937] sm:text-2xl">
                Step-by-Step Instructions
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Complete the following verification steps before starting your
                examination.
              </p>

            </div>

          </div>

          {/* Steps */}

          <div className="mt-8 space-y-7">

            {steps.map((step) => (

              <div
                key={step.number}
                className="flex gap-4 sm:gap-5"
              >

                {/* Number */}

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                  {step.number}
                </div>

                {/* Content */}

                <div className="min-w-0 flex-1">

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                    <div className="min-w-0">

                      <h3 className="font-bold text-[#1f2937]">
                        {step.title}
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-gray-500">
                        {step.description}
                      </p>

                    </div>

                    {/* Action Button */}

                    <button
                      type="button"
                      className="flex h-9 shrink-0 items-center justify-center rounded-full bg-blue-600 px-5 text-xs font-bold text-white transition hover:bg-blue-700"
                    >
                      {step.button}
                    </button>

                  </div>

                  {/* Status */}

                  <div className="mt-3 flex items-center gap-2">

                    <span className="h-2 w-2 rounded-full bg-gray-400" />

                    <span className="text-xs font-medium text-gray-500">
                      Not Checked
                    </span>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>

        {/* ================= RULES ================= */}

        <div className="mt-6 grid grid-cols-1 gap-6 md:mt-8 md:grid-cols-2">

          {/* IMPORTANT RULES */}

          <div className="rounded-[28px] bg-white p-6 shadow-sm sm:p-7">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                <AlertTriangle size={22} />
              </div>

              <h2 className="text-xl font-extrabold text-[#1f2937]">
                Important Rules
              </h2>

            </div>

            <div className="mt-6 space-y-4">

              {rules.map((rule, index) => (

                <div
                  key={index}
                  className="flex items-start gap-3"
                >

                  <CheckCircle2
                    size={19}
                    className="mt-0.5 shrink-0 text-green-600"
                  />

                  <p className="text-sm leading-6 text-gray-600">
                    {rule}
                  </p>

                </div>

              ))}

            </div>

          </div>

          {/* BEFORE STARTING */}

          <div className="rounded-[28px] bg-white p-6 shadow-sm sm:p-7">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                <ShieldCheck size={22} />
              </div>

              <h2 className="text-xl font-extrabold text-[#1f2937]">
                Before You Start
              </h2>

            </div>

            <div className="mt-6 space-y-4">

              {beforeStart.map((item, index) => (

                <div
                  key={index}
                  className="flex items-start gap-3"
                >

                  <CheckCircle2
                    size={19}
                    className="mt-0.5 shrink-0 text-green-600"
                  />

                  <p className="text-sm leading-6 text-gray-600">
                    {item}
                  </p>

                </div>

              ))}

            </div>

          </div>

        </div>

        {/* ================= CONFIRMATION ================= */}

        <div className="mt-6 rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm sm:mt-8 sm:p-7">

          <label className="flex cursor-pointer items-start gap-4">

            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) =>
                setAccepted(e.target.checked)
              }
              className="mt-1 h-5 w-5 shrink-0 accent-blue-600"
            />

            <div>

              <p className="font-bold text-[#1f2937]">
                I have read and understood the instructions
              </p>

              <p className="mt-1 text-sm leading-6 text-gray-500">
                I agree to follow the examination rules and
                understand that the examination may begin once I
                click Start Exam.
              </p>

            </div>

          </label>

          {/* ================= BUTTONS ================= */}

          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

            {/* Go Back */}

            <button
              onClick={() => navigate(-1)}
              className="flex h-12 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-7 text-sm font-bold text-gray-700 transition hover:bg-gray-100"
            >
              <ArrowLeft size={16} />
              Go Back
            </button>

            {/* Start Exam */}

            <button
              disabled={!accepted}
              onClick={() => navigate("/Status")}
              className={`flex h-12 items-center justify-center gap-3 rounded-full px-7 text-sm font-bold transition ${
                accepted
                  ? "bg-blue-600 text-white shadow-md hover:bg-blue-700"
                  : "cursor-not-allowed bg-gray-200 text-gray-400"
              }`}
            >
              Start Exam
              <ArrowRight size={17} />
            </button>

          </div>

        </div>

        {/* ================= FOOTER ================= */}

        <p className="mt-6 pb-5 text-center text-xs leading-5 text-gray-400">
          Please refer to the official examination guidelines
          for exam-specific rules and requirements.
        </p>

      </div>
    </div>
  );
}

export default Instruction;