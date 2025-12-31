import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useRef } from "react";

function QrScannerModal({ onClose, onScan }) {
  const scannerRef = useRef(null);
  const isMountedRef = useRef(false); // 🔒 STRICTMODE GUARD

  useEffect(() => {
    // 🚫 Prevent double execution (React StrictMode)
    if (isMountedRef.current) return;
    isMountedRef.current = true;

    const html5QrCode = new Html5Qrcode("qr-reader");
    scannerRef.current = html5QrCode;

    html5QrCode
      .start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: 250,
        },
        (decodedText) => {
          stopScanner();
          onScan(decodedText);
        }
      )
      .catch((err) => {
        console.error("QR start error:", err);
      });

    const stopScanner = async () => {
      if (scannerRef.current) {
        try {
          await scannerRef.current.stop();
          await scannerRef.current.clear();
        } catch {}
        scannerRef.current = null;
      }
    };

    return () => {
      stopScanner();
    };
  }, [onScan]);

  return (
    <div className="qr-modal">
      <div className="qr-modal-content">
        <h3>Scan Attendance QR</h3>

        <div
          id="qr-reader"
          style={{
            width: "100%",
            height: "300px",
            marginTop: "12px",
          }}
        />

        <button
          className="secondary-btn"
          onClick={onClose}
          style={{ marginTop: "14px" }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default QrScannerModal;
