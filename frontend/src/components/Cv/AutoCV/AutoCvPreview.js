import React from "react";

const labelStyle = {
  color: "#2e86c1",
  fontWeight: "bold",
  textTransform: "uppercase",
  letterSpacing: 1,
};
const sectionStyle = {
  borderBottom: "1px solid #eee",
  marginBottom: 12,
  paddingBottom: 8,
};

const AutoCvPreview = React.forwardRef(({ cvData }, ref) => {
  return (
    
      <div
        ref={ref}
        className="border rounded p-4 bg-white shadow"
        style={{
          minHeight: 600,
          fontFamily: "Georgia, serif",
          maxWidth: 800,
          margin: "auto",
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div>
            <h2 style={{ color: "#117a65", fontWeight: 700 }}>
              {cvData.fullName}
            </h2>
            <div style={{ fontStyle: "italic", color: "#444" }}>
              {cvData.jobTitle}
            </div>
          </div>
          <div style={{ textAlign: "right", fontSize: 14 }}>
            <div>
              Email: <a href={`mailto:${cvData.email}`}>{cvData.email}</a>
            </div>
            <div>
              LinkedIn: <a href={cvData.linkedin}>{cvData.linkedin}</a>
            </div>
            <div>
              Github: <a href={cvData.github}>{cvData.github}</a>
            </div>
            <div>Mobile: {cvData.phone}</div>
          </div>
        </div>
        <div style={sectionStyle}>
          <div style={labelStyle}>Tóm tắt</div>
          <div>{cvData.summary}</div>
        </div>
        <div style={sectionStyle}>
          <div style={labelStyle}>Học vấn</div>
          <div
            className="row"
            style={{ display: "flex", alignItems: "flex-start" }}
          >
            <div className="col-8" style={{ flex: 1 }}>
              <strong>{cvData.educationSchool}</strong>
              <br />
              <span style={{ fontStyle: "italic" }}>
                {cvData.educationMajor}; GPA: {cvData.educationGPA}
              </span>
            </div>
            <div className="col-4 text-end" style={{ minWidth: 180 }}>
              <div>{cvData.educationLocation}</div>
              <div style={{ fontStyle: "italic" }}>{cvData.educationTime}</div>
            </div>
          </div>
        </div>
        <div style={sectionStyle}>
          <div style={labelStyle}>Dự án</div>
          <div dangerouslySetInnerHTML={{ __html: cvData.projects }} />
        </div>
        <div style={sectionStyle}>
          <div style={labelStyle}>Thành tựu</div>
          <div dangerouslySetInnerHTML={{ __html: cvData.achievements }} />
        </div>
        <div style={sectionStyle}>
          <div style={labelStyle}>Kỹ năng</div>
          <div dangerouslySetInnerHTML={{ __html: cvData.skills }} />
          {/* <div><strong>Ngôn ngữ:</strong> {cvData.languages}</div> */}
        </div>
      </div>

  );
});

export default AutoCvPreview;
