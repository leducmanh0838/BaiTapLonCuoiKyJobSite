import { useContext } from "react";
import { AppContext } from "../../configs/AppProvider";
import { getUserRoleByValue, UserRole } from "../../constants/UserRole";
import { Link, useNavigate } from "react-router-dom";
import MyAvatar from "../../components/layout/MyAvatar"
import { BiLogOut } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { Dropdown } from "react-bootstrap";
import HeaderMenu from "./HeaderMenu";
import { FaBars } from "react-icons/fa";

const Header = () => {
    const nav = useNavigate();
    const { currentUser, currentUserDispatch } = useContext(AppContext);
    console.info("currentUser: ", JSON.stringify(currentUser))

    return (
        <>
            <header className="d-flex align-items-center justify-content-between p-2 shadow bg-white sticky-top rounded">
                <button
                    className="btn d-md-none me-2 border-0 shadow-sm rounded-circle bg-light p-2 mx-2"
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#mobileSidebar"
                    aria-label="Mở menu"
                >
                    <FaBars size={22} className="text-dark" />
                </button>
                <div className="align-items-center d-none d-md-flex">
                    <div className="d-flex align-items-center me-3" onClick={() => nav("/")}
                        style={{ cursor: "pointer" }}
                    >
                        <img src="/images/logo.jpg"
                            style={{
                                width: 32,
                                height: 32,
                                objectFit: "cover"
                            }}
                        />
                        <div>
                            <span style={{ fontFamily: 'Arial Black', color: '#f57c00' }}>Job</span>
                            <span style={{ fontFamily: 'Pacifico, cursive', color: '#6d4c41' }}>Site</span>
                        </div>
                        {/* <div className="fw-bold ms-2">
                            JobSite
                        </div> */}
                    </div>
                    <nav className="nav d-flex px-3 gap-2">
                        <HeaderMenu/>
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
                                <Dropdown.Item as={Link}>
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