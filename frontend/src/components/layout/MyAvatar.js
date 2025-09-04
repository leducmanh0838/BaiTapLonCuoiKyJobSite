// src/components/Avatar/index.jsx
import React from "react";

const MyAvatar = ({ src, alt = "Avatar", size = 32, className = "", ...rest }) => {
  return (
    <img
      src={src ? src : "/images/default_avatar.jpg"}
      onError={(e) => { e.currentTarget.src = "/images/default_avatar.jpg" }}
      alt={alt}
      className={`rounded-circle me-2 ${className}`}
      style={{
        width: size,
        height: size,
        objectFit: "cover",
      }}
      {...rest}
    />
  );
};

export default React.memo(MyAvatar);