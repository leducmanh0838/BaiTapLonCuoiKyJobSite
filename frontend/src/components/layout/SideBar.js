import HeaderMenu from "./HeaderMenu";

const SideBar = ({ }) => {
    return (
        <>
            <div
                className="offcanvas offcanvas-start"
                tabIndex="-1"
                id="mobileSidebar"
                aria-labelledby="offcanvasLabel"
                style={{
                    visibility: 'visible',
                    width: 'auto', // 75% chiều ngang
                    zIndex: 1045,   // Trên cả header
                    minWidth: '60vw'
                }}
            >

                <div className="offcanvas-header">
                    <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="offcanvas"
                        aria-label="Close"
                    ></button>
                </div>

                <div className="text-center fw-bold fs-4 mb-4 d-flex flex-column align-items-center mx-3">
                    <img src="/images/logo.jpg"
                        style={{
                            width: 80,
                            height: 80,
                            objectFit: "cover"
                        }}
                    />
                    <div>
                        <span style={{ fontFamily: 'Arial Black', color: '#f57c00' }}>Job</span>
                        <span style={{ fontFamily: 'Pacifico, cursive', color: '#6d4c41' }}>Site</span>
                    </div>
                </div>

                <div className="nav d-block px-3 gap-2">
                    <HeaderMenu/>
                </div>

            </div>
        </>
    )
}

export default SideBar;