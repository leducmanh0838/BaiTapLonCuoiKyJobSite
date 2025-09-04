import React from "react";

const MySpinner = ({ size = "md", text = "Đang tải dữ liệu..." }) => {
  const sizeClass = {
    sm: "spinner-border spinner-border-sm",
    md: "spinner-border",
    lg: "spinner-border",
  };

  const sizeStyle = {
    sm: { width: "1.5rem", height: "1.5rem" },
    md: { width: "2rem", height: "2rem" },
    lg: { width: "3rem", height: "3rem" },
  };

  const className = sizeClass[size] || sizeClass["md"];
  const style = sizeStyle[size] || sizeStyle["md"];

  return (
    <div className="d-flex flex-column align-items-center justify-content-center my-4">
      <div className={className} style={style} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      {text && <p className="mt-2 text-muted">{text}</p>}
    </div>
  );
};

export default React.memo(MySpinner);