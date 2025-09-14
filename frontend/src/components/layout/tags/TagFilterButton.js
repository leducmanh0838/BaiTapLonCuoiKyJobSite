import { memo, useEffect, useState } from "react";
import SelectedTagLayout from "./SelectedTagLayout"
import Apis, { endpoints } from "../../../configs/Apis";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";
import { FaTag } from "react-icons/fa";

const TagFilterButton = ({ }) => {
    const [selectedTags, setSelectedTags] = useState([]);
    const [isShow, setIsShow] = useState(false);

    return (<>
        <div>
            <div className="btn btn-light d-inline-block" onClick={() => setIsShow(prev => !prev)}>
                <FaTag /> Lọc danh mục: {isShow ? <HiChevronDown size={20} /> : <HiChevronUp size={20} />}
            </div>
        </div>
        <div className="my-2">
            {isShow && <SelectedTagLayout selectedTags={selectedTags} setSelectedTags = {setSelectedTags} />}
        </div>
    </>)
}

export default memo(TagFilterButton);