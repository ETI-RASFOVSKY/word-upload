import React, { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const SignaturePage = () => {
  const sigRef = useRef();
  const [params] = useSearchParams();
  const fileUrl = params.get("file");

  const [loading, setLoading] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const sendSignature = async () => {
    setLoading(true);
    setShowPopup(true);
    setPopupMessage("שולח חתימה, אנא המתן...");

    try {
      const signature = sigRef.current.toDataURL();
      await axios.post("http://localhost:3001/api/sign", {
        signature,
        fileUrl,
        toEmail: "e0548451274@gmail.com",
      });
      setPopupMessage("החתימה נשלחה בהצלחה!");
    } catch (error) {
      console.error("שגיאה בשליחה:", error);
      setPopupMessage("שליחה נכשלה, נסה שוב.");
    } finally {
      setLoading(false);
      setTimeout(() => setShowPopup(false), 3000);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>צפייה בטופס</h2>
      {fileUrl ? (
        <p style={styles.linkParagraph}>
          צפה בקובץ כאן:{" "}
          <a
            href={`https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.link}
          >
            לחץ להורדה וצפייה בטופס
          </a>
        </p>
      ) : (
        <p style={{ textAlign: "center" }}>לא נמצא קובץ להצגה</p>
      )}

      <h3 style={styles.subtitle}>חתימה</h3>
      <SignatureCanvas
        ref={sigRef}
        canvasProps={{ width: 400, height: 200, className: "sigCanvas" }}
        style={styles.canvas}
      />
      <div style={styles.buttons}>
        <button onClick={sendSignature} style={styles.sendButton} disabled={loading}>
          {loading ? "שולח..." : "שלח חתימה"}
        </button>
        <button onClick={() => sigRef.current.clear()} style={styles.clearButton} disabled={loading}>
          נקה חתימה
        </button>
      </div>

      {showPopup && (
        <div style={styles.popup}>
          <p>{popupMessage}</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    direction: "rtl",
    maxWidth: "800px",
    margin: "40px auto",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
    backgroundColor: "#fafafa",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    textAlign: "center",
  },
  title: {
    marginBottom: "25px",
    color: "#222",
  },
  linkParagraph: {
    marginBottom: "40px",
    fontSize: "18px",
  },
  link: {
    color: "#0078d4",
    fontWeight: "bold",
    textDecoration: "none",
  },
  subtitle: {
    marginBottom: "15px",
    color: "#333",
  },
  canvas: {
    border: "2px solid #0078d4",
    borderRadius: "8px",
    marginBottom: "20px",
  },
  buttons: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
  },
  sendButton: {
    backgroundColor: "#0078d4",
    color: "white",
    border: "none",
    padding: "12px 25px",
    fontSize: "16px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  clearButton: {
    backgroundColor: "#aaa",
    color: "white",
    border: "none",
    padding: "12px 25px",
    fontSize: "16px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  popup: {
    position: "fixed",
    top: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "#333",
    color: "white",
    padding: "15px 35px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
    zIndex: 1000,
  },
};

export default SignaturePage;

