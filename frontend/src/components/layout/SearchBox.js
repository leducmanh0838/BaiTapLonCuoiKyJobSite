import { memo, useState } from "react";
import { useSearchParams } from "react-router-dom";

const SearchBox = () => {
    const [keyword, setKeyword] = useState("");
    const [searchParams, setSearchParams] = useSearchParams();

    const handleSubmit = (e) => {
        e.preventDefault();
        searchParams.set("keyword", keyword);
        setSearchParams(searchParams); // cập nhật param trên URL
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="d-flex container align-items-center gap-2">
                <label htmlFor="searchbox" className="form-label d-inline text-nowrap">
                    Tìm kiếm:
                </label>
                <input
                    autoComplete="off"
                    type="text"
                    className="form-control"
                    id="searchbox"
                    name="searchbox"
                    placeholder="Tiêu đề, công ty, vị trí,..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
            </div>
        </form>
    );
};

export default memo(SearchBox);
