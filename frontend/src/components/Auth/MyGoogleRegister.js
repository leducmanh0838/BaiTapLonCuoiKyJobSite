import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { GOOGLE_CLIENT_ID } from "../../configs/env";


const MyGoogleRegister = ({ submitSocialRegister }) => {
    const handleSubmit = async (response) => {
        response?.credential && submitSocialRegister("google", response.credential)
    }

    return (
        <div className="w-100 mb-2  justify-content-center">
            <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                <GoogleLogin
                    onSuccess={handleSubmit}
                    onError={() => console.log("Đăng ký thất bại")}
                    width="100%"
                    useOneTap={false}
                    size="large"
                    shape="pill"
                    theme="filled_black"
                    text="signup_with"
                />
            </GoogleOAuthProvider>
        </div>
    )
};

export default MyGoogleRegister;