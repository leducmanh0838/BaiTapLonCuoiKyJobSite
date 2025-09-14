// src/components/JobPostings/ApplicationList.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { authApis, endpoints } from "../../configs/Apis";
import { Button, Table, Badge, Card } from "react-bootstrap";
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

  useEffect(() => {
    const loadApplications = async () => {
      try {
        let res = await authApis().get(
          endpoints.jobPostings.applications.list(id)
        );
        setApplications(res.data.results || res.data);
      } catch (err) {
        console.error("Error fetching applications:", err);
        toast.error("Không thể tải danh sách ứng viên!");
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, [id]);

  if (loading) return <MySpinner text="Đang tải danh sách ứng viên..." />;

  const statusIcons = {
    PENDING: <FaClock className="me-1" />,
    INTERVIEW: <FaComments className="me-1" />,
    HIRED: <FaCheckCircle className="me-1" />,
    REJECTED: <FaTimesCircle className="me-1" />,
  };

  // mapping màu cho trạng thái
  const statusVariants = {
    PENDING: "warning",    // vàng
    INTERVIEW: "info",     // xanh dương nhạt
    HIRED: "success",      // xanh lá
    REJECTED: "danger",    // đỏ
  };

  return (
    <div className="container mt-4">
      <Card className="shadow-sm">
        <Card.Body>
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold mb-0">📋 Danh sách ứng tuyển</h4>
            <Button
              variant="warning"
              className="ms-auto d-flex align-items-center gap-2"
              onClick={() =>
                navigate(`/employer/job-postings/${id}/applications/message`)
              }
            >
              <FaEnvelope /> Gửi thông báo
            </Button>
          </div>

          {/* Table */}
          <Table
            hover
            responsive
            striped
            bordered
            className="align-middle text-center"
          >
            <thead className="table-light">
              <tr>
                <th style={{ width: "30%" }}>Ứng viên</th>
                <th style={{ width: "20%" }}>CV</th>
                <th style={{ width: "50%" }}>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {applications.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center text-muted py-4">
                    Chưa có ứng viên nào
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
                              className="rounded-circle border"
                              width={40}
                              height={40}
                            />
                          ) : (
                            <FaUserCircle size={40} className="text-secondary" />
                          )}
                          <span className="fw-semibold">{fullName}</span>
                        </div>
                      </td>

                      {/* Xem CV */}
                      <td>
                        <Button
                          size="sm"
                          variant="outline-primary"
                          className="d-flex align-items-center gap-1 mx-auto"
                          onClick={() => window.open(app.cv_file, "_blank")}
                        >
                          <FaFileAlt /> Xem CV
                        </Button>
                      </td>

                      {/* Trạng thái */}
                      <td>
                        {app.is_cancel ? (
                          <Badge
                            bg="secondary"
                            pill
                            className="px-3 py-2 d-flex align-items-center justify-content-center gap-1"
                          >
                            <FaBan /> Đã hủy
                          </Badge>
                        ) : (
                          <div className="d-flex justify-content-center gap-2 flex-wrap">
                            {["PENDING", "INTERVIEW", "HIRED", "REJECTED"].map(
                              (st) => {
                                const statusObj =
                                  getApplicationStatusByValue(st);
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
                                          `Cập nhật trạng thái: ${
                                            statusObj?.label || st
                                          }`
                                        );
                                      } catch (err) {
                                        console.error("Update status failed", err);
                                        toast.error("Cập nhật trạng thái thất bại!");
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
        </Card.Body>
      </Card>
    </div>
  );
}

export default ApplicationList;
