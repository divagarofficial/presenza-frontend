import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import Popup from "../../components/Popup";
import api from "../../api/api";

function CRScanPage() {
  const videoRef = useRef(null);
  const scannerRef = useRef(null);
  const scannedRef = useRef(false);
  const exitingRef = useRef(false); // 🔒 prevent double exit

  const [scanning, setScanning] = useState(false);
  const [popup, setPopup] = useState({ type: "", message: "" });
  const [successGlow, setSuccessGlow] = useState(false);

  // 🔊 beep ONLY on success
  const playBeep = () => {
    try {
      new Audio("/beep.mp3").play();
    } catch {}
  };

  /* ======================================================
     EXIT SCAN PAGE — HARD REDIRECT (FINAL)
     ====================================================== */
  const exitScanPage = () => {
    if (exitingRef.current) return;
    exitingRef.current = true;

    // stop scanner
    try {
      scannerRef.current?.reset();
    } catch {}

    // clear state (safe even if page unloads)
    setPopup({ type: "", message: "" });
    setScanning(false);
    setSuccessGlow(false);
    scannedRef.current = false;

    // 🔥 HARD REDIRECT (GUARANTEED)
    window.location.replace("/student/cr/scan");
  };

  /* ---------------- START SCANNING ---------------- */
  const startScanning = () => {
    exitingRef.current = false;
    setPopup({ type: "", message: "" });
    setSuccessGlow(false);
    scannedRef.current = false;
    setScanning(true);
  };

  /* ---------------- STOP SCANNING ---------------- */
  const stopScanning = () => {
    exitScanPage();
  };

  /* ---------------- ZXING INIT ---------------- */
  useEffect(() => {
    if (!scanning) return;
    if (!videoRef.current) return;

    const video = videoRef.current;
    if (video.offsetWidth === 0 || video.offsetHeight === 0) return;

    const scanner = new BrowserMultiFormatReader();
    scannerRef.current = scanner;

    scanner.decodeFromVideoDevice(
      undefined,
      video,
      async (result) => {
        if (!result) return;
        if (scannedRef.current) return;

        scannedRef.current = true;
        const roll = result.getText().trim();

        try {
          const res = await api.post(
            "/cr/attendance/daily/scan",
            { student_roll: roll },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          playBeep();
          setSuccessGlow(true);

          setPopup({
            type: "success",
            message: res.data.message,
          });
        } catch (err) {
          scannedRef.current = false;

          setPopup({
            type: "error",
            message:
              err.response?.data?.detail ||
              err.response?.data?.message ||
              "Attendance marking failed",
          });
        }
      }
    );

    return () => {
      try {
        scanner.reset();
      } catch {}
    };
  }, [scanning]);

  /* ---------------- AUTO EXIT AFTER POPUP ---------------- */
  useEffect(() => {
    if (!popup.type) return;

    const timer = setTimeout(() => {
      exitScanPage();
    }, 2500);

    return () => clearTimeout(timer);
  }, [popup.type]);

  return (
    <div className="cr-scan-page">
      <h2>Scan Student QR</h2>

      {/* QR BOX */}
      <div className={`scan-box ${successGlow ? "scan-success" : ""}`}>
        {scanning ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="scan-video"
          />
        ) : (
          <div className="scan-placeholder">
            Scanner idle
          </div>
        )}
      </div>

      {/* ACTIONS */}
      {!scanning ? (
        <button className="primary-btn" onClick={startScanning}>
          Start Scanning
        </button>
      ) : (
        <button className="secondary-btn" onClick={stopScanning}>
          Stop Scanning
        </button>
      )}

      {/* POPUP */}
      <Popup
        type={popup.type}
        message={popup.message}
        actionText="OK"
        onAction={exitScanPage}
      />
    </div>
  );
}

export default CRScanPage;
