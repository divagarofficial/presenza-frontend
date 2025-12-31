import {
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import presenzaLogo from "../assets/presenza-logo.png";

function Popup({
  type,
  message,
  actionText = "OK",
  onAction,
}) {
  if (!type || !message) return null;

  const isError = type === "error";

  const handleClick = () => {
    if (typeof onAction === "function") {
      onAction();
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-card">
        <img
          src={presenzaLogo}
          alt="Presenza"
          className="popup-logo"
        />

        <div
          className={`popup-icon ${
            isError ? "error" : "success"
          }`}
        >
          {isError ? <FaExclamationTriangle /> : <FaCheckCircle />}
        </div>

        <div className="popup-title">
          {isError ? "Action Required" : "Success"}
        </div>

        <div className="popup-message">{message}</div>

        <div className="popup-actions">
          <button
            type="button"
            className="popup-primary-btn"
            onClick={handleClick}
          >
            {actionText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Popup;
