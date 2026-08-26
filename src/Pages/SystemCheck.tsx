import { useEffect, useRef, useState } from "react";
import {
  Camera,
  Mic,
  CheckCircle,
  XCircle,
  Volume2,
  Monitor,
} from "lucide-react";

function StatusIcon({ active }: { active: boolean }) {
  return active ? (
    <CheckCircle className="text-green-500" size={22} />
  ) : (
    <XCircle className="text-red-500" size={22} />
  );
}

function SystemCheck() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [camera, setCamera] = useState(false);
  const [microphone, setMicrophone] = useState(false);
  const [audio, setAudio] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkDevices = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (stream.getVideoTracks().length > 0) {
          setCamera(true);
        }

        if (stream.getAudioTracks().length > 0) {
          setMicrophone(true);
        }

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        setAudio(true);
      } catch (error) {
        console.error("Device access error:", error);
      } finally {
        setChecking(false);
      }
    };

    checkDevices();

    const video = videoRef.current;

    return () => {
      if (video?.srcObject) {
        const tracks = (video.srcObject as MediaStream).getTracks();

        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-5xl">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600/20 mb-4">
            <Monitor className="text-blue-400" size={30} />
          </div>

          <h1 className="text-3xl font-bold">
            System Check
          </h1>

          <p className="text-slate-400 mt-2">
            Check your device before starting the examination
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="aspect-video bg-black rounded-xl overflow-hidden flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />

              {!camera && !checking && (
                <div className="absolute text-center">
                  <Camera size={40} className="mx-auto text-red-400" />
                  <p className="text-red-400 mt-2">
                    Camera not detected
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mt-5">
              <div className="flex items-center gap-3">
                <Camera className="text-blue-400" size={22} />
                <div>
                  <p className="font-semibold">Camera</p>
                  <p className="text-sm text-slate-400">
                    Webcam access
                  </p>
                </div>
              </div>

              <StatusIcon active={camera} />
            </div>
          </div>

          <div className="space-y-4">

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Mic className="text-blue-400" size={23} />
                </div>

                <div>
                  <p className="font-semibold">
                    Microphone
                  </p>
                  <p className="text-sm text-slate-400">
                    Microphone permission
                  </p>
                </div>
              </div>

              <StatusIcon active={microphone} />
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Volume2 className="text-blue-400" size={23} />
                </div>

                <div>
                  <p className="font-semibold">
                    Audio
                  </p>
                  <p className="text-sm text-slate-400">
                    Speaker availability
                  </p>
                </div>
              </div>

              <StatusIcon active={audio} />
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <h3 className="font-semibold mb-3">
                Examination Requirements
              </h3>

              <div className="space-y-2 text-sm text-slate-400">
                <p>✓ Stable internet connection</p>
                <p>✓ Camera should remain enabled</p>
                <p>✓ Microphone permission is required</p>
                <p>✓ Stay in full-screen mode during exam</p>
              </div>
            </div>

            <button
              disabled={checking || !camera || !microphone}
              className={`w-full py-3.5 rounded-xl font-semibold transition ${
                camera && microphone
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-slate-700 text-slate-400 cursor-not-allowed"
              }`}
            >
              {checking
                ? "Checking System..."
                : camera && microphone
                ? "Continue to Exam"
                : "Fix Device Issues"}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}

export default SystemCheck;
