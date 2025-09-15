import { useEffect, useRef, useState } from "react";
import { FaCamera } from "react-icons/fa";
import JoditEditor from 'jodit-react';
import WardDropdown from "../layout/provinces/WardDropdown";
import ProvinceDropdown from "../layout/provinces/ProvinceDropdown";
import DistrictDropdown from "../layout/provinces/DistrictDropdown";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { authApis, endpoints } from "../../configs/Apis";
import SelectedTagLayout from "../layout/tags/SelectedTagLayout";

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
    const [selectedTags, setSelectedTags] = useState([]);
    const [allTags, setAllTags] = useState([]); // Lưu toàn bộ tag từ API

    const [currentFormData, setCurrentFormData] = useState({
        title: "",
        company_name: "",
        salary: "",
        description: defaultTemplate,
        experience: "",
        image: null,
        address: "",
        city_code: null,
        district_code: null,
        ward_code: null,
        deadline: "",
        tags: "",
    });

    // Lấy toàn bộ tag từ API khi mount
    useEffect(() => {
        const fetchTags = async () => {
            try {
                const api = authApis();
                const res = await api.get(endpoints.tags.list);
                setAllTags(res.data);
            } catch (err) {}
        };
        fetchTags();
    }, []);

    useEffect(() => {
        const fetchJobDetail = async () => {
            try {
                if (isEdit) {
                    const api = authApis();
                    console.info("EDIT!!!")
                    const res = await api.get(endpoints.jobPostings.detail(itemId));
                    const data = res.data;
                    console.log("data: ", data)
                    // Nếu data.tags là id, map sang name
                    let tagNames = [];
                    if (Array.isArray(data.tags) && data.tags.length > 0 && allTags.length > 0) {
                        tagNames = data.tags.map(id => {
                            const found = allTags.find(t => t.id === id || t.name === id);
                            return found ? found.name : id;
                        });
                    } else {
                        tagNames = (data.tags || []).map(tag => typeof tag === 'string' ? tag : tag.text || tag.name || "");
                    }
                    setOriginalFormData(JSON.parse(JSON.stringify(data)));
                    setCurrentFormData({
                        ...data,
                        image: data.image || null,
                        deadline: data.deadline ? data.deadline.slice(0, 16) : "",
                        tags: tagNames,
                    });
                    setSelectedTags(data.tags || []);
                }
            } catch (err) {
                toast.error("Không thể tải dữ liệu tin tuyển dụng!");
            }
        };
        fetchJobDetail();
    }, [isEdit, itemId, allTags]);
    console.log("originalFormData: ", originalFormData)
    console.log("currentFormData: ", currentFormData)

    useEffect(() => {
        if (isEdit) {
            console.info("EDIT!!!")
            // Ensure tags is always an array of strings
            const tagTexts = (itemDetail.tags || []).map(tag => typeof tag === 'string' ? tag : tag.text || tag.name || "");
            setOriginalFormData(JSON.parse(JSON.stringify(itemDetail)))
            setCurrentFormData({ ...itemDetail, tags: tagTexts })
            setSelectedTags(tagTexts);
        }
    }, [])

    const handleSubmit = async () => {
        const api = authApis();
        const fd = new FormData();
        fd.append("title", currentFormData.title);
        fd.append("company_name", currentFormData.company_name);
        fd.append("description", currentFormData.description);
        fd.append("salary", currentFormData.salary);
        fd.append("experience", currentFormData.experience || "");
        fd.append("address", currentFormData.address);
        fd.append("city_code", currentFormData.city_code);
        fd.append("district_code", currentFormData.district_code);
        fd.append("ward_code", currentFormData.ward_code);
        fd.append("deadline", currentFormData.deadline);
        fd.append("tags", currentFormData.tags);
        if (currentFormData.image && typeof currentFormData.image !== "string") {
            fd.append("image", currentFormData.image);
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


    useEffect(() => {
        const tagNames = selectedTags.map(id => {
            const found = allTags.find(t => t.id === id || t.name === id);
            return found ? found.name : id;
        });
        setCurrentFormData(prev => ({
            ...prev,
            tags: tagNames
        }));
    }, [selectedTags, allTags]);

    return (<>
        <div className="container">
            <div className="row p-2 flex-column flex-md-row">
                <div className="col-12 col-md-4 mb-3 mb-md-0">
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
                <div className="col-12 col-md-8">
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
                    <div className="row mb-2">
                            <div className="col-12">
                                <div className="form-floating">
                                    <input
                                        autoComplete="off"
                                        type="text"
                                        className="form-control"
                                        id="company_name"
                                        placeholder="Tên công ty"
                                        value={currentFormData.company_name}
                                        onChange={e =>
                                            setCurrentFormData({
                                                ...currentFormData,
                                                company_name: e.target.value,
                                            })
                                        }
                                    />
                                    <label htmlFor="company_name">Tên công ty</label>
                                </div>
                            </div>
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

                    <div className="container mt-3 px-0">
                        <div className="row row-cols-2 mb-2 g-2">
                            <div className="col">
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
                            <div className="col">
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
                            <div className="col">
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
                                                address: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>
                            <div className="col">
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


                        <div className="row mb-2">
                            <div className="col-12">
                                <div className="mb-3">
                                    <SelectedTagLayout selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
                                </div>
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
                                        Đăng tin tuyển dụng
                                    </div>
                                </>}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
        <style>{`
@media (max-width: 768px) {
  .form-floating > label { font-size: 15px; }
  .form-floating > .form-control, .form-floating > .form-select { font-size: 15px; }
  .btn { font-size: 16px; }
  .upload-box { min-height: 180px !important; }
  .jodit-wysiwyg { min-height: 180px !important; font-size: 15px; }
  .container, .row, .col-12, .col-md-4, .col-md-8 { padding-left: 0 !important; padding-right: 0 !important; }
}
`}</style>
    </>)
}

export default JobPostingForm;