import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { endpoints } from "../../configs/Apis";
import Apis from "../../configs/Apis";
import { Spinner, Row, Col, Button } from "react-bootstrap";
import {
  FaMapMarkerAlt,
  FaBuilding,
  FaTags,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaUserTie,
  FaCity,
  FaClock,
} from "react-icons/fa";
import GridTagList from "../layout/tags/GridTagList";

const JobPostingDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      try {
        const res = await Apis.get(endpoints.jobPostings.detail(id));
        setJob(res.data);
      } catch (err) {
        setJob(null);
      }
      setLoading(false);
    };
    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container py-5 text-center">
        <h2>Không tìm thấy tin tuyển dụng</h2>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <Row className="g-4 align-items-start">
        <Col md={5} className="text-center">
          <img
            src={job.image || "/images/logo.jpg"}
            alt="job"
            className="img-fluid rounded mb-3"
            style={{
              maxHeight: 320,
              objectFit: "cover",
              borderRadius: 12,
              boxShadow: "0 2px 16px #eee",
              width: "100%",
            }}
          />
        </Col>
        <Col md={7}>
          <h2 className="fw-bold mb-2 text-primary">{job.title}</h2>
          <div className="mb-1 d-flex align-items-center gap-2">
            <FaBuilding className="text-secondary" />
            <span className="fw-bold">Tên công ty:</span> {job.company_name}
          </div>
          <div className="mb-1 d-flex align-items-center gap-2">
            <FaMoneyBillWave className="text-success" />
            <span className="fw-bold">Lương:</span> {job.salary}
          </div>
          <div className="mb-1 d-flex align-items-center gap-2">
            <FaUserTie className="text-info" />
            <span className="fw-bold">Kinh nghiệm:</span> {job.experience}
          </div>
          <div className="mb-1 d-flex align-items-center gap-2">
            <FaMapMarkerAlt className="text-danger" />
            <span className="fw-bold">Địa chỉ:</span> {job.address}
          </div>
          <div className="mb-1 d-flex align-items-center gap-2">
            <FaCity className="text-primary" />
            <span className="fw-bold">Thành phố:</span> {job.city_code}
          </div>
          <div className="mb-1 d-flex align-items-center gap-2">
            <FaClock className="text-warning" />
            <span className="fw-bold">Ngày đăng bài:</span>{" "}
            {job.created_at ? new Date(job.created_at).toLocaleString() : "-"}
          </div>
          <div className="mb-1 d-flex align-items-center gap-2">
            <FaCalendarAlt className="text-primary" />
            <span className="fw-bold">Ngày hết hạn nộp:</span>{" "}
            {job.deadline ? new Date(job.deadline).toLocaleString() : "-"}
          </div>
          <div className="mb-3">
            <GridTagList tags={job.tags || []} />
          </div>
        </Col>
      </Row>
      <div className="mt-4">
        <div className="fw-bold mb-2 d-flex align-items-center gap-2">
          <FaTags className="text-warning" />
          Mô tả:
        </div>
        <div
          className="bg-light p-4 rounded-3 shadow-sm"
          style={{ minHeight: 120, fontSize: 17, lineHeight: 1.7 }}
        >
          <div dangerouslySetInnerHTML={{ __html: job.description }} />
        </div>
      </div>
      <div className="mt-4 text-center">
        <Button
          variant="dark"
          size="lg"
          className="px-5 py-2 rounded-3 fw-bold"
          style={{ fontSize: 20 }}
         onClick={() => nav(`/job-postings/${id}/applications/`)}
        >
          Nộp ứng tuyển
        </Button>
      </div>
    </div>
  );
};

export default JobPostingDetail;
