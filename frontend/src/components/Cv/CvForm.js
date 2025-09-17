import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { authApis, endpoints } from "../../configs/Apis";
import { toast } from "react-toastify";
import { FaFilePdf, FaSave, FaTimes } from "react-icons/fa";
import JoditEditor from "jodit-react";
import { Card, Spinner } from "react-bootstrap";

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
  const [currentFormData, setCurrentFormData] = useState({
    id: null,
    title: "",
    summary: defaultTemplate,
    file: null,
    fileUrl: null,
  });
  const [loading, setLoading] = useState(false);

  // Load CV khi edit
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
        setCurrentFormData(cv);
      } catch (err) {
        toast.error("Không tải được CV!");
      } finally {
        setLoading(false);
      }
    };
    loadCv();
  }, [cvId, isEdit]);

  // Xử lý thay đổi input
  const handleChange = (e) => {
    setCurrentFormData({
      ...currentFormData,
      [e.target.name]: e.target.value,
    });
  };

  // Xử lý file
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setCurrentFormData({
      ...currentFormData,
      file: file,
      fileUrl: file ? URL.createObjectURL(file) : currentFormData.fileUrl,
    });
  };

  // Thêm mới
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

  // Sửa
  const handleSubmitEdit = async () => {
    const formData = new FormData();
    formData.append("title", currentFormData.title);
    formData.append("summary", currentFormData.summary);

    if (currentFormData.file)
      formData.append("upload_file", currentFormData.file);

    try {
      setLoading(true);
      await authApis().patch(endpoints.cvs.detail(cvId), formData, {
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
      <Card className="shadow border-0 rounded-3">
  <Card.Header className="bg-white border-bottom d-flex align-items-center">
    <span className="fs-5 fw-bold">
      {isEdit ? "✏️ Chỉnh sửa CV" : "➕ Thêm CV mới"}
    </span>
  </Card.Header>

  <Card.Body>
    <div className="row g-4">
      {/* Cột trái: Preview CV */}
      <div className="col-md-4">
        <Card className="h-100 shadow-sm border-0">
          <Card.Header className="bg-light text-center fw-semibold">
            <FaFilePdf className="me-2 text-danger" /> Preview CV
          </Card.Header>
          <Card.Body className="d-flex flex-column justify-content-center align-items-center">
            <input
              type="file"
              accept="application/pdf"
              id="cv-file"
              className="d-none"
              onChange={handleFileChange}
            />

            {currentFormData.fileUrl ? (
              <>
                <iframe
                  src={currentFormData.fileUrl}
                  title="Preview CV"
                  style={{
                    width: "100%",
                    height: "350px",
                    border: "none",
                    borderRadius: "8px",
                  }}
                />
                <div className="d-flex w-100 mt-2">
                  <label
                    htmlFor="cv-file"
                    className="btn btn-outline-primary flex-fill me-2"
                  >
                    Đổi CV khác
                  </label>
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() =>
                      setCurrentFormData({ ...currentFormData, fileUrl: null, file: null })
                    }
                  >
                    <FaTimes /> Xóa
                  </button>
                </div>
              </>
            ) : (
              <label
                htmlFor="cv-file"
                className="w-100 h-100 d-flex flex-column justify-content-center align-items-center border border-2 border-dashed rounded bg-light"
                style={{ cursor: "pointer", minHeight: "300px" }}
              >
                <FaFilePdf size={60} color="#bbb" />
                <p className="mt-2 text-muted">Chọn file PDF để tải lên</p>
              </label>
            )}
          </Card.Body>
        </Card>
      </div>

      {/* Cột phải: Form */}
      <div className="col-md-8">
        <div className="form-floating mb-3">
          <input
            autoComplete="off"
            type="text"
            className="form-control fs-5 fw-semibold"
            id="title"
            name="title"
            placeholder="Tiêu đề CV"
            value={currentFormData.title}
            onChange={handleChange}
            required
          />
          <label htmlFor="title">📄 Tiêu đề CV</label>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">📝 Tóm tắt</label>
          <div className="border rounded p-2">
            <JoditEditor
              ref={editor}
              value={currentFormData.summary}
              config={{
                readonly: false,
                height: 300,
                placeholder: "Nhập tóm tắt về kỹ năng, kinh nghiệm...",
              }}
              onBlur={(newContent) =>
                setCurrentFormData({ ...currentFormData, summary: newContent })
              }
            />
          </div>
        </div>
      </div>
    </div>
  </Card.Body>

  {/* Footer: nút hành động */}
  <Card.Footer className="bg-light d-flex justify-content-end">
    {isEdit ? (
      <button
        type="button"
        className="btn btn-success"
        onClick={handleSubmitEdit}
        disabled={loading}
      >
        {loading ? <Spinner size="sm" /> : <FaSave />} Lưu thay đổi
      </button>
    ) : (
      <button
        type="button"
        className="btn btn-primary"
        onClick={handleSubmitAdd}
        disabled={loading}
      >
        {loading ? <Spinner size="sm" /> : <FaSave />} Thêm mới
      </button>
    )}
    <button
      type="button"
      className="btn btn-outline-secondary ms-2"
      onClick={() => navigate("/cvs")}
    >
      <FaTimes /> Hủy
    </button>
  </Card.Footer>
</Card>

    </div>
  );
};

export default CvForm;
