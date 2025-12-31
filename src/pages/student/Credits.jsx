import presenzaLogo from "../assets/presenza-logo.png";
import minduraLogo from "../assets/mindura-logo.png";

function Credits() {
  return (
    <div className="credits-page">
      <img src={presenzaLogo} alt="Presenza" className="credits-logo" />
      <h2>PRESENZA</h2>
      <p className="credits-tagline">Presence is the proof</p>

      <div className="credits-divider" />

      <img src={minduraLogo} alt="Mindura" className="credits-mindura" />
      <p className="credits-company">MINDURA TECHNOLOGIES</p>

      <p className="credits-footer">
        © 2025 Mindura Technologies. All rights reserved.
      </p>
    </div>
  );
}

export default Credits;
