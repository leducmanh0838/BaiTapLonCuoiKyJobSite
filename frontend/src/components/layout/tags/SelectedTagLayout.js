import { useState, useMemo, useEffect, memo } from "react";
import { getTagCategoryByValue } from "../../../constants/TagCategory";
import { FaTag } from "react-icons/fa";
import Apis, { endpoints } from "../../../configs/Apis"
import { useSearchParams } from "react-router-dom";

const SelectedTagLayout = ({ selectedTags, setSelectedTags }) => {
  // const [selectedTags, setSelectedTags] = useState([]);
  const [tags, setTags] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const groupedTags = useMemo(() => {

    return tags.reduce((acc, tag) => {
      if (!acc[tag.category]) acc[tag.category] = [];
      acc[tag.category].push(tag);
      return acc;
    }, {});
  }, [JSON.stringify(tags)]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await Apis(endpoints.tags.list)
        console.info("res.data: ", JSON.stringify(res.data))
        setTags(res.data);
      } catch (err) {

      }
    }
    fetchData();
  }, [])

  const toggleTag = (tagId) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const resetFilters = () => setSelectedTags([]);
  const applyFilters = () => {
    // const params = new URLSearchParams(window.location.search);

    // // Xóa hết tags cũ
    // params.delete("tags");

    // // Thêm tags mới
    // selectedTags.forEach((id) => {
    //   params.append("tags", id);
    // });

    // // Update URL mà không reload trang
    // const newUrl = `${window.location.pathname}?${params.toString()}`;
    // window.history.replaceState({}, "", newUrl);

    // console.log("URL mới:", newUrl);
    const newParams = new URLSearchParams(searchParams);

    // Xóa hết tags cũ
    newParams.delete("tags");

    // Thêm tags mới
    selectedTags.forEach((id) => {
      newParams.append("tags", id);
    });

    setSearchParams(newParams);
  };

  return (
    <div className="card shadow p-3">
      {Object.entries(groupedTags).map(([category, tags]) => (
        <div key={category} className="mb-3">
          {/* <p className="fw-medium mb-1">{getTagCategoryByValue(category).label}</p> */}
          <div className="d-flex align-items-center mb-2">
            <span className="">{getTagCategoryByValue(category).label}</span>
            <div className="flex-grow-1 border-bottom ms-2"></div>
          </div>
          <div className="d-flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                className={`btn btn-sm rounded-pill ${selectedTags.includes(tag.id)
                  ? "btn-primary text-white"
                  : "btn-outline-primary"
                  }`}
                onClick={() => toggleTag(tag.id)}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* <div className="d-flex justify-content-end mt-3 gap-3">
        <button className="btn btn-light" onClick={resetFilters}>
          Làm mới
        </button>
        <button className="btn btn-success" onClick={applyFilters}>
          Áp dụng bộ lọc
        </button>
      </div> */}
    </div>
  );
}


export default memo(SelectedTagLayout);