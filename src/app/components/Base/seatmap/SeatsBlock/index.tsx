"use client";

import React, { useState } from "react";
import { Seat } from "../Seat";
import { type SeatType } from "@/app/assets/data/seats";

interface SeatsBlockProps {
  seatData: SeatType[][];
  onSelectionChange: (selectedSeats: SeatType[]) => void;
  maxSelection?: number; // New prop to define the maximum number of selectable seats
}

export const SeatsBlock: React.FC<SeatsBlockProps> = ({
  seatData,
  onSelectionChange,
  maxSelection,
}) => {
  const [seats, setSeats] = useState<SeatType[][]>(seatData);

  // Handle seat selection without using `useEffect`
  const handleSeatClick = (rowIdx: number, seatIdx: number) => {
    const selectedSeatsCount = seats
      .flat()
      .filter((seat) => seat.status === "selection").length;

    const newSeats = seats.map((row, rIdx) =>
      row.map((seat, sIdx) => {
        if (rIdx === rowIdx && sIdx === seatIdx) {
          if (seat.status === "selection") {
            // Deselect the seat if already selected
            return { ...seat, status: "available" };
          } else if (seat.status === "available" && (!maxSelection || selectedSeatsCount < maxSelection)) {
            // Select the seat if it does not exceed the limit
            return { ...seat, status: "selection" };
          }
        }
        return seat;
      })
    );

    setSeats(newSeats);

    // Call the `onSelectionChange` callback outside `useEffect`
    const selectedSeats = newSeats.flat().filter((seat) => seat.status === "selection");
    onSelectionChange(selectedSeats);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="relative mt-20 w-full overflow-x-auto">
        {seats.map((row, rowIdx) => (
          <div
            key={rowIdx}
            className="flex items-center justify-center space-x-2 my-2"
          >
            <p className="w-6 h-6 p-5 flex items-center justify-center">
              {row[0]?.row}
            </p>
            {row.map((seat, seatIdx) => (
              <Seat
                key={`${seat.title}${seatIdx}`}
                seat={seat}
                handleSeatClick={() => handleSeatClick(rowIdx, seatIdx)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
