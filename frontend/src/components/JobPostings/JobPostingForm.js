import React, { useEffect, useRef, useState, useContext } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import JoditEditor from "jodit-react";
import { toast } from "react-toastify";
import { authApis, endpoints } from "../../configs/Apis";
import { AppContext } from "../../configs/AppProvider";
import ProvinceDropdown from "../layout/provinces/ProvinceDropdown";
import DistrictDropdown from "../layout/provinces/DistrictDropdown";
import WardDropdown from "../layout/provinces/WardDropdown";

const JobPostingForm = () => {
  const { itemId } = useParams();
  const isEdit = !!itemId;
  const nav = useNavigate();
  const editor = useRef(null);
  const { currentUser } = useContext(AppContext);

  const location = useLocation();
  const job = location.state?.job;

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    salary: "",
    experience: "",
    address: "",
    city_code: "",
    district_code: "",
    ward_code: "",
    deadline: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Lấy địa chỉ từ currentUser (nếu có)
  useEffect(() => {
    if (currentUser) {
      setForm((prev) => ({
        ...prev,
        address: currentUser.address || "",
        city_code: currentUser.city_code || "",
        district_code: currentUser.district_code || "",
        ward_code: currentUser.ward_code || "",
      }));
    }
  }, [currentUser]);
  
  useEffect(() => {
    if(!isEdit && job) {
    if (job) {
      setForm({
        title: job.title || "",
        description: job.description || "",
        salary: job.salary || "",
        experience: job.experience || "",
        address: job.address || "",
        city_code: job.city_code || "",
        district_code: job.district_code || "",
        ward_code: job.ward_code || "",
        deadline: job.deadline ? job.deadline.slice(0, 16) : "",
      });
      setImagePreview(job.image || null);
    } else {
      const fetchDetail = async () => {
        setLoading(true);
        try {
          const api = authApis();
          const res = await api.get(endpoints.jobPostings.detail(itemId));
          const data = res.data;
          setForm({
            title: data.title || "",
            description: data.description || "",
            salary: data.salary || "",
            experience: data.experience || "",
            address: data.address || "",
            city_code: data.city_code || "",
            district_code: data.district_code || "",
            ward_code: data.ward_code || "",
            deadline: data.deadline ? data.deadline.slice(0, 16) : "",
          });
          setImagePreview(data.image || null);
        } catch (err) {
          console.error(err);
          toast.error("Không thể tải dữ liệu tin tuyển dụng.");
        } finally {
          setLoading(false);
        }
      };
      fetchDetail();
    }
  }}, [isEdit, itemId, job]);
  console.log(form);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "city_code" ? { district_code: "", ward_code: "" } : {}),
      ...(name === "district_code" ? { ward_code: "" } : {}),
    }));
  };

  const handleProvinceChange = (code) => {
    setForm((prev) => ({
      ...prev,
      city_code: code,
      district_code: "",
      ward_code: "",
    }));
  };

  const handleDistrictChange = (code) => {
    setForm((prev) => ({
      ...prev,
      district_code: code,
      ward_code: "",
    }));
  };

  const handleWardChange = (code) => {
    setForm((prev) => ({
      ...prev,
      ward_code: code,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const api = authApis();
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("salary", form.salary);
      fd.append("experience", form.experience);
      fd.append("address", form.address);
      if (form.city_code) fd.append("city_code", form.city_code);
      if (form.district_code) fd.append("district_code", form.district_code);
      if (form.ward_code) fd.append("ward_code", form.ward_code);
      if (form.deadline) fd.append("deadline", form.deadline);
      if (imageFile) fd.append("image", imageFile);

      if (isEdit) {
        await api.patch(endpoints.jobPostings.detail(itemId), fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Cập nhật tin tuyển dụng thành công.");
      } else {
        await api.post(endpoints.jobPostings.list, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Tạo tin tuyển dụng thành công.");
      }
      nav("/employer/job-postings/");
    } catch (err) {
      console.error(err);
      toast.error("Có lỗi xảy ra khi gửi dữ liệu.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (isEdit && job) {
      setForm({
        title: job.title || "",
        description: job.description || "",
        salary: job.salary || "",
        experience: job.experience || "",
        address: job.address || "",
        city_code: job.city_code || "",
        district_code: job.district_code || "",
        ward_code: job.ward_code || "",
        deadline: job.deadline ? job.deadline.slice(0, 16) : "",
      });
      setImagePreview(job.image || null);
    }
  }, [isEdit, job]);

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h3 className="mb-4">
        {!isEdit ? "Chỉnh sửa tin tuyển dụng" : "Thêm tin tuyển dụng"}
      </h3>
      <Form onSubmit={handleSubmit}>
        <Row className="g-4">
          <Col md={4}>
            <div
              style={{
                border: "1px dashed #ddd",
                borderRadius: 6,
                padding: 12,
                minHeight: 260,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#fafafa",
              }}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="preview"
                  className="img-fluid"
                  style={{ maxHeight: 220, objectFit: "cover" }}
                />
              ) : (
                <div className="text-muted text-center">
                  <div style={{ fontSize: 40 }}>📷</div>
                  <div>Ảnh đại diện công việc</div>
                </div>
              )}
            </div>
            <Form.Group className="mt-2">
              <Form.Label>Upload ảnh</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </Form.Group>
          </Col>

          <Col md={8}>
            <Form.Group className="mb-2">
              <Form.Label>Tiêu đề</Form.Label>
              <Form.Control
                name="title"
                value={form.title}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Lương</Form.Label>
              <Form.Control
                name="salary"
                value={form.salary}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Kinh nghiệm</Form.Label>
              <Form.Control
                name="experience"
                value={form.experience}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Mô tả</Form.Label>
              <JoditEditor
                ref={editor}
                value={form.description}
                tabIndex={1}
                onBlur={(newContent) =>
                  setForm((prev) => ({ ...prev, description: newContent }))
                }
              />
            </Form.Group>

            <Row className="mt-3">
              <Col md={4}>
                <ProvinceDropdown
                  selectedCode={form.city_code}
                  setSelectedCode={handleProvinceChange}
                />
              </Col>
              <Col md={4}>
                <DistrictDropdown
                  cityCode={form.city_code}
                  selectedCode={form.district_code}
                  setSelectedCode={handleDistrictChange}
                />
              </Col>
              <Col md={4}>
                <WardDropdown
                  districtCode={form.district_code}
                  selectedCode={form.ward_code}
                  setSelectedCode={handleWardChange}
                />
              </Col>
            </Row>

            <Form.Group className="mb-2 mt-2">
              <Form.Label>Địa chỉ</Form.Label>
              <Form.Control
                name="address"
                value={form.address}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Deadline</Form.Label>
              <Form.Control
                type="datetime-local"
                name="deadline"
                value={form.deadline ? form.deadline.slice(0, 16) : ""}
                onChange={handleInputChange}
                placeholder="Chọn ngày và giờ"
              />
            </Form.Group>

            <div className="d-flex gap-2 mt-3">
              <Button type="submit" disabled={submitting}>
                {submitting ? "Đang gửi..." : isEdit ? "Cập nhật" : "Thêm"}
              </Button>
              <Button
                variant="secondary"
                onClick={() => nav(-1)}
                disabled={submitting}
              >
                Hủy
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default JobPostingForm;
