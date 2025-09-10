import React, { useContext, useEffect, useState } from "react";
import { Button, Card, Row, Col, Spinner } from "react-bootstrap";
import { AppContext } from "../../configs/AppProvider";
import Apis, { endpoints } from "../../configs/Apis";
import { getProvinceNameByCode } from "../../constants/Provinces";
import { useNavigate, useLocation } from "react-router-dom";

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
                const res = await Apis.get(`${endpoints.jobPostings.list}?owner_id=${currentUser.id}`);
                setJobs(res.data.results || res.data || []);
            } catch (err) {
                setJobs([]);
            }
            setLoading(false);
        };
        fetchJobs();
    }, [currentUser]);

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold">Quản lý tin tuyển dụng</h2>
                <Button variant="dark" onClick={() => nav("/employer/job-postings/new")}>Thêm tin tuyển dụng</Button>
            </div>
            {loading ? (
                <div className="text-center my-5"><Spinner animation="border" /></div>
            ) : (
                <Row xs={1} md={2} lg={2} xl={2} className="g-4">
                    {jobs.length === 0 ? (
                        <div className="text-center text-muted">Không có tin tuyển dụng nào.</div>
                    ) : (
                        jobs.map((job) => (
                            <Col key={job.id}>
                                <Card className="h-100 shadow-sm">
                                    <Row className="g-0 align-items-center">
                                        <Col xs={4} className="text-center">
                                            <img
                                                src={job.image || "/images/logo.jpg"}
                                                alt="job"
                                                className="img-fluid rounded-start"
                                                style={{ maxHeight: 180, objectFit: "cover" }}
                                            />
                                        </Col>
                                        <Col xs={8}>
                                            <Card.Body>
                                                <Card.Title className="fw-bold">{job.title || job.name}</Card.Title>
                                                <div>Lương: <b>{job.salary || "-"}</b></div>
                                                <div>Kinh nghiệm: <b>{job.experience || "-"}</b></div>
                                                <div>Địa chỉ: <b>{job.address || "-"}</b></div>
                                                <div>Thành phố: <b>{getProvinceNameByCode(job.city_code) || "-"}</b></div>
                                                <div className="d-flex mt-3 gap-2">
                                                    <Button
                                                      variant="outline-primary"
                                                      size="sm"
                                                      onClick={() => nav(`/employer/job-postings/${job.id}/edit`)}
                                                    >
                                                      Chỉnh sửa
                                                    </Button>
                                                    <Button variant="outline-danger" size="sm">Xóa</Button>
                                                </div>
                                                <Button variant="secondary" size="sm" className="w-100 mt-2">Xem hồ sơ</Button>
                                            </Card.Body>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        ))
                    )}
                </Row>
            )}
        </div>
    );
};

export default JobPostingsManagement;