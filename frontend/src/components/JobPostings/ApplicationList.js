// src/components/JobPostings/ApplicationList.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { authApis, endpoints } from "../../configs/Apis";
import { Button, Table, Badge, Card, Pagination } from "react-bootstrap";
import { getApplicationStatusByValue } from "../../constants/ApplicationStatus";
import { toast } from "react-toastify";
import MySpinner from "../layout/MySpinner";
import {
  FaEnvelope,
  FaUserCircle,
  FaFileAlt,
  FaClock,
  FaComments,
  FaCheckCircle,
  FaTimesCircle,
  FaBan,
} from "react-icons/fa";

function ApplicationList() {
  const { id } = useParams(); // jobPostingId
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadApplications = async (page = 1) => {
    try {
      let res = await authApis().get(
        `${endpoints.jobPostings.applications.list(id)}?page=${page}`
      );
      setApplications(res.data.results || []);
      setTotalPages(Math.ceil(res.data.count / 10)); // page_size = 10
    } catch (err) {
      console.error("Error fetching applications:", err);
      toast.error("Không thể tải danh sách ứng viên!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications(page);
  }, [id, page]);

  if (loading) return <MySpinner text="Đang tải danh sách ứng viên..." />;

  const statusIcons = {
    PENDING: <FaClock className="me-1" />,
    INTERVIEW: <FaComments className="me-1" />,
    HIRED: <FaCheckCircle className="me-1" />,
    REJECTED: <FaTimesCircle className="me-1" />,
  };

  const statusVariants = {
    PENDING: "warning",
    INTERVIEW: "info",
    HIRED: "success",
    REJECTED: "danger",
  };

  const markRead = async (appId) => {
    try{
      const res = await authApis().patch(endpoints.jobPostings.applications.markRead(id, appId));
      console.info("Thành công!!");
    }catch(err){
      console.info("Lỗi");
    }
  }

  return (
    <div className="container mt-4">
      <Card className="shadow border-0 rounded-3">
        <Card.Header className="bg-light d-flex justify-content-between align-items-center">
          <h5 className="fw-bold mb-0">📋 Danh sách ứng tuyển</h5>
          <Button
            variant="warning"
            className="d-flex align-items-center gap-2"
            onClick={() =>
              navigate(`/employer/job-postings/${id}/applications/message`)
            }
          >
            <FaEnvelope /> Gửi thông báo
          </Button>
        </Card.Header>

        <Card.Body>
          <Table hover responsive bordered className="align-middle text-center">
            <thead className="table-light">
              <tr>
                <th style={{ width: "35%" }}>Ứng viên</th>
                <th style={{ width: "20%" }}>CV</th>
                <th style={{ width: "45%" }}>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {applications.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center text-muted py-5">
                    <FaUserCircle size={40} className="mb-2 text-secondary" />
                    <div>Chưa có ứng viên nào</div>
                  </td>
                </tr>
              ) : (
                applications.map((app) => {
                  const fullName = app.cv_owner
                    ? `${app.cv_owner.first_name} ${app.cv_owner.last_name}`.trim()
                    : "Ẩn danh";

                  return (
                    <tr key={app.id}>
                      {/* Ứng viên */}
                      <td className="text-start">
                        <div className="d-flex align-items-center gap-2">
                          {app.cv_owner?.avatar ? (
                            <img
                              src={app.cv_owner.avatar}
                              alt="avatar"
                              className="rounded-circle border border-2"
                              width={45}
                              height={45}
                            />
                          ) : (
                            <FaUserCircle size={45} className="text-secondary" />
                          )}
                          <span className="fw-semibold">{fullName}</span>
                          {!(app.is_read) && "(Chưa đọc)"}
                        </div>
                      </td>

                      {/* CV */}
                      <td>
                        <Button
                          size="sm"
                          variant="outline-primary"
                          className="d-flex align-items-center gap-1 mx-auto"
                          title="Xem CV ứng viên"
                          onClick={() => {
                            markRead(app.id);
                            window.open(app.cv_file, "_blank");
                          }}
                        >
                          <FaFileAlt /> CV
                        </Button>
                      </td>

                      {/* Trạng thái */}
                      <td>
                        {app.is_cancel ? (
                          <Badge
                            bg="secondary"
                            pill
                            className="px-3 py-2 d-flex align-items-center gap-1 justify-content-center"
                          >
                            <FaBan /> Đã hủy
                          </Badge>
                        ) : (
                          <div className="d-flex justify-content-center flex-wrap gap-2">
                            {["PENDING", "INTERVIEW", "HIRED", "REJECTED"].map(
                              (st) => {
                                const statusObj = getApplicationStatusByValue(st);
                                const isActive = app.status === st;

                                return (
                                  <Button
                                    key={st}
                                    size="sm"
                                    variant={
                                      isActive
                                        ? statusVariants[st]
                                        : "outline-secondary"
                                    }
                                    className="rounded-pill px-3 d-flex align-items-center gap-1"
                                    onClick={async () => {
                                      try {
                                        await authApis().patch(
                                          endpoints.jobPostings.applications.detail(
                                            id,
                                            app.id
                                          ),
                                          { status: st }
                                        );
                                        setApplications((prev) =>
                                          prev.map((a) =>
                                            a.id === app.id
                                              ? { ...a, status: st }
                                              : a
                                          )
                                        );
                                        toast.success(
                                          `Cập nhật trạng thái: ${statusObj?.label || st
                                          }`
                                        );
                                      } catch (err) {
                                        console.error(
                                          "Update status failed",
                                          err
                                        );
                                        toast.error(
                                          "Cập nhật trạng thái thất bại!"
                                        );
                                      }
                                    }}
                                  >
                                    {statusIcons[st]} {statusObj?.label || st}
                                  </Button>
                                );
                              }
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-3">
              <Pagination>
                {[...Array(totalPages)].map((_, idx) => (
                  <Pagination.Item
                    key={idx + 1}
                    active={idx + 1 === page}
                    onClick={() => setPage(idx + 1)}
                  >
                    {idx + 1}
                  </Pagination.Item>
                ))}
              </Pagination>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}

export default ApplicationList;
