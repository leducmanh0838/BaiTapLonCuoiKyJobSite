import React, { useContext, useEffect, useState } from "react";
import { Button, Card, Row, Col, Spinner, Badge } from "react-bootstrap";
import { AppContext } from "../../configs/AppProvider";
import Apis, { authApis, endpoints } from "../../configs/Apis";
import { getProvinceNameByCode } from "../../constants/Provinces";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { 
  PlusLg, 
  PencilSquare, 
  Trash3, 
  GeoAltFill, 
  CashStack, 
  BriefcaseFill, 
  Building,
  BoxSeam
} from "react-bootstrap-icons";

/* RECOMMENDATION: Để có trải nghiệm tốt nhất với hiệu ứng hover,
  bạn hãy thêm đoạn CSS sau vào file CSS chung của dự án (ví dụ: App.css)
  
  .job-card {
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    border: 1px solid #e9ecef;
  }

  .job-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.1) !important;
  }
*/

const JobPostingsManagement = () => {
  const { currentUser } = useContext(AppContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      if (!currentUser?.id) return;
      setLoading(true);
      try {
        const res = await Apis.get(
          `${endpoints.jobPostings.list}?owner_id=${currentUser.id}`
        );
        // Giả lập thời gian tải để thấy hiệu ứng loading skeleton
        setTimeout(() => {
            setJobs(res.data.results || res.data || []);
            setLoading(false);
        }, 1000); 
      } catch (err) {
        setJobs([]);
        setLoading(false);
      }
    };
    fetchJobs();
  }, [currentUser]);

  const handleDelete = async (job) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xoá tin "${job.title}"?`))
      return;
    try {
      await authApis().delete(endpoints.jobPostings.detail(job.id));
      toast.success("Đã xoá tin tuyển dụng!");
      setJobs((prev) => prev.filter((j) => j.id !== job.id));
    } catch (err) {
      toast.error("Xoá thất bại!");
    }
  };
  
  // Component cho trạng thái loading đẹp mắt hơn
  const LoadingSkeleton = () => (
    Array.from({ length: 4 }).map((_, index) => (
      <Col key={index}>
        <Card className="h-100 shadow-sm border-0 placeholder-glow">
          <Row className="g-0">
            <Col md={4}>
              <div className="w-100 h-100 placeholder" style={{minHeight: "180px", borderTopLeftRadius: "0.375rem", borderBottomLeftRadius: "0.375rem"}}></div>
            </Col>
            <Col md={8}>
              <Card.Body className="d-flex flex-column">
                <div className="placeholder col-8 mb-3 rounded"></div>
                <div className="placeholder col-6 mb-2 rounded"></div>
                <div className="placeholder col-5 mb-2 rounded"></div>
                <div className="placeholder col-7 mb-2 rounded"></div>
                <div className="mt-auto d-grid">
                    <Button variant="primary" disabled className="placeholder w-100"></Button>
                </div>
              </Card.Body>
            </Col>
          </Row>
        </Card>
      </Col>
    ))
  );

  // Component cho trạng thái không có tin tuyển dụng
  const EmptyState = () => (
    <Col xs={12}>
        <div className="text-center p-5 bg-light rounded-3">
            <BoxSeam size={60} className="text-muted mb-3" />
            <h3 className="fw-bold">Chưa có tin tuyển dụng nào</h3>
            <p className="text-muted">
                Hãy bắt đầu tạo tin tuyển dụng đầu tiên của bạn để tìm kiếm ứng viên tiềm năng.
            </p>
            <Button
                variant="primary"
                onClick={() => nav("/employer/job-postings/new")}
                className="mt-3"
            >
                <PlusLg className="me-2" />
                Tạo tin tuyển dụng mới
            </Button>
        </div>
    </Col>
  );

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h1 className="fw-bold display-6">Quản lý tin tuyển dụng</h1>
        <Button
          variant="primary"
          size="lg"
          onClick={() => nav("/employer/job-postings/new")}
          className="d-flex align-items-center shadow"
        >
          <PlusLg className="me-2" /> Thêm tin mới
        </Button>
      </div>

      <Row xs={1} md={1} lg={2} xl={2} className="g-4">
        {loading ? (
          <LoadingSkeleton />
        ) : jobs.length === 0 ? (
          <EmptyState />
        ) : (
          jobs.map((job) => (
            <Col key={job.id}>
              <Card className="h-100 shadow-sm border-0 job-card">
                <Row className="g-0">
                  <Col md={4} className="d-flex align-items-center justify-content-center p-3">
                    <img
                      src={job.image || "https://via.placeholder.com/150?text=Logo"}
                      alt={job.title}
                      className="img-fluid rounded"
                      style={{ 
                        maxHeight: "140px", 
                        maxWidth: "140px",
                        objectFit: "contain" 
                      }}
                    />
                  </Col>
                  <Col md={8}>
                    <Card.Body className="d-flex flex-column h-100">
                      <div>
                        <Card.Title className="fw-bold fs-5 mb-3">{job.title || job.name}</Card.Title>
                        <div className="d-flex align-items-center text-muted mb-2">
                            <CashStack className="me-2" /> 
                            Lương: <b className="ms-1 text-dark">{job.salary ? `${job.salary.toLocaleString()} VNĐ` : "Thỏa thuận"}</b>
                        </div>
                        <div className="d-flex align-items-center text-muted mb-2">
                            <BriefcaseFill className="me-2" /> 
                            Kinh nghiệm: <b className="ms-1 text-dark">{job.experience || "Không yêu cầu"}</b>
                        </div>
                        <div className="d-flex align-items-center text-muted">
                            <GeoAltFill className="me-2" /> 
                            Khu vực: <b className="ms-1 text-dark">{getProvinceNameByCode(job.city_code) || "Toàn quốc"}</b>
                        </div>
                      </div>

                      <div className="mt-auto pt-3 d-flex justify-content-between align-items-center">
                        <Button
                          variant="dark"
                          className="w-50"
                          onClick={() => nav(`/employer/job-postings/${job.id}/applications`)}
                        >
                          Xem hồ sơ ứng tuyển
                        </Button>
                        <div className="d-flex gap-2">
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            title="Chỉnh sửa"
                            onClick={() => nav(`/employer/job-postings/${job.id}/edit`)}
                          >
                            <PencilSquare />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            title="Xóa"
                            onClick={() => handleDelete(job)}
                          >
                            <Trash3 />
                          </Button>
                        </div>
                      </div>
                    </Card.Body>
                  </Col>
                </Row>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </div>
  );
};

export default JobPostingsManagement;