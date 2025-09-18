import React from "react";
import JoditEditor from "jodit-react";

const AutoCvForm = ({ cvData, setCvData, onGenerate }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCvData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form>
      <h5 className="mt-3">Thông tin cá nhân</h5>
      <div className="mb-2">
        <input type="text" className="form-control" name="fullName" placeholder="Họ tên" value={cvData.fullName} onChange={handleChange} />
      </div>
      <div className="mb-2">
        <input type="text" className="form-control" name="jobTitle" placeholder="Vị trí ứng tuyển" value={cvData.jobTitle} onChange={handleChange} />
      </div>
      <div className="mb-2">
        <input type="email" className="form-control" name="email" placeholder="Email" value={cvData.email} onChange={handleChange} />
      </div>
      <div className="mb-2">
        <input type="text" className="form-control" name="phone" placeholder="Số điện thoại" value={cvData.phone} onChange={handleChange} />
      </div>
      <div className="mb-2">
        <input type="text" className="form-control" name="address" placeholder="Địa chỉ" value={cvData.address} onChange={handleChange} />
      </div>
      <div className="mb-2">
        <input type="text" className="form-control" name="linkedin" placeholder="LinkedIn" value={cvData.linkedin} onChange={handleChange} />
      </div>
      <div className="mb-2">
        <input type="text" className="form-control" name="github" placeholder="Github" value={cvData.github} onChange={handleChange} />
      </div>

      <h5 className="mt-3">Tóm tắt bản thân</h5>
      <textarea className="form-control mb-2" name="summary" value={cvData.summary} onChange={handleChange} rows={2} />

      <h5 className="mt-3">Học vấn</h5>
      <input type="text" className="form-control mb-2" name="educationSchool" placeholder="Tên trường" value={cvData.educationSchool} onChange={handleChange} />
      <input type="text" className="form-control mb-2" name="educationMajor" placeholder="Ngành học" value={cvData.educationMajor} onChange={handleChange} />
      <input type="text" className="form-control mb-2" name="educationGPA" placeholder="GPA" value={cvData.educationGPA} onChange={handleChange} />
      <input type="text" className="form-control mb-2" name="educationTime" placeholder="Thời gian học" value={cvData.educationTime} onChange={handleChange} />
      <input type="text" className="form-control mb-2" name="educationLocation" placeholder="Địa điểm" value={cvData.educationLocation} onChange={handleChange} />

      <h5 className="mt-3">Dự án</h5>
      <JoditEditor
        value={cvData.projects}
        config={{ readonly: false, height: 200 }}
        onBlur={(newContent) => setCvData((prev) => ({ ...prev, projects: newContent }))}
      />

      <h5 className="mt-3">Thành tích</h5>
      <JoditEditor
        value={cvData.achievements}
        config={{ readonly: false, height: 120 }}
        onBlur={(newContent) => setCvData((prev) => ({ ...prev, achievements: newContent }))}
      />

      <h5 className="mt-3">Kỹ năng</h5>
      <JoditEditor
        value={cvData.skills}
        config={{ readonly: false, height: 120 }}
        onBlur={(newContent) => setCvData((prev) => ({ ...prev, skills: newContent }))}
      />
      {/* <input type="text" className="form-control mb-2" name="languages" placeholder="Ngoại ngữ" value={cvData.languages} onChange={handleChange} /> */}

      <button type="button" className="btn btn-primary mt-3" onClick={onGenerate}>
        Generate CV
      </button>
    </form>
  );
};

export default AutoCvForm;
