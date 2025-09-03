import { useState } from "react";
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
            <div>
                <input
                    autoComplete="off"
                    type="text"
                    className="form-control"
                    id="searchbox"
                    name="searchbox"
                    placeholder="Tìm kiếm"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
            </div>
        </form>
    );
};

export default SearchBox;
