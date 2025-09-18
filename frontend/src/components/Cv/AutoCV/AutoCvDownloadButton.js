import React from "react";
import { useReactToPrint } from "react-to-print";
import html2pdf from "html2pdf.js";
import { authApis, endpoints } from "../../../configs/Apis";

const AutoCvDownloadButton = ({ previewRef, cvData }) => {
  const handlePrint = useReactToPrint({
    contentRef: previewRef,
    documentTitle: "CV",
  });

  const handleSaveCv = async () => {
    if (!previewRef.current) return;
    // Render PDF từ DOM node
    const element = previewRef.current;
    const opt = {
      margin: 0,
      filename: `${cvData.fullName || "cv"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    // Tạo PDF và lấy Blob URL
    const pdfBlobUrl = await html2pdf().from(element).set(opt).outputPdf('bloburl');
    // Lấy Blob từ blobUrl
    const response = await fetch(pdfBlobUrl);
    const pdfBlob = await response.blob();

    const formData = new FormData();
    formData.append("title", cvData.jobTitle || "CV");
    formData.append("summary", cvData.summary || "");
    formData.append(
      "upload_file",
      new File([pdfBlob], `${cvData.fullName || "cv"}.pdf`, {
        type: "application/pdf",
      })
    );

    try {
      console.log("title:", formData.get("title"));
      console.log("summary:", formData.get("summary"));
      console.log("upload_file:", formData.get("upload_file"));
      await authApis().post(endpoints.cvs.list, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Lưu CV thành công!");
    } catch (err) {
      alert("Lưu CV thất bại!");
    }
  };

  return (
    <>
      <button className="btn btn-danger mt-3" onClick={handlePrint}>
        Tải CV PDF
      </button>
      <button className="btn btn-success mt-3 ms-2" onClick={handleSaveCv}>
        Lưu CV
      </button>
    </>
  );
};

export default AutoCvDownloadButton;
