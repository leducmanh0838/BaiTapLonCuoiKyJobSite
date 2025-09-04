import React, { useContext, useEffect, useState } from "react";
import MyGoogleLogin from "./MyGoogleLogin";
import MySpinner from "../layout/MySpinner";
import Apis, { endpoints } from "../../configs/Apis"
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../configs/AppProvider";
import FacebookLogin from "./FacebookLogin";
import { toast } from "react-toastify";
import { DOT_CLIENT_ID, DOT_CLIENT_SECRET } from "../../configs/env";
import FacebookRegister from "./FacebookRegister";
import MyGoogleRegister from "./MyGoogleRegister";
import { UserRole } from "../../constants/UserRole";
import MyAvatar from "../layout/MyAvatar";

const Register = () => {
    const { currentUserDispatch } = useContext(AppContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const [isSocialLogin, setIsSocialLogin] = useState(false);
    const [typeSocialLogin, setTypeSocialLogin] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [socialInfo, setSocialInfo] = useState(null);

    useEffect(() => {
        Object.values(errors).forEach((errMsg) => {
            toast.warning(errMsg);
        });
    }, [JSON.stringify(errors)])

    const [formData, setFormData] = useState({
        role: UserRole.CANDIDATE.value,
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirm: "",
        phone: "",
        avatar: null,
    });

    const isStrongPassword = (password) => {
        const regex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(password);
    };

    const validateForm = () => {
        let newErrors = {};

        if (!formData.first_name.trim()) {
            newErrors.first_name = "Họ không được bỏ trống";
        }
        if (!formData.last_name.trim()) {
            newErrors.last_name = "Tên không được bỏ trống";
        }
        if (!isStrongPassword(formData.password)) {
            newErrors.password =
                "Mật khẩu phải ≥ 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt";
        }
        if (formData.password !== formData.confirm) {
            newErrors.confirm = "Mật khẩu xác nhận không khớp";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // true nếu không có lỗi
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "phone") {
            // Chỉ giữ lại ký tự số
            const onlyNums = value.replace(/\D/g, "");

            // Giới hạn tối đa 12 số
            if (onlyNums.length > 12) return;

            setFormData({
                ...formData,
                [name]: onlyNums,
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleSubmitSystemRegister = async () => {
        if (isSocialLogin) {
            try {
                setLoading(true);
                let res;
                if (typeSocialLogin === "google") {
                    res = await Apis.post(endpoints.auth.googleRegister, { idToken: accessToken, role: formData.role, phone: formData.phone}, {
                        headers: {
                            "Content-Type": "multipart/form-data"
                        }
                    });
                }
                else if (typeSocialLogin === "facebook") {
                    res = await Apis.post(endpoints.auth.facebookRegister, { accessToken, role: formData.role, phone: formData.phone }, {
                        headers: {
                            "Content-Type": "multipart/form-data"
                        }
                    });
                }

                console.info("res.data: ", res.data)

                toast.success("Đăng nhập thành công!")

                currentUserDispatch({
                    "type": "login",
                    "payload": res.data
                });
                navigate("/");
            } catch (error) {
                if (error.response && error.response.data && error.response.data.detail) {
                    // alert(error.response.data.message);
                    toast.warning(error.response.data.detail)
                }
                if (error.response) {
                    console.error("Lỗi backend:", error.response.data);
                } else if (error.request) {
                    console.error("Không nhận được phản hồi từ server:", error.request);
                } else {
                    console.error("Lỗi khi gửi yêu cầu:", error.message);
                }
            } finally {
                setLoading(false)
            }
        } else {
            if (!validateForm()) {
                return;
            }
            try {
                setLoading(true);
                const res = await Apis.post(endpoints.user.list, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });

                toast.success("Đăng ký thành công! vui lòng đăng nhập")

                navigate("/login");
            } catch (error) {
                if (error.response && error.response.data && error.response.data.detail) {
                    // alert(error.response.data.message);
                    toast.warning(error.response.data.detail)
                }
                if (error.response) {
                    console.error("Lỗi backend:", error.response.data);
                } else if (error.request) {
                    console.error("Không nhận được phản hồi từ server:", error.request);
                } else {
                    console.error("Lỗi khi gửi yêu cầu:", error.message);
                }
            } finally {
                setLoading(false)
            }
        }
    }

    const hanldeSubmitSocialRegister = async (typeLogin, accessToken) => {
        console.info("typeLogin: ", typeLogin);
        console.info("accessToken: ", accessToken);

        try {
            if (typeLogin === "facebook") {
                const res = await Apis.post(endpoints.auth.verifyFacebook, { accessToken });
                console.info("res.data: ", res.data)
                setSocialInfo(res.data)
            }
            else if (typeLogin === "google") {
                const res = await Apis.post(endpoints.auth.verifyGoogle, { idToken: accessToken });
                console.info("res.data: ", res.data)
                setSocialInfo(res.data)
            }
            setTypeSocialLogin(typeLogin);
            setAccessToken(accessToken);
            setIsSocialLogin(true);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.detail) {
                // alert(error.response.data.message);
                toast.warning(error.response.data.detail)
            }
            if (error.response) {
                console.error("Lỗi backend:", error.response.data);
            } else if (error.request) {
                console.error("Không nhận được phản hồi từ server:", error.request);
            } else {
                console.error("Lỗi khi gửi yêu cầu:", error.message);
            }
        }
    }


    return (
        <div
            className="d-flex align-items-center justify-content-center"
            style={{
                minHeight: "calc(100vh - 70px)", // 60px = chiều cao header
                background: "linear-gradient(135deg, #667eea, #764ba2)",
            }}
        >
            <div className="card p-4 shadow rounded-4" style={{ width: "800px" }}>
                <h4 className="text-center mb-4 fw-bold">Đăng ký tài khoản</h4>
                {!isSocialLogin ? <>
                    <div className="mb-3 row">
                        <label className="col-sm-3 col-form-label">Họ:</label>
                        <div className="col-sm-9">
                            <input
                                type="text"
                                name="last_name"
                                className="form-control"
                                placeholder="Nhập họ"
                                value={formData.last_name}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="mb-3 row">
                        <label className="col-sm-3 col-form-label">Tên:</label>
                        <div className="col-sm-9">
                            <input
                                type="text"
                                name="first_name"
                                className="form-control"
                                placeholder="Nhập tên"
                                value={formData.first_name}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="mb-3 row">
                        <label className="col-sm-3 col-form-label">Tài khoản:</label>
                        <div className="col-sm-9">
                            <input
                                type="text"
                                name="username"
                                className="form-control"
                                placeholder="Nhập tài khoản"
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="mb-3 row">
                        <label className="col-sm-3 col-form-label">Email:</label>
                        <div className="col-sm-9">
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                placeholder="Nhập email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="mb-3 row">
                        <label className="col-sm-3 col-form-label">Điện thoại:</label>
                        <div className="col-sm-9">
                            <input
                                type="phone"
                                name="phone"
                                className="form-control"
                                placeholder="Nhập điện thoại"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="mb-3 row">
                        <label className="col-sm-3 col-form-label">Mật khẩu:</label>
                        <div className="col-sm-9">
                            <input
                                type="password"
                                name="password"
                                className="form-control"
                                placeholder="Nhập mật khẩu"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="mb-3 row">
                        <label className="col-sm-3 col-form-label">Xác nhận mật khẩu:</label>
                        <div className="col-sm-9">
                            <input
                                type="password"
                                name="confirm"
                                className="form-control"
                                placeholder="Nhập xác nhận mật khẩu"
                                value={formData.confirm}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="mb-3 row">
                        <label className="col-sm-3 col-form-label">Ảnh đại diện:</label>
                        <div className="col-sm-9">
                            <input
                                type="file"
                                name="avatar"
                                className="form-control"
                                accept="image/*"
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        avatar: e.target.files[0], // lấy file
                                    })
                                }
                            />

                            {/* Preview ảnh */}
                            {formData.avatar && (
                                <div className="mt-3">
                                    <img
                                        src={URL.createObjectURL(formData.avatar)}
                                        alt="Preview"
                                        className="img-thumbnail"
                                        style={{ maxWidth: "200px", height: "auto" }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </> : <>
                    <div className="row align-items-center my-3">
                        <div className="col-2">
                            <MyAvatar src={socialInfo.avatar} size={120} />
                        </div>
                        <div className="col-9">
                            <h2>
                                {socialInfo.last_name} {socialInfo.first_name}
                            </h2>
                            <p className="fs-5">
                                {socialInfo.email}
                            </p>
                        </div>
                    </div>

                    <div className="mb-3 row">
                        <label className="col-sm-3 col-form-label">Điện thoại:</label>
                        <div className="col-sm-9">
                            <input
                                type="phone"
                                name="phone"
                                className="form-control"
                                placeholder="Nhập điện thoại"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </>}

                <div className="mb-3 row">
                    <label className="col-sm-3 col-form-label">Chọn vai trò:</label>
                    <div className="col-sm-9 d-flex align-items-center">
                        <div className="form-check me-3">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="role"
                                id="candidate"
                                value="CANDIDATE"
                                checked={formData.role === UserRole.CANDIDATE.value}
                                onChange={handleChange}
                            />
                            <label className="form-check-label" htmlFor="candidate">
                                {UserRole.CANDIDATE.label}
                            </label>
                        </div>
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="role"
                                id="employer"
                                value="EMPLOYER"
                                checked={formData.role === UserRole.EMPLOYER.value}
                                onChange={handleChange}
                            />
                            <label className="form-check-label" htmlFor="employer">
                                {UserRole.EMPLOYER.label}
                            </label>
                        </div>
                    </div>
                </div>


                {/* Button Login */}
                <button className="btn btn-success w-100 rounded-pill mb-3" onClick={handleSubmitSystemRegister}>
                    Đăng ký
                </button>
                {!isSocialLogin && <>
                    <div class="text-center my-1">
                        <span class="position-relative top-n1 px-2 bg-white text-muted">hoặc</span>
                        <hr class="border-1 border-top border-secondary" />
                    </div>
                    {/* Google Login */}
                    {loading ? <MySpinner text="Đang đăng nhập..." /> : <>
                        <MyGoogleRegister submitSocialRegister={hanldeSubmitSocialRegister} />
                        <FacebookRegister submitSocialRegister={hanldeSubmitSocialRegister} />
                    </>}
                </>}

            </div>
        </div>
    );
}

export default Register;
