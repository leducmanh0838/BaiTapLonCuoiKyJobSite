import { useEffect, useState } from "react";
import { authApis, endpoints } from "../../configs/Apis";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CvCard = ({ cv, onDelete }) => {
  const navigate = useNavigate();
  return (
    <Card className="shadow-sm w-100" style={{ minHeight: "220px" }}>
      <Card.Body>
        <Row>
          {/* Preview bên trái */}
          <Col xs={5} className="d-flex align-items-center">
            <div
              style={{
                width: "100%",
                height: "160px",
                border: "1px solid #ddd",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                background: "#f8f9fa",
              }}
            >
              {cv.file ? (
                <iframe
                  src={cv.file}
                  type="application/pdf"
                  title={cv.title}
                  style={{
                    width: "100%",
                    height: "250px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                  }}
                />
              ) : (
                <div
                  className="d-flex align-items-center justify-content-center text-muted"
                  style={{
                    width: "100%",
                    height: "250px",
                    border: "1px dashed #ccc",
                    borderRadius: "8px",
                  }}
                >
                  Không có file CV
                </div>
              )}
            </div>
          </Col>

          {/* Nội dung bên phải */}
          <Col xs={7} className="d-flex flex-column">
            <h6 className="fw-bold">{cv.title}</h6>
            <div
              style={{
                flexGrow: 1,
                maxHeight: "80px",
                overflowY: "auto",
                fontSize: "14px",
              }}
              className="mb-2"
            >
              <strong>Tóm tắt:</strong>
              <div
                dangerouslySetInnerHTML={{
                  __html: cv.summary || "Chưa có tóm tắt",
                }}
              />
            </div>

            <div className="d-flex justify-content-start">
              <Button
                variant="warning"
                size="sm"
                className="me-2"
                onClick={() => navigate(`/cvs/${cv.id}/edit`)}
              >
                Chỉnh sửa
              </Button>
              <Button variant="danger" size="sm" onClick={() => onDelete(cv.id)}>
                Xóa
              </Button>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

const CvManager = () => {
  const [cvs, setCvs] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const navigate = useNavigate();

  // Load danh sách CV
  const loadCvs = async (url = endpoints.cvs.list, append = false) => {
    try {
      let res = await authApis().get(url);
      const results = res.data.results || res.data;
      setCvs((prev) => (append ? [...prev, ...results] : results));
      setNextPage(res.data.next || null);
    } catch (err) {
      toast.error("Lỗi khi tải CV!");
    }
  };

  useEffect(() => {
    loadCvs();
  }, []);

  // Xóa CV
  const deleteCv = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa CV này?")) return;
    try {
      await authApis().delete(endpoints.cvs.detail(id));
      toast.success("Xóa thành công!");
      loadCvs();
    } catch (err) {
      toast.error("Xóa thất bại!");
    }
  };

  return (
    <Container className="mt-3 mb-3">
      <h3 className="mb-3">Trang quản lý các CV của ứng viên</h3>

      <div className="mb-4 d-flex gap-2">
        <Button
          variant="primary"
          onClick={() => navigate("/cvs/new")}
        >
          Thêm CV mới của bạn
        </Button>
        <Button
          variant="success"
          onClick={() => navigate("/auto-cv")}
        >
          CV Generation
        </Button>
      </div>

      <Row>
        {cvs.map((cv) => (
          <Col md={6} sm={12} className="mb-3" key={cv.id}>
            <CvCard cv={cv} onDelete={deleteCv} />
          </Col>
        ))}
      </Row>

      {/* Nút Xem thêm */}
      {nextPage && (
        <div className="text-center mt-3">
          <Button variant="outline-primary" onClick={() => loadCvs(nextPage, true)}>
            Xem thêm
          </Button>
        </div>
      )}
    </Container>
  );
};

export default CvManager;
