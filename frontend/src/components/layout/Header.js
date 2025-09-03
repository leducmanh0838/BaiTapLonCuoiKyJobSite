import { useContext } from "react";
import { AppContext } from "../../configs/AppProvider";
import { getUserRoleByValue, UserRole } from "../../constants/UserRole";
import { Link, useLocation } from "react-router-dom";

const HeaderMenuItem = ({ name, path }) => {
    const location = useLocation(); // Lấy URL hiện tại

    return (
        <>
            <Link
                key={path}
                to={path}
                className={`nav-link ${location.pathname === path ? "fw-bold text-primary border-bottom border-primary" : ""}`}
            >
                {name}
            </Link>
        </>
    )
}

const Header = () => {
    const { currentUser } = useContext(AppContext);

    return (
        <>
            <header className="d-flex align-items-center justify-content-between p-2 m-1 shadow bg-white sticky-top rounded">
                <div className="d-flex">
                    <nav className="nav">
                        <HeaderMenuItem name="Trang chủ" path="/" />
                        {currentUser?.role && currentUser.role === getUserRoleByValue(UserRole.CANDIDATE.value) && <>
                            <HeaderMenuItem name="Quản lý cv" path="/cvs" />
                            <HeaderMenuItem name="Quản lý hồ sơ ứng tuyển" path="/applications" />
                        </>}
                        {currentUser?.role && currentUser.role === getUserRoleByValue(UserRole.EMPLOYER.value) && <>
                            <HeaderMenuItem name="Quản lý tin tuyển dụng" path="/cvs" />
                        </>}
                    </nav>
                    {currentUser?.role === getUserRoleByValue(UserRole.CANDIDATE.value) && <>

                    </>}
                </div>
                <div className="me-2">
                    {currentUser ? <>
                        <button className="btn btn-danger">
                            Đăng xuất
                        </button>
                    </> : <>
                        <button className="btn btn-success">
                            Đăng nhập
                        </button>
                    </>}
                </div>
            </header>
        </>
    )
}

export default Header;