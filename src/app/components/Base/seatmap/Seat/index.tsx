"use client";

import { useState } from "react";
import { type SeatType } from "@/app/assets/data/seats"; // Adjust the path as necessary

interface SeatProps {
  seat: SeatType;
  handleSeatClick: () => void;
}

export const Seat: React.FC<SeatProps> = ({ seat, handleSeatClick }) => {
  const [hoveredSeat, setHoveredSeat] = useState<SeatType | null>(null);

  // Function to determine the appropriate fill color based on seat status
  const getFillColor = (status: string) => {
    switch (status) {
      case "available":
        return "#00FF00"; // Green for available seats
      case "reserved":
        return "#FF0000"; // Red for reserved seats
      case "selection":
        return "#0000FF"; // Blue for selected seats
      default:
        return "#A0A0A0"; // Gray for other statuses
    }
  };

  return (
    <div
      className="relative cursor-pointer"
      style={{ width: '40px', height: '40px' }} // Fixed seat size
      onClick={handleSeatClick}
      onMouseEnter={() => setHoveredSeat(seat)}
      onMouseLeave={() => setHoveredSeat(null)}
    >
      {/* Rotated SVG by 180 degrees */}
      <svg
        version="1.0"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512.000000 512.000000"
        preserveAspectRatio="xMidYMid meet"
        style={{ transform: "rotate(180deg)", width: '100%', height: '100%' }} // Ensuring the SVG fits within the fixed container size
      >
        <g
          transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
          fill={getFillColor(seat.status)} // Dynamically setting the seat color
          stroke="none"
        >
          <path d="M717 4944 c-354 -64 -640 -354 -702 -711 -13 -77 -15 -304 -13 -1798 3 -1325 6 -1718 16 -1745 23 -68 83 -133 156 -170 64 -32 73 -34 192 -38 l124 -4 7 -27 c30 -127 147 -240 287 -277 76 -20 3476 -20 3552 0 140 37 257 150 287 277 l7 27 124 4 c119 4 128 6 192 38 73 37 133 102 156 170 10 27 13 420 16 1745 2 1494 0 1721 -13 1798 -62 361 -349 649 -710 712 -126 22 -3556 21-3678 -1z m3728 -163 c250 -84 413 -247 497 -496 l23 -70 3 -1726 2 -1725 -23 -44 c-37 -71 -85 -90 -221 -90 -135 0 -187 20 -223 85 l-23 40 0 1191 c0 1171 0 1192 -20 1216 -11 14 -28 28 -38 30 -30 8 -81 -18 -87 -44 -3 -13 -4 -565 -3 -1228 l3 -1205 28 -58 c17 -34 48 -74 77 -99 l48 -41 -14 -40 c-20 -58 -58-102 -112 -134 l-47 -28 -1755 0 -1755 0 -47 28 c-54 32 -92 76 -112 134 l-14 40 48 41 c73 63 103 133 108 249 4 87 3 96 -19 119 -27 29 -68 31 -100 5 -19-15 -23 -30 -28 -102 -7 -103 -29 -145 -91 -176 -38 -20 -60 -23 -156 -23 -136 0 -184 19 -221 90 l-23 44 2 1725 3 1726 23 70 c93 277 309 469 580 515 26 4 850 7 1832 6 l1785 -1 70 -24z" />
          <path d="M887 4309 c-95 -22 -173 -87 -216 -178 l-26 -56 -3 -1440 c-2 -1032 1 -1448 9 -1467 21 -52 102 -58 128 -9 8 14 11 392 11 1216 0 1136 1 1197 18 1190 63 -27 95 -34 160 -35 41 0 72 -3 70 -8 -1 -4 -15 -32 -30 -62 -15 -30 -32 -79 -38 -109 -13 -69 -13 -537 0 -615 28 -171 169 -304 348 -327 88 -11 2396 -11 2484 0 179 23 320 156 348 327 13 78 13 546 0 615 -6 30 -23 79 -38 109 -15 30 -28 58 -30 62 -2 5 29 8 70 8 65 1 97 8 161 35 15 6 17 0 17 -72 0 -70 3 -82 23 -101 33 -31 80 -29 107 5 21 27 21 33 18 353 l-3 325 -26 56 c-33 71 -87 125 -158 158 l-56 26 -1655 2 c-945 0 -1671 -3 -1693 -8z m3336 -153 c39 -16 82 -61 96 -99 6 -16 11 -76 11 -135 0 -124 -17 -174 -71 -213 l-34 -24 -1665 0 -1665 0 -34 24 c-54 39 -71 89 -71 213 0 117 8 149 48 192 55 59 -53 55 1720 56 1365 0 1638 -2 1665 -14z m-363 -652 c54 -25 94 -64 124 -119 20 -38 21 -52 21 -345 0 -294 -1 -306 -22 -345 -12 -22 -36 -54 -55 -72 -70 -67 23 -63 -1368 -63 -1391 0 -1298 -4 -1368 63 -19 18 -43 50 -55 72 -21 39 -22 51 -22 345 0 293 1 307 21 345 39 73 94 116 171 134 22 5 569 8 1273 8 1233 -2 1235 -2 1280 -23z" />
        </g>
      </svg>

      {/* Tooltip */}
      {hoveredSeat?.id === seat.id && (
        <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded px-3 py-1.5 z-50 text-nowrap font-light capitalize">
          {seat.status === "available" ? `Koltuk: ${seat.title}` : seat.status}
        </div>
      )}
    </div>
  );
};
