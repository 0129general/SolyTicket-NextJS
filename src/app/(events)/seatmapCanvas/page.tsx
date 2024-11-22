"use client";

import React from "react";
import { NextPage } from "next";
import { SeatsBlock } from "@/app/components/Base/seatmap";
import { seatData, type SeatType } from "@/app/assets/data/seats";

const handleSelectionChange = (selectedSeats: SeatType[]) => {
  console.log("Selected Seats:", selectedSeats);
};

const SeatmapConvasPage: NextPage = () => (
  <SeatsBlock seatData={seatData} onSelectionChange={handleSelectionChange} />
);

export default SeatmapConvasPage;
