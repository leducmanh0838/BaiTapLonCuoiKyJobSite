// src/components/Cv/CvForm.js
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { authApis, endpoints } from "../../configs/Apis";
import { toast } from "react-toastify";
import { FaFilePdf } from "react-icons/fa";
import JoditEditor from "jodit-react";

const defaultTemplate = `
  <b>Tóm tắt công việc</b>
  <ul>
    <li>Kinh nghiệm nổi bật</li>
    <li>Kỹ năng chính</li>
    <li>Thành tích đạt được</li>
  </ul>
`;

const CvForm = () => {
  const { cvId } = useParams();
  const navigate = useNavigate();
  const isEdit = !!cvId;

  const editor = useRef(null);
  const [originalFormData, setOriginalFormData] = useState(null);
  const [currentFormData, setCurrentFormData] = useState({
    id: null,
    title: "",
    summary: defaultTemplate,
    file: null,
    fileUrl: null,
  });
  const [loading, setLoading] = useState(false);

  // ✅ Load CV khi edit
  useEffect(() => {
    const loadCv = async () => {
      if (!isEdit) return;
      try {
        setLoading(true);
        let res = await authApis().get(endpoints.cvs.detail(cvId));
        const cv = {
          id: res.data.id,
          title: res.data.title,
          summary: res.data.summary || defaultTemplate,
          file: null,
          fileUrl: res.data.file,
        };
        setOriginalFormData(JSON.parse(JSON.stringify(cv)));
        setCurrentFormData(JSON.parse(JSON.stringify(cv)));
      } catch (err) {
        toast.error("Không tải được CV!");
      } finally {
        setLoading(false);
      }
    };
    loadCv();
  }, [cvId, isEdit]);

  // Xử lý thay đổi input text
  const handleChange = (e) => {
    setCurrentFormData({
      ...currentFormData,
      [e.target.name]: e.target.value,
    });
  };

  // Xử lý thay đổi file
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setCurrentFormData({
      ...currentFormData,
      file: file,
      fileUrl: file ? URL.createObjectURL(file) : currentFormData.fileUrl,
    });
  };

  // ✅ Submit khi thêm mới
  const handleSubmitAdd = async () => {
    const formData = new FormData();
    formData.append("title", currentFormData.title);
    formData.append("summary", currentFormData.summary);
    if (currentFormData.file)
      formData.append("upload_file", currentFormData.file);

    try {
      setLoading(true);
      await authApis().post(endpoints.cvs.list, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Thêm CV thành công!");
      navigate("/cvs");
    } catch (err) {
      toast.error("Có lỗi xảy ra khi thêm CV!");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Submit khi sửa
  const handleSubmitEdit = async () => {
    const formData = new FormData();
    formData.append("title", currentFormData.title);
    formData.append("summary", currentFormData.summary);
    if (currentFormData.file)
      formData.append("upload_file", currentFormData.file);

    try {
      setLoading(true);
      await authApis().put(endpoints.cvs.detail(cvId), formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Cập nhật CV thành công!");
      navigate("/cvs");
    } catch (err) {
      toast.error("Có lỗi xảy ra khi cập nhật CV!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row p-2">
        {/* Cột trái: preview CV */}
        <div className="col-4">
          <input
            type="file"
            accept="application/pdf"
            id="cv-file"
            className="d-none"
            onChange={handleFileChange}
          />
          <label
            htmlFor="cv-file"
            style={{
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              border: "2px dashed #ddd",
              borderRadius: "12px",
              minHeight: "300px",
              backgroundColor: "#fafafa",
              overflow: "hidden",
            }}
            className="w-100"
          >
            {currentFormData.fileUrl ? (
              <iframe
                src={currentFormData.fileUrl}
                title="Preview CV"
                style={{
                  width: "100%",
                  height: "400px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                }}
              />
            ) : (
              <div className="text-center text-muted">
                <FaFilePdf size={60} color="#ccc" />
                <p className="mt-2">Chọn file PDF để tải lên</p>
              </div>
            )}
          </label>
        </div>

        {/* Cột phải: form */}
        <div className="col-8">
          <div className="form-floating mb-3">
            <input
              autoComplete="off"
              type="text"
              className="form-control fs-5 fw-bold"
              id="title"
              name="title"
              placeholder="Tiêu đề CV"
              value={currentFormData.title}
              onChange={handleChange}
              required
            />
            <label htmlFor="title">Tiêu đề CV</label>
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Tóm tắt</label>
            <JoditEditor
              ref={editor}
              value={currentFormData.summary}
              config={{
                readonly: false,
                height: 300,
                placeholder: "Nhập tóm tắt về kỹ năng, kinh nghiệm...",
                cleanHTML: {
                  allowTags: "p,b,i,u,em,strong,a,ul,ol,li,br,span",
                  removeEmptyElements: true,
                },
              }}
              onBlur={(newContent) =>
                setCurrentFormData({
                  ...currentFormData,
                  summary: newContent,
                })
              }
            />
          </div>

          <div className="d-flex justify-content-end">
            {isEdit ? (
              <button
                type="button"
                className="btn btn-success"
                onClick={handleSubmitEdit}
                disabled={loading}
              >
                {loading ? "Đang lưu..." : "Chỉnh sửa"}
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmitAdd}
                disabled={loading}
              >
                {loading ? "Đang lưu..." : "Thêm mới"}
              </button>
            )}
            <button
              type="button"
              className="btn btn-secondary ms-2"
              onClick={() => navigate("/cvs")}
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CvForm;
