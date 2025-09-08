import axios from "axios"
import { BASE_URL } from "./env";
import cookie from "react-cookies"
/*
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
        googleRegister: 'api/auth/google-register/',
        facebookRegister: 'api/auth/facebook-register/',
        verifyFacebook: 'api/auth/verify-facebook/',
        verifyGoogle: 'api/auth/verify-google/',
        token: 'o/token/',
    },
    user: {
        currentUser: 'api/users/current-user/',
        list:'api/users/',
    },
    cvs: {
        list: 'api/cvs/',
        detail: (id) => `api/cvs/${id}/`,
    },
    applications: {
        list: 'api/applications/',
        detail: (id) => `api/applications/${id}/`,
    },
    tags: {
        list: 'api/tags/',
    },
    jobPostings: {
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