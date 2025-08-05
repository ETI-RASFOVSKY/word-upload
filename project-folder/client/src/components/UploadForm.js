import React, { useState } from "react";
import axios from "axios";

const UploadForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [shareLink, setShareLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setShareLink("");
    setUploadStatus("");
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus("לא נבחר קובץ להעלאה.");
      return;
    }

    setLoading(true);
    setShowPopup(true);
    setPopupMessage("מעלה קובץ, אנא המתן...");

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post("http://localhost:3001/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data && response.data.link) {
        setUploadStatus("הקובץ הועלה בהצלחה!");
        const signingLink = `http://localhost:3000/sign?file=${encodeURIComponent(response.data.link)}`;
        setShareLink(signingLink);
        setPopupMessage("הקובץ הועלה בהצלחה!");
      } else {
        setUploadStatus("ההעלאה הצליחה אך לא התקבל קישור.");
        setPopupMessage("ההעלאה הצליחה אך לא התקבל קישור.");
      }
    } catch (error) {
      console.error("שגיאה בהעלאת הקובץ:", error);
      setUploadStatus("אירעה שגיאה בעת העלאת הקובץ.");
      setPopupMessage("אירעה שגיאה בעת העלאת הקובץ.");
    } finally {
      setLoading(false);
      setTimeout(() => setShowPopup(false), 3000);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>העלאת קובץ</h2>
      <input type="file" onChange={handleFileChange} style={styles.input} />
      <button onClick={handleUpload} style={styles.button} disabled={loading}>
        {loading ? "טוען..." : "העלה"}
      </button>
      {uploadStatus && <p style={styles.status}>{uploadStatus}</p>}
      {shareLink && (
        <p style={styles.linkParagraph}>
          קישור לשיתוף:{" "}
          <a href={shareLink} target="_blank" rel="noopener noreferrer" style={styles.link}>
            {shareLink}
          </a>
        </p>
      )}

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
    maxWidth: "500px",
    margin: "40px auto",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    backgroundColor: "#f9f9f9",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#333",
  },
  input: {
    display: "block",
    marginBottom: "20px",
    width: "100%",
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#0078d4",
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
  },
  status: {
    marginTop: "20px",
    fontWeight: "bold",
    textAlign: "center",
    color: "#444",
  },
  linkParagraph: {
    marginTop: "15px",
    textAlign: "center",
  },
  link: {
    color: "#0078d4",
    textDecoration: "none",
    fontWeight: "bold",
  },
  popup: {
    position: "fixed",
    top: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "#333",
    color: "white",
    padding: "15px 30px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
    zIndex: 1000,
  },
};

export default UploadForm;

