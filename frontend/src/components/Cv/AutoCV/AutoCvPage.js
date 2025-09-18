import React, { useRef, useState } from "react";
import AutoCvForm from "./AutoCvForm";
import AutoCvPreview from "./AutoCvPreview";
import AutoCvDownloadButton from "./AutoCvDownloadButton";

const AutoCvPage = () => {
  const [cvData, setCvData] = useState({
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "",
    address: "",
    linkedin: "",
    github: "",
    summary: "",
    educationSchool: "",
    educationMajor: "",
    educationGPA: "",
    educationTime: "",
    educationLocation: "",
    projects: "",
    achievements: "",
    skills: "",
    // languages: "",
  });
  const [showPreview, setShowPreview] = useState(false);
  const previewRef = useRef();

  return (
    <div className="container py-4">
      <h2 className="mb-4">Tạo CV tự động</h2>
      <div className="row">
        <div className="col-md-6">
          <AutoCvForm cvData={cvData} setCvData={setCvData} onGenerate={() => setShowPreview(true)} />
        </div>
        <div className="col-md-6">
          {showPreview && (
            <>
              <AutoCvPreview ref={previewRef} cvData={cvData} />
              <AutoCvDownloadButton previewRef={previewRef} cvData={cvData}/>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AutoCvPage;
