import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { authApis, endpoints } from "../../configs/Apis";
import { Form, Button, Spinner, Card, Badge } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  FaFileAlt,
  FaPlusCircle,
  FaRegEnvelope,
  FaPaperPlane,
  FaEye,
} from "react-icons/fa";

const JobApplicationForm = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const location = useLocation();

  const [cvs, setCvs] = useState([]);
  const [selectedCv, setSelectedCv] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const newCvId = queryParams.get("newCvId");

  const loadCvs = async () => {
    try {
      let res = await authApis().get(endpoints.cvs.list);
      const cvList = res.data.results || res.data;
      setCvs(cvList);
      if (newCvId) setSelectedCv(newCvId);
    } catch (err) {
      toast.error("Lỗi tải CV");
    }
  };

  useEffect(() => {
    loadCvs();
  }, [newCvId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCv) {
      toast.warning("Vui lòng chọn CV!");
      return;
    }
    setLoading(true);
    try {
      await authApis().post(endpoints.applications.list, {
        job_posting: id,
        cv: selectedCv,
        cover_letter: coverLetter,
      });
      toast.success("Nộp đơn thành công!");
      nav(`/applications`);
    } catch (err) {
      toast.error("Nộp đơn thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: 780 }}>
      <Card
        className="p-4 shadow-lg border-0"
        style={{ borderRadius: 20, background: "#fff" }}
      >
        <div className="text-center mb-4">
          <h3 className="fw-bold text-primary mb-2 d-flex align-items-center justify-content-center gap-2">
            <FaPaperPlane /> Nộp đơn ứng tuyển
          </h3>
          <p className="text-muted mb-0">
            Hãy hoàn thiện thông tin để tạo ấn tượng với nhà tuyển dụng
          </p>
        </div>

        <Form onSubmit={handleSubmit}>
          {/* Chọn CV */}
<Form.Group
  className="mb-4 p-3 border-start border-4 border-primary rounded bg-light"
>
  <Form.Label className="fw-semibold text-primary">
    <FaFileAlt className="me-2" />
    Chọn CV
  </Form.Label>
  <Form.Select
    value={selectedCv}
    onChange={(e) => setSelectedCv(e.target.value)}
    className="shadow-sm mb-2"
  >
    <option value="">-- Chọn CV --</option>
    {cvs.map((cv) => (
      <option key={cv.id} value={cv.id}>
        {cv.title || `CV #${cv.id}`}
      </option>
    ))}
  </Form.Select>
  <div className="d-flex align-items-center gap-2 mb-3">
    <Button
      variant="outline-primary"
      size="sm"
      onClick={() =>
        nav(`/cvs/new?redirect=/job-postings/${id}/applications`)
      }
    >
      <FaPlusCircle className="me-1" />
      Tạo CV mới
    </Button>
    {selectedCv && (
      <Badge bg="secondary" className="d-flex align-items-center gap-1 px-3">
        <FaEye /> Đã chọn
      </Badge>
    )}
  </div>

  {/* ✅ Preview CV giống CvForm */}
  {selectedCv && (
    <div
      className="border rounded p-2 bg-white shadow-sm"
      style={{ borderRadius: "12px", minHeight: "300px" }}
    >
      {(() => {
        const cv = cvs.find((c) => c.id == selectedCv);
        if (cv?.file) {
          return (
            <iframe
              src={cv.file}
              title="Preview CV"
              style={{
                width: "100%",
                height: "400px",
                border: "1px solid #ddd",
                borderRadius: "8px",
              }}
            />
          );
        }
        return (
          <div className="text-center text-muted p-4">
            <FaFileAlt size={50} color="#ccc" />
            <p className="mt-2">CV chưa có file đính kèm</p>
          </div>
        );
      })()}
    </div>
  )}
</Form.Group>


          {/* Submit */}
          <div className="text-center">
            <Button
              type="submit"
              disabled={loading}
              className="px-5 py-2 fw-bold d-flex align-items-center justify-content-center gap-2 mx-auto"
              style={{
                fontSize: 18,
                borderRadius: 30,
                background:
                  "linear-gradient(90deg, rgba(0,123,255,1) 0%, rgba(0,200,150,1) 100%)",
                border: "none",
              }}
            >
              {loading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                <>
                  <FaPaperPlane /> Xác nhận nộp đơn
                </>
              )}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default JobApplicationForm;
