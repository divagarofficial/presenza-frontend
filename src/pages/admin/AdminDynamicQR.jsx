import { useEffect, useState } from "react";
import QRCode from "react-qr-code";

function AdminDynamicQR() {
  /* ===== TEMP MOCK (BACKEND LATER) ===== */
  const [qrValue, setQrValue] = useState("");
  const [slot, setSlot] = useState("Slot 2");
  const [subject, setSubject] = useState("CS23411 - DBMS");
  const [countdown, setCountdown] = useState(3);

  /* ===== AUTO QR REFRESH (2s) ===== */
  useEffect(() => {
    const qrInterval = setInterval(() => {
      // temporary random QR (backend later)
      setQrValue(`QR_${Date.now()}`);
      setCountdown(3);
    }, 2000);

    return () => clearInterval(qrInterval);
  }, []);

  /* ===== COUNTDOWN ===== */
  useEffect(() => {
    if (countdown === 0) return;
    const timer = setTimeout(() => {
      setCountdown((c) => c - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  return (
    <div className="admin-page">
      <h2>Live Attendance QR</h2>
      <p className="muted">
        QR is generated automatically based on timetable
      </p>

      {/* INFO CARD */}
      <div className="qr-info-card">
        <div>
          <strong>Date</strong>
          <p>{new Date().toDateString()}</p>
        </div>

        <div>
          <strong>Current Slot</strong>
          <p>{slot}</p>
        </div>

        <div>
          <strong>Subject</strong>
          <p>{subject}</p>
        </div>
      </div>

      {/* QR DISPLAY */}
      <div className="qr-live-box">
        <QRCode value={qrValue} size={240} />
        <p className="qr-timer">
          Refreshing in <strong>{countdown}s</strong>
        </p>
      </div>

      <p className="muted small">
        Students must scan within the valid window
      </p>
    </div>
  );
}

export default AdminDynamicQR;
