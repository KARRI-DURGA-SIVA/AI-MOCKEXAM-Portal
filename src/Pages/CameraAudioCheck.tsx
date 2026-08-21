import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  CheckCircle2,
  Mic,
  RefreshCw,
  ShieldCheck,
  Volume2,
  AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function CameraAudioCheck() {
  const navigate = useNavigate();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationRef = useRef<number | null>(null);

  const [cameraStatus, setCameraStatus] = useState<
    "checking" | "passed" | "failed"
  >("checking");

  const [audioStatus, setAudioStatus] = useState<
    "checking" | "passed" | "failed"
  >("checking");

  const [micLevel, setMicLevel] = useState(0);
  const [error, setError] = useState("");

  const startCheck = async () => {
    try {
      setError("");
      setCameraStatus("checking");
      setAudioStatus("checking");

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: true,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const videoTrack = stream.getVideoTracks()[0];
      const audioTrack = stream.getAudioTracks()[0];

      if (videoTrack?.readyState === "live") {
        setCameraStatus("passed");
      } else {
        setCameraStatus("failed");
      }

      if (audioTrack?.readyState === "live") {
        setAudioStatus("passed");
        startAudioDetection(stream);
      } else {
        setAudioStatus("failed");
      }
    } catch (err) {
      console.error(err);

      setCameraStatus("failed");
      setAudioStatus("failed");

      setError(
        "Camera and microphone access was denied. Please allow permissions and try again."
      );
    }
  };

  const startAudioDetection = (stream: MediaStream) => {
    try {
      const AudioContextClass =
        window.AudioContext ||
        (
          window as typeof window & {
            webkitAudioContext?: typeof AudioContext;
          }
        ).webkitAudioContext;

      if (!AudioContextClass) return;

      const audioContext = new AudioContextClass();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();

      analyser.fftSize = 256;

      const source = audioContext.createMediaStreamSource(stream);

      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const detectVolume = () => {
        analyser.getByteFrequencyData(dataArray);

        let total = 0;

        for (let i = 0; i < dataArray.length; i++) {
          total += dataArray[i];
        }

        const average = total / dataArray.length;

        const level = Math.min(100, average * 2);

        setMicLevel(level);

        animationRef.current = requestAnimationFrame(detectVolume);
      };

      detectVolume();
    } catch (error) {
      console.error("Audio detection error:", error);
    }
  };

  useEffect(() => {
    startCheck();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      if (audioContextRef.current) {
        audioContextRef.current.close();
      }

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const bothPassed =
    cameraStatus === "passed" && audioStatus === "passed";

  const getStatusText = (
    status: "checking" | "passed" | "failed"
  ) => {
    if (status === "checking") return "Checking...";
    if (status === "passed") return "Working properly";
    return "Check failed";
  };

  return (
    <div className="min-h-screen bg-[#f5f6f8] px-4 py-5 sm:px-6 md:px-10 md:py-8">
      <div className="mx-auto w-full max-w-6xl">

        {/* HEADER */}

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 items-center gap-2 rounded-full border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-600 shadow-sm transition hover:bg-gray-50"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <div className="flex h-11 items-center gap-2 rounded-full bg-white px-4 text-xs font-semibold text-gray-600 shadow-sm sm:text-sm">
            <ShieldCheck size={17} />
            <span>Secure Examination</span>
          </div>
        </div>

        {/* TITLE */}

        <div className="mt-8">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-600">
            Step 1 of 4
          </p>

          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#1f2937] sm:text-4xl">
            Camera & Audio Check
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
            We need access to your camera and microphone before the
            examination begins. Make sure your face is clearly visible
            and your microphone is working.
          </p>
        </div>

        {/* MAIN GRID */}

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_1fr]">

          {/* CAMERA CARD */}

          <div className="rounded-[8px] bg-white p-5 shadow-sm sm:p-6">

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <Camera size={22} />
                </div>

                <div>
                  <h2 className="font-extrabold text-[#1f2937]">
                    Camera Preview
                  </h2>

                  <p className="mt-1 text-xs text-gray-500">
                    Position your face inside the frame
                  </p>
                </div>

              </div>

              <StatusBadge status={cameraStatus} />

            </div>

            {/* CAMERA */}

            <div className="relative mt-6 overflow-hidden rounded-[12px] bg-[#111827] aspect-video">

              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="h-full w-full object-cover"
              />

              {/* FACE FRAME */}

              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">

                <div className="relative h-[72%] w-[45%] max-w-[260px] rounded-[45%] border-2 border-white/80">

                  <div className="absolute -left-1 -top-1 h-8 w-8 border-l-4 border-t-4 border-blue-500 rounded-tl-xl" />

                  <div className="absolute -right-1 -top-1 h-8 w-8 border-r-4 border-t-4 border-blue-500 rounded-tr-xl" />

                  <div className="absolute -bottom-1 -left-1 h-8 w-8 border-b-4 border-l-4 border-blue-500 rounded-bl-xl" />

                  <div className="absolute -bottom-1 -right-1 h-8 w-8 border-b-4 border-r-4 border-blue-500 rounded-br-xl" />

                </div>

              </div>

              {/* CAMERA STATUS */}

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <div className="flex items-center gap-2 rounded-full bg-black/60 px-4 py-2 text-xs font-medium text-white backdrop-blur">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      cameraStatus === "passed"
                        ? "bg-green-400"
                        : cameraStatus === "failed"
                        ? "bg-red-400"
                        : "bg-yellow-400"
                    }`}
                  />

                  {getStatusText(cameraStatus)}
                </div>
              </div>

            </div>

            <div className="mt-4 flex items-start gap-3 rounded-[8px] bg-blue-50 p-4">

              <ShieldCheck
                size={18}
                className="mt-0.5 shrink-0 text-blue-600"
              />

              <p className="text-xs leading-5 text-blue-700">
                Keep your face clearly visible. Remove sunglasses,
                masks, or anything that blocks your face.
              </p>

            </div>

          </div>

          {/* AUDIO CARD */}

          <div className="rounded-[8px] bg-white p-5 shadow-sm sm:p-6">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-100 text-green-600">
                <Mic size={22} />
              </div>

              <div>
                <h2 className="font-extrabold text-[#1f2937]">
                  Microphone
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Speak to test your microphone
                </p>
              </div>

            </div>

            {/* AUDIO VISUALIZER */}

            <div className="mt-8 rounded-[12px] bg-[#f8fafc] p-6">

              <div className="flex items-center justify-center">

                <div
                  className={`flex h-20 w-20 items-center justify-center rounded-full ${
                    audioStatus === "passed"
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <Volume2 size={34} />
                </div>

              </div>

              <p className="mt-5 text-center text-sm font-bold text-[#1f2937]">
                {micLevel > 5
                  ? "Microphone detected"
                  : "Say something..."}
              </p>

              {/* LEVEL */}

              <div className="mt-5">

                <div className="h-3 overflow-hidden rounded-full bg-gray-200">

                  <div
                    className="h-full rounded-full bg-green-500 transition-all duration-75"
                    style={{
                      width: `${Math.max(micLevel, 2)}%`,
                    }}
                  />

                </div>

                <div className="mt-2 flex justify-between text-[10px] font-medium text-gray-400">
                  <span>Low</span>
                  <span>Microphone Level</span>
                  <span>High</span>
                </div>

              </div>

            </div>

            {/* AUDIO STATUS */}

            <div className="mt-5 flex items-center justify-between rounded-[8px] border border-gray-100 p-4">

              <div className="flex items-center gap-3">

                <Mic size={18} className="text-gray-500" />

                <div>
                  <p className="text-sm font-bold text-[#1f2937]">
                    Microphone Access
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {getStatusText(audioStatus)}
                  </p>
                </div>

              </div>

              {audioStatus === "passed" ? (
                <CheckCircle2
                  size={21}
                  className="text-green-600"
                />
              ) : (
                <AlertTriangle
                  size={21}
                  className="text-orange-500"
                />
              )}

            </div>

          </div>

        </div>

        {/* ERROR */}

        {error && (
          <div className="mt-6 flex items-start gap-3 rounded-[8px] border border-red-100 bg-red-50 p-4">

            <AlertTriangle
              size={19}
              className="mt-0.5 shrink-0 text-red-500"
            />

            <p className="text-sm leading-6 text-red-600">
              {error}
            </p>

          </div>
        )}

        {/* VERIFICATION SUMMARY */}

        <div className="mt-6 rounded-[8px] bg-white p-6 shadow-sm sm:p-7">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <ShieldCheck size={22} />
            </div>

            <div>
              <h2 className="font-extrabold text-[#1f2937]">
                Verification Status
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Both devices must pass before continuing.
              </p>
            </div>

          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">

            <StatusRow
              icon={<Camera size={18} />}
              title="Camera"
              status={cameraStatus}
            />

            <StatusRow
              icon={<Mic size={18} />}
              title="Microphone"
              status={audioStatus}
            />

          </div>

          {/* BUTTONS */}

          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={startCheck}
              className="flex h-12 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-7 text-sm font-bold text-gray-700 transition hover:bg-gray-100"
            >
              <RefreshCw size={16} />
              Recheck
            </button>

            <button
              type="button"
              disabled={!bothPassed}
              onClick={() => navigate("/Status")}
              className={`flex h-12 items-center justify-center gap-3 rounded-full px-7 text-sm font-bold transition ${
                bothPassed
                  ? "bg-blue-600 text-white shadow-md hover:bg-blue-700"
                  : "cursor-not-allowed bg-gray-200 text-gray-400"
              }`}
            >
              Continue
              <ArrowRight size={17} />
            </button>

          </div>

        </div>

        {/* FOOTER */}

        <p className="mt-6 pb-5 text-center text-xs leading-5 text-gray-400">
          Camera and microphone access is required for secure
          examination verification.
        </p>

      </div>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: "checking" | "passed" | "failed";
}) {
  if (status === "passed") {
    return (
      <div className="flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-600">
        <CheckCircle2 size={14} />
        Ready
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600">
        <AlertTriangle size={14} />
        Failed
      </div>
    );
  }

  return (
    <div className="rounded-full bg-yellow-50 px-3 py-1.5 text-xs font-bold text-yellow-600">
      Checking
    </div>
  );
}

function StatusRow({
  icon,
  title,
  status,
}: {
  icon: React.ReactNode;
  title: string;
  status: "checking" | "passed" | "failed";
}) {
  return (
    <div className="flex items-center justify-between rounded-[8px] border border-gray-100 p-4">

      <div className="flex items-center gap-3">

        <div className="text-gray-500">
          {icon}
        </div>

        <span className="text-sm font-bold text-[#1f2937]">
          {title}
        </span>

      </div>

      {status === "passed" ? (
        <div className="flex items-center gap-1.5 text-xs font-bold text-green-600">
          <CheckCircle2 size={16} />
          Passed
        </div>
      ) : status === "failed" ? (
        <div className="text-xs font-bold text-red-600">
          Failed
        </div>
      ) : (
        <div className="text-xs font-bold text-yellow-600">
          Checking
        </div>
      )}

    </div>
  );
}

export default CameraAudioCheck;