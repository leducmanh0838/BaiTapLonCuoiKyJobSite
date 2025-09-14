import { useEffect, useRef, useState } from "react";
import { FaCamera } from "react-icons/fa";
import JoditEditor from 'jodit-react';
import WardDropdown from "../layout/provinces/WardDropdown";
import ProvinceDropdown from "../layout/provinces/ProvinceDropdown";
import DistrictDropdown from "../layout/provinces/DistrictDropdown";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { authApis, endpoints } from "../../configs/Apis";

const itemDetail = {
    title: "Tiêu đề cần chỉnh sửa",
    // field1: "Trường 1 cần chỉnh sửa",
    salary: "5-10 triệu",
    experience: "1-2 năm",
    description: `
        <b>Mô tả công việc</b>
        <ul>
        <li>Lập trình Python</li>
        <li>Nhiệt tình</li>
        <li>Chăm sóc khách hàng</li>
        </ul>
        <b>Yêu cầu ứng viên</b>
        <ul>
        <li>Học giỏi</li>
        <li>Teamwork tốt</li>
+        </ul>
    `,
    image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
    address: "Địa chỉ cần chỉnh sửa",
    city_code: 1,
    district_code: 1,
    ward_code: 1,
}

const JobPostingForm = ({ }) => {
    const editor = useRef(null);
    const nav = useNavigate();
    const defaultTemplate = `
        <b>Mô tả công việc</b>
        <ul>
        <li>Mô tả 1</li>
        <li>Mô tả 2</li>
        <li>Mô tả 3</li>
        </ul>
        <b>Yêu cầu ứng viên</b>
        <ul>
        <li>Yêu cầu 1</li>
        <li>Yêu cầu 2</li>
        <li>Yêu cầu 3</li>
        </ul>
    `;

    const { itemId } = useParams(); // lấy id
    console.info("itemId: ", itemId)
    const isEdit = !!itemId; //trang này có phải là chỉnh sửa không?
    const [originalFormData, setOriginalFormData] = useState(null)

    const [currentFormData, setCurrentFormData] = useState({
        title: "",
        salary: "",
        description: defaultTemplate,
        experience: "",
        image: null,
        address: "",
        city_code: null,
        district_code: null,
        ward_code: null,
    });

    useEffect(() => {
        const fetchJobDetail = async () => {
            try {
                if (isEdit) {
                    const api = authApis();
                    console.info("EDIT!!!")
                    const res = await api.get(endpoints.jobPostings.detail(itemId));
                    const data = res.data;
                    console.log("data: ", data)
                    setOriginalFormData(JSON.parse(JSON.stringify(data)));
                    setCurrentFormData({
                        ...data,
                        image: data.image || null, // giữ nguyên link ảnh nếu có
                        deadline: data.deadline ? data.deadline.slice(0, 16) : "", // chuyển về dạng datetime-local nếu có
                    });
                }
            } catch (err) {
                toast.error("Không thể tải dữ liệu tin tuyển dụng!");
            }
        };
        fetchJobDetail();
    }, [isEdit, itemId]);
    console.log("originalFormData: ", originalFormData)
    console.log("currentFormData: ", currentFormData)

    useEffect(() => {
        if (isEdit) {
            console.info("EDIT!!!")
            // lấy dữ liệu chi tiết từ id
            // JSON.parse(JSON.stringify(...)) để clone và tránh lưu tham chiếu
            
            setOriginalFormData(JSON.parse(JSON.stringify(itemDetail)))
            setCurrentFormData(JSON.parse(JSON.stringify(itemDetail)))
        }
    }, [])

    const handleSubmit = async () => {
        const api = authApis();
        const fd = new FormData();
        fd.append("title", currentFormData.title);
        fd.append("description", currentFormData.description);
        fd.append("salary", currentFormData.salary);
        fd.append("experience", currentFormData.experience || ""); // nếu có
        fd.append("address", currentFormData.address);
        fd.append("city_code", currentFormData.city_code);
        fd.append("district_code", currentFormData.district_code);
        fd.append("ward_code", currentFormData.ward_code);
        fd.append("deadline", currentFormData.deadline); // nên chuyển về ISO nếu dùng datetime-local
        if (currentFormData.image && typeof currentFormData.image !== "string") {
            fd.append("image", currentFormData.image); // chỉ gửi file mới, không gửi link string
        }

        try {
            if (isEdit) {
                await api.patch(endpoints.jobPostings.detail(itemId), fd, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                toast.success("Cập nhật tin tuyển dụng thành công!");
            } else {
                await api.post(endpoints.jobPostings.list, fd, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                toast.success("Tạo tin tuyển dụng thành công!");
            }
            nav("/employer/job-postings");
        } catch (err) {
            toast.error("Có lỗi xảy ra khi gửi dữ liệu!");
        }
    };

    return (<>
        <div className="container">

            <div className="row p-2">
                <div className="col-4">
                    {/* <img src={item.image} className="img-fluid" style={{ width: '100%', maxHeight: '600px', objectFit: 'cover' }}/> */}
                    <div>
                        <input
                            type="file"
                            accept="image/*"
                            id="main-image"
                            className="d-none"
                            onChange={(e) =>
                                setCurrentFormData({
                                    ...currentFormData,
                                    image: e.target.files[0], // lấy file
                                })
                            }
                        />

                        <label
                            htmlFor="main-image"
                            className="upload-box"
                            style={{
                                display: "flex",
                                // justifyContent: "center",
                                // alignItems: "center",
                                // backgroundColor: "#faf8f5",
                                // border: "2px dashed #ddd",
                                // borderRadius: "12px",
                                width: '100%',
                                objectFit: 'cover',
                                cursor: "pointer",
                            }}
                        >
                            {currentFormData.image ? (
                                <img className="rounded-3 border border-1"
                                    src={
                                        typeof currentFormData.image === "string"
                                            ? currentFormData.image
                                            : currentFormData.image
                                                ? URL.createObjectURL(currentFormData.image)
                                                : ""
                                    }
                                    alt="Ảnh chính"
                                    style={{ width: '100%', objectFit: "cover" }}
                                />
                            ) : (
                                <div className="w-100 d-flex align-items-center justify-content-center rounded-3"
                                    style={{
                                        backgroundColor: "#faf8f5",
                                        border: "2px dashed #ddd",
                                        minHeight: '300px'
                                    }}
                                >
                                    <FaCamera size={60} color="#ccc" />
                                </div>
                            )}
                        </label>
                    </div>
                </div>
                <div className="col-8">
                    <div className="form-floating">
                        <input
                            autoComplete="off"
                            type="text"
                            className="form-control fs-4 fw-bold mb-3"
                            id="title"
                            placeholder="placeholder"
                            value={currentFormData.title}
                            onChange={(e) =>
                                setCurrentFormData({
                                    ...currentFormData,
                                    title: e.target.value, // lấy file
                                })
                            }
                        // onBlur={onBlur}
                        // onFocus={onFocus}
                        // {...rest}
                        />
                        <label htmlFor="title" >Tiêu đề</label>
                    </div>
                    {/* <div className="form-floating">
                        <input
                            autoComplete="off"
                            type="text"
                            className="form-control mb-2"
                            id="field1"
                            placeholder="placeholder"
                            value={currentFormData.field1}
                            onChange={(e) =>
                                setCurrentFormData({
                                    ...currentFormData,
                                    field1: e.target.value, // lấy file
                                })
                            }
                        />
                        <label htmlFor="field1" >Trường 1</label>
                    </div> */}
                    <div className="form-floating mb-2">
                        <input
                            autoComplete="off"
                            type="text"
                            className="form-control"
                            id="salary"
                            placeholder="Lương"
                            value={currentFormData.salary}
                            onChange={e =>
                                setCurrentFormData({
                                    ...currentFormData,
                                    salary: e.target.value,
                                })
                            }
                        />
                        <label htmlFor="salary">Lương</label>
                    </div>

                    <div className="form-floating mb-2">
                        <input
                            autoComplete="off"
                            type="text"
                            className="form-control"
                            id="experience"
                            placeholder="Kinh nghiệm"
                            value={currentFormData.experience || ""}
                            onChange={e =>
                                setCurrentFormData({
                                    ...currentFormData,
                                    experience: e.target.value,
                                })
                            }
                        />
                        <label htmlFor="experience">Kinh nghiệm</label>
                    </div>

                    <div className="form-floating mb-2">
                        <input
                            type="datetime-local"
                            className="form-control"
                            id="deadline"
                            placeholder="Deadline"
                            value={currentFormData.deadline || ""}
                            onChange={e =>
                                setCurrentFormData({
                                    ...currentFormData,
                                    deadline: e.target.value,
                                })
                            }
                        />
                        <label htmlFor="deadline">Deadline</label>
                    </div>

                    <JoditEditor
                        ref={editor}
                        value={currentFormData.description}
                        config={{
                            readonly: false,
                            height: 400,
                            cleanHTML: {
                                // giữ lại các thẻ được phép
                                allowTags: 'p,b,i,u,em,strong,a,ul,ol,li,br,span',
                                removeEmptyElements: true
                            },
                            // Cho phép attribute nhất định
                            iframe: false,
                            placeholder: "Nhập nội dung ở đây...",
                            defaultActionOnPaste: "insert_as_html",
                            askBeforePasteFromWord: false,
                            askBeforePasteHTML: false,
                            pasteFromWord: true,
                        }}
                        onBlur={(newContent) =>
                            setCurrentFormData({
                                ...currentFormData,
                                description: newContent,
                            })
                        }
                    />

                    <div className="container mt-3">
                        <div className="row mb-2">
                            <div className="col-6">
                                <ProvinceDropdown
                                    selectedCode={currentFormData.city_code}
                                    setSelectedCode={(cityCode) =>
                                        setCurrentFormData((prev) => ({
                                            ...prev,
                                            city_code: cityCode
                                        }))
                                    }
                                />
                            </div>
                            <div className="col-6">
                                <DistrictDropdown
                                    cityCode={currentFormData.city_code}
                                    selectedCode={currentFormData.district_code}
                                    setSelectedCode={(districtCode) =>
                                        setCurrentFormData((prev) => ({
                                            ...prev,
                                            district_code: districtCode
                                        }))
                                    }
                                />
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col-6">
                                <div className="d-flex align-items-center">
                                    <label htmlFor="addresss" className="form-label d-inline text-nowrap mx-3 me-2">
                                        Địa chỉ:
                                    </label>
                                    <input
                                        autoComplete="off"
                                        type="text"
                                        className="form-control"
                                        id="addresss"
                                        placeholder="Số nhà 1 Đường 123"
                                        value={currentFormData.address}
                                        onChange={(e) =>
                                            setCurrentFormData({
                                                ...currentFormData,
                                                address: e.target.value, // lấy file
                                            })
                                        }
                                    />
                                </div>
                            </div>
                            <div className="col-6">
                                <WardDropdown
                                    districtCode={currentFormData.district_code}
                                    selectedCode={currentFormData.ward_code}
                                    setSelectedCode={(wardCode) =>
                                        setCurrentFormData((prev) => ({
                                            ...prev,
                                            ward_code: wardCode
                                        }))
                                    }
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col d-flex justify-content-end mt-2">
                                {isEdit ? <>
                                    <div className="btn btn-success" onClick={handleSubmit}>
                                        Chỉnh sửa
                                    </div>
                                </> : <>
                                    <div className="btn btn-primary" onClick={handleSubmit}>
                                        Thêm
                                    </div>
                                </>}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </>)
}

export default JobPostingForm;