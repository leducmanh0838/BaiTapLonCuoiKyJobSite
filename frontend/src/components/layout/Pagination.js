import { useSearchParams } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Pagination = ({ totalPages }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const pageFromUrl = parseInt(searchParams.get("page")) || 1; // mặc định 1 nếu không có page

    const handleClick = (page) => {
        if (page < 1 || page > totalPages) return; // tránh vượt giới hạn
        searchParams.set("page", page);
        setSearchParams(searchParams);
    };

    return (
        <nav>
            <ul className="pagination justify-content-center">

                {/* Nút Previous */}
                <li className={`page-item ${pageFromUrl === 1 ? "disabled" : ""}`}>
                    <button
                        className="page-link"
                        onClick={() => handleClick(pageFromUrl - 1)}
                        disabled={pageFromUrl === 1}
                    >
                        <FaChevronLeft />
                    </button>
                </li>

                {/* Các trang */}
                {Array.from({ length: totalPages }, (_, index) => {
                    const page = index + 1;
                    return (
                        <li
                            key={page}
                            className={`page-item ${pageFromUrl === page ? "active" : ""}`}
                        >
                            <button
                                className="page-link"
                                onClick={() => handleClick(page)}
                            >
                                {page}
                            </button>
                        </li>
                    );
                })}

                {/* Nút Next */}
                <li className={`page-item ${pageFromUrl === totalPages ? "disabled" : ""}`}>
                    <button
                        className="page-link"
                        onClick={() => handleClick(pageFromUrl + 1)}
                        disabled={pageFromUrl === totalPages}
                    >
                        <FaChevronRight/>
                    </button>
                </li>

            </ul>
        </nav>
    );
};

export default Pagination;