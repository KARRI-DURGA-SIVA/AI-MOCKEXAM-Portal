import { useEffect, useState } from "react";
import type { ElementType, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Monitor,
  Wifi,
  Maximize2,
  AppWindow,
  Globe,
  AlertTriangle,
  RefreshCw,
  Lock,
  X,
  ExternalLink,
  Info,
} from "lucide-react";

type CheckKey =
  | "browser"
  | "fullscreen"
  | "internet"
  | "applications";

type CheckStatus =
  | "idle"
  | "checking"
  | "success"
  | "error"
  | "warning";

type CheckState = {
  status: CheckStatus;
  message: string;
};

type DetectedItem = {
  name: string;
  type: "tab" | "application";
  url?: string;
};

type SecurityEventType =
  | "tab-switch"
  | "window-blur"
  | "fullscreen-exit"
  | "external-activity";

type SecurityEvent = {
  type: SecurityEventType;
  title: string;
  message: string;
  time: string;
  items?: DetectedItem[];
};

function EnvironmentCheck() {
  const navigate = useNavigate();

  /*
   * =========================================================
   * CHECK STATE
   * =========================================================
   */

  const [checks, setChecks] = useState<
    Record<CheckKey, CheckState>
  >({
    browser: {
      status: "idle",
      message: "Browser has not been checked yet.",
    },

    fullscreen: {
      status: "idle",
      message: "Fullscreen mode has not been enabled.",
    },

    internet: {
      status: "idle",
      message: "Internet connection has not been checked.",
    },

    applications: {
      status: "idle",
      message: "Environment has not been checked.",
    },
  });

  /*
   * =========================================================
   * BROWSER INFORMATION
   * =========================================================
   */

  const [browserName, setBrowserName] = useState("");
  const [browserVersion, setBrowserVersion] = useState("");

  /*
   * =========================================================
   * SECURITY STATE
   * =========================================================
   */

  const [securityPopup, setSecurityPopup] =
    useState(false);

  const [securityTitle, setSecurityTitle] =
    useState("");

  const [securityMessage, setSecurityMessage] =
    useState("");

  const [detectedItems, setDetectedItems] =
    useState<DetectedItem[]>([]);

  const [securityEvents, setSecurityEvents] =
    useState<SecurityEvent[]>([]);

  const [violationCount, setViolationCount] =
    useState(0);

  const [monitoringEnabled, setMonitoringEnabled] =
    useState(false);

  /*
   * =========================================================
   * UPDATE CHECK
   * =========================================================
   */

  const updateCheck = (
    key: CheckKey,
    status: CheckStatus,
    message: string
  ) => {
    setChecks((previous) => ({
      ...previous,

      [key]: {
        status,
        message,
      },
    }));
  };

  /*
   * =========================================================
   * SECURITY EVENT
   * =========================================================
   */

  const showSecurityPopup = (
    title: string,
    message: string,
    type: SecurityEventType,
    items: DetectedItem[] = []
  ) => {
    setSecurityTitle(title);
    setSecurityMessage(message);
    setDetectedItems(items);
    setSecurityPopup(true);

    setViolationCount((previous) => previous + 1);

    setSecurityEvents((previous) => [
      ...previous,
      {
        type,
        title,
        message,
        time: new Date().toLocaleTimeString(),
        items,
      },
    ]);
  };

  /*
   * =========================================================
   * BROWSER DETECTION
   * =========================================================
   */

  const checkBrowser = () => {
    updateCheck(
      "browser",
      "checking",
      "Detecting your browser..."
    );

    setTimeout(() => {
      const userAgent = navigator.userAgent;

      const chromeMatch = userAgent.match(
        /Chrome\/([0-9.]+)/
      );

      const isChrome =
        chromeMatch !== null &&
        !/Edg\/|OPR\/|Brave\/|SamsungBrowser\//.test(
          userAgent
        );

      /*
       * GOOGLE CHROME
       */

      if (isChrome && chromeMatch) {
        const version = chromeMatch[1];

        const majorVersion = parseInt(
          version.split(".")[0],
          10
        );

        setBrowserName("Google Chrome");
        setBrowserVersion(version);

        if (majorVersion < 120) {
          updateCheck(
            "browser",
            "warning",
            `Chrome ${majorVersion} detected. Please update Google Chrome to version 120 or newer.`
          );

          return;
        }

        updateCheck(
          "browser",
          "success",
          `Google Chrome ${version} is supported.`
        );

        return;
      }

      /*
       * EDGE
       */

      if (/Edg\//.test(userAgent)) {
        setBrowserName("Microsoft Edge");
        setBrowserVersion("");

        updateCheck(
          "browser",
          "error",
          "Microsoft Edge detected. Please use Google Chrome."
        );

        return;
      }

      /*
       * FIREFOX
       */

      if (/Firefox\//.test(userAgent)) {
        setBrowserName("Mozilla Firefox");
        setBrowserVersion("");

        updateCheck(
          "browser",
          "error",
          "Firefox detected. Please use Google Chrome."
        );

        return;
      }

      /*
       * SAFARI
       */

      if (
        /Safari\//.test(userAgent) &&
        !/Chrome\//.test(userAgent)
      ) {
        setBrowserName("Safari");
        setBrowserVersion("");

        updateCheck(
          "browser",
          "error",
          "Safari detected. Please use Google Chrome."
        );

        return;
      }

      /*
       * OPERA
       */

      if (/OPR\//.test(userAgent)) {
        setBrowserName("Opera");
        setBrowserVersion("");

        updateCheck(
          "browser",
          "error",
          "Opera detected. Please use Google Chrome."
        );

        return;
      }

      /*
       * UNKNOWN
       */

      setBrowserName("Unknown Browser");
      setBrowserVersion("");

      updateCheck(
        "browser",
        "error",
        "Unsupported browser detected. Please use Google Chrome."
      );
    }, 700);
  };

  /*
   * =========================================================
   * FULLSCREEN
   * =========================================================
   */

  const enterFullscreen = async () => {
    updateCheck(
      "fullscreen",
      "checking",
      "Requesting fullscreen mode..."
    );

    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }

      updateCheck(
        "fullscreen",
        "success",
        "Fullscreen mode is enabled."
      );
    } catch {
      updateCheck(
        "fullscreen",
        "error",
        "Fullscreen permission was blocked. Click Enable again."
      );
    }
  };

  /*
   * =========================================================
   * INTERNET
   * =========================================================
   */

  const checkInternet = async () => {
    updateCheck(
      "internet",
      "checking",
      "Checking internet connection..."
    );

    if (!navigator.onLine) {
      updateCheck(
        "internet",
        "error",
        "Your device is currently offline."
      );

      return;
    }

    try {
      const response = await fetch(
        window.location.href,
        {
          method: "HEAD",
          cache: "no-store",
        }
      );

      if (response.ok || response.status < 500) {
        updateCheck(
          "internet",
          "success",
          "Internet connection is available."
        );
      } else {
        updateCheck(
          "internet",
          "error",
          "The examination server could not be reached."
        );
      }
    } catch {
      updateCheck(
        "internet",
        "error",
        "Internet connection could not be verified."
      );
    }
  };

  /*
   * =========================================================
   * SECURE ENVIRONMENT
   * =========================================================
   */

  const checkApplications = () => {
    updateCheck(
      "applications",
      "checking",
      "Checking secure examination environment..."
    );

    setTimeout(() => {
      if (!window.isSecureContext) {
        updateCheck(
          "applications",
          "error",
          "Secure HTTPS connection is required."
        );

        return;
      }

      if (!navigator.onLine) {
        updateCheck(
          "applications",
          "error",
          "Internet connection is unavailable."
        );

        return;
      }

      if (!document.hasFocus()) {
        updateCheck(
          "applications",
          "warning",
          "Exam window is not currently active."
        );

        return;
      }

      updateCheck(
        "applications",
        "success",
        "Secure examination environment is ready."
      );
    }, 700);
  };

  /*
   * =========================================================
   * RUN ALL CHECKS
   * =========================================================
   */

  /*
   * =========================================================
   * ENABLE MONITORING
   * =========================================================
   */

  const enableMonitoring = () => {
    const browserPassed =
      checks.browser.status === "success";

    const fullscreenPassed =
      checks.fullscreen.status === "success";

    const internetPassed =
      checks.internet.status === "success";

    const environmentPassed =
      checks.applications.status === "success";

    if (
      browserPassed &&
      fullscreenPassed &&
      internetPassed &&
      environmentPassed
    ) {
      setMonitoringEnabled(true);

      updateCheck(
        "applications",
        "success",
        "Exam environment monitoring is active."
      );

      return;
    }

    showSecurityPopup(
      "Complete Environment Checks",
      "Please complete all four environment checks before enabling examination monitoring.",
      "external-activity"
    );
  };

  /*
   * =========================================================
   * TAB / WINDOW / FULLSCREEN MONITORING
   *
   * IMPORTANT:
   * A normal React website can detect that the candidate
   * leaves the page, but cannot read all other Chrome tab
   * names or all macOS application names.
   *
   * A Chrome Extension / Native Agent can send those names
   * through postMessage. This component supports that.
   * =========================================================
   */

  useEffect(() => {
    if (!monitoringEnabled) {
      return;
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        showSecurityPopup(
          "Tab Switch Detected",
          "You left the AI Mock Exam page. Please return to the examination immediately.",
          "tab-switch"
        );
      }
    };

    const handleWindowBlur = () => {
      showSecurityPopup(
        "Exam Window Inactive",
        "The examination window is no longer active. Please return to the exam window.",
        "window-blur"
      );
    };

    const handleWindowFocus = () => {
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        showSecurityPopup(
          "Fullscreen Exited",
          "You exited fullscreen mode. Please return to fullscreen mode to continue the examination.",
          "fullscreen-exit"
        );
      }
    };

    /*
     * OPTIONAL:
     * Chrome extension / native application can send:
     *
     * {
     *   type: "EXAM_ACTIVE_ITEMS",
     *   items: [
     *      {
     *        name: "YouTube",
     *        type: "tab",
     *        url: "https://youtube.com"
     *      }
     *   ]
     * }
     */

    const handleExternalActivity = (
      event: MessageEvent
    ) => {
      if (!event.data) {
        return;
      }

      if (
        event.data.type !==
        "EXAM_ACTIVE_ITEMS"
      ) {
        return;
      }

      const items = Array.isArray(
        event.data.items
      )
        ? event.data.items
        : [];

      if (items.length === 0) {
        return;
      }

      setDetectedItems(items);

      showSecurityPopup(
        "Unauthorized Activity Detected",
        "The following browser tabs or applications were reported as active. Please close unauthorized activity before continuing.",
        "external-activity",
        items
      );
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    window.addEventListener(
      "blur",
      handleWindowBlur
    );

    window.addEventListener(
      "focus",
      handleWindowFocus
    );

    document.addEventListener(
      "fullscreenchange",
      handleFullscreenChange
    );

    window.addEventListener(
      "message",
      handleExternalActivity
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );

      window.removeEventListener(
        "blur",
        handleWindowBlur
      );

      window.removeEventListener(
        "focus",
        handleWindowFocus
      );

      document.removeEventListener(
        "fullscreenchange",
        handleFullscreenChange
      );

      window.removeEventListener(
        "message",
        handleExternalActivity
      );
    };
  }, [monitoringEnabled]);

  /*
   * =========================================================
   * STATUS
   * =========================================================
   */

  const successfulChecks =
    Object.values(checks).filter(
      (item) => item.status === "success"
    ).length;

  const allChecked =
    Object.values(checks).every(
      (item) => item.status === "success"
    );

  /*
   * =========================================================
   * STATUS ICON
   * =========================================================
   */

  const getStatusIcon = (
    status: CheckStatus
  ) => {
    switch (status) {
      case "success":
        return (
          <CheckCircle2
            size={18}
            className="text-green-600"
          />
        );

      case "error":
        return (
          <AlertTriangle
            size={18}
            className="text-red-500"
          />
        );

      case "warning":
        return (
          <AlertTriangle
            size={18}
            className="text-orange-500"
          />
        );

      case "checking":
        return (
          <RefreshCw
            size={17}
            className="animate-spin text-blue-600"
          />
        );

      default:
        return null;
    }
  };

  /*
   * =========================================================
   * STATUS TEXT
   * =========================================================
   */

  const getStatusText = (
    status: CheckStatus
  ) => {
    switch (status) {
      case "success":
        return "Verified";

      case "error":
        return "Failed";

      case "warning":
        return "Warning";

      case "checking":
        return "Checking...";

      default:
        return "Not Checked";
    }
  };

  /*
   * =========================================================
   * CARD STYLE
   * =========================================================
   */

  const getCardStyle = (
    status: CheckStatus
  ) => {
    switch (status) {
      case "success":
        return "border-green-200 bg-green-50/50";

      case "error":
        return "border-red-200 bg-red-50/50";

      case "warning":
        return "border-orange-200 bg-orange-50/50";

      default:
        return "border-gray-200 bg-white";
    }
  };

  /*
   * =========================================================
   * CHECK CARD
   * =========================================================
   */

  const renderCheckCard = (
    key: CheckKey,
    title: string,
    description: string,
    icon: ElementType,
    action: ReactNode
  ) => {
    const check = checks[key];

    const Icon = icon;

    return (
      <div
        className={`rounded-[10px] border p-5 transition-all ${getCardStyle(
          check.status
        )}`}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Icon size={21} />
          </div>

          <div className="flex-1">

            <div className="flex items-center gap-2">

              <h3 className="font-bold text-[#1f2937]">
                {title}
              </h3>

              {getStatusIcon(
                check.status
              )}

            </div>

            <p className="mt-1 text-sm leading-6 text-gray-500">
              {description}
            </p>

            <p
              className={`mt-2 text-xs font-semibold ${
                check.status === "success"
                  ? "text-green-600"
                  : check.status === "error"
                  ? "text-red-600"
                  : check.status === "warning"
                  ? "text-orange-600"
                  : check.status === "checking"
                  ? "text-blue-600"
                  : "text-gray-400"
              }`}
            >
              {check.message}
            </p>

          </div>

          <div className="shrink-0">
            {action}
          </div>

        </div>
      </div>
    );
  };

  /*
   * =========================================================
   * PAGE
   * =========================================================
   */

  return (
    <div className="min-h-screen bg-[#f5f6f8] px-4 py-5 sm:px-6 md:px-10 md:py-8">

      <div className="mx-auto w-full max-w-6xl">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="flex items-center justify-between">

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 shadow-sm transition hover:bg-gray-50"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-bold text-gray-600 shadow-sm sm:text-sm">

            <ShieldCheck
              size={17}
              className="text-blue-600"
            />

            Secure Examination

          </div>

        </div>

        {/* =====================================================
            TITLE
        ===================================================== */}

        <div className="mt-8">

          <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-600">
            Step 3 of 4
          </p>

          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#1f2937] sm:text-4xl md:text-5xl">
            Environment & Browser
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
            Prepare your device for the AI Mock Examination.
            Complete all environment checks before continuing.
          </p>

        </div>

        {/* =====================================================
            PROGRESS
        ===================================================== */}

        <div className="mt-7 rounded-[12px] bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <span className="text-sm font-bold text-gray-700">
              Verification Progress
            </span>

            <span className="text-sm font-bold text-blue-600">
              {successfulChecks}/4 Completed
            </span>

          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100">

            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-500"
              style={{
                width: `${
                  (successfulChecks / 4) * 100
                }%`,
              }}
            />

          </div>

        </div>

        {/* =====================================================
            BROWSER PREVIEW
        ===================================================== */}

        <div className="mt-6 overflow-hidden rounded-[12px] bg-[#111827] shadow-sm">

          {/* Browser top bar */}

          <div className="flex items-center gap-3 border-b border-gray-700 px-4 py-3">

            <div className="flex gap-1.5">

              <span className="h-3 w-3 rounded-full bg-red-400" />

              <span className="h-3 w-3 rounded-full bg-yellow-400" />

              <span className="h-3 w-3 rounded-full bg-green-400" />

            </div>

            <div className="flex flex-1 items-center gap-2 rounded-lg bg-gray-800 px-4 py-2">

              <Lock
                size={14}
                className="text-green-400"
              />

              <span className="text-xs text-gray-300 sm:text-sm">
                secure.ai-mock-exam.com
              </span>

              <span className="ml-auto hidden text-xs font-bold text-green-400 sm:block">
                SECURE
              </span>

            </div>

            <Monitor
              size={18}
              className="text-gray-400"
            />

          </div>

          {/* Browser body */}

          <div className="grid min-h-[230px] grid-cols-1 md:grid-cols-[1fr_260px]">

            <div className="flex flex-col justify-center px-6 py-8 sm:px-10">

              <div className="flex items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600">

                  <Globe
                    size={25}
                    className="text-white"
                  />

                </div>

                <div>

                  <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                    Browser Detection
                  </p>

                  <h2 className="text-lg font-bold text-white">
                    {browserName ||
                      "Google Chrome Required"}
                  </h2>

                </div>

              </div>

              <p className="mt-5 max-w-xl text-sm leading-6 text-gray-400">

                {browserVersion
                  ? `Detected Chrome version ${browserVersion}.`
                  : "The AI Mock Exam requires a supported Google Chrome browser."}

              </p>

              <div className="mt-5 flex flex-wrap gap-2">

                <span className="rounded-full bg-green-500/10 px-3 py-1.5 text-xs font-semibold text-green-400">
                  ● Secure Browser
                </span>

                <span className="rounded-full bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-400">
                  ● AI Monitoring
                </span>

                <span className="rounded-full bg-purple-500/10 px-3 py-1.5 text-xs font-semibold text-purple-400">
                  ● Exam Protection
                </span>

              </div>

            </div>

            {/* Browser status */}

            <div className="border-t border-gray-700 bg-gray-900 p-6 md:border-l md:border-t-0">

              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Browser Status
              </p>

              <div className="mt-5 space-y-4">

                <div className="flex items-center justify-between">

                  <span className="text-sm text-gray-300">
                    Browser
                  </span>

                  <span
                    className={`text-xs font-bold ${
                      checks.browser.status ===
                      "success"
                        ? "text-green-400"
                        : checks.browser.status ===
                          "error"
                        ? "text-red-400"
                        : checks.browser.status ===
                          "warning"
                        ? "text-orange-400"
                        : "text-gray-400"
                    }`}
                  >
                    {getStatusText(
                      checks.browser.status
                    )}
                  </span>

                </div>

                <div className="flex items-center justify-between">

                  <span className="text-sm text-gray-300">
                    HTTPS
                  </span>

                  <span
                    className={`text-xs font-bold ${
                      window.isSecureContext
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {window.isSecureContext
                      ? "Secure"
                      : "Required"}
                  </span>

                </div>

                <div className="flex items-center justify-between">

                  <span className="text-sm text-gray-300">
                    Network
                  </span>

                  <span
                    className={`text-xs font-bold ${
                      navigator.onLine
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {navigator.onLine
                      ? "Online"
                      : "Offline"}
                  </span>

                </div>

                <div className="flex items-center justify-between">

                  <span className="text-sm text-gray-300">
                    Monitoring
                  </span>

                  <span
                    className={`text-xs font-bold ${
                      monitoringEnabled
                        ? "text-green-400"
                        : "text-gray-400"
                    }`}
                  >
                    {monitoringEnabled
                      ? "Active"
                      : "Off"}
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* =====================================================
            ENVIRONMENT VERIFICATION
        ===================================================== */}

        <div className="mt-6 rounded-[12px] bg-white p-6 shadow-sm sm:p-8">

          <div className="flex items-start gap-3">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">

              <Monitor size={23} />

            </div>

            <div>

              <h2 className="text-xl font-extrabold text-[#1f2937] sm:text-2xl">
                Environment Verification
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Complete every required check before entering the examination.
              </p>

            </div>

          </div>

          <div className="mt-8 space-y-4">

            {/* BROWSER */}

            {renderCheckCard(
              "browser",
              "Chrome Browser",
              "Google Chrome version 120 or newer is recommended for the examination.",
              Globe,
              <button
                type="button"
                onClick={checkBrowser}
                disabled={
                  checks.browser.status ===
                  "checking"
                }
                className="flex h-10 items-center justify-center gap-2 rounded-full bg-blue-600 px-5 text-xs font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {checks.browser.status ===
                "checking" ? (
                  <>
                    <RefreshCw
                      size={14}
                      className="animate-spin"
                    />
                    Checking
                  </>
                ) : (
                  <>
                    <RefreshCw size={14} />
                    Check Chrome
                  </>
                )}
              </button>
            )}

            {/* FULLSCREEN */}

            {renderCheckCard(
              "fullscreen",
              "Fullscreen Mode",
              "The examination should run in fullscreen mode.",
              Maximize2,
              <button
                type="button"
                onClick={enterFullscreen}
                disabled={
                  checks.fullscreen.status ===
                  "checking"
                }
                className="h-10 rounded-full bg-blue-600 px-5 text-xs font-bold text-white transition hover:bg-blue-700 disabled:opacity-50"
              >
                {checks.fullscreen.status ===
                "success"
                  ? "Verified"
                  : "Enable"}
              </button>
            )}

            {/* INTERNET */}

            {renderCheckCard(
              "internet",
              "Internet Connection",
              "Verify that your connection can reach the examination portal.",
              Wifi,
              <button
                type="button"
                onClick={checkInternet}
                disabled={
                  checks.internet.status ===
                  "checking"
                }
                className="h-10 rounded-full bg-blue-600 px-5 text-xs font-bold text-white transition hover:bg-blue-700 disabled:opacity-50"
              >
                {checks.internet.status ===
                "checking"
                  ? "Checking..."
                  : "Check"}
              </button>
            )}

            {/* APPLICATION */}

            {renderCheckCard(
              "applications",
              "Secure Environment",
              "Verify that the examination page is running over a secure connection.",
              AppWindow,
              <button
                type="button"
                onClick={checkApplications}
                disabled={
                  checks.applications.status ===
                  "checking"
                }
                className="h-10 rounded-full bg-blue-600 px-5 text-xs font-bold text-white transition hover:bg-blue-700 disabled:opacity-50"
              >
                {checks.applications.status ===
                "checking"
                  ? "Checking..."
                  : "Check"}
              </button>
            )}

          </div>

        </div>

        {/* =====================================================
            CLOSE APPS / TABS RECOMMENDATION
        ===================================================== */}

        <div className="mt-6 rounded-[12px] border border-blue-100 bg-blue-50 p-6">

          <div className="flex items-start gap-4">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">

              <AppWindow size={21} />

            </div>

            <div className="flex-1">

              <h3 className="font-extrabold text-blue-900">
                Prepare Your System
              </h3>

              <p className="mt-1 text-sm leading-6 text-blue-800">
                Before starting the examination, close
                unnecessary browser tabs and applications.
              </p>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">

                <div className="rounded-xl bg-white p-4">

                  <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                    Browser
                  </p>

                  <p className="mt-2 text-sm font-semibold text-gray-700">
                    Keep only the examination tab open.
                  </p>

                </div>

                <div className="rounded-xl bg-white p-4">

                  <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                    Applications
                  </p>

                  <p className="mt-2 text-sm font-semibold text-gray-700">
                    Close messaging, screen-sharing and
                    unnecessary applications.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* =====================================================
            MONITORING
        ===================================================== */}

        <div className="mt-6 rounded-[12px] bg-white p-6 shadow-sm sm:p-8">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-start gap-4">

              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                  monitoringEnabled
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                <ShieldCheck size={22} />
              </div>

              <div>

                <h3 className="font-extrabold text-gray-900">
                  Examination Activity Monitoring
                </h3>

                <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                  Detects when the examination page loses focus,
                  when the candidate changes tabs, or when
                  fullscreen mode is exited.
                </p>

              </div>

            </div>

            <div className="shrink-0">

              {monitoringEnabled ? (
                <div className="flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-xs font-bold text-green-600">

                  <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />

                  Monitoring Active

                </div>
              ) : (
                <button
                  type="button"
                  onClick={enableMonitoring}
                  disabled={!allChecked}
                  className={`flex h-10 items-center gap-2 rounded-full px-5 text-xs font-bold transition ${
                    allChecked
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "cursor-not-allowed bg-gray-200 text-gray-400"
                  }`}
                >
                  <ShieldCheck size={15} />
                  Enable Monitoring
                </button>
              )}

            </div>

          </div>

        </div>

        {/* =====================================================
            SECURITY EVENTS
        ===================================================== */}

        {securityEvents.length > 0 && (
          <div className="mt-6 rounded-[12px] bg-white p-6 shadow-sm sm:p-8">

            <div className="flex items-center justify-between">

              <div>

                <h3 className="text-lg font-extrabold text-gray-900">
                  Security Activity
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Events detected during environment verification.
                </p>

              </div>

              <span className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600">
                {violationCount} Event
                {violationCount !== 1
                  ? "s"
                  : ""}
              </span>

            </div>

            <div className="mt-5 space-y-3">

              {securityEvents
                .slice()
                .reverse()
                .slice(0, 5)
                .map((event, index) => (
                  <div
                    key={`${event.time}-${index}`}
                    className="rounded-xl border border-gray-100 bg-gray-50 p-4"
                  >

                    <div className="flex items-start gap-3">

                      <AlertTriangle
                        size={17}
                        className="mt-0.5 shrink-0 text-orange-500"
                      />

                      <div className="flex-1">

                        <div className="flex flex-wrap items-center justify-between gap-2">

                          <p className="text-sm font-bold text-gray-800">
                            {event.title}
                          </p>

                          <span className="text-[11px] font-semibold text-gray-400">
                            {event.time}
                          </span>

                        </div>

                        <p className="mt-1 text-xs leading-5 text-gray-500">
                          {event.message}
                        </p>

                      </div>

                    </div>

                  </div>
                ))}

            </div>

          </div>
        )}

        {/* =====================================================
            IMPORTANT WARNING
        ===================================================== */}

        <div className="mt-6 flex items-start gap-3 rounded-[10px] border border-orange-200 bg-orange-50 p-5">

          <AlertTriangle
            size={20}
            className="mt-0.5 shrink-0 text-orange-500"
          />

          <div>

            <p className="text-sm font-bold text-orange-800">
              Important Browser Requirement
            </p>

            <p className="mt-1 text-sm leading-6 text-orange-700">
              Keep the examination tab active and remain
              in fullscreen mode. Close unnecessary browser
              tabs and applications before starting.
            </p>

          </div>

        </div>

        {/* =====================================================
            NAVIGATION
        ===================================================== */}

        <div className="mt-6 flex flex-col-reverse gap-3 pb-6 sm:flex-row sm:justify-between">

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-12 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-7 text-sm font-bold text-gray-700 transition hover:bg-gray-100"
          >
            <ArrowLeft size={16} />
            Previous
          </button>

          <button
            type="button"
            disabled={!allChecked}
            onClick={() =>
              navigate("/final-verification")
            }
            className={`flex h-12 items-center justify-center gap-3 rounded-full px-7 text-sm font-bold transition ${
              allChecked
                ? "bg-blue-600 text-white shadow-md hover:bg-blue-700 active:scale-95"
                : "cursor-not-allowed bg-gray-200 text-gray-400"
            }`}
          >
            Continue
            <ArrowRight size={17} />
          </button>

        </div>

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <p className="pb-5 text-center text-xs leading-5 text-gray-400">
          AI Mock Exam Portal • Secure Examination Environment
        </p>

      </div>

      {/* =======================================================
          SECURITY POPUP
      ======================================================= */}

      {securityPopup && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">

          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* Popup header */}

            <div className="border-b border-gray-100 px-6 py-5">

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-100">

                    <AlertTriangle
                      size={22}
                      className="text-red-600"
                    />

                  </div>

                  <div>

                    <h2 className="text-lg font-extrabold text-gray-900">
                      {securityTitle}
                    </h2>

                    <p className="text-xs font-semibold text-red-600">
                      Examination Security Alert
                    </p>

                  </div>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSecurityPopup(false)
                  }
                  className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                >
                  <X size={18} />
                </button>

              </div>

            </div>

            {/* Popup body */}

            <div className="px-6 py-5">

              <p className="text-sm leading-6 text-gray-600">
                {securityMessage}
              </p>

              {/* Detected items */}

              {detectedItems.length > 0 && (
                <div className="mt-5">

                  <div className="flex items-center gap-2">

                    <Info
                      size={16}
                      className="text-blue-600"
                    />

                    <p className="text-sm font-bold text-gray-800">
                      Active Items Detected
                    </p>

                  </div>

                  <div className="mt-3 space-y-2">

                    {detectedItems.map(
                      (item, index) => (
                        <div
                          key={`${item.name}-${index}`}
                          className="flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 p-3"
                        >

                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-red-500">

                            {item.type ===
                            "tab" ? (
                              <Globe
                                size={17}
                              />
                            ) : (
                              <AppWindow
                                size={17}
                              />
                            )}

                          </div>

                          <div className="min-w-0 flex-1">

                            <p className="truncate text-sm font-bold text-gray-800">
                              {item.name}
                            </p>

                            <p className="text-xs text-red-600">
                              {item.type ===
                              "tab"
                                ? "Browser Tab"
                                : "Application"}
                            </p>

                          </div>

                          {item.url && (
                            <ExternalLink
                              size={15}
                              className="shrink-0 text-gray-400"
                            />
                          )}

                        </div>
                      )
                    )}

                  </div>

                </div>
              )}

              {/* Close recommendation */}

              <div className="mt-5 rounded-xl border border-orange-200 bg-orange-50 p-4">

                <div className="flex items-start gap-3">

                  <AppWindow
                    size={19}
                    className="mt-0.5 shrink-0 text-orange-600"
                  />

                  <div>

                    <p className="text-sm font-bold text-orange-800">
                      Recommended Action
                    </p>

                    <p className="mt-1 text-xs leading-5 text-orange-700">
                      Close unauthorized browser tabs and
                      unnecessary applications, then return
                      to the examination window.
                    </p>

                  </div>

                </div>

              </div>

              {/* Security count */}

              <div className="mt-4 flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">

                <span className="text-xs font-semibold text-gray-500">
                  Security Events
                </span>

                <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-600">
                  {violationCount}
                </span>

              </div>

            </div>

            {/* Popup footer */}

            <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">

              <button
                type="button"
                onClick={() =>
                  setSecurityPopup(false)
                }
                className="h-11 rounded-full border border-gray-200 bg-white px-5 text-sm font-bold text-gray-600 transition hover:bg-gray-50"
              >
                Close
              </button>

              <button
                type="button"
                onClick={async () => {
                  setSecurityPopup(false);

                  try {
                    if (
                      !document.fullscreenElement
                    ) {
                      await document.documentElement.requestFullscreen();
                    }
                  } catch {
                    // Browser may block fullscreen if
                    // the user interaction is not permitted.
                  }
                }}
                className="flex h-11 items-center gap-2 rounded-full bg-blue-600 px-6 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                <ShieldCheck size={16} />
                Return to Exam
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default EnvironmentCheck;
