import QRCode from "react-qr-code";
import { useEffect, useState } from "react";

function MyQR() {
  const [rollNumber, setRollNumber] = useState("");

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      // ✅ MANUAL JWT DECODE (SAFE)
      const payload = JSON.parse(
        atob(token.split(".")[1])
      );

      setRollNumber(payload.roll_number);
    } catch (err) {
      console.error("JWT decode failed", err);
    }
  }, []);

  if (!rollNumber) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <p>Loading QR...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>My QR</h2>

      <div style={{ marginTop: "20px" }}>
        <QRCode value={rollNumber} size={220} />
      </div>

      <p style={{ marginTop: "16px", fontWeight: "600" }}>
        Roll Number: {rollNumber}
      </p>
    </div>
  );
}

export default MyQR;
