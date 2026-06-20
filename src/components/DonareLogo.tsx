/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

interface DonareLogoProps {
  className?: string; // Additional Tailwind styling classes
  iconSize?: string;  // e.g., 'w-7 h-7'
  textSize?: string;  // e.g., 'text-xl'
  textColor?: string; // e.g., 'text-[#0e6a41]' or 'text-emerald-900'
  darkBackground?: boolean;
}

export default function DonareLogo({
  className = "",
  iconSize = "w-7 h-7",
  textSize = "text-[21px]",
  textColor = "text-[#0e6a41]",
  darkBackground = false
}: DonareLogoProps) {
  const brandColor = darkBackground ? "text-white" : textColor;
  const logoColorHex = darkBackground ? "#ffffff" : "#0e6a41";

  return (
    <div className={`flex items-center space-x-2.5 select-none font-sans ${className}`} id="donare-brand-logo">
      {/* Precision engineered vector graphic representing the direct hand-cradled heart model */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${iconSize} transition-transform duration-300 group-hover:scale-105`}
        aria-hidden="true"
      >
        {/* Slevecuff/Wrist */}
        <rect
          x="2"
          y="12"
          width="2"
          height="7"
          rx="1"
          fill={logoColorHex}
        />
        {/* Flat Palm holding heart upward */}
        <path
          d="M5 16h11c1.1 0 2-.9 2-2v-1.5c0-.5-.4-.9-.9-.9s-.9.4-.9.9V14c0 .1-.1.2-.2.2H6.2c-.4 0-.8-.3-.8-.8v-.7c0-.4.3-.8.8-.8h1c.5 0 .9-.4.9-.9V10c0-.5-.4-.9-.9-.9H7c-1.4 0-2.5 1.1-2.5 2.5v1.2c0 1.5 1.2 2.7 2.7 2.7z"
          fill={logoColorHex}
        />
        {/* Heart styled perfectly floating above the palm */}
        <path
          d="M12 9.25c.3 0 .6-.1.8-.3l3.2-3.2c1-1 1-2.6 0-3.6s-2.6-1-3.6 0l-.4.4l-.4-.4c-1-1-2.6-1-3.6 0s-1 2.6 0 3.6l3.2 3.2c.2.2.5.3.8.3z"
          fill={logoColorHex}
        />
      </svg>

      {/* Brand Text */}
      <span className={`font-sans font-bold ${textSize} ${brandColor} tracking-tight leading-none`}>
        Donare
      </span>
    </div>
  );
}
