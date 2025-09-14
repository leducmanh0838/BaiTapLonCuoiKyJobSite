import React from "react";
import { useNavigate } from "react-router-dom";

const GridTagList = ({ tags, link = true }) => {
  const navigate = useNavigate();
  return (
    <div className="d-flex flex-wrap gap-2 py-1">
      {tags.map((tag, index) => (
        <span key={index} className={`px-2 py-1 rounded-pill border border-2 ${link && "btn btn-light"}`} 
        onClick={() => link && navigate(`/search?keyword=${tag}`)}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

export default GridTagList;