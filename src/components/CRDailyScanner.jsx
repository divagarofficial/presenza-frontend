import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import Popup from "../../components/Popup";
import api from "../../api/api";

function CRScanPage() {
  const videoRef = useRef(null);
  const scannerRef = useRef(null);
  const scannedRef = useRef(false);

  const [scanning, setScanning] = useState(false);
  const [popup, setPopup] = useState({ type: "", message: "" });

  // ▶ user explicitly starts scan
  const startScanning = () => {
    setPopup({ type: "", message: "" });
    scannedRef.current = false;
    setScanning(true);
  };

  // ⏹ stop scanner safely
  const stopScanning = () => {
    scannerRef.current?.reset();
    setScanning(false);
  };

  // 🧠 start ZXing ONLY when video box exists & has size
  useEffect(() => {
    if (!scanning) return;
    if (!videoRef.current) return;

    // wait one frame so layout settles
    requestAnimationFrame(() => {
      const video = videoRef.current;

      // critical guard
      if (video.offsetWidth === 0 || video.offsetHeight === 0) {
        console.warn("Scanner aborted: video has no size");
        return;
      }

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

          scanner.reset();
          setScanning(false);

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

            // ✅ show EXACT backend message
            setPopup({
              type: "success",
              message: res.data.message,
            });
          } catch (err) {
            setPopup({
              type: "error",
              message:
                err.response?.data?.detail ||
                err.response?.data?.message ||
                "Scan failed",
            });
          }
        }
      );
    });

    return () => scannerRef.current?.reset();
  }, [scanning]);

  return (
    <div className="cr-scan-page">
      <h2>Scan Student QR</h2>

      {/* 🎯 QR-SIZED SCAN BOX */}
      <div className="scan-box">
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

      {/* ACTION BUTTONS */}
      {!scanning ? (
        <button className="primary-btn" onClick={startScanning}>
          Start Scanning
        </button>
      ) : (
        <button className="secondary-btn" onClick={stopScanning}>
          Cancel
        </button>
      )}

      <Popup type={popup.type} message={popup.message} />
    </div>
  );
}

export default CRScanPage;
