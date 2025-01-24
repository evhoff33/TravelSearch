import { createPortal } from "react-dom";
import "../styles/LoadingIndicator.css";

const LoadingIndicator = () => {
  return createPortal(
    <div className="loading-overlay">
      <div className="loading-container">
        <div className="loader"></div>
      </div>
    </div>,
    document.body
  );
};

export default LoadingIndicator;
