import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { GOOGLE_CLIENT_ID } from "../../configs/env";


const MyGoogleLogin = ({ submitSocialLogin }) => {
    const handleSubmitLogin = async (response) => {
        response?.credential && submitSocialLogin("google", response.credential)
    }

    return (
        <div className="w-100 mb-2  justify-content-center">
            <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                <GoogleLogin
                    onSuccess={handleSubmitLogin}
                    onError={() => console.log("Login thất bại")}
                    width="100%"
                    useOneTap={false}
                    size="large"
                    shape="pill"
                    theme="filled_black"
                />
            </GoogleOAuthProvider>
        </div>
    )
};

export default MyGoogleLogin;