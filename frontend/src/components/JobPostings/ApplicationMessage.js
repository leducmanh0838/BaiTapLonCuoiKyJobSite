// src/components/JobPostings/ApplicationMessage.js
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { authApis, endpoints } from "../../configs/Apis";
import { Button, Card, Form, Spinner, Badge } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  FaClock,
  FaComments,
  FaCheckCircle,
  FaTimesCircle,
  FaEnvelope,
  FaArrowLeft,
} from "react-icons/fa";

// Map trạng thái -> màu sắc (đồng bộ với ApplicationsList.js)
const statusColors = {
  PENDING: "secondary",
  INTERVIEW: "info",
  HIRED: "success",
  REJECTED: "danger",
};

function ApplicationMessage() {
  const { id } = useParams(); // jobPostingId
  const navigate = useNavigate();

  const [statuses, setStatuses] = useState([]); // danh sách trạng thái đã chọn
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const statusOptions = [
    { value: "PENDING", label: "Đang chờ", icon: <FaClock /> },
    { value: "INTERVIEW", label: "Phỏng vấn", icon: <FaComments /> },
    { value: "HIRED", label: "Trúng tuyển", icon: <FaCheckCircle /> },
    { value: "REJECTED", label: "Từ chối", icon: <FaTimesCircle /> },
  ];

  const handleSubmit = async () => {
    if (!message.trim()) {
      toast.warning("Vui lòng nhập nội dung thông báo!");
      return;
    }

    try {
      setLoading(true);
      const res = await authApis().post(endpoints.jobPostings.messages(id), {
        message,
        statuses: statuses.length > 0 ? statuses : undefined, // nếu không chọn thì gửi tất cả
      });

      toast.success(`Đã gửi thông báo cho ${res.data.count} ứng viên`);
      navigate(-1); // quay lại danh sách ứng viên
    } catch (err) {
      console.error("Send message failed:", err);
      toast.error("Không thể gửi thông báo!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <Card className="shadow border-0 rounded-3">
        <Card.Header className="bg-primary text-white d-flex align-items-center">
          <FaEnvelope className="me-2" />
          <h5 className="fw-bold mb-0">Gửi thông báo đến ứng viên</h5>
        </Card.Header>

        <Card.Body>
          <div className="mb-4">
            <Form.Label className="fw-semibold">Trạng thái ứng tuyển</Form.Label>
            <div className="d-flex flex-wrap gap-2 mt-2">
              {statusOptions.map((st) => {
                const active = statuses.includes(st.value);
                return (
                  <Button
                    key={st.value}
                    variant={
                      active
                        ? statusColors[st.value]
                        : "outline-" + statusColors[st.value]
                    }
                    className="rounded-pill d-flex align-items-center gap-2 px-3"
                    onClick={() =>
                      setStatuses((prev) =>
                        prev.includes(st.value)
                          ? prev.filter((s) => s !== st.value)
                          : [...prev, st.value]
                      )
                    }
                  >
                    {st.icon}
                    {st.label}
                    {active && (
                      <Badge bg="light" text="dark">
                        ✓
                      </Badge>
                    )}
                  </Button>
                );
              })}
            </div>
            <small className="text-muted">
              Nếu không chọn, thông báo sẽ gửi đến <strong>tất cả ứng viên</strong>.
            </small>
          </div>

          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">Nội dung thông báo</Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              placeholder="Nhập nội dung bạn muốn gửi cho ứng viên..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </Form.Group>
        </Card.Body>

        <Card.Footer className="d-flex justify-content-between bg-light">
          <Button
            variant="outline-secondary"
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            <FaArrowLeft className="me-2" />
            Quay lại
          </Button>
          <Button variant="warning" onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <Spinner size="sm" animation="border" className="me-2" />
                Đang gửi...
              </>
            ) : (
              <>
                <FaEnvelope className="me-2" />
                Gửi thông báo
              </>
            )}
          </Button>
        </Card.Footer>
      </Card>
    </div>
  );
}

export default ApplicationMessage;
