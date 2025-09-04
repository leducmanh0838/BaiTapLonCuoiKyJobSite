import { useContext } from "react";
import { AppContext } from "../../configs/AppProvider";
import { getUserRoleByValue, UserRole } from "../../constants/UserRole";
import { Link, useLocation, useNavigate } from "react-router-dom";
import MyAvatar from "../../components/layout/MyAvatar"
import { BiLogOut } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { IoHome } from "react-icons/io5";
import { IoHomeOutline } from "react-icons/io5";
import { BsPostcard } from "react-icons/bs";
import { BsPostcardFill } from "react-icons/bs";
import { FaFileAlt } from "react-icons/fa";
import { FaRegFileAlt } from "react-icons/fa";
import { MdAccountCircle } from "react-icons/md";
import { MdOutlineAccountCircle } from "react-icons/md";
import { Dropdown } from "react-bootstrap";






const HeaderMenuItem = ({ name, path, iconOutline, icon }) => {
    const location = useLocation(); // Lấy URL hiện tại
    const nav = useNavigate();

    return (
        <>
            {/* <Link
                key={path}
                to={path}
                className={`nav-link ${location.pathname === path ? "fw-bold text-primary border-bottom border-primary" : ""}`}
            >
                {name}
            </Link> */}
            <button onClick={() => nav(path)}
                className="btn d-flex align-items-center rounded-pill px-0"
                style={{
                    // backgroundColor: '#e8ebedff',
                    backgroundColor: location.pathname === path ? "#0d6efd" : "#e8ebedff",
                    // color: 'white',
                    fontSize: '14px',
                    // fontWeight: 'bold',
                    height: '35px',
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

const Header = () => {
    const nav = useNavigate();
    const { currentUser, currentUserDispatch } = useContext(AppContext);
    console.info("currentUser: ", JSON.stringify(currentUser))

    return (
        <>
            <header className="d-flex align-items-center justify-content-between p-2 m-1 shadow bg-white sticky-top rounded">
                <div className="d-flex align-items-center">
                    <div className="d-flex align-items-center me-3" onClick={() => nav("/")}
                        style={{ cursor: "pointer" }}
                    >
                        <img src="images/logo.jpg"
                            style={{
                                width: 32,
                                height: 32,
                                objectFit: "cover"
                            }}
                        />
                        <div className="fw-bold ms-2">
                            JobHub
                        </div>
                    </div>
                    <nav className="nav d-flex px-3 gap-2">
                        <HeaderMenuItem name="Trang chủ" path="/" iconOutline={<IoHomeOutline size={20} />} icon={<IoHome size={20} />} />
                        {currentUser?.role && currentUser.role === UserRole.CANDIDATE.value && <>
                            <HeaderMenuItem name="Quản lý cv" path="/cvs" icon={<MdAccountCircle size={20} />} iconOutline={<MdOutlineAccountCircle size={20} />} />
                            <HeaderMenuItem name="Quản lý hồ sơ ứng tuyển" path="/applications" icon={<FaFileAlt size={18} />} iconOutline={<FaRegFileAlt size={18} />} />
                        </>}
                        {currentUser?.role && currentUser.role === UserRole.EMPLOYER.value && <>
                            <HeaderMenuItem name="Quản lý tin tuyển dụng" path="/job-postings" icon={<BsPostcardFill size={20} />} iconOutline={<BsPostcard size={20} />} />
                        </>}
                    </nav>
                    {currentUser?.role === getUserRoleByValue(UserRole.CANDIDATE.value) && <>

                    </>}
                </div>
                <div className="me-2">
                    {currentUser ? <>

                        <Dropdown>
                            <Dropdown.Toggle variant="light" className="d-flex align-items-center">
                                <MyAvatar src={currentUser.avatar} />
                                <span className="d-none d-md-inline">
                                    {`${currentUser.last_name} ${currentUser.first_name}`}
                                </span>
                            </Dropdown.Toggle>

                            <Dropdown.Menu className="p-2 shadow" style={{ width: "300px" }}>
                                <Dropdown.Item as={Link} to="/profile">
                                    <div className="d-flex align-items-start">
                                        <MyAvatar src={currentUser.avatar} size={48} />
                                        <div className="flex-grow-1">
                                            <div className="fw-bold">
                                                {`${currentUser.last_name} ${currentUser.first_name}`}
                                            </div>
                                            <div className="text-muted" style={{ fontSize: "0.85rem" }}>
                                                {currentUser.email}
                                            </div>
                                        </div>
                                        <div className="ms-2 text-success">✔️</div>
                                    </div>
                                </Dropdown.Item>
                                <Dropdown.Item className="btn btn-light" onClick={() => nav("/profile")}>
                                    <CgProfile className="me-2" />
                                    <span>Hồ sơ</span>
                                </Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item className="btn btn-light" onClick={() => currentUserDispatch({ type: "logout" })}>
                                    <BiLogOut color="red" className="me-2" />
                                    <span style={{ color: "red" }}>Đăng xuất</span>
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </> : <>
                        <div className="d-flex gap-2">
                            <button className="btn btn-outline-primary" onClick={() => nav("/login")}>
                                Đăng nhập
                            </button>
                            <button className="btn btn-outline-success" onClick={() => nav("/register")}>
                                Đăng ký
                            </button>
                        </div>
                    </>}
                </div>
            </header>
        </>
    )
}

export default Header;