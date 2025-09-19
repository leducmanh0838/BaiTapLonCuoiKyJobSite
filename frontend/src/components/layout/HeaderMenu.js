import { useLocation, useNavigate } from "react-router-dom";
import { IoHome } from "react-icons/io5";
import { IoHomeOutline } from "react-icons/io5";
import { BsPostcard } from "react-icons/bs";
import { BsPostcardFill } from "react-icons/bs";
import { FaBars, FaFileAlt } from "react-icons/fa";
import { FaRegFileAlt } from "react-icons/fa";
import { MdAccountCircle } from "react-icons/md";
import { MdOutlineAccountCircle } from "react-icons/md";
import { useContext } from "react";
import { AppContext } from "../../configs/AppProvider";
import { UserRole } from "../../constants/UserRole";

const HeaderMenuItem = ({ name, path, iconOutline, icon }) => {
    const location = useLocation(); // Lấy URL hiện tại
    const nav = useNavigate();

    return (
        <>
            <style>
                {`
                    @media (max-width: 768px) {
                        .sidebar-btn {
                        width: 100% !important;
                        }
                    }
                `}
            </style>
            <button onClick={() => nav(path)}
                className="btn d-flex flex-row align-items-center rounded-pill p-0 my-2 sidebar-btn"
                style={{
                    // backgroundColor: '#e8ebedff',
                    backgroundColor: location.pathname === path ? "#0d6efd" : "#e8ebedff",
                    // color: 'white',
                    fontSize: '14px',
                    // fontWeight: 'bold',
                    height: '35px',
                    // width: window.innerWidth <= 768 ? "100%" : "auto",
                }}
            >
                {/* Icon - sát trái */}
                <div
                    className="bg-white d-flex align-items-center justify-content-center rounded-circle ms-0"
                    style={{
                        color: location.pathname === path ? "#0d6efd" : "#000000ff",
                        width: '33px',
                        height: '33px',
                    }}
                >
                    {location.pathname === path ? icon : iconOutline}
                </div>

                {/* Text - chiếm toàn bộ phần còn lại */}
                <div className="flex-grow-1 text-center px-2"
                    style={{
                        color: location.pathname === path ? "#ffffffff" : "#000000ff",
                        fontWeight: location.pathname === path ? "bold" : "",
                    }}
                >
                    {name}
                </div>
            </button>
        </>
    )
}

const HeaderMenu = () => {
    const { currentUser, currentUserDispatch } = useContext(AppContext);
    return (<>
        <HeaderMenuItem name="Trang chủ" path="/" iconOutline={<IoHomeOutline size={20} />} icon={<IoHome size={20} />} />
        {currentUser?.role && currentUser.role === UserRole.CANDIDATE.value && <>
            <HeaderMenuItem name="Quản lý cv" path="/cvs" icon={<MdAccountCircle size={20} />} iconOutline={<MdOutlineAccountCircle size={20} />} />
            <HeaderMenuItem name="Quản lý hồ sơ ứng tuyển" path="/applications" icon={<FaFileAlt size={18} />} iconOutline={<FaRegFileAlt size={18} />} />
        </>}
        {currentUser?.role && currentUser.role === UserRole.EMPLOYER.value && <>
            <HeaderMenuItem name="Quản lý tin tuyển dụng" path="/employer/job-postings" icon={<BsPostcardFill size={20} />} iconOutline={<BsPostcard size={20} />} />
        </>}
    </>
    )
}

export default HeaderMenu;