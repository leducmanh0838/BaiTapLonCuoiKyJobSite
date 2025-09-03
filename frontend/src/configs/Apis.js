import axios from "axios"
import { BASE_URL } from "./env";
import cookie from "react-cookies"
/*
LƯU Ý!!!
Không được tự ý sửa code này, nếu sửa code thì ảnh hưởng chung đến dự án
Nếu có lỗi thì nhớ nhắn với Lê Đức Mạnh
Cách gọi:
gọi lấy danh sách GET cvs/: Apis.get(endpoints.cvs.list)
gọi lấy chi tiết GET cvs/{id}: Apis.get(endpoints.cvs.detail(id))
thêm CV POST cvs/: Apis.post(endpoints.cvs.list)
chỉnh sửa PATCH cvs/{id}: Apis.patch(endpoints.cvs.detail(id))
xóa DELETE cvs/{id}: Apis.delete(endpoints.cvs.detail(id))
*/

export const endpoints = {
    auth: {
        googleLogin: 'api/auth/google-login/',
        facebookLogin: 'api/auth/facebook-login/',
        token: 'o/token/',
    },
    cvs: {
        list: 'api/cvs/',
        detail: (id) => `api/cvs/${id}/`,
    },
    applications: {
        list: 'api/applications/',
        detail: (id) => `api/applications/${id}/`,
    },
    jobPosting: {
        list: 'api/job-postings/',
        detail: (id) => `api/job-postings/${id}/`,
        applications: {
            list: (jobPostingId) => `api/job-postings/${jobPostingId}/applications/`,
            detail: (jobPostingId, applicationId) => `api/job-postings/${jobPostingId}/applications/${applicationId}/`,
        },
    },
};

export const authApis = () => {
    const token = cookie.load('token')
    const accessToken = token?.access_token; 
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
}

export default axios.create({
    baseURL: BASE_URL
})