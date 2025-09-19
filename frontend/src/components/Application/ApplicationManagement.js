import React, { useEffect, useState } from "react";
import { authApis, endpoints } from "../../configs/Apis";
import { getApplicationStatusByValue } from "../../constants/ApplicationStatus";
import { Button, Spinner, Row, Col, Card } from "react-bootstrap";
import { FaCalendarAlt, FaCircle } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Pagination from "../layout/Pagination";

const ApplicationManagement = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPage, setTotalPage] = useState(null);
  const nav = useNavigate();
  const location = useLocation();

  const loadApplications = async () => {
    setLoading(true);
    try {
      const api = authApis();
      const res = await api.get(
        // endpoints.applications.list
        `${endpoints.applications.list}${location.search}`
      );
      setApplications(res.data.results || []);
      setTotalPage(res.data.count / (10) + 1)
    } catch (err) {
      setApplications([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadApplications();
  }, [location.search]);

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" />
      </div>
    );
  }

  const cancelApplication = async (id) => {
    if (!window.confirm("Bạn có chắc muốn hủy đơn ứng tuyển này?")) return;
    try {
      await authApis().patch(endpoints.applications.detail(id), {
        "is_cancel": true
      });
      toast.success("hủy thành công!");
      loadApplications();
    } catch (err) {
      toast.error("hủy thất bại!");
    }
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4 text-primary">Danh sách ứng tuyển</h2>
      <Row xs={1} md={2} lg={2} xl={2} className="g-4">
        {applications.length === 0 ? (
          <div className="text-center text-muted">Không có đơn ứng tuyển nào.</div>
        ) : (
          applications.map((app) => {
            const statusObj = getApplicationStatusByValue(app.status);
            return (
              <Col key={app.id}>
                <Card className="h-100 shadow border-0" style={{ borderRadius: 18, overflow: 'hidden', background: '#fff' }}>
                  <Row className="g-0 align-items-center">
                    <Col xs={4} className="text-center p-0">
                      {app.job_posting_info?.image ? (
                        <img
                          src={app.job_posting_info.image}
                          alt="job"
                          className="img-fluid rounded-start"
                          style={{ maxHeight: 160, objectFit: "cover", width: "100%", borderTopLeftRadius: 18, borderBottomLeftRadius: 18 }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            minHeight: 160,
                            background: "#f3f3f3",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderTopLeftRadius: 18,
                            borderBottomLeftRadius: 18,
                            borderRight: "1px solid #eee",
                          }}
                        >
                          <span style={{ fontSize: 48, color: '#bdbdbd' }}>📄</span>
                        </div>
                      )}
                    </Col>
                    <Col xs={8} className="p-3">
                      <Card.Body className="p-0">
                        <Card.Title className="fw-bold mb-1 text-dark" style={{ fontSize: 20, cursor: 'pointer' }}
                          onClick={() => nav(`/job-postings/${app.job_posting_info?.id}`)}
                        >
                          {app.job_posting_info?.title}
                        </Card.Title>
                        <div className="mb-1 d-flex align-items-center gap-2 text-secondary" style={{ fontSize: 15 }}>
                          <FaCalendarAlt style={{ color: '#3b82f6' }} />
                          <span>Ngày nộp:</span>
                          <b className="text-dark">{new Date(app.created_at).toLocaleDateString()}</b>
                        </div>
                        <div className="mb-2 d-flex align-items-center gap-2" style={{ fontSize: 15 }}>
                          <FaCircle style={{ color: statusObj?.color, fontSize: 13 }} />
                          <span>Trạng thái:</span>
                          <span style={{ color: statusObj?.color, fontWeight: 600 }}>{statusObj?.label}</span>
                        </div>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          disabled={app.is_cancel}
                          className="rounded-pill px-4 fw-bold shadow-sm"
                          style={{ fontSize: 15, borderWidth: 2 }}
                          onClick={() => cancelApplication(app.id)}
                        >
                          Hủy ứng tuyển
                        </Button>
                      </Card.Body>
                    </Col>
                  </Row>
                </Card>
              </Col>
            );
          })
        )}

      </Row>
      {totalPage && <div className="mt-4">
        <Pagination totalPages={totalPage} />
      </div>}
    </div>
  );
};

export default ApplicationManagement;
