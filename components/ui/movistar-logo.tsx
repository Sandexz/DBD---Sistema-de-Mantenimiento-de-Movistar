import React from "react";
import Image from "next/image";

interface MovistarLogoProps {
  className?: string;
  variant?: "full" | "icon" | "white";
  width?: number;
  height?: number;
}

export function MovistarLogo({
  className = "h-8 w-auto object-contain",
  variant = "full",
  width,
  height,
  ...props
}: MovistarLogoProps & React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      src="/movistar-logo.png"
      alt="Movistar Logo"
      className={className}
      {...props}
    />
  );
}

