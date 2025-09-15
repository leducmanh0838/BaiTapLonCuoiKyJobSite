import { useState, useMemo, useEffect, memo } from "react";
import { getTagCategoryByValue } from "../../../constants/TagCategory";
import Apis, { endpoints } from "../../../configs/Apis"

const SelectedTagLayout = ({ selectedTags, setSelectedTags }) => {
  const [tags, setTags] = useState([]);

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

  const toggleTag = (tagName) => {
    setSelectedTags((prev) =>
      prev.includes(tagName) ? prev.filter((name) => name !== tagName) : [...prev, tagName]
    );
  };

  return (
    <div className="card p-3">
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
                className={`btn btn-sm rounded-pill ${selectedTags.includes(tag.name)
                  ? "btn-primary text-white"
                  : "btn-outline-primary"
                  }`}
                onClick={() => toggleTag(tag.name)}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}


export default memo(SelectedTagLayout);