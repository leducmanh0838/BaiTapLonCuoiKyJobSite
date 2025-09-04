import React, { useContext, useState } from "react";
import MyGoogleLogin from "./MyGoogleLogin";
import MySpinner from "../layout/MySpinner";
import Apis, { endpoints } from "../../configs/Apis"
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../configs/AppProvider";
import FacebookLogin from "./FacebookLogin";
import { toast } from "react-toastify";
import { DOT_CLIENT_ID, DOT_CLIENT_SECRET } from "../../configs/env";

const Login = () => {
    const { currentUserDispatch } = useContext(AppContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        grant_type: "password",
        username: "",
        password: "",
        client_id: DOT_CLIENT_ID,
        client_secret: DOT_CLIENT_SECRET,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmitSystemLogin = async () => {
        try {
            const resToken = await Apis.post(endpoints.auth.token, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            let data = {};
            data["token"] = resToken.data;
            console.info("access_token: ", JSON.stringify(resToken.data.access_token))
            const resCurrentUser = await Apis.get(
                endpoints.user.currentUser,
                {
                    headers: {
                        Authorization: `Bearer ${resToken.data.access_token}`
                    }
                }
            );
            data["current_user"] = resCurrentUser.data;
            console.info("current_user: ", JSON.stringify(resCurrentUser.data))
            console.info("data: ", JSON.stringify(data))

            currentUserDispatch({
                "type": "login",
                "payload": data
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
        }
    }

    const hanldeSubmitSocialLogin = async (typeLogin, accessToken) => {
        console.info("typeLogin: ", typeLogin);
        console.info("accessToken: ", accessToken);

        try {
            setLoading(true);
            let res;
            if (typeLogin === "google") {
                res = await Apis.post(endpoints.auth.googleLogin, { idToken: accessToken });
            }
            else if (typeLogin === "facebook")
                res = await Apis.post(endpoints.auth.facebookLogin, { accessToken });

            // login(res.data);
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
    }


    return (
        <div
            className="d-flex align-items-center justify-content-center"
            style={{
                minHeight: "calc(100vh - 70px)", // 60px = chiều cao header
                background: "linear-gradient(135deg, #667eea, #764ba2)",
            }}
        >
            <div className="card p-4 shadow rounded-4" style={{ width: "450px" }}>
                <h4 className="text-center mb-4 fw-bold">Đăng nhập tài khoản</h4>

                {/* Username */}
                <div className="mb-3">
                    <label className="form-label">Tài khoản</label>
                    <input
                        type="username"
                        name="username"
                        className="form-control"
                        placeholder="Nhập tài khoản"
                        value={formData.username}
                        onChange={handleChange}
                    />
                </div>

                {/* Password */}
                <div className="mb-3">
                    <label className="form-label">Mật khẩu</label>
                    <input
                        type="password"
                        name="password"
                        className="form-control"
                        placeholder="Nhập mật khẩu"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>

                {/* Button Login */}
                <button className="btn btn-success w-100 rounded-pill mb-3" onClick={handleSubmitSystemLogin}>
                    Đăng nhập
                </button>
                <div class="text-center my-3">
                    <span class="position-relative top-n1 px-2 bg-white text-muted">hoặc</span>
                    <hr class="border-1 border-top border-secondary" />
                </div>
                {/* Google Login */}
                {loading ? <MySpinner text="Đang đăng nhập..." /> : <>
                    <MyGoogleLogin submitSocialLogin={hanldeSubmitSocialLogin} />
                    <FacebookLogin submitSocialLogin={hanldeSubmitSocialLogin} />
                </>}
            </div>
        </div>
    );
}

export default Login;
