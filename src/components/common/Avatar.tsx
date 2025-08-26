// components/common/Avatar.tsx
import React from "react";
import { getUserImageUrl } from "../../utils/getUserImageUrl";

interface AvatarProps {
  imageUrl?: string | null;
  alt?: string;
  size?: number;   // px size (default 40)
  rounded?: "full" | "lg" | "md" | "none"; // control border radius
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  imageUrl,
  alt = "User avatar",
  size = 40,
  rounded = "full",
  className = "",
}) => {
  const url = getUserImageUrl(imageUrl);

  const roundedClass =
    rounded === "full"
      ? "rounded-full"
      : rounded === "lg"
      ? "rounded-lg"
      : rounded === "md"
      ? "rounded-md"
      : "rounded-none";

  return (
    <img
      src={url}
      alt={alt}
      width={size}
      height={size}
      className={`object-cover ${roundedClass} ${className}`}
      style={{ width: size, height: size }}
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).src = "/default-avatar.png";
      }}
    />
  );
};

export default Avatar;
