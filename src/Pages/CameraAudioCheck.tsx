
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Save,
  RotateCcw,
  Play,
  Square,
} from "lucide-react";

type StepStatus = "idle" | "recording" | "ready" | "saved" | "failed";

function CameraAudioCheck() {
  const navigate = useNavigate();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioUrlRef = useRef<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [cameraReady, setCameraReady] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [savedImage, setSavedImage] = useState("");
  const [audioStatus, setAudioStatus] = useState<StepStatus>("idle");
  const [audioPreview, setAudioPreview] = useState("");
  const [savedAudio, setSavedAudio] = useState<Blob | null>(null);
  const [error, setError] = useState("");
  const [cameraLoading, setCameraLoading] = useState(true);

  // Request camera permission when the page opens.
  useEffect(() => {
    let cancelled = false;
    let localStream: MediaStream | null = null;

    async function startCamera() {
      try {
        setCameraLoading(true);
        setError("");

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        localStream = stream;

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => undefined);
        }

        setCameraReady(true);
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setCameraReady(false);
          setError(
            "Camera access failed. Allow camera permission in your browser and try again."
          );
        }
      } finally {
        if (!cancelled) setCameraLoading(false);
      }
    }

    void startCamera();

    return () => {
      cancelled = true;

      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      if (recorderRef.current?.state === "recording") {
        recorderRef.current.stop();
      }

      localStream?.getTracks().forEach((track) => track.stop());

      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }
    };
  }, []);

  // Capture the current camera frame.
  const captureImage = () => {
    const video = videoRef.current;

    if (!video || !video.videoWidth || !video.videoHeight) {
      setError("Camera is not ready. Please wait and try again.");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");

    if (!context) {
      setError("Unable to capture the image. Please try again.");
      return;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    setImagePreview(canvas.toDataURL("image/jpeg", 0.9));
    setSavedImage("");
    setError("");
  };

  const retakeImage = () => {
    setImagePreview("");
    setSavedImage("");
    setError("");
  };

  const saveImage = () => {
    if (!imagePreview) {
      setError("Capture an image before saving.");
      return;
    }

    // Saved in React state for this page/session, not uploaded to a server.
    setSavedImage(imagePreview);
    setError("");
  };

  // Start a five-second microphone recording.
  const startAudioTest = async () => {
    try {
      setError("");

      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Microphone recording is not supported in this browser.");
      }

      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const recorder = new MediaRecorder(audioStream);
      recorderRef.current = recorder;
      chunksRef.current = [];

      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
        audioUrlRef.current = null;
      }

      setAudioPreview("");
      setSavedAudio(null);
      setAudioStatus("recording");

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      recorder.onerror = () => {
        setAudioStatus("failed");
        setError("Audio recording failed. Please try again.");
        audioStream.getTracks().forEach((track) => track.stop());
      };

      recorder.onstop = () => {
        audioStream.getTracks().forEach((track) => track.stop());

        if (chunksRef.current.length === 0) {
          setAudioStatus("failed");
          setError("No audio was recorded. Please try again.");
          return;
        }

        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });

        const url = URL.createObjectURL(blob);
        audioUrlRef.current = url;

        setAudioPreview(url);
        setAudioStatus("ready");
      };

      recorder.start();

      timeoutRef.current = setTimeout(() => {
        if (recorder.state === "recording") recorder.stop();
      }, 5000);
    } catch (err) {
      console.error(err);
      setAudioStatus("failed");
      setError(
        err instanceof Error
          ? err.message
          : "Microphone access failed. Check your browser permissions."
      );
    }
  };

  const stopAudioTest = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
    }
  };

  const saveAudio = () => {
    if (!audioPreview) {
      setError("Complete the audio test before saving.");
      return;
    }

    // Keep the recording in memory for the current page/session.
    const blob = new Blob(chunksRef.current, {
      type: recorderRef.current?.mimeType || "audio/webm",
    });

    setSavedAudio(blob);
    setAudioStatus("saved");
    setError("");
  };

  const canContinue = Boolean(savedImage && savedAudio);

  const restartCamera = async () => {
    try {
      setError("");
      setCameraLoading(true);

      streamRef.current?.getTracks().forEach((track) => track.stop());

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => undefined);
      }

      setCameraReady(true);
    } catch (err) {
      console.error(err);
      setError("Could not restart the camera. Check your browser permissions.");
    } finally {
      setCameraLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f6f8] px-4 py-6 text-[#1f2937] sm:px-6 md:px-10">
      <main className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <div className="flex items-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-semibold text-gray-600 shadow-sm">
            <ShieldCheck size={18} />
            Secure Examination
          </div>
        </header>

        <section className="mt-8">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-600">
            Step 1 of 4
          </p>
          <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">
            Camera & Audio Check
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
            Capture and save your photograph first. Then record and save a
            microphone sample. Both steps must be completed before continuing.
          </p>
        </section>

        {error && (
          <div
            role="alert"
            className="mt-6 flex gap-3 rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-700"
          >
            <AlertTriangle className="shrink-0" size={19} />
            {error}
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* CAMERA CARD */}
          <section className="rounded-xl bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-blue-100 p-3 text-blue-600">
                  <Camera size={22} />
                </div>
                <div>
                  <h2 className="font-extrabold">Capture Your Image</h2>
                  <p className="mt-1 text-xs text-gray-500">
                    Keep your face clearly visible.
                  </p>
                </div>
              </div>

              {savedImage && (
                <span className="flex items-center gap-1 text-xs font-bold text-green-600">
                  <CheckCircle2 size={16} />
                  Saved
                </span>
              )}
            </div>

            <div className="relative mt-6 flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-gray-900">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Captured examination identity"
                  className="h-full w-full object-contain"
                />
              ) : (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="h-full w-full object-cover"
                  />
                  {!cameraReady && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-5 text-center text-sm text-white">
                      <Camera size={30} />
                      {cameraLoading
                        ? "Starting camera..."
                        : "Camera unavailable"}
                    </div>
                  )}
                  {cameraReady && (
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                      <div className="h-[72%] w-[44%] max-w-[240px] rounded-[45%] border-2 border-white/80" />
                    </div>
                  )}
                </>
              )}
            </div>

            <p className="mt-3 text-xs text-gray-500">
              {savedImage
                ? "Your image is saved for this session."
                : imagePreview
                  ? "Review the captured image before saving."
                  : "Allow camera access when your browser asks."}
            </p>

            {!imagePreview ? (
              <button
                type="button"
                disabled={!cameraReady}
                onClick={captureImage}
                className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                <Camera size={18} />
                Capture Image
              </button>
            ) : (
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={retakeImage}
                  className="flex h-12 items-center justify-center gap-2 rounded-lg border border-gray-300 font-bold text-gray-700 hover:bg-gray-50"
                >
                  <RotateCcw size={17} />
                  Retake Image
                </button>

                <button
                  type="button"
                  disabled={Boolean(savedImage)}
                  onClick={saveImage}
                  className="flex h-12 items-center justify-center gap-2 rounded-lg bg-blue-600 font-bold text-white hover:bg-blue-700 disabled:bg-green-600"
                >
                  <Save size={17} />
                  {savedImage ? "Image Saved" : "Save Image"}
                </button>
              </div>
            )}

            {savedImage && (
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm font-semibold text-green-700">
                <CheckCircle2 size={18} />
                Image captured and saved successfully.
              </div>
            )}

            <button
              type="button"
              onClick={restartCamera}
              className="mt-3 flex w-full items-center justify-center gap-2 py-2 text-sm font-semibold text-gray-500 hover:text-blue-600"
            >
              <RefreshCw size={15} />
              Restart Camera
            </button>
          </section>

          {/* AUDIO CARD */}
          <section className="rounded-xl bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-green-100 p-3 text-green-600">
                <Mic size={22} />
              </div>
              <div>
                <h2 className="font-extrabold">Microphone Test</h2>
                <p className="mt-1 text-xs text-gray-500">
                  Record a short audio sample.
                </p>
              </div>
            </div>

            <div className="mt-6 flex min-h-[220px] flex-col items-center justify-center rounded-xl bg-[#f8fafc] p-6">
              <div
                className={`flex h-20 w-20 items-center justify-center rounded-full ${
                  audioStatus === "saved"
                    ? "bg-green-100 text-green-600"
                    : audioStatus === "recording"
                      ? "animate-pulse bg-red-100 text-red-600"
                      : "bg-blue-50 text-blue-600"
                }`}
              >
                <Volume2 size={34} />
              </div>

              <p className="mt-5 text-center font-bold">
                {audioStatus === "recording"
                  ? "Recording... speak now"
                  : audioStatus === "ready"
                    ? "Recording complete"
                    : audioStatus === "saved"
                      ? "Audio saved successfully"
                      : audioStatus === "failed"
                        ? "Recording failed"
                        : "Ready to test your microphone"}
              </p>

              <p className="mt-2 text-center text-xs leading-5 text-gray-500">
                {audioStatus === "recording"
                  ? "The recording will stop automatically after 5 seconds."
                  : "Speak clearly when recording starts."}
              </p>
            </div>

            {audioStatus === "recording" ? (
              <button
                type="button"
                onClick={stopAudioTest}
                className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-red-600 font-bold text-white hover:bg-red-700"
              >
                <Square size={17} />
                Stop Recording
              </button>
            ) : (
              <button
                type="button"
                disabled={!savedImage || audioStatus === "saved"}
                onClick={() => void startAudioTest()}
                className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                <Play size={17} />
                {audioStatus === "ready" || audioStatus === "failed"
                  ? "Record Again"
                  : audioStatus === "saved"
                    ? "Audio Saved"
                    : "Start Audio Test"}
              </button>
            )}

            {audioPreview && (
              <div className="mt-4 rounded-lg border border-gray-200 p-4">
                <p className="mb-3 text-sm font-bold">Preview Recording</p>
                <audio
                  controls
                  src={audioPreview}
                  className="w-full"
                />

                <button
                  type="button"
                  disabled={audioStatus === "saved"}
                  onClick={saveAudio}
                  className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-green-600 font-bold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-700"
                >
                  <Save size={17} />
                  {audioStatus === "saved" ? "Audio Saved" : "Save Audio"}
                </button>
              </div>
            )}

            {audioStatus === "saved" && (
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm font-semibold text-green-700">
                <CheckCircle2 size={18} />
                Audio recording saved successfully.
              </div>
            )}

            {!savedImage && (
              <p className="mt-4 text-xs text-gray-500">
                Save your image before starting the microphone test.
              </p>
            )}
          </section>
        </div>

        {/* VERIFICATION SUMMARY */}
        <section className="mt-6 rounded-xl bg-white p-5 shadow-sm sm:p-6">
          <h2 className="font-extrabold">Verification Summary</h2>
          <p className="mt-1 text-sm text-gray-500">
            Complete both requirements to proceed to the next instruction.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex items-center justify-between rounded-lg border border-gray-100 p-4">
              <span className="text-sm font-semibold">Photograph</span>
              {savedImage ? (
                <span className="flex items-center gap-1 text-xs font-bold text-green-600">
                  <CheckCircle2 size={16} /> Saved
                </span>
              ) : (
                <span className="text-xs font-semibold text-gray-500">
                  Pending
                </span>
              )}
            </div>

            <div className="flex items-center justify-between rounded-lg border border-gray-100 p-4">
              <span className="text-sm font-semibold">Audio recording</span>
              {savedAudio ? (
                <span className="flex items-center gap-1 text-xs font-bold text-green-600">
                  <CheckCircle2 size={16} /> Saved
                </span>
              ) : (
                <span className="text-xs font-semibold text-gray-500">
                  Pending
                </span>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => {
                setImagePreview("");
                setSavedImage("");
                setAudioPreview("");
                setSavedAudio(null);
                setAudioStatus("idle");
                setError("");

                if (audioUrlRef.current) {
                  URL.revokeObjectURL(audioUrlRef.current);
                  audioUrlRef.current = null;
                }
              }}
              className="flex h-12 items-center justify-center gap-2 rounded-full border border-gray-300 px-6 text-sm font-bold text-gray-700 hover:bg-gray-50"
            >
              <RefreshCw size={16} />
              Reset Steps
            </button>

            <button
              type="button"
              disabled={!canContinue}
              onClick={() => navigate("/instruction")}
              className="flex h-12 items-center justify-center gap-2 rounded-full bg-blue-600 px-7 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              Next Instruction
              <ArrowRight size={17} />
            </button>
          </div>
        </section>

        <p className="py-5 text-center text-xs leading-5 text-gray-400">
          Your captured media remains in browser memory on this page. It is not
          uploaded to the server by this implementation.
        </p>
      </main>
    </div>
  );
}

export default CameraAudioCheck;
