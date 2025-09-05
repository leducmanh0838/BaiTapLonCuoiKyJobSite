import { useEffect, useState } from "react";
import { authApis, endpoints } from "../../configs/Apis";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { toast } from "react-toastify";

const CvCard = ({ cv, onDelete }) => {
  console.log("CV file URL:", cv.file);
  return (
    <Card
      className="shadow-sm w-100"
      style={{ minHeight: "220px" }}
    >
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
                  height: "250px", // chiều cao cố định để các card bằng nhau
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
              <strong>Tóm tắt:</strong> {cv.summary}
            </div>

            <div className="d-flex justify-content-start">
              <Button
                variant="warning"
                size="sm"
                className="me-2"
                onClick={() => toast.info("TODO: mở form chỉnh sửa CV")}
              >
                Chỉnh sửa
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => onDelete(cv.id)}
              >
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

  // Load danh sách CV
  const loadCvs = async () => {
    try {
      let res = await authApis().get(endpoints.cvs.list);
      setCvs(res.data.results || res.data);
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
    <Container className="mt-3">
      <h3 className="mb-3">Trang quản lý các CV của ứng viên</h3>
      <Button
        variant="primary"
        className="mb-4"
        onClick={() => toast.info("TODO: mở form thêm CV")}
      >
        Thêm CV mới của bạn
      </Button>

      <Row>
        {cvs.map((cv) => (
          <Col md={6} sm={12} className="mb-3" key={cv.id}>
            <CvCard cv={cv} onDelete={deleteCv} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default CvManager;
